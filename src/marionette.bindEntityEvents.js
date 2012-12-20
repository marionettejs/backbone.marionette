// Marionette.bindEntityEvents
// ---------------------------
//
// This method is used to bind a backbone "entity" (collection/model) 
// to methods on a target object. 
//
// The first paremter, `target`, must have a `listenTo` method from the
// EventBinder object.
//
// The second parameter is the entity (Backbone.Model or Backbone.Collection)
// to bind the events from.
//
// The third parameter is a hash of { "event:name": "eventHandler" }
// configuration. Multiple handlers can be separated by a space. A
// function can be supplied instead of a string handler name. 
Marionette.bindEntityEvents = (function(){

  // Bind the event to handlers specified as a string of
  // handler names on the target object
  function bindFromStrings(target, entity, evt, methods){
    var methodNames = methods.split(/\s+/);

    _.each(methodNames,function(methodName) {

      var method = target[methodName];
      if(!method) {
        throw new Error("Method '"+ methodName +"' was configured as an event handler, but does not exist.");
      }

      target.listenTo(entity, evt, method, target);
    });
  }

  // Bind the event to a supplied callback function
  function bindToFunction(target, entity, evt, method){
      target.listenTo(entity, evt, method, target);
  }

  // Export the bindEntityEvents method
  return function(target, entity, bindings){
    if (!entity || !bindings) { return; }

    _.each(bindings, function(methods, evt){

      // allow for a function as the handler, 
      // or a list of event names as a string
      if (_.isFunction(methods)){
        bindToFunction(target, entity, evt, methods);
      } else {
        bindFromStrings(target, entity, evt, methods);
      }

    });
  };
})();
