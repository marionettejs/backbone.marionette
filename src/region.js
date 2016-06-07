// Region
// ------

import _ from 'underscore';
import Backbone from 'backbone';
import isNodeAttached from './utils/isNodeAttached';
import MarionetteObject from './object';
import MarionetteError from './error';
import monitorViewEvents from './monitor-view-events';
import destroyBackboneView from './utils/destroyBackboneView';
import { triggerMethodOn } from './trigger-method';

const ClassOptions = [
  'allowMissingEl',
  'parentEl',
  'replaceElement'
];

const Region = MarionetteObject.extend({
  cidPrefix: 'mnr',
  replaceElement: false,
  _isReplaced: false,

  constructor(options) {
    this._setOptions(options);

    this.mergeOptions(options, ClassOptions);

    // getOption necessary because options.el may be passed as undefined
    this._initEl = this.el = this.getOption('el');

    // Handle when this.el is passed in as a $ wrapped element.
    this.el = this.el instanceof Backbone.$ ? this.el[0] : this.el;

    if (!this.el) {
      throw new MarionetteError({
        name: 'NoElError',
        message: 'An "el" must be specified for a region.'
      });
    }

    this.$el = this.getEl(this.el);
    MarionetteObject.call(this, options);
  },

  // Displays a backbone view instance inside of the region. Handles calling the `render`
  // method for you. Reads content directly from the `el` attribute. The `preventDestroy`
  // option can be used to prevent a view from the old view being destroyed on show.
  show(view, options) {
    if (!this._ensureElement(options)) {
      return;
    }
    this._ensureView(view);
    if (view === this.currentView) { return this; }

    this.triggerMethod('before:show', this, view, options);

    monitorViewEvents(view);

    this.empty(options);

    // We need to listen for if a view is destroyed in a way other than through the region.
    // If this happens we need to remove the reference to the currentView since once a view
    // has been destroyed we can not reuse it.
    view.on('destroy', this.empty, this);

    // Make this region the view's parent.
    // It's important that this parent binding happens before rendering so that any events
    // the child may trigger during render can also be triggered on the child's ancestor views.
    view._parent = this;

    this._renderView(view);

    this._attachView(view, options);

    this.triggerMethod('show', this, view, options);
    return this;
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

  _ensureElement(options = {}) {
    if (!_.isObject(this.el)) {
      this.$el = this.getEl(this.el);
      this.el = this.$el[0];
    }

    if (!this.$el || this.$el.length === 0) {
      const allowMissingEl = typeof options.allowMissingEl === 'undefined' ? !!_.result(this, 'allowMissingEl') : !!options.allowMissingEl;

      if (allowMissingEl) {
        return false;
      } else {
        throw new MarionetteError(`An "el" must exist in DOM for this region ${this.cid}`);
      }
    }
    return true;
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
        message: 'View (cid: "' + view.cid + '") has already been destroyed and cannot be used.'
      });
    }
  },

  // Override this method to change how the region finds the DOM element that it manages. Return
  // a jQuery selector object scoped to a provided parent el or the document if none exists.
  getEl(el) {
    return Backbone.$(el, _.result(this, 'parentEl'));
  },

  _replaceEl(view) {
    // always restore the el to ensure the regions el is present before replacing
    this._restoreEl();

    const parent = this.el.parentNode;

    parent.replaceChild(view.el, this.el);
    this._isReplaced = true;
  },

  // Restore the region's element in the DOM.
  _restoreEl() {
    if (!this.currentView) {
      return;
    }

    const view = this.currentView;
    const parent = view.el.parentNode;

    if (!parent) {
      return;
    }

    parent.replaceChild(this.el, view.el);
    this._isReplaced = false;
  },

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
  empty(options = { allowMissingEl: true }) {
    const view = this.currentView;

    // If there is no view in the region we should only detach current html
    if (!view) {
      if (this._ensureElement(options)) {
        this.detachHtml();
      }
      return this;
    }

    view.off('destroy', this.empty, this);
    this.triggerMethod('before:empty', this, view);

    if (this._isReplaced) {
      this._restoreEl();
    }

    delete this.currentView;

    if (!view._isDestroyed) {
      this._removeView(view, options);
    }

    delete view._parent;

    this.triggerMethod('empty', this, view);
    return this;
  },

  _removeView(view, {preventDestroy} = {}) {
    const shouldPreventDestroy = !!preventDestroy;

    if (shouldPreventDestroy) {
      this._detachView(view);
      return;
    }

    if (view.destroy) {
      view.destroy();
    } else {
      destroyBackboneView(view);
    }
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

  // Reset the region by destroying any existing view and clearing out the cached `$el`.
  // The next time a view is shown via this region, the region will re-query the DOM for
  // the region's `el`.
  reset(options) {
    this.empty(options);

    if (this.$el) {
      this.el = this._initEl;
    }

    delete this.$el;
    return this;
  },

  destroy(options) {
    this.reset(options);
    return MarionetteObject.prototype.destroy.apply(this, arguments);
  }
});

export default Region;
