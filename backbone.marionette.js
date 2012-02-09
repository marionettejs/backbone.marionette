// Backbone.Marionette v0.4.4
//
// Copyright (C)2011 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT License
//
// Documentation and Full License Available at:
// http://github.com/derickbailey/backbone.marionette

Backbone.Marionette = (function(Backbone, _, $){
  var Marionette = {};

  Marionette.version = "0.4.4";

  // Region Manager
  // --------------

  // Manage the visual regions of your composite application. See
  // http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/
  Marionette.RegionManager = function(options){
    this.options = options || {};
    if (!this.el){
      var err = new Error("An 'el' must be specified");
      err.name = "NoElError";
      throw err;
    }
  };

  _.extend(Marionette.RegionManager.prototype, Backbone.Events, {

    // Displays a backbone view instance inside of the region.
    // Handles calling the `render` method for you. Reads content
    // directly from the `el` attribute. Also calls an optional
    // `onShow` and `close` method on your view, just after showing
    // or just before closing the view, respectively.
    show: function(view){
      this.ensureEl();
      this.close();
      this.open(view);

      this.currentView = view;
    },

    ensureEl: function(){
      if (!this.$el || this.$el.length == 0){
        this.$el = $(this.el);
      }
    },

    // Internal method to render and display a view. Not meant 
    // to be called from any external code.
    open: function(view){
      var that = this;

      $.when(view.render()).then(function () {
        that.$el.html(view.el);
        view.onShow && view.onShow();
        that.trigger("view:show", view);
      });

    },

    // Close the current view, if there is one. If there is no
    // current view, it does nothing and returns immediately.
    close: function(){
      var view = this.currentView;
      if (!view){ return; }

      view.close && view.close();
      this.trigger("view:closed", view);

      delete this.currentView;
    }
  });

  // Item View
  // ---------
  
  // A single item view implementation that contains code for rendering
  // with underscore.js templates, serializing the view's model or collection,
  // and calling several methods on extended views, such as `onRender`.
  Marionette.ItemView = Backbone.View.extend({
    constructor: function(){
      var args = slice.call(arguments);
      Backbone.View.prototype.constructor.apply(this, args);

      _.bindAll(this, "render");
    },

    // Serialize the model or collection for the view. If a model is
    // found, `.toJSON()` is called. If a collection is found, `.toJSON()`
    // is also called, but is used to populate an `items` array in the
    // resulting data. If both are found, defaults to the model. 
    // You can override the `serializeData` method in your own view 
    // definition, to provide custom serialization for your view's data.
    serializeData: function(){
      var data;
      if (this.collection) { 
        data = {};
        data.items = this.collection.toJSON(); 
      }
      if (this.model) { data = this.model.toJSON(); }
      return data;
    },

    // Either provide a `template: "#foo"` selector in the view
    // definition, or provide it at instantiation: `new
    // MyView({ template: "#foo" });`.
    template: function(){
      return $(this.options.template);
    },

    // Render the view, defaulting to underscore.js templates.
    // You can override this in your view definition.
    render: function(){
      var that = this;
      var data = this.serializeData();

      this.getTemplate(function(template){
        var html = that.renderTemplate(template, data);

        that.$el.html(html);

        if (that.onRender){
          that.onRender();
        }
      });

      return this;
    },

    // Default implementation uses underscore.js templates. Override
    // this method to use your own templating engine.
    renderTemplate: function(template, data){
      if (!template || template.length === 0){
        var err = new Error("A template must be specified");
        err.name = "NoTemplateError";
        throw err;
      }

      return _.template(template.html(), data);
    },

    // Retrieve the template from the call's context. The
    // `template` attribute can either be a function that
    // returns a jQuery object, or a jQuery selector string 
    // directly. The string value must be a valid jQuery 
    // selector.  
    getTemplate: function(callback){
      var template = this.template;
  
      if (_.isFunction(template)){
        var templateData = template.call(this);
        callback.call(this, templateData);
      } else {
        Marionette.TemplateManager.get(template, callback);
      }
    },

    // Default `close` implementation, for removing a view from the
    // DOM and unbinding it. Region managers will call this method
    // for you. You can specify an `onClose` method in your view to
    // add custom code that is called after the view is closed.
    close: function(){
      this.unbindAll();
      this.unbind();
      this.remove();

      if (this.onClose){
        this.onClose();
      }
    }
  });

  // Collection View
  // ---------------

  // A view that iterates over a Backbone.Collection
  // and renders an individual ItemView for each model.
  Marionette.CollectionView = Backbone.View.extend({
    modelView: Marionette.ItemView,

    constructor: function(){
      Backbone.View.prototype.constructor.apply(this, arguments);

      _.bindAll(this, "addChildView", "render");
      this.bindTo(this.collection, "add", this.addChildView, this);
      this.bindTo(this.collection, "remove", this.removeChildView, this);
      this.bindTo(this.collection, "reset", this.render, this);
    },

    // Loop through all of the items and render 
    // each of them with the specified `itemView`.
    render: function(){
      this.renderModel();

      this.collection.each(this.addChildView);
      if (this.onRender){
        this.onRender();
      }
      return this;
    },

    // Render an individual model, if we have one, as
    // part of a composite view (branch / leaf). For example:
    // a treeview.
    renderModel: function(){
      if (this.model){
        var modelView = new this.modelView({
          model: this.model,
          template: this.template
        });
        modelView.render();

        this.$el.append(modelView.el);
      }
    },

    // Render the child item's view and add it to the
    // HTML for the collection view.
    addChildView: function(item){
      var html = this.renderItem(item);
      this.appendHtml(this.$el, html);
    },

    // Remove the child view and close it
    removeChildView: function(item){
      var view = this.children[item.cid];
      if (view){
        view.close();
        delete this.children[item.cid];
      }
    },

    // Append the HTML to the collection's `el`.
    // Override this method to do something other
    // then `.append`.
    appendHtml: function(el, html){
      el.append(html);
    },

    // Render the individual item by instantiating
    // a specifid `itemView`. Override this method
    // to provide custom item rendering for each
    // item in the collection.
    renderItem: function(item){
      if (!this.itemView){
      var err = new Error("An `itemView` must be specified");
      err.name = "NoItemViewError";
      throw err;
      }

      var view = new this.itemView({
        model: item
      });
      view.render();
      this.storeChild(view);
      return view.el;
    },

    // Store references to all of the child `itemView`
    // instances so they can be managed and cleaned up, later.
    storeChild: function(view){
      if (!this.children){
        this.children = {};
      }
      this.children[view.model.cid] = view;
    },
    
    // Handle cleanup and other closing needs for
    // the collection of views.
    close: function(){
      this.unbind();
      this.unbindAll();
      this.remove();

      if (this.children){
        _.each(this.children, function(childView){
          childView.close();
        });
      }

      if (this.onClose){
        this.onClose();
      }
    }
  });

  // BindTo: Event Binding
  // ---------------------
  
  // BindTo facilitates the binding and unbinding of events
  // from objects that extend `Backbone.Events`. It makes
  // unbinding events, even with anonymous callback functions,
  // easy. 
  //
  // Thanks to Johnny Oshika for this code.
  // http://stackoverflow.com/questions/7567404/backbone-js-repopulate-or-recreate-the-view/7607853#7607853
  Marionette.BindTo = {
    // Store the event binding in array so it can be unbound
    // easily, at a later point in time.
    bindTo: function (obj, eventName, callback, context) {
      context = context || this;
      obj.on(eventName, callback, context);

      if (!this.bindings) this.bindings = [];

      this.bindings.push({ 
        obj: obj, 
        eventName: eventName, 
        callback: callback, 
        context: context 
      });
    },

    // Unbind all of the events that we have stored.
    unbindAll: function () {
      _.each(this.bindings, function (binding) {
        binding.obj.off(binding.eventName, binding.callback);
      });

      this.bindings = [];
    }
  };

  // AppRouter
  // ---------

  // Reduce the boilerplate code of handling route events
  // and then calling a single method on another object.
  // Have your routers configured to call the method on
  // your object, directly.
  //
  // Configure an AppRouter with `appRoutes`.
  //
  // App routers can only take one `controller` object. 
  // It is reocmmended that you divide your controller
  // objects in to smaller peices of related functionality
  // and have multiple routers / controllers, instead of
  // just one giant router and controller.
  //
  // You can also add standard routes to an AppRouter.
  
  Marionette.AppRouter = Backbone.Router.extend({

    constructor: function(options){
      Backbone.Router.prototype.constructor.call(this, options);

      if (this.appRoutes){
        this.processAppRoutes(options.controller, this.appRoutes);
      }
    },

    processAppRoutes: function(app, appRoutes){
      var method, methodName;
      var route, routesLength;
      var routes = [];
      var router = this;

      for(route in appRoutes){
        routes.unshift([route, appRoutes[route]]);
      }

      routesLength = routes.length;
      for (var i = 0; i < routesLength; i++){
        route = routes[i][0];
        methodName = routes[i][1];
        method = app[methodName];
        router.route(route, methodName, method);
      }
    }
  });
  
  // Callbacks
  // ---------

  // A simple way of managing a collection of callbacks
  // and executing them at a later point in time, using jQuery's
  // `Deferred` object.
  Marionette.Callbacks = function(){
    this.deferred = $.Deferred();
    this.promise = this.deferred.promise();
  };

  _.extend(Marionette.Callbacks.prototype, {
    
    // Add a callback to be executed. Callbacks added here are
    // guaranteed to execute, even if they are added after the 
    // `run` method is called.
    add: function(callback){
      this.promise.done(function(context, options){
        callback.call(context, options);
      });
    },

    // Run all registered callbacks with the context specified. 
    // Additional callbacks can be added after this has been run 
    // and they will still be executed.
    run: function(context, options){
      this.deferred.resolve(context, options);
    }
  });

  // Composite Application
  // ---------------------

  // Contain and manage the composite application as a whole.
  // Stores and starts up `RegionManager` objects, includes an
  // event aggregator as `app.vent`
  Marionette.Application = function(options){
    this.initCallbacks = new Marionette.Callbacks();
    this.vent = _.extend({}, Backbone.Events, Marionette.BindTo);
    _.extend(this, options);
  };

  _.extend(Marionette.Application.prototype, Backbone.Events, {
    // Add an initializer that is either run at when the `start`
    // method is called, or run immediately if added after `start`
    // has already been called.
    addInitializer: function(initializer){
      this.initCallbacks.add(initializer);
    },

    // kick off all of the application's processes.
    // initializes all of the regions that have been added
    // to the app, and runs all of the initializer functions
    start: function(options){
      this.trigger("initialize:before", options);
      this.initCallbacks.run(this, options);
      this.trigger("initialize:after", options);

      this.trigger("start", options);
    },

    // Add region managers to your app. 
    // Accepts a hash of named strings or RegionManager objects
    // addRegions({something: "#someRegion"})
    // addRegions{{something: RegionManager.extend({el: "#someRegion"}) });
    addRegions: function(regions){
      var regionValue, regionObj;

      for(var region in regions){
        if (regions.hasOwnProperty(region)){
          regionValue = regions[region];
    
          if (typeof regionValue === "string"){
            regionObj = Marionette.RegionManager.extend({
              el: regionValue
            });
          } else {
            regionObj = regionValue;
          }

          this[region] = new regionObj();
        }
      }
    }
  });

  // Template Manager
  // ----------------
  
  // Manage templates stored in `<script>` blocks,
  // caching them for faster access.
  Marionette.TemplateManager = {
    templates: {},

    // Get the specified template by id. Either
    // retrieves the cached version, or loads it
    // from the DOM.
    get: function(templateId, callback){
      var template = this.templates[templateId];
      if (template){
        callback && callback.call(this, template);
      } else {
        var that = this;
        this.loadTemplate(templateId, function(template){
          that.templates[templateId] = template;
          callback && callback.call(that, template);
        });
      }
    },

    // Load a template from the DOM.
    loadTemplate: function(templateId, callback){
      callback.call(this, $(templateId));
    },

    // Clear templates from the cache. If no arguments
    // are specified, clears all templates:
    // `clear()`
    //
    // If arguments are specified, clears each of the 
    // specified templates from the cache:
    // `clear("#t1", "#t2", "...")`
    clear: function(){
      var length = arguments.length;
      if (length > 0){
        for(var i=0; i<length; i++){
          delete this.templates[arguments[i]];
        }
      } else {
        this.templates = {};
      }
    }
  };

  // Helpers
  // -------

  // For slicing `arguments` in functions
  var slice = Array.prototype.slice;
  
  // Copy the `extend` function used by Backbone's classes
  var extend = Backbone.View.extend;
  Marionette.RegionManager.extend = extend;
  Marionette.Application.extend = extend;

  // Copy the features of `BindTo` on to these objects
  _.extend(Marionette.ItemView.prototype, Marionette.BindTo);
  _.extend(Marionette.CollectionView.prototype, Marionette.BindTo);
  _.extend(Marionette.Application.prototype, Marionette.BindTo);
  _.extend(Marionette.RegionManager.prototype, Marionette.BindTo);

  return Marionette;
})(Backbone, _, window.jQuery || window.Zepto || window.ender);
