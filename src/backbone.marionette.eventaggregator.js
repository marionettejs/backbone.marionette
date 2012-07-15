// Event Aggregator
// ----------------

// A pub-sub object that can be used to decouple various parts
// of an application through event-driven architecture.
Marionette.EventAggregator = Marionette.EventBinder.extend({
  
  // Extend any provided options directly on to the event binder
  constructor: function(options){
    Marionette.EventBinder.apply(this, arguments);
    _.extend(this, options);
  },

  // Override the `bindTo` method to ensure that the event aggregator
  // is used as the event binding storage
  bindTo: function(eventName, callback, context){
    return Marionette.EventBinder.prototype.bindTo.call(this, this, eventName, callback, context);
  }
});

// Copy the basic Backbone.Events on to the event aggregator
_.extend(Marionette.EventAggregator.prototype, Backbone.Events);

// Copy the `extend` function used by Backbone's classes
Marionette.EventAggregator.extend = Backbone.View.extend;

