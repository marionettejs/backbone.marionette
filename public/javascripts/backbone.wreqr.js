// Backbone.Wreqr, v0.2.0
// Copyright (c)2012 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
// http://github.com/marionettejs/backbone.wreqr
Backbone.Wreqr = (function(Backbone, Marionette, _){
  "option strict";
  var Wreqr = {};

  // Handlers
  // --------
  // A registry of functions to call, given a name
  
  Wreqr.Handlers = (function(Backbone, _){
    "option strict";
    
    // Constructor
    // -----------
  
    var Handlers = function(){
      "use strict";
      this._handlers = {};
    };
  
    Handlers.extend = Backbone.Model.extend;
  
    // Instance Members
    // ----------------
  
    _.extend(Handlers.prototype, {
  
      // Add a handler for the given name, with an
      // optional context to run the handler within
      addHandler: function(name, handler, context){
        var config = {
          callback: handler,
          context: context
        };
  
        this._handlers[name] = config;
      },
  
      // Get the currently registered handler for
      // the specified name. Throws an exception if
      // no handler is found.
      getHandler: function(name){
        var config = this._handlers[name];
  
        if (!config){
          throw new Error("Handler not found for '" + name + "'");
        }
  
        return function(){
          var args = Array.prototype.slice.apply(arguments);
          return config.callback.apply(config.context, args);
        };
      },
  
      // Remove a handler for the specified name
      removeHandler: function(name){
        delete this._handlers[name];
      },
  
      // Remove all handlers from this registry
      removeAllHandlers: function(){
        this._handlers = {};
      }
    });
  
    return Handlers;
  })(Backbone, _);
  
  // Wreqr.Commands
  // --------------
  //
  // A simple command pattern implementation. Register a command
  // handler and execute it.
  Wreqr.Commands = (function(Wreqr){
    "option strict";
  
    return Wreqr.Handlers.extend({
      execute: function(){
        var name = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
  
        this.getHandler(name).apply(this, args);
      }
    });
  
  })(Wreqr);
  
  // Wreqr.RequestResponse
  // ---------------------
  //
  // A simple request/response implementation. Register a
  // request handler, and return a response from it
  Wreqr.RequestResponse = (function(Wreqr){
    "option strict";
  
    return Wreqr.Handlers.extend({
      request: function(){
        var name = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
  
        return this.getHandler(name).apply(this, args);
      }
    });
  
  })(Wreqr);
  
  // Event Aggregator
  // ----------------
  // A pub-sub object that can be used to decouple various parts
  // of an application through event-driven architecture.
  
  Wreqr.EventAggregator = (function(Backbone, _){
  
    // Grab a reference to the original listenTo
    var listenTo = Backbone.Events.listenTo;
  
    // Create a version of listenTo that allows contexting binding
    function contextBoundListenTo(obj, evtSource, events, callback, context){
      context = context || obj;
      return listenTo.call(obj, evtSource, events, _.bind(callback, context));
    }
  
    // Define the EventAggregator
    function EventAggregator(){}
  
    // Mix Backbone.Events in to it
    _.extend(EventAggregator.prototype, Backbone.Events, {
      // Override the listenTo so that we can have a version that
      // correctly binds context
      listenTo: function(evtSource, events, callback, context){
        return contextBoundListenTo(this, evtSource, events, callback, context);
      }
    });
  
    // Allow it to be extended
    EventAggregator.extend = Backbone.Model.extend;
  
    return EventAggregator;
  })(Backbone, _);
  

  return Wreqr;
})(Backbone, Backbone.Marionette, _);
