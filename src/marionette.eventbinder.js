// EventBinder
// -----------
// Import the event binder from it's new home
// https://github.com/marionettejs/backbone.eventbinder
Marionette.EventBinder = Backbone.EventBinder.extend();

// Add the EventBinder methods to the view directly,
// but keep them bound to the EventBinder instance so they work properly.
// This allows the event binder's implementation to vary independently
// of it being attached to the view... for example the internal structure
// used to store the events can change without worry about it interfering
// with Marionette's views.
Marionette.addEventBinder = function(target){
  var eventBinder = new Marionette.EventBinder();
  target.eventBinder = eventBinder;

  target.bindTo = function(source, event, callback, context){
    // check the context of the bindTo and set it to the object
    // that is having the eventBinder attached to it, if no context
    // has been specified in the .bindTo call
    context = context || target;
    eventBinder.bindTo(source, event, callback, context);
  };

  target.unbindFrom = _.bind(eventBinder.unbindFrom, eventBinder);
  target.unbindAll = _.bind(eventBinder.unbindAll, eventBinder);
};
