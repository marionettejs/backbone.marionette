// Trigger Method
// --------------

// Trigger an event and/or a corresponding method name. Examples:
//
// `this.triggerMethod("foo")` will trigger the "foo" event and
// call the "onFoo" method.
//
// `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
// call the "onFooBar" method.
Marionette.triggerMethod = function(event) {

  // split the event name on the ":"
  var splitter = /(^|:)(\w)/gi;

  // take the event section ("section1:section2:section3")
  // and turn it in to uppercase name
  function getEventName(match, prefix, eventName) {
    return eventName.toUpperCase();
  }

  // get the method name from the event name
  var methodName = 'on' + event.replace(splitter, getEventName);
  var method = this[methodName];
  var result;

  // call the onMethodName if it exists
  if (_.isFunction(method)) {
    // pass all arguments, except the event name
    result = method.apply(this, _.tail(arguments));
  }

  // trigger the event, if a trigger method exists
  if (_.isFunction(this.trigger)) {
    this.trigger.apply(this, arguments);
  }

  return result;
};

// triggerMethodOn invokes triggerMethod on a specific context
//
// e.g. `Marionette.triggerMethodOn(view, 'show')`
// will trigger a "show" event or invoke onShow the view.
Marionette.triggerMethodOn = function(context) {
  var fnc = _.isFunction(context.triggerMethod) ?
                context.triggerMethod :
                Marionette.triggerMethod;

  return fnc.apply(context, _.rest(arguments));
};
