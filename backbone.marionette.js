// Backbone.Marionette v0.1
//
// Copyright (C)2011 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT License
//
// Documentation and Full License Available at:
// http://github.com/derickbailey/backbone.marionette

Backbone.Marionette = (function(Backbone, _){
  var Marionette = {};

  // Region Manager
  // --------------

  Marionette.RegionManager = function(options){
    this.options = options || (options = {});
    if (!this.el){
      throw new Error("An 'el' must be specified");
    }
    this.el = $(this.el);
  };

  _.extend(Marionette.RegionManager.prototype, Backbone.Events, {
    show: function(view){
      var oldView = this.currentView;
      this.currentView = view;

      this.closeView(oldView);
      this.openView(view);
    },

    closeView: function(view){
      if (view && view.close){
        view.close();
      }
    },

    openView: function(view){
      view.render();
      this.el.html(view.el);
      if (view.onShow){
        view.onShow();
      }
    }
  });

  // Composite Application
  // ---------------------

  Marionette.Application = function(){
    this.initializers = [];
    this.vent = _.extend({}, Backbone.Events);
  };

  _.extend(Marionette.Application.prototype, Backbone.Events, {
    addInitializer: function(initializer){
      this.initializers.push(initializer);
    },

    start: function(options){
      for(var i=0; i<this.initializers.length; i++){
        var initializer = this.initializers[i];
        initializer(options);
      }
    }
  });

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


  // allow these objects to be extended, for inheritance
  Marionette.RegionManager.extend = extend;

  return Marionette;
})(Backbone, _);
