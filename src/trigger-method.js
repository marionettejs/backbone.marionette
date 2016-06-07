// Trigger Method
// --------------

import _         from 'underscore';
import getOption from './utils/getOption';

// split the event name on the ":"
const splitter = /(^|:)(\w)/gi;

// split the list of events on the space
var eventSplitter = /\s+/;

// take the event section ("section1:section2:section3")
// and turn it in to uppercase name onSection1Section2Section3
function getEventName(match, prefix, eventName) {
  return eventName.toUpperCase();
}

// Trigger a single event and/or a corresponding method name.
function execTriggerMethod(event, args) {
  // get the method name from the event name
  const methodName = 'on' + event.replace(splitter, getEventName);
  const method = getOption.call(this, methodName);
  let result;

  // call the onMethodName if it exists
  if (_.isFunction(method)) {
    // pass all args, except the event name
    result = method.apply(this, args);
  }

  // trigger the event
  this.trigger(event, ...args);

  return result;
}

// Trigger an event and/or a corresponding method name. Examples:
//
// `this.triggerMethod("foo")` will trigger the "foo" event and
// call the "onFoo" method.
//
// `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
// call the "onFooBar" method.
//
// `this.triggerMethod("foo:bar baz:qux")` will trigger at first the "foo:bar"
// event and call the "onFooBar" method and then trigger the "baz:qux" event
// and call the "onBazQux" method
export function triggerMethod(events, ...args) {
  var result;

  if (eventSplitter.test(events)) {
    result = _.map(events.split(eventSplitter), (event) => {
      return execTriggerMethod.call(this, event, args);
    });
  } else {
    result = execTriggerMethod.call(this, events, args)
  }

  return result;
}

// triggerMethodOn invokes triggerMethod on a specific context
//
// e.g. `Marionette.triggerMethodOn(view, 'show')`
// will trigger a "show" event or invoke onShow the view.
export function triggerMethodOn(context, ...args) {
  const fnc = _.isFunction(context.triggerMethod) ? context.triggerMethod : triggerMethod;
  return fnc.apply(context, args);
}
