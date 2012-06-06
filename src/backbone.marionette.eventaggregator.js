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
    return Marionette.BindTo.bindTo.call(this, this, eventName, callback, context);
  }
});

