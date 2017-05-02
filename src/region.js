// Region
// ------

import _ from 'underscore';
import Backbone from 'backbone';
import deprecate from './utils/deprecate';
import destroyBackboneView from './utils/destroy-backbone-view';
import monitorViewEvents from './common/monitor-view-events';
import isNodeAttached from './common/is-node-attached';
import { triggerMethodOn } from './common/trigger-method';
import DomMixin from './mixins/dom';
import MarionetteObject from './object';
import MarionetteError from './error';
import View from './view';

const ClassOptions = [
  'allowMissingEl',
  'parentEl',
  'replaceElement'
];

const Region = MarionetteObject.extend({
  cidPrefix: 'mnr',
  replaceElement: false,
  _isReplaced: false,
  _isSwappingView: false,

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

    view = this._getView(view, options);

    if (view === this.currentView) { return this; }

    this._isSwappingView = !!this.currentView;

    this.triggerMethod('before:show', this, view, options);

    // Assume an attached view is already in the region for pre-existing DOM
    if (!view._isAttached) {
      this.empty(options);
    }

    this._setupChildView(view);

    this._renderView(view);

    this._attachView(view, options);

    this.currentView = view;

    this.triggerMethod('show', this, view, options);

    this._isSwappingView = false;

    return this;
  },

  _setupChildView(view) {
    monitorViewEvents(view);

    this._proxyChildViewEvents(view);

    // We need to listen for if a view is destroyed in a way other than through the region.
    // If this happens we need to remove the reference to the currentView since once a view
    // has been destroyed we can not reuse it.
    view.on('destroy', this._empty, this);
  },

  _proxyChildViewEvents(view) {
    const parentView = this._parentView;

    if (!parentView) { return; }

    parentView._proxyChildViewEvents(view);
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

    if (shouldReplaceEl) {
      this._replaceEl(view);
    } else {
      this.attachHtml(view);
    }

    if (shouldTriggerAttach) {
      view._isAttached = true;
      triggerMethodOn(view, 'attach', view);
    }
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

  _getView(view) {
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

    if (view instanceof Backbone.View) {
      return view;
    }

    const viewOptions = this._getViewOptions(view);

    return new View(viewOptions);
  },

  // This allows for a template or a static string to be
  // used as a template
  _getViewOptions(viewOptions) {
    if (_.isFunction(viewOptions)) {
      return { template: viewOptions };
    }

    if (_.isObject(viewOptions)) {
      return viewOptions;
    }

    const template = function() { return viewOptions; };

    return { template };
  },

  // Override this method to change how the region finds the DOM element that it manages. Return
  // a jQuery selector object scoped to a provided parent el or the document if none exists.
  getEl(el) {
    return this.findEls(el, _.result(this, 'parentEl'));
  },

  _replaceEl(view) {
    // always restore the el to ensure the regions el is present before replacing
    this._restoreEl();

    view.on('before:destroy', this._restoreEl, this);

    this.replaceEl(view.el, this.el);

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

    this._detachView(view);

    this._isReplaced = false;
  },

  // Check to see if the region's el was replaced.
  isReplaced() {
    return !!this._isReplaced;
  },

  // Check to see if a view is being swapped by another
  isSwappingView() {
    return !!this._isSwappingView;
  },

  // Override this method to change how the new view is appended to the `$el` that the
  // region is managing
  attachHtml(view) {
    this.appendChildren(this.el, view.el);
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

    const shouldDestroy = !options.preventDestroy;

    if (!shouldDestroy) {
      deprecate('The preventDestroy option is deprecated. Use Region#detachView');
    }

    this._empty(view, shouldDestroy);
    return this;
  },

  _empty(view, shouldDestroy) {
    view.off('destroy', this._empty, this);
    this.triggerMethod('before:empty', this, view);

    this._restoreEl();

    delete this.currentView;

    if (!view._isDestroyed) {
      if (shouldDestroy) {
        this.removeView(view);
      } else {
        this._detachView(view);
      }
      this._stopChildViewEvents(view);
    }

    this.triggerMethod('empty', this, view);
  },

  _stopChildViewEvents(view) {
    const parentView = this._parentView;

    if (!parentView) { return; }

    this._parentView.stopListening(view);
  },

  destroyView(view) {
    if (view._isDestroyed) {
      return view;
    }

    if (view.destroy) {
      view.destroy();
    } else {
      destroyBackboneView(view);
    }
    return view;
  },

  removeView(view) {
    this.destroyView(view);
  },

  // Empties the Region without destroying the view
  // Returns the detached view
  detachView() {
    const view = this.currentView;

    if (!view) {
      return;
    }

    this._empty(view);

    return view;
  },

  _detachView(view) {
    const shouldTriggerDetach = !!view._isAttached;
    const shouldRestoreEl = this._isReplaced;
    if (shouldTriggerDetach) {
      triggerMethodOn(view, 'before:detach', view);
    }

    if (shouldRestoreEl) {
      this.replaceEl(this.el, view.el);
    } else {
      this.detachHtml();
    }

    if (shouldTriggerDetach) {
      view._isAttached = false;
      triggerMethodOn(view, 'detach', view);
    }
  },

  // Override this method to change how the region detaches current content
  detachHtml() {
    this.detachContents(this.el);
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
    if (this._isDestroyed) { return this; }

    this.reset(options);

    if (this._name) {
      this._parentView._removeReferences(this._name);
    }
    delete this._parentView;
    delete this._name;

    return MarionetteObject.prototype.destroy.apply(this, arguments);
  }
});

_.extend(Region.prototype, DomMixin);

export default Region;
