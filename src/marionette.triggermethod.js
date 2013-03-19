// Trigger an event and a corresponding method name. Examples:
//
// `this.triggerMethod("foo")` will trigger the "foo" event and
// call the "onFoo" method. 
//
// `this.triggerMethod("foo:bar") will trigger the "foo:bar" event and
// call the "onFooBar" method.
Marionette.triggerMethod = function(event) {
  var methodName = 'on' + event.replace(/(^|:)(\w)/gi, function() { return arguments[2].toUpperCase(); });
  var method = this[methodName];

  this.trigger.apply(this, arguments);

  if (_.isFunction(method)) {
    return method.apply(this, _.tail(arguments));
  }
};
