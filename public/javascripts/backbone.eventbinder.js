// Backbone.EventBinder, v1.0.1
// Copyright (c)2012 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
// http://github.com/marionettejs/backbone.eventbinder
// EventBinder
// -----------
//
// The event binder facilitates the binding and unbinding of events
// from objects that extend `Backbone.Events`. It makes
// unbinding events, even with anonymous callback functions,
// easy. 
//
// Inspired by [Johnny Oshika](http://stackoverflow.com/questions/7567404/backbone-js-repopulate-or-recreate-the-view/7607853#7607853)

Backbone.EventBinder = (function(Backbone, _){
  "use strict";

  // A map of objects that support binding/unbinding events.
  // This allows EventBinder to support events on arbitrary
  // objects with EB's consistent api.
  var handlerMap = {
    // 'default' type accounts for Backbone style objects extending
    // Backbone.Events
    "default" : {
      bindTo : function (obj, eventName, callback, context) {
        context = context || this;
        obj.on(eventName, callback, context);

        var binding = {
          type : 'default',
          obj: obj,
          eventName: eventName,
          callback: callback,
          context: context
        };

        return binding;
      },
      unbindFrom : function(binding){
        binding.obj.off(binding.eventName, binding.callback, binding.context);
      }
    },

    // 'jquery' style handlers allow us to bind to jQuery
    // (or compatible) objects
    jquery : {
      bindTo : function (obj, eventName, callback, context) {
        context = context || this;
        callback = _(callback).bind(context);
        obj.on(eventName, callback);

        var binding = {
          type : 'jquery',
          obj: obj,
          eventName: eventName,
          callback: callback,
          context: context
        };

        return binding;
      },
      unbindFrom : function(binding){
        binding.obj.off(binding.eventName, binding.callback);
      }
    }
  };

  // Use whatever best logic necessary to determine the type
  // of the supplied object
  function getHandlerForObject(obj) {
    if (_.isUndefined(obj) || _.isNull(obj)) {
      throw new Error("Can't bindTo undefined");
    }

    if (obj.jquery) { return handlerMap.jquery; }

    return handlerMap["default"];
  }
  
  // Constructor function
  var EventBinder = function(){
    this._eventBindings = [];
  };

  // Copy the `extend` function used by Backbone's classes
  EventBinder.extend = Backbone.View.extend;

  // Extend the EventBinder with additional methods
  _.extend(EventBinder.prototype, {

    // Delegate to the bindTo for the appropriate type and
    // store the event binding in array so it can be unbound
    // easily, at a later point in time.
    bindTo: function(/* args... */) {
      var obj = arguments[0];
      var handlers = getHandlerForObject(obj);

      var binding = handlers.bindTo.apply(this,arguments);

      this._eventBindings.push(binding);

      return binding;
    },

    // Unbind from a single binding object. Binding objects are
    // returned from the `bindTo` method call. 
    unbindFrom: function(binding) {
      handlerMap[binding.type].unbindFrom.apply(this,arguments);
      this._eventBindings = _.reject(this._eventBindings, function(bind){return bind === binding;});
    },

    // Unbind all of the events that we have stored.
    unbindAll: function() {
      // The `unbindFrom` call removes elements from the array
      // while it is being iterated, so clone it first.
      var bindings = _.map(this._eventBindings, _.identity);
      _.each(bindings, this.unbindFrom, this);
    }
  });

  return EventBinder;
})(Backbone, _);
