// Backbone.Marionette v0.1.0
//
// Copyright (C)2011 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT License
//
// Documentation and Full License Available at:
// http://github.com/derickbailey/backbone.marionette

Backbone.Marionette = (function(Backbone, _, $){
  var Marionette = {};

  Marionette.version = "0.1.0";

  // Region Manager
  // --------------

  // Manage the visual regions of your composite application. See
  // http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/
  Marionette.RegionManager = function(options){
    this.options = options || (options = {});
    if (!this.el){
      throw new Error("An 'el' must be specified");
    }
    this.el = $(this.el);
  };

  _.extend(Marionette.RegionManager.prototype, Backbone.Events, {

    // Displays a backbone view instance inside of the region.
    // Handles calling the `render` method for you. Reads content
    // directly from the `el` attribute. Also calls an optional
    // `onShow` and `close` method on your view, just after showing
    // or just before closing the view, respectively.
    show: function(view){
      var oldView = this.currentView;
      this.currentView = view;

      this._closeView(oldView);
      this._openView(view);
    },

    _closeView: function(view){
      if (view && view.close){
        view.close();
      }
    },

    _openView: function(view){
      view.render();
      this.el.html(view.el);
      if (view.onShow){
        view.onShow();
      }
    }
  });

  // Composite Application
  // ---------------------

  // Contain and manage the composite application as a whole.
  // Stores and starts up `RegionManager` objects, includes an
  // event aggregator as `app.vent`
  Marionette.Application = function(options){
    this.initializers = [];
    this.vent = _.extend({}, Backbone.Events);
    _.extend(this, options);
  };

  _.extend(Marionette.Application.prototype, Backbone.Events, {
    addInitializer: function(initializer){
      this.initializers.push(initializer);
    },

    // kick off all of the application's processes.
    // initializes all of the regions that have been added
    // to the app, and runs all of the initializer functions
    start: function(options){
      this.trigger("initialize:before", options);
      for(var i=0; i<this.initializers.length; i++){
        var initializer = this.initializers[i];
        initializer(options);
      }
      this.trigger("initialize:after", options);
    },

    // Add region managers to your app. 
    // Accepts a hash of named strings or RegionManager objects
    // addRegions({something: "#someRegion"})
    // addRegions{{something: RegionManager.extend({el: "#someRegion"}) });
    addRegions: function(regions){
      if (!this.regions){
        this.regions = {};
        this.addInitializer(_.bind(this._initializeRegions, this));
      }

      var appRegions = this.regions;

      for(var region in regions){
        if (regions.hasOwnProperty(region)){
          regionValue = regions[region];
    
          if (typeof regionValue === "string"){
            appRegions[region] = Marionette.RegionManager.extend({
              el: regionValue
            });
          } else {
            appRegions[region] = regionValue
          }

        }
      }
    },

    _initializeRegions: function(){
      if (!this.regions){
        return;
      }

      for(var region in this.regions){
        if (this.regions.hasOwnProperty(region)){
          this[region] = new this.regions[region]();
        }
      }
    }
  });

  // Helpers
  // -------

  // The 'inherits' and 'extend' functions are taken directly from:
  // Backbone.js 0.5.3
  // (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
  // http://documentcloud.github.com/backbone

  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  var ctor = function(){};
  var inherits = function(parent, protoProps, staticProps) {
    var child;
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }
    _.extend(child, parent);
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    if (protoProps) _.extend(child.prototype, protoProps);
    if (staticProps) _.extend(child, staticProps);
    child.prototype.constructor = child;
    child.__super__ = parent.prototype;
    return child;
  };

  Marionette.RegionManager.extend = extend;
  Marionette.Application.extend = extend;

  return Marionette;
})(Backbone, _, jQuery);
