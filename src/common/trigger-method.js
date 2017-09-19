// Trigger Method
// --------------

import _ from 'underscore';
import getOption from './get-option';

// split the event name on the ":"
const colonSplitter = /(^|:)(\w)/gi;
const spaceSplitter = /\s+/;

// take the event section ("section1:section2:section3")
// and turn it in to uppercase name onSection1Section2Section3
function getEventName(match, prefix, eventName) {
  return eventName.toUpperCase();
}

const getOnMethodName = _.memoize(function(event) {
  return 'on' + event.replace(colonSplitter, getEventName);
});

function isManyEvents(events) {
  return events && spaceSplitter.test(events);
}

function execEventMethod(event, args) {
  // get the method name from the events name
  const methodName = getOnMethodName(event);
  const method = getOption.call(this, methodName);

  // call the onMethodName if it exists
  if (_.isFunction(method)) {
    // pass all args, except the event name
    return method.apply(this, args);
  }
}

function execEventMethods(events, args) {
  return events.split(spaceSplitter)
    .filter(event => event.length > 0)
    .map((event) => {
      return execEventMethod.call(this, event, args);
    });
}

// Trigger an event and/or a corresponding method name. Examples:
//
// `this.triggerMethod("foo")` will trigger the "foo" event and
// call the "onFoo" method.
//
// `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
// call the "onFooBar" method.
export function triggerMethod(events, ...args) {
  let result;

  if (isManyEvents(events)) {
    result = execEventMethods.call(this, events, args);
  } else {
    result = execEventMethod.call(this, events, args);
  }

  // trigger the event
  this.trigger.apply(this, arguments);

  return result;
}
