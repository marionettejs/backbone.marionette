/* jshint maxstatements: 14, maxcomplexity: 7 */

// Trigger Method
// --------------

import _               from 'underscore';
import getOption       from './utils/getOption';

var _triggerMethod = (function() {
  // split the event name on the ":"
  var splitter = /(^|:)(\w)/gi;

  // take the event section ("section1:section2:section3")
  // and turn it in to uppercase name
  function getEventName(match, prefix, eventName) {
    return eventName.toUpperCase();
  }

  return function(context, args) {
    var event = args[0];

    // get the method name from the event name
    var methodName = 'on' + event.replace(splitter, getEventName);
    var method = getOption(context, methodName);
    var result;

    // call the onMethodName if it exists
    if (_.isFunction(method)) {
      // pass all args, except the event name
      result = method.apply(context, _.rest(args));
    }

    // trigger the event
    context.trigger.apply(context, args);

    return result;
  };
})();

// Trigger an event and/or a corresponding method name. Examples:
//
// `this.triggerMethod("foo")` will trigger the "foo" event and
// call the "onFoo" method.
//
// `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
// call the "onFooBar" method.
function triggerMethod(event) {
  return _triggerMethod(this, arguments);
}

// triggerMethodOn invokes triggerMethod on a specific context
//
// e.g. `Marionette.triggerMethodOn(view, 'show')`
// will trigger a "show" event or invoke onShow the view.
function triggerMethodOn(context, ...args) {
  var fnc = _.isFunction(context.triggerMethod) ?
                context.triggerMethod :
                triggerMethod;

  return fnc.apply(context, args);
}

// triggerMethodMany invokes triggerMethod on many targets from a source
// it's useful for standardizing a pattern where we propogate an event from a source
// to many targets.
//
// For each target we want to follow the pattern
// target.triggerMethod(event, target, source, ...other args)
// e.g childview.triggerMethod('attach', childView, region, ...args)
function triggerMethodMany(targets, source, eventName, ...args) {
  _.each(targets, function(target) {
    triggerMethodOn.apply(target, [target, eventName, target, source, ...args]);
  });
}

export {
  _triggerMethod,
  triggerMethod,
  triggerMethodOn,
  triggerMethodMany
};
