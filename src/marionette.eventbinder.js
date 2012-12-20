(function(Backbone, Marionette, _){
  // grab a reference to the original listenTo
  var listenTo = Backbone.Events.listenTo;

  // create a version of listenTo that allows contexting binding
  function contextBoundListenTo(obj, evtSource, events, callback, context){
    context = context || obj;
    return listenTo.call(obj, evtSource, events, _.bind(callback, context));
  }

  // Fix the listenTo method on the target object, allowing the 4th
  // context parameter to be specified
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

})(Backbone, Marionette, _);

