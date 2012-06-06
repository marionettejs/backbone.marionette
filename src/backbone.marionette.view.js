// Marionette.View
// ---------------

// The core view type that other Marionette views extend from.
Marionette.View = Backbone.View.extend({

  // Get the template for this view
  // instance. You can set a `template` attribute in the view
  // definition or pass a `template: "whatever"` parameter in
  // to the constructor options. 
  getTemplate: function(){
    var template;

    // Get the template from `this.options.template` or
    // `this.template`. The `options` takes precedence.
    if (this.options && this.options.template){
      template = this.options.template;
    } else {
      template = this.template;
    }

    return template;
  },

  // Serialize the model or collection for the view. If a model is
  // found, `.toJSON()` is called. If a collection is found, `.toJSON()`
  // is also called, but is used to populate an `items` array in the
  // resulting data. If both are found, defaults to the model. 
  // You can override the `serializeData` method in your own view 
  // definition, to provide custom serialization for your view's data.
  serializeData: function(){
    var data;

    if (this.model) { 
      data = this.model.toJSON(); 
    }
    else if (this.collection) {
      data = { items: this.collection.toJSON() };
    }

    data = this.mixinTemplateHelpers(data);

    return data;
  },

  // Mix in template helper methods. Looks for a
  // `templateHelpers` attribute, which can either be an
  // object literal, or a function that returns an object
  // literal. All methods and attributes from this object
  // are copies to the object passed in.
  mixinTemplateHelpers: function(target){
    target = target || {};
    var templateHelpers = this.templateHelpers;
    if (_.isFunction(templateHelpers)){
      templateHelpers = templateHelpers.call(this);
    }
    return _.extend(target, templateHelpers);
  },

  // Configure `triggers` to forward DOM events to view
  // events. `triggers: {"click .foo": "do:foo"}`
  configureTriggers: function(){
    if (!this.triggers) { return; }

    var triggers = this.triggers;
    var that = this;
    var triggerEvents = {};

    // Allow `triggers` to be configured as a function
    if (_.isFunction(triggers)){ triggers = triggers.call(this); }

    // Configure the triggers, prevent default
    // action and stop propagation of DOM events
    _.each(triggers, function(value, key){

      triggerEvents[key] = function(e){
        if (e && e.preventDefault){ e.preventDefault(); }
        if (e && e.stopPropagation){ e.stopPropagation(); }
        that.trigger(value);
      }

    });

    return triggerEvents;
  },

  // Overriding Backbone.View's delegateEvents specifically
  // to handle the `triggers` configuration
  delegateEvents: function(events){
    events = events || this.events;
    if (_.isFunction(events)){ events = events.call(this)}

    var combinedEvents = {};
    var triggers = this.configureTriggers();
    _.extend(combinedEvents, events, triggers);

    Backbone.View.prototype.delegateEvents.call(this, combinedEvents);
  },

  // Default `close` implementation, for removing a view from the
  // DOM and unbinding it. Regions will call this method
  // for you. You can specify an `onClose` method in your view to
  // add custom code that is called after the view is closed.
  close: function(){
    if (this.beforeClose) { this.beforeClose(); }

    this.unbindAll();
    this.remove();

    if (this.onClose) { this.onClose(); }
    this.trigger('close');
    this.unbind();
  }
});

