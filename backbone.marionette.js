// Backbone.Marionette v0.6.0
//
// Copyright (C)2011 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT License
//
// Documentation and Full License Available at:
// http://github.com/derickbailey/backbone.marionette

Backbone.Marionette = (function(Backbone, _, $){
  var Marionette = {};

  Marionette.version = "0.6.0";

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

      this.initialEvents();
    },

    // Configured the initial events that the item view 
    // binds to. Override this method to prevent the initial
    // events, or to add your own initial events.
    initialEvents: function(){
      if (this.collection){
        this.bindTo(this.collection, "reset", this.render, this);
      }
    },

    // Serialize the model or collection for the view. If a model is
    // found, `.toJSON()` is called. If a collection is found, `.toJSON()`
    // is also called, but is used to populate an `items` array in the
    // resulting data. If both are found, defaults to the model. 
    // You can override the `serializeData` method in your own view 
    // definition, to provide custom serialization for your view's data.
    serializeData: function(){
      var data;

      if (this.model) { data = this.model.toJSON(); }
      else if (this.collection) {
        data = { items: this.collection.toJSON() };
      }

      return data;
    },

    // Render the view, defaulting to underscore.js templates.
    // You can override this in your view definition.
    render: function(){
      var that = this;
      var data = this.serializeData();
      var deferredRender = $.Deferred();

      deferredRender.done(function(){
        that.onRender && that.onRender();
        that.trigger("item:rendered", that);
      });

      var templateRetrieval = this.getTemplate();

      $.when(templateRetrieval).then(function(template){
        var html = that.renderTemplate(template, data);
        that.$el.html(html);
        deferredRender.resolve();
      });

      return deferredRender;
    },

    // Default implementation uses underscore.js templates. Override
    // this method to use your own templating engine.
    renderTemplate: function(template, data){
      if (!template || template.length === 0){
        var msg = "A template must be specified";
        var err = new Error(msg);
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
    getTemplate: function(){
      var template = this.template || this.options.template;
  
      if (_.isFunction(template)){
        template  = template.call(this);
      }

      return Marionette.TemplateCache.get(template);
    },

    // Default `close` implementation, for removing a view from the
    // DOM and unbinding it. Regions will call this method
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
    constructor: function(){
      Backbone.View.prototype.constructor.apply(this, arguments);

      _.bindAll(this, "addChildView", "render");
      this.initialEvents();
    },

    // Configured the initial events that the collection view 
    // binds to. Override this method to prevent the initial
    // events, or to add your own initial events.
    initialEvents: function(){
      this.bindTo(this.collection, "add", this.addChildView, this);
      this.bindTo(this.collection, "remove", this.removeChildView, this);
      this.bindTo(this.collection, "reset", this.reRender, this);
    },

    // Re-rendering the collection view involves closing any
    // existing child views before rendering again.
    reRender: function(){
      this.closeChildren();
      this.render();
    },

    // Loop through all of the items and render 
    // each of them with the specified `itemView`.
    render: function(){
      var that = this;
      var deferredRender = $.Deferred();
      var promises = [];

      this.collection.each(function(item){
        promises.push(that.addChildView(item));
      });

      deferredRender.done(function(){
        this.onRender && this.onRender();
        this.trigger("collection:rendered", this);
      });

      $.when(promises).then(function(){
        deferredRender.resolveWith(that);
      });

      return deferredRender;
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

      this.closeChildren();

      if (this.onClose){
        this.onClose();
      }
    },

    closeChildren: function(){
      if (this.children){
        _.each(this.children, function(childView){
          childView.close();
        });
      }
    }
  });

  // Composite View
  // --------------

  // Used for rendering a branch-leaf, hierarchical structure.
  // Extends directly from CollectionView and also renders an
  // an item view as `modelView`, for the top leaf
  Marionette.CompositeView = Marionette.CollectionView.extend({
    modelView: Marionette.ItemView,

    // Renders the model once, and the collection once. Calling
    // this again will tell the model's view to re-render itself
    // but the collection will not re-render.
    render: function(){
      var that = this;
      var compositeRendered = $.Deferred();

      this.renderedModelView = new this.modelView({
        model: this.model,
        template: this.template
      });

      var modelIsRendered = this.renderModel();

      $.when(modelIsRendered).then(function(){
        that.$el.html(that.renderedModelView.el);
        that.trigger("composite:model:rendered");

        var collectionIsRendered = that.renderCollection();
        $.when(collectionIsRendered).then(function(){
          compositeRendered.resolve();
        });
      });

      compositeRendered.done(function(){
        that.trigger("composite:rendered");
      });

      this.render = function(){
        return this.renderModel();
      }

      return compositeRendered;
    },

    // Render the collection for the composite view
    renderCollection: function(){
      var collectionDeferred = Marionette.CollectionView.prototype.render.apply(this, arguments);
      collectionDeferred.done(function(){
        this.trigger("composite:collection:rendered");
      });
      return collectionDeferred;
    },

    // Render an individual model, if we have one, as
    // part of a composite view (branch / leaf). For example:
    // a treeview.
    renderModel: function(){
      if (this.renderedModelView){
        return this.renderedModelView.render();
      }
    },

    // Ensure we close things correctly
    close: function(){
        Marionette.CollectionView.prototype.close.apply(this, arguments);
        if (this.renderedModelView){
          this.renderedModelView.close && this.renderedModelView.close();
          delete this.renderedModelView;
        }
    }
  });

  // Region 
  // ------

  // Manage the visual regions of your composite application. See
  // http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/
  Marionette.Region = function(options){
    this.options = options || {};

    _.extend(this, options);

    if (!this.el){
      var err = new Error("An 'el' must be specified");
      err.name = "NoElError";
      throw err;
    }
  };

  _.extend(Marionette.Region.prototype, Backbone.Events, {

    // Displays a backbone view instance inside of the region.
    // Handles calling the `render` method for you. Reads content
    // directly from the `el` attribute. Also calls an optional
    // `onShow` and `close` method on your view, just after showing
    // or just before closing the view, respectively.
    show: function(view, appendMethod){
      this.ensureEl();

      this.close();
      this.open(view, appendMethod);

      this.currentView = view;
    },

    ensureEl: function(){
      if (!this.$el || this.$el.length == 0){
        this.$el = this.getEl(this.el);
      }
    },

    // Override this method to change how the region finds the
    // DOM element that it manages. Return a jQuery selector object.
    getEl: function(selector){
        return $(selector);
    },

    // Internal method to render and display a view. Not meant 
    // to be called from any external code.
    open: function(view, appendMethod){
      var that = this;
      appendMethod = appendMethod || "html";

      $.when(view.render()).then(function () {
        that.$el[appendMethod](view.el);
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
    },

    // Attach an existing view to the region. This 
    // will not call `render` or `onShow` for the new view, 
    // and will not replace the current HTML for the `el`
    // of the region.
    attachView: function(view){
      this.currentView = view;
    }
  });

  // Layout
  // ------

  // Formerly known as Composite Region.
  //
  // Used for managing application layouts, nested layouts and
  // multiple regions within an application or sub-application.
  //
  // A specialized view type that renders an area of HTML and then
  // attaches `Region` instances to the specified `regions`.
  // Used for composite view management and sub-application areas.
  Marionette.Layout = Marionette.ItemView.extend({
    constructor: function () {
      this.vent = new Backbone.Marionette.EventAggregator();
      Backbone.Marionette.ItemView.apply(this, arguments);
      this.regionManagers = {};
    },

    render: function () {
      this.initializeRegions();
      return Backbone.Marionette.ItemView.prototype.render.call(this, arguments);
    },

    close: function () {
      this.closeRegions();
      Backbone.Marionette.ItemView.prototype.close.call(this, arguments);
    },

    initializeRegions: function () {
      var that = this;
      _.each(this.regions, function (selector, name) {
        var regionManager = new Backbone.Marionette.Region({
            el: selector,

            getEl: function(selector){
              return that.$(selector);
            }
        });
        that.regionManagers[name] = regionManager;
        that[name] = regionManager;
      });
    },

    closeRegions: function () {
      var that = this;
      _.each(this.regionManagers, function (manager, name) {
        manager.close();
        delete that[name];
      });
      delete this.regionManagers;
    }
  });

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
        var controller = this.controller;
        if (options && options.controller) {
          controller = options.controller;
        }
        this.processAppRoutes(controller, this.appRoutes);
      }
    },

    processAppRoutes: function(controller, appRoutes){
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
        method = _.bind(controller[methodName], controller);
        router.route(route, methodName, method);
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

  // Event Aggregator
  // ----------------

  // A pub-sub object that can be used to decouple various parts
  // of an application through event-driven architecture.
  Marionette.EventAggregator = function(options){
    _.extend(this, options);
  };

  _.extend(Marionette.EventAggregator.prototype, Backbone.Events, Marionette.BindTo, {
    // Assumes the event aggregator itself is the 
    // object being bound to.
    bindTo: function(eventName, callback, context){
      Marionette.BindTo.bindTo.call(this, this, eventName, callback, context);
    }
  });

  // Composite Application
  // ---------------------

  // Contain and manage the composite application as a whole.
  // Stores and starts up `Region` objects, includes an
  // event aggregator as `app.vent`
  Marionette.Application = function(options){
    this.initCallbacks = new Marionette.Callbacks();
    this.vent = new Marionette.EventAggregator();
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

    // Add regions to your app. 
    // Accepts a hash of named strings or Region objects
    // addRegions({something: "#someRegion"})
    // addRegions{{something: Region.extend({el: "#someRegion"}) });
    addRegions: function(regions){
      var regionValue, regionObj;

      for(var region in regions){
        if (regions.hasOwnProperty(region)){
          regionValue = regions[region];
    
          if (typeof regionValue === "string"){
            regionObj = new Marionette.Region({
              el: regionValue
            });
          } else {
            regionObj = new regionValue;
          }

          this[region] = regionObj;
        }
      }
    }
  });

  // Template Cache
  // --------------
  
  // Manage templates stored in `<script>` blocks,
  // caching them for faster access.
  Marionette.TemplateCache = {
    templates: {},

    // Get the specified template by id. Either
    // retrieves the cached version, or loads it
    // from the DOM.
    get: function(templateId){
      var that = this;
      var templateRetrieval = $.Deferred();
      var cachedTemplate = this.templates[templateId];

      if (cachedTemplate){
        templateRetrieval.resolve(cachedTemplate);
      } else {

        var templateLoaded = this.loadTemplate(templateId);
        $.when(templateLoaded).then(function(template){
          that.templates[templateId] = template;
          templateRetrieval.resolve(template);
        });

      }

      return templateRetrieval;
    },

    // Load a template from the DOM, by default. Override
    // this method to provide your own template retrieval,
    // such as asynchronous loading from a server.
    loadTemplate: function(templateId){
      return $(templateId);
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
  Marionette.Region.extend = extend;
  Marionette.Application.extend = extend;

  // Copy the features of `BindTo` on to these objects
  _.extend(Marionette.ItemView.prototype, Marionette.BindTo);
  _.extend(Marionette.CollectionView.prototype, Marionette.BindTo);
  _.extend(Marionette.Application.prototype, Marionette.BindTo);
  _.extend(Marionette.Region.prototype, Marionette.BindTo);

  return Marionette;
})(Backbone, _, window.jQuery || window.Zepto || window.ender);
