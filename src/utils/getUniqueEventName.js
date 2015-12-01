// Borrow event splitter from Backbone
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

function uniqueName(eventName, selector) {
  return [eventName + _.uniqueId('.evt'), selector].join(' ');
}

// Set event name to be namespaced using a unique index
// to generate a non colliding event namespace
// http://api.jquery.com/event.namespace/
export default function getUniqueEventName(eventName) {
  var match = eventName.match(delegateEventSplitter);
  return uniqueName(match[1], match[2]);
};
