/* jshint maxcomplexity: 10, maxstatements: 29 */

// Region
// ------
//
// Manage the visual regions of your composite application. See
// http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/

Marionette.Region = function(options) {
  this.options = options || {};
  this.el = this.getOption('el');

  // Handle when this.el is passed in as a $ wrapped element.
  this.el = this.el instanceof Backbone.$ ? this.el[0] : this.el;

  if (!this.el) {
    throwError('An "el" must be specified for a region.', 'NoElError');
  }

  this.$el = this.getEl(this.el);

  if (this.initialize) {
    var args = Array.prototype.slice.apply(arguments);
    this.initialize.apply(this, args);
  }
};


// Region Class methods
// -------------------

_.extend(Marionette.Region, {

  // Build an instance of a region by passing in a configuration object
  // and a default region class to use if none is specified in the config.
  //
  // The config object should either be a string as a jQuery DOM selector,
  // a Region class directly, or an object literal that specifies both
  // a selector and regionClass:
  //
  // ```js
  // {
  //   selector: "#foo",
  //   regionClass: MyCustomRegion
  // }
  // ```
  //
  buildRegion: function(regionConfig, defaultRegionClass) {
    var regionIsString = _.isString(regionConfig);
    var regionSelectorIsString = _.isString(regionConfig.selector);
    var regionClassIsUndefined = _.isUndefined(regionConfig.regionClass);
    var regionIsClass = _.isFunction(regionConfig);

    if (!regionIsClass && !regionIsString && !regionSelectorIsString) {
      throwError('Region must be specified as a Region class,' +
        'a selector string or an object with selector property');
    }

    var selector, RegionClass;

    // get the selector for the region

    if (regionIsString) {
      selector = regionConfig;
    }

    if (regionConfig.selector) {
      selector = regionConfig.selector;
      delete regionConfig.selector;
    }

    // get the class for the region

    if (regionIsClass) {
      RegionClass = regionConfig;
    }

    if (!regionIsClass && regionClassIsUndefined) {
      RegionClass = defaultRegionClass;
    }

    if (regionConfig.regionClass) {
      RegionClass = regionConfig.regionClass;
      delete regionConfig.regionClass;
    }

    if (regionIsString || regionIsClass) {
      regionConfig = {};
    }

    regionConfig.el = selector;

    // build the region instance
    var region = new RegionClass(regionConfig);

    // override the `getEl` function if we have a parentEl
    // this must be overridden to ensure the selector is found
    // on the first use of the region. if we try to assign the
    // region's `el` to `parentEl.find(selector)` in the object
    // literal to build the region, the element will not be
    // guaranteed to be in the DOM already, and will cause problems
    if (regionConfig.parentEl) {
      region.getEl = function(el) {
        if (_.isObject(el)) {
          return Backbone.$(el);
        }
        var parentEl = regionConfig.parentEl;
        if (_.isFunction(parentEl)) {
          parentEl = parentEl();
        }
        return parentEl.find(el);
      };
    }

    return region;
  }

});

// Region Instance Methods
// -----------------------

_.extend(Marionette.Region.prototype, Backbone.Events, {

  // Displays a backbone view instance inside of the region.
  // Handles calling the `render` method for you. Reads content
  // directly from the `el` attribute. Also calls an optional
  // `onShow` and `onDestroy` method on your view, just after showing
  // or just before destroying the view, respectively.
  // The `preventDestroy` option can be used to prevent a view from
  // the old view being destroyed on show.
  // The `forceShow` option can be used to force a view to be
  // re-rendered if it's already shown in the region.

  show: function(view, options){
    this._ensureElement();

    var showOptions = options || {};
    var isDifferentView = view !== this.currentView;
    var preventDestroy =  !!showOptions.preventDestroy;
    var forceShow = !!showOptions.forceShow;

    // we are only changing the view if there is a view to change to begin with
    var isChangingView = !!this.currentView;

    // only destroy the view if we don't want to preventDestroy and the view is different
    var _shouldDestroyView = !preventDestroy && isDifferentView;

    if (_shouldDestroyView) {
      this.empty();
    }

    // show the view if the view is different or if you want to re-show the view
    var _shouldShowView = isDifferentView || forceShow;

    if (_shouldShowView) {

      // We need to listen for if a view is destroyed
      // in a way other than through the region.
      // If this happens we need to remove the reference
      // to the currentView since once a view has been destroyed
      // we can not reuse it.
      view.once('destroy', _.bind(this.empty, this));
      view.render();

      if (isChangingView) {
        this.triggerMethod('before:swap', view);
      }

      this.triggerMethod('before:show', view);

      if (_.isFunction(view.triggerMethod)) {
        view.triggerMethod('before:show');
      } else {
        this.triggerMethod.call(view, 'before:show');
      }

      this.attachHtml(view);
      this.currentView = view;

      if (isChangingView) {
        this.triggerMethod('swap', view);
      }

      this.triggerMethod('show', view);

      if (_.isFunction(view.triggerMethod)) {
        view.triggerMethod('show');
      } else {
        this.triggerMethod.call(view, 'show');
      }

      return this;
    }

    return this;
  },

  _ensureElement: function(){
    if (!_.isObject(this.el)) {
      this.$el = this.getEl(this.el);
      this.el = this.$el[0];
    }

    if (!this.$el || this.$el.length === 0) {
      throwError('An "el" ' + this.$el.selector + ' must exist in DOM');
    }
  },

  // Override this method to change how the region finds the
  // DOM element that it manages. Return a jQuery selector object.
  getEl: function(el) {
    return Backbone.$(el);
  },

  // Override this method to change how the new view is
  // appended to the `$el` that the region is managing
  attachHtml: function(view) {
    // empty the node and append new view
    this.el.innerHTML='';
    this.el.appendChild(view.el);
  },

  // Destroy the current view, if there is one. If there is no
  // current view, it does nothing and returns immediately.
  empty: function() {
    var view = this.currentView;

    // If there is no view in the region
    // we should not remove anything
    if (!view) { return; }

    this.triggerMethod('before:empty', view);
    this._destroyView();
    this.triggerMethod('empty', view);

    // Remove region pointer to the currentView
    delete this.currentView;
    return this;
  },

  // call 'destroy' or 'remove', depending on which is found
  // on the view (if showing a raw Backbone view or a Marionette View)
  _destroyView: function() {
    var view = this.currentView;

    if (view.destroy && !view.isDestroyed) {
      view.destroy();
    } else if (view.remove) {
      view.remove();
    }
  },

  // Attach an existing view to the region. This
  // will not call `render` or `onShow` for the new view,
  // and will not replace the current HTML for the `el`
  // of the region.
  attachView: function(view) {
    this.currentView = view;
    return this;
  },

  // Checks whether a view is currently present within
  // the region. Returns `true` if there is and `false` if
  // no view is present.
  hasView: function() {
    return !!this.currentView;
  },

  // Reset the region by destroying any existing view and
  // clearing out the cached `$el`. The next time a view
  // is shown via this region, the region will re-query the
  // DOM for the region's `el`.
  reset: function() {
    this.empty();

    if (this.$el) {
      this.el = this.$el.selector;
    }

    delete this.$el;
    return this;
  },

  // Proxy `getOption` to enable getting options from this or this.options by name.
  getOption: Marionette.proxyGetOption,

  // import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: Marionette.triggerMethod
});

// Copy the `extend` function used by Backbone's classes
Marionette.Region.extend = Marionette.extend;
