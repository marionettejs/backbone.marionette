// EventBinder
// -----------
// Provides an object that can be instantiated, to be used as an
// event management object. Replaces The previous Backbone.EventBinder
// with a version that works from Backbone.Events directly.

Marionette.EventBinder = (function(Marionette){
  // grab a reference to the original listenTo
  var listenTo = Backbone.Events.listenTo;

  // create a version of listenTo that allows contexting binding
  function contextBoundListenTo(obj, evtSource, events, callback, context){
    context = context || obj;
    return listenTo.call(obj, evtSource, events, _.bind(callback, context));
  }

  // Define the EventBinder, add Backbone.Events to it
  function EventBinder(){}

  _.extend(EventBinder.prototype, Backbone.Events, {
    // Override the listenTo so that we can have a version that
    // correctly binds context
    listenTo: function(evtSource, events, callback, context){
      return contextBoundListenTo(this, evtSource, events, callback, context);
    }
  });

  // Allow it to be extended
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
    target.listenTo = function(evtSource, events, callback, context){
      return contextBoundListenTo(this, evtSource, events, callback, context);
    };
  };

  return EventBinder;
})(Marionette);

