// addEventBinder
// --------------
//
// Mixes in Backbone.Events to the target object, if it is not present
// already. Also adjusts the listenTo method to accept a 4th parameter
// for the callback context.

(function(Backbone, Marionette, _){

  // grab a reference to the original listenTo
  var listenTo = Backbone.Events.listenTo;

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
      context = context || this;
      return listenTo.call(this, evtSource, events, _.bind(callback, context));
    };
  };

})(Backbone, Marionette, _);

