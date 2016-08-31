// Region
// ------

import _ from 'underscore';
import Backbone from 'backbone';
import destroyBackboneView from './utils/destroy-backbone-view';
import monitorViewEvents from './common/monitor-view-events';
import isNodeAttached from './common/is-node-attached';
import { triggerMethodOn } from './common/trigger-method';
import MarionetteObject from './object';
import MarionetteError from './error';

const ClassOptions = [
  'el',
  'replaceElement'
];

const Region = MarionetteObject.extend({
  cidPrefix: 'mnr',
  replaceElement: false,
  _isReplaced: false,

  constructor(options) {
    this.mergeOptions(options, ClassOptions);

    this._ensureElement();

    MarionetteObject.call(this, options);
  },

  _ensureElement() {
    // Handle when this.el is passed in as a $ wrapped element.
    this.el = this.el instanceof Backbone.$ ? this.el[0] : this.el;

    if (!this.el) {
      throw new MarionetteError({
        name: 'NoElError',
        message: `An "el" must be specified for this region. ${this.cid}`
      });
    }

    this.$el = this.getEl(this.el);

    if (!this.$el || this.$el.length === 0) {
      throw new MarionetteError({
        name: 'NoDOMError',
        message: `An "el" must exist in DOM for this region. ${this.cid}`
      });
    }
  },

  // Displays a backbone view instance inside of the region. Handles calling the `render`
  // method for you. Reads content directly from the `el` attribute. The `preventDestroy`
  // option can be used to prevent a view from the old view being destroyed on show.
  show(view, options) {
    this._ensureView(view);

    if (view === this.currentView) { return this; }

    this.triggerMethod('before:show', this, view, options);

    this.thenShow(view, options);

    return this;
  },

  // Override this function to allow for async showing
  // control when the view empties and when it finally shows
  thenShow(view, options) {
    this.empty(options);

    this.finallyShow(view, options);
  },

  finallyShow(view, options) {
    this._setupView(view);

    this._renderView(view);

    this._attachView(view, options);

    this.triggerMethod('show', this, view, options);

    return this;
  },

  _setupView(view) {
    // Make this region the view's parent.
    // It's important that this parent binding happens before rendering so that any events
    // the child may trigger during render can also be triggered on the child's ancestor views.
    view._parent = this;

    monitorViewEvents(view);

    // We need to listen for if a view is destroyed in a way other than through the region.
    // If this happens we need to remove the reference to the currentView since once a view
    // has been destroyed we can not reuse it.
    view.on('destroy', this.empty, this);
  },

  _renderView(view) {
    if (view._isRendered) {
      return;
    }

    if (!view.supportsRenderLifecycle) {
      triggerMethodOn(view, 'before:render', view);
    }

    view.render();

    if (!view.supportsRenderLifecycle) {
      view._isRendered = true;
      triggerMethodOn(view, 'render', view);
    }
  },

  _attachView(view, options = {}) {
    const shouldTriggerAttach = !view._isAttached && isNodeAttached(this.el);
    const shouldReplaceEl = typeof options.replaceElement === 'undefined' ? !!_.result(this, 'replaceElement') : !!options.replaceElement;

    if (shouldTriggerAttach) {
      triggerMethodOn(view, 'before:attach', view);
    }

    this.attachHtml(view, shouldReplaceEl);

    if (shouldTriggerAttach) {
      view._isAttached = true;
      triggerMethodOn(view, 'attach', view);
    }

    this.currentView = view;
  },

  _ensureView(view) {
    if (!view) {
      throw new MarionetteError({
        name: 'ViewNotValid',
        message: 'The view passed is undefined and therefore invalid. You must pass a view instance to show.'
      });
    }

    if (view._isDestroyed) {
      throw new MarionetteError({
        name: 'ViewDestroyedError',
        message: `View (cid: "${view.cid}") has already been destroyed and cannot be used.`
      });
    }
  },

  // Override this method to change how the region finds the DOM element that it manages. Return
  getEl(el) {
    return Backbone.$(el);
  },

  _replaceEl(view) {
    // always restore the el to ensure the regions el is present before replacing
    this._restoreEl();

    this._replaceChild(view.el, this.el);
    this._isReplaced = true;
  },

  // Restore the region's element in the DOM.
  _restoreEl() {
    // There is nothing to replace
    if (!this._isReplaced) {
      return;
    }

    const view = this.currentView;

    if (!view) {
      return;
    }

    if (this._replaceChild(this.el, view.el)) {
      this._isReplaced = false;
    }
  },

  _replaceChild(parent, newView, oldView) {
    const parent = this.el.parentNode;

    if (!parent) {
      return false;
    }

    parent.replaceChild(newView, oldView);

    return true;
  },

  // Check to see if the region's el was replaced.
  isReplaced() {
    return !!this._isReplaced;
  },

  // Override this method to change how the new view is appended to the `$el` that the
  // region is managing
  attachHtml(view, shouldReplace) {
    if (shouldReplace) {
      // replace the region's node with the view's node
      this._replaceEl(view);
    } else {
      this.el.appendChild(view.el);
    }
  },

  // Destroy the current view, if there is one. If there is no current view, it does
  // nothing and returns immediately.
  empty(options) {
    const view = this.currentView;

    // If there is no view in the region we should only detach current html
    if (!view) {
      this.detachHtml();
      return this;
    }

    view.off('destroy', this.empty, this);
    this.triggerMethod('before:empty', this, view);

    this._restoreEl();

    delete this.currentView;

    if (!view._isDestroyed) {
      this._removeView(view, options);
      delete view._parent;
    }

    this.triggerMethod('empty', this, view);
    return this;
  },

  _removeView(view) {
    if (view.destroy) {
      view.destroy();
    } else {
      destroyBackboneView(view);
    }
  },


  detachView() {
    const view = this.currentView;

    delete this.currentView;

    this._detachView(view);
    delete view._parent;

    return this;
  },

  _detachView(view) {
    const shouldTriggerDetach = !!view._isAttached;
    if (shouldTriggerDetach) {
      triggerMethodOn(view, 'before:detach', view);
    }

    this.detachHtml();

    if (shouldTriggerDetach) {
      view._isAttached = false;
      triggerMethodOn(view, 'detach', view);
    }
  },

  // Override this method to change how the region detaches current content
  detachHtml() {
    this.$el.contents().detach();
  },

  // Checks whether a view is currently present within the region. Returns `true` if there is
  // and `false` if no view is present.
  hasView() {
    return !!this.currentView;
  },

  destroy() {
    if (this._isDestroyed) { return this; }

    this.triggerMethod('before:destroy', this, ...args);

    this.empty();
    delete this.el;
    delete this.$el;

    this._isDestroyed = true;
    this.triggerMethod('destroy', this, ...args);
    this.stopListening();

    return this;
  }
});

export default Region;
