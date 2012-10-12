// Backbone.Wreqr, v0.0.0
// Copyright (c)2012 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
// http://github.com/marionettejs/backbone.wreqr
Backbone.Wreqr = (function(Backbone, Marionette, _){
  "option strict";
  var Wreqr = {};

  Wreqr.Handlers = (function(Backbone, _){
    "option strict";
    
    var Handlers = function(){
      "use strict";
      this._handlers = {};
    };
  
    Handlers.extend = Backbone.Model.extend;
  
    _.extend(Handlers.prototype, {
      addHandler: function(name, handler, context){
        var config = {
          callback: handler,
          context: context
        };
  
        this._handlers[name] = config;
      },
  
      getHandler: function(name){
        var config = this._handlers[name];
  
        if (!config){
          throw new Error("Handler not found for '" + name + "'");
        }
  
        return function(){
          return config.callback.apply(config.context, arguments);
        };
      },
  
      removeHandler: function(name){
        delete this._handlers[name];
      },
  
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
      execute: function(name, args){
        this.getHandler(name)(args);
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
      request: function(name, args){
        return this.getHandler(name)(args);
      }
    });
  
  })(Wreqr);
  
  // Event Aggregator
  // ----------------
  // A pub-sub object that can be used to decouple various parts
  // of an application through event-driven architecture.
  
  Wreqr.EventAggregator = (function(Backbone, _){
    "option strict";
    var EA = function(){};
  
    // Copy the `extend` function used by Backbone's classes
    EA.extend = Backbone.Model.extend;
  
    // Copy the basic Backbone.Events on to the event aggregator
    _.extend(EA.prototype, Backbone.Events);
  
    return EA;
  })(Backbone, _);
  

  return Wreqr;
})(Backbone, Backbone.Marionette, _);
