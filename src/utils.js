/* jshint maxstatements: 14, maxparams: 5, maxcomplexity: 7 */
var Utils = Marionette.Utils = new Marionette.Mixin({

  // Retrieve an object, function or other value from a target
  // object or its `options`, with `options` taking precedence.
  getOption: function(optionName) {
    if (!optionName) { return; }
    if (this.options && (this.options[optionName] !== undefined)) {
      return this.options[optionName];
    } else {
      return this[optionName];
    }
  }

});

// Trigger Method
// --------------

// split the event name on the ":"
var splitter = /(^|:)(\w)/gi;

// take the event section ("section1:section2:section3")
// and turn it in to uppercase name
function getEventName(match, prefix, eventName) {
  return eventName.toUpperCase();
}

Marionette._triggerMethod = function(context, event, args) {
  var noEventArg = arguments.length < 3;
  if (noEventArg) {
    args = event;
    event = args[0];
  }

  // get the method name from the event name
  var methodName = 'on' + event.replace(splitter, getEventName);
  var method = context[methodName];
  var result;

  // call the onMethodName if it exists
  if (_.isFunction(method)) {
    // pass all args, except the event name
    result = method.apply(context, noEventArg ? _.rest(args) : args);
  }

  // trigger the event, if a trigger method exists
  if (_.isFunction(context.trigger)) {
    if (noEventArg + args.length > 1) {
      context.trigger.apply(context, noEventArg ? args : [event].concat(_.rest(args, 0)));
    } else {
      context.trigger(event);
    }
  }

  return result;
};

// Trigger an event and/or a corresponding method name. Examples:
//
// `this.triggerMethod("foo")` will trigger the "foo" event and
// call the "onFoo" method.
//
// `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
// call the "onFooBar" method.
Utils.triggerMethod = function(event) {
  return Marionette._triggerMethod(this, arguments);
};

// triggerMethodOn invokes triggerMethod on a specific context
//
// e.g. `Marionette.triggerMethodOn(view, 'show')`
// will trigger a "show" event or invoke onShow the view.
Utils.triggerMethodOn = function(context) {
  var fnc = _.isFunction(context.triggerMethod) ?
                context.triggerMethod :
                Marionette.triggerMethod;

  return fnc.apply(context, _.rest(arguments));
};

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

// Bind the event to handlers specified as a string of
// handler names on the target object
function bindFromStrings(target, entity, evt, methods) {
  var methodNames = methods.split(/\s+/);

  _.each(methodNames, function(methodName) {

    var method = target[methodName];
    if (!method) {
      throw new Marionette.Error('Method "' + methodName +
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
    throw new Marionette.Error({
      message: 'Bindings must be an object or function.',
      url: 'marionette.functions.html#marionettebindentityevents'
    });
  }

  // allow the bindings to be a function
  bindings = Marionette._getValue(bindings, target);

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

Utils.bindEntityEvents = function(entity, bindings) {
  iterateEvents(this, entity, bindings, bindToFunction, bindFromStrings);
};

Utils.unbindEntityEvents = function(entity, bindings) {
  iterateEvents(this, entity, bindings, unbindToFunction, unbindFromStrings);
};

// Add Utils to the base Class
Marionette.Class.mixin(Utils);
