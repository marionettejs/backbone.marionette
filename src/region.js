// Region
// ------

import _ from 'underscore';
import Backbone from 'backbone';
import isNodeAttached from './utils/isNodeAttached';
import MarionetteObject from './object';
import MarionetteError from './error';
import MonitorViewEvents from './monitor-view-events';
import getValue from './utils/getValue';
import { triggerMethodOn, triggerMethodMany } from './trigger-method';

const Region = MarionetteObject.extend({
  cidPrefix: 'mnr',
  triggerAttach: true,
  triggerDetach: true,

  constructor: function(options) {
    this._setOptions(options);
    this.el = this.getOption('el');

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

  // Displays a backbone view instance inside of the region.
  // Handles calling the `render` method for you. Reads content
  // directly from the `el` attribute. Also calls an optional
  // `onShow` and `onDestroy` method on your view, just after showing
  // or just before destroying the view, respectively.
  // The `preventDestroy` option can be used to prevent a view from
  // the old view being destroyed on show.
  // The `forceShow` option can be used to force a view to be
  // re-rendered if it's already shown in the region.
  show: function(view, options={}) {
    if (!this._ensureElement()) {
      return;
    }

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

    MonitorViewEvents(view);

    const isChangingView = !!this.currentView;
    const isDifferentView = view !== this.currentView;
    const isAttachedRegion = isNodeAttached(this.el);
    const shouldForceShow = !!options.forceShow;
    const shouldReplaceEl = !!options.replaceElement;
    const shouldDestroyView = view !== this.currentView && options.preventDestroy;
    const shouldShowView = isDifferentView || shouldForceShow;
    const shouldTriggerAttach = options.triggerAttach !== false && this.triggerAttach;

    if (this.currentView && isDifferentView) {
      delete this.currentView._parent;
    }

    if (shouldDestroyView) {
      this.empty();
    } else if (isChangingView && shouldShowView) {
      // A `destroy` event is attached to the clean up manually removed views.
      // We need to detach this event when a new view is going to be shown as it
      // is no longer relevant.
      this.currentView.off('destroy', this.empty, this);
    }

    if (!shouldShowView) {
      return this;
    }

    this.triggerMethod('before:show', view, this, options);

    // We need to listen for if a view is destroyed in a way other than through the region.
    // If this happens we need to remove the reference to the currentView since once a view
    // has been destroyed we can not reuse it.
    view.once('destroy', this.empty, this);

    // Make this region the view's parent.
    // It's important that this parent binding happens before rendering so that any events
    // the child may trigger during render can also be triggered on the child's ancestor views.
    view._parent = this;

    // Render the view
    if (!view.supportsRenderLifecycle) {
      triggerMethodOn(view, 'before:render', view);
    }
    view.render();
    if (!view.supportsRenderLifecycle) {
      triggerMethodOn(view, 'render', view);
    }

    // Attach the view
    if (isAttachedRegion && shouldTriggerAttach) {
      triggerMethodOn(view, 'before:attach', view);
    }
    this.attachHtml(view, shouldReplaceEl);
    this.currentView = view;
    if (isAttachedRegion && shouldTriggerAttach) {
      triggerMethodOn(view, 'attach', view);
    }

    this.triggerMethod('show', view, this, options);
    return this;
  },

  _ensureElement: function() {
    if (!_.isObject(this.el)) {
      this.$el = this.getEl(this.el);
      this.el = this.$el[0];
    }

    if (!this.$el || this.$el.length === 0) {
      if (this.getOption('allowMissingEl')) {
        return false;
      } else {
        throw new MarionetteError('An "el" ' + this.$el.selector + ' must exist in DOM');
      }
    }
    return true;
  },

  // Override this method to change how the region finds the DOM
  // element that it manages. Return a jQuery selector object scoped
  // to a provided parent el or the document if none exists.
  getEl: function(el) {
    return Backbone.$(el, getValue(this.options.parentEl, this));
  },

  _replaceEl: function(view) {
    // empty el so we don't save any non-destroyed views
    this.$el.contents().detach();

    // always restore the el to ensure the regions el is
    // present before replacing
    this._restoreEl();

    const parent = this.el.parentNode;

    parent.replaceChild(view.el, this.el);
    this.replaced = true;
  },

  // Restore the region's element in the DOM.
  _restoreEl: function() {
    if (!this.currentView) {
      return;
    }

    const view = this.currentView;
    const parent = view.el.parentNode;

    if (!parent) {
      return;
    }

    parent.replaceChild(this.el, view.el);
    this.replaced = false;
  },

  // Override this method to change how the new view is
  // appended to the `$el` that the region is managing
  attachHtml: function(view, shouldReplace) {
    if (shouldReplace) {
      // replace the region's node with the view's node
      this._replaceEl(view);
    } else {
      // empty the node and append new view
      this.$el.contents().detach();

      this.el.appendChild(view.el);
    }
  },

  // Destroy the current view, if there is one. If there is no
  // current view, it does nothing and returns immediately.
  empty: function(options={}) {
    const view = this.currentView;

    const preventDestroy = !!options.preventDestroy;
    const shouldTriggerDetach = options.triggerDetach !== false && !this.triggerDetach;

    // If there is no view in the region
    // we should not remove anything
    if (!view) { return this; }

    view.off('destroy', this.empty, this);
    this.triggerMethod('before:empty', view);

    if (this.replaced) {
      this._restoreEl();
    }

    if (!preventDestroy) {
      this._destroyView(options);
    }
    this.triggerMethod('empty', view);

    // Remove region pointer to the currentView
    delete this.currentView;

    if (preventDestroy) {
      if (shouldTriggerDetach) {
        triggerMethodOn(view, 'before:detach', view);
      }
      this.$el.contents().detach();
      if (shouldTriggerDetach) {
        triggerMethodOn(view, 'detach', view);
      }
    }

    return this;
  },

  // call 'destroy' or 'remove', depending on which is found
  // on the view (if showing a raw Backbone view or a Marionette View)
  _destroyView: function(options) {
    const view = this.currentView;
    if (view._isDestroyed) { return; }

    const shouldTriggerDetach = options.triggerDetach !== false && !this.triggerDetach;

    if (!view.supportsDestroyLifecycle) {
      triggerMethodOn(view, 'before:destroy', view);
      if (shouldTriggerDetach) {
        triggerMethodOn(view, 'before:detach', view);
      }
    }
    if (view.destroy) {
      view.destroy();
    } else {
      view.remove();

      // appending _isDestroyed to raw Backbone View allows regions
      // to throw a ViewDestroyedError for this view
      view._isDestroyed = true;
    }
    if (shouldTriggerDetach) {
      triggerMethodOn(view, 'detach', view);
    }
    if (!view.supportsDestroyLifecycle) {
      triggerMethodOn(view, 'destroy', view);
    }
  }
});

export default Region;
