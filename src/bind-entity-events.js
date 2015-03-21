/* jshint maxparams: 5 */

// Bind Entity Events & Unbind Entity Events
// -----------------------------------------
//
// These methods are used to bind/unbind a backbone "entity" (e.g. collection/model)
// to methods on a target object.
//
// The first parameter, `target`, must have the Backbone.Events module mixed in.
//
// The second parameter is the `entity` (Backbone.Model, Backbone.Collection or
// any object that has Backbone.Events mixed in) to bind the events from.
//
// The third parameter is a hash of { "event:name": "eventHandler" }
// configuration. Multiple handlers can be separated by a space. A
// function can be supplied instead of a string handler name.

'use strict';

var _       = require('underscore');
var helpers = require('./helpers.js');
var error   = require('./error.js');

// Bind the event to handlers specified as a string of
// handler names on the target object
function bindFromStrings(target, entity, evt, methods) {
  var methodNames = methods.split(/\s+/);

  _.each(methodNames, function(methodName) {

    var method = target[methodName];
    if (!method) {
      throw new error.Error('Method "' + methodName +
        '" was configured as an event handler, but does not exist.');
    }

    target.listenTo(entity, evt, method);
  });
}

// Bind the event to a supplied callback function
function bindToFunction(target, entity, evt, method) {
  target.listenTo(entity, evt, method);
}

// Bind the event to handlers specified as a string of
// handler names on the target object
function unbindFromStrings(target, entity, evt, methods) {
  var methodNames = methods.split(/\s+/);

  _.each(methodNames, function(methodName) {
    var method = target[methodName];
    target.stopListening(entity, evt, method);
  });
}

// Bind the event to a supplied callback function
function unbindToFunction(target, entity, evt, method) {
  target.stopListening(entity, evt, method);
}

// generic looping function
function iterateEvents(target, entity, bindings, functionCallback, stringCallback) {
  if (!entity || !bindings) { return; }

  // type-check bindings
  if (!_.isObject(bindings)) {
    throw new error.Error({
      message: 'Bindings must be an object or function.',
      url: 'marionette.functions.html#marionettebindentityevents'
    });
  }

  // allow the bindings to be a function
  bindings = helpers._getValue(bindings, target);

  // iterate the bindings and bind them
  _.each(bindings, function(methods, evt) {

    // allow for a function as the handler,
    // or a list of event names as a string
    if (_.isFunction(methods)) {
      functionCallback(target, entity, evt, methods);
    } else {
      stringCallback(target, entity, evt, methods);
    }

  });
}

exports = {
  // Export Public API
  bindEntityEvents: function(target, entity, bindings) {
    iterateEvents(target, entity, bindings, bindToFunction, bindFromStrings);
  },

  unbindEntityEvents: function(target, entity, bindings) {
    iterateEvents(target, entity, bindings, unbindToFunction, unbindFromStrings);
  },

  // Proxy `bindEntityEvents`
  proxyBindEntityEvents: function(entity, bindings) {
    return exports.bindEntityEvents(this, entity, bindings);
  },

  // Proxy `unbindEntityEvents`
  proxyUnbindEntityEvents: function(entity, bindings) {
    return exports.unbindEntityEvents(this, entity, bindings);
  }
};
