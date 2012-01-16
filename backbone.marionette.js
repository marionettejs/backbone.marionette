// Backbone.Marionette v0.2.2
//
// Copyright (C)2011 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT License
//
// Documentation and Full License Available at:
// http://github.com/derickbailey/backbone.marionette

Backbone.Marionette = (function(Backbone, _, $){
  var Marionette = {};

  Marionette.version = "0.2.2";

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

  // Item View
  // ---------
  
  // A single item view implementation that contains code for rendering
  // with underscore.js templates, serializing the view's model or collection,
  // and calling several methods on extended views, such as `onRender`.
  Marionette.ItemView = Backbone.View.extend({
    constructor: function(){
      var args = slice.call(arguments);
      Backbone.View.prototype.constructor.apply(this, args);

      this.el = $(this.el);
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
      var template = this.getTemplate();
      var data = this.serializeData();
      var html = this.renderTemplate(template, data);

      this.el.html(html);

      if (this.onRender){
        this.onRender();
      }

    },

    // Default implementation uses underscore.js templates. Override
    // this method to use your own templating engine.
    renderTemplate: function(template, data){
      return _.template(template.html(), data);
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
    constructor: function(){
      Backbone.View.prototype.constructor.apply(this, arguments);

      this.el = $(this.el);

      _.bindAll(this, "addChildView");
      this.bindTo(this.collection, "add", this.addChildView, this);
      this.bindTo(this.collection, "remove", this.removeChildView, this);
    },

    // Loop through all of the items and render 
    // each of them with the specified `itemView`.
    render: function(){
      this.collection.each(this.addChildView);
    },

    // Render the child item's view and add it to the
    // HTML for the collection view.
    addChildView: function(item){
      var html = this.renderItem(item);
      this.appendHtml(this.el, html);
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
      obj.bind(eventName, callback, context);

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
        binding.obj.unbind(binding.eventName, binding.callback);
      });

      this.bindings = [];
    }
  };

  // Composite Application
  // ---------------------

  // Contain and manage the composite application as a whole.
  // Stores and starts up `RegionManager` objects, includes an
  // event aggregator as `app.vent`
  Marionette.Application = function(options){
    this.initializers = [];
    this.vent = _.extend({}, Backbone.Events, Marionette.BindTo);
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
          var regionValue = regions[region];
    
          if (typeof regionValue === "string"){
            appRegions[region] = Marionette.RegionManager.extend({
              el: regionValue
            });
          } else {
            appRegions[region] = regionValue;
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

  // Template Manager
  // ----------------
  
  // Manage templates stored in `<script>` blocks,
  // caching them for faster access.
  Marionette.TemplateManager = {
    templates: {},

    // Get the specified template by id. Either
    // retrieves the cached version, or loads it
    // from the DOM.
    get: function(templateId){
      var template = this.templates[templateId];
      if (!template){
        template = this.loadTemplate(templateId);
        this.templates[templateId] = template;
      }
      return template;
    },

    // Load a template from the DOM.
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
      if (length > 1){
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
  
  // Retrieve the template from the call's context. The
  // `template` attribute can either be a function that
  // returns a jQuery object, or a jQuery selector string 
  // directly. The string value must be a valid jQuery 
  // selector.  
  var templateMixin = {
    getTemplate: function(){
      var template = this.template;
      var templateData;

      if (_.isFunction(template)){
        templateData = template.call(this);
      } else {
        templateData = Marionette.TemplateManager.get(template);
      }

      return templateData;
    }
  };
  // Copy the 'getTemplate' function on to the views
  _.extend(Marionette.ItemView.prototype, templateMixin);
  _.extend(Marionette.CollectionView.prototype, templateMixin);

  // Copy the `extend` function used by Backbone's classes
  var extend = Backbone.View.extend;
  Marionette.RegionManager.extend = extend;
  Marionette.Application.extend = extend;

  // Copy the features of `BindTo` on to these objects
  _.extend(Marionette.ItemView.prototype, Marionette.BindTo);
  _.extend(Marionette.CollectionView.prototype, Marionette.BindTo);
  _.extend(Marionette.Application.prototype, Marionette.BindTo);

  return Marionette;
})(Backbone, _, jQuery);
