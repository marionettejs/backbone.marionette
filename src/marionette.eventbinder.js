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

    target.listenTo = _.wrap(target.listenTo, function(original, source, event, callback, context){
      // check the context of the listenTo and set it to the object
      // that is having the eventBinder attached to it, if no context
      // has been specified in the .listenTo call
      context = context || target;
      return original.call(target, source, event, _.bind(callback, context));
    });
  };

  return EventBinder;
})(Marionette);
