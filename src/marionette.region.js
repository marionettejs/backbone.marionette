/* jshint maxcomplexity: 10, maxstatements: 26 */

// Region
// ------
//
// Manage the visual regions of your composite application. See
// http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/

Marionette.Region = function(options) {
  this.options = options || {};
  this.el = this.getOption('el');

  if (!this.el) {
    throwError('An "el" must be specified for a region.', 'NoElError');
  }

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
      region.getEl = function(selector) {
        var parentEl = regionConfig.parentEl;
        if (_.isFunction(parentEl)) {
          parentEl = parentEl();
        }
        return parentEl.find(selector);
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
    this.ensureEl();

    var showOptions = options || {};
    var isDifferentView = view !== this.currentView;
    var preventDestroy =  !!showOptions.preventDestroy;
    var forceShow = !!showOptions.forceShow;

    // only destroy the view if we don't want to preventDestroy and the view is different
    var _shouldDestroyView = !preventDestroy && isDifferentView;

    if (_shouldDestroyView) {
      this.destroy();
    }

    // show the view if the view is different or if you want to re-show the view
    var _shouldShowView = isDifferentView || forceShow;

    if (_shouldShowView) {
      view.render();
      this.triggerMethod('before:show', view);
      this.triggerMethod.call(view, 'before:show');

      this.open(view);
      this.currentView = view;

      this.triggerMethod('show', view);
      this.triggerMethod.call(view, 'show');

      if (_.isFunction(view.triggerMethod)) {
        view.triggerMethod('show');
      } else {
        this.triggerMethod.call(view, 'show');
      }

      return this;
    }
  },

  ensureEl: function() {
    if (!this.$el || this.$el.length === 0) {
      this.$el = this.getEl(this.el);
    }

    if (this.$el.length === 0) {
      throwError('An "el" ' + this.el + ' must exist in DOM');
    }
  },

  // Override this method to change how the region finds the
  // DOM element that it manages. Return a jQuery selector object.
  getEl: function(selector) {
    return Backbone.$(selector);
  },

  // Override this method to change how the new view is
  // appended to the `$el` that the region is managing
  open: function(view) {
    this.$el.empty().append(view.el);
  },

  // Destroy the current view, if there is one. If there is no
  // current view, it does nothing and returns immediately.
  destroy: function() {
    var view = this.currentView;
    if (!view || view.isDestroyed) { return; }

    this.triggerMethod('before:destroy', view);

    // call 'destroy' or 'remove', depending on which is found
    if (view.destroy) { view.destroy(); }
    else if (view.remove) { view.remove(); }

    this.triggerMethod('destroy', view);

    delete this.currentView;
  },

  // Attach an existing view to the region. This
  // will not call `render` or `onShow` for the new view,
  // and will not replace the current HTML for the `el`
  // of the region.
  attachView: function(view) {
    this.currentView = view;
  },

  // Reset the region by destroying any existing view and
  // clearing out the cached `$el`. The next time a view
  // is shown via this region, the region will re-query the
  // DOM for the region's `el`.
  reset: function() {
    this.destroy();
    delete this.$el;
  },

  // Proxy `getOption` to enable getting options from this or this.options by name.
  getOption: Marionette.proxyGetOption,

  // import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: Marionette.triggerMethod
});

// Copy the `extend` function used by Backbone's classes
Marionette.Region.extend = Marionette.extend;
