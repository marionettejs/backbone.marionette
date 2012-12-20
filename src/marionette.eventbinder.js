// EventBinder
// -----------

Marionette.EventBinder = (function(Marionette){

  // Define the EventBinder, add Backbone.Events to it and
  // allow it to be extended like other Backbone objects
  function EventBinder(){};
  _.extend(EventBinder.prototype, Backbone.Events);
  EventBinder.extend = Marionette.extend;

  // Add the EventBinder methods to the target directly,
  // but keep them bound to the EventBinder instance so they 
  // work properly. This allows the event binder's implementation 
  // to vary independently of it being attached to the view... 
  // for example the internal structure used to store the events 
  // can change without worry about it interfering with Marionette's 
  // views.
  Marionette.addEventBinder = function(target){

    // If the target is not already extending Backbone.Events,
    // then extend that on to it first
    if (!target.on && !target.off && !target.listenTo && !target.stopListening){
      _.extend(target, Backbone.Events);
    }

    // Override the built-in listenTo method to make sure we 
    // account for context
    target.listenTo = _.wrap(target.listenTo, function(original, source, event, callback, context){
      context = context || target;
      return original.call(target, source, event, _.bind(callback, context));
    });
  };

  return EventBinder;
})(Marionette);
