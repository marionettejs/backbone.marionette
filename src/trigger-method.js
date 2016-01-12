/* jshint maxstatements: 14, maxcomplexity: 7 */

// Trigger Method
// --------------

import _         from 'underscore';
import getOption from './utils/getOption';

// split the event name on the ":"
var splitter = /(^|:)(\w)/gi;

// take the event section ("section1:section2:section3")
// and turn it in to uppercase name onSection1Section2Section3
function getEventName(match, prefix, eventName) {
  return eventName.toUpperCase();
}

// Trigger an event and/or a corresponding method name. Examples:
//
// `this.triggerMethod("foo")` will trigger the "foo" event and
// call the "onFoo" method.
//
// `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
// call the "onFooBar" method.
export function triggerMethod(event, ...args) {
  // get the method name from the event name
  var methodName = 'on' + event.replace(splitter, getEventName);
  var method = getOption.call(this, methodName);
  var result;

  // call the onMethodName if it exists
  if (_.isFunction(method)) {
    // pass all args, except the event name
    result = method.apply(this, args);
  }

  // trigger the event
  this.trigger(event, ...args);

  return result;
}

// triggerMethodOn invokes triggerMethod on a specific context
//
// e.g. `Marionette.triggerMethodOn(view, 'show')`
// will trigger a "show" event or invoke onShow the view.
export function triggerMethodOn(context, ...args) {
  var fnc = _.isFunction(context.triggerMethod) ? context.triggerMethod : triggerMethod;
  return fnc.apply(context, args);
}

// triggerMethodMany invokes triggerMethod on many targets from a source
// it's useful for standardizing a pattern where we propagate an event from a source
// to many targets.
//
// For each target we want to follow the pattern
// target.triggerMethod(event, target, ...args)
// e.g childview.triggerMethod('attach', childView, ...args)
export function triggerMethodMany(targets, eventName, ...args) {
  _.each(targets, function(target) {
    triggerMethodOn(target, eventName, target, ...args);
  });
}
