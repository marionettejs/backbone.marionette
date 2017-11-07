// Borrow event splitter from Backbone
const delegateEventSplitter = /^(\S+)\s*(.*)$/;

// Set event name to be namespaced using a unique index
// to generate a non colliding event namespace
// http://api.jquery.com/event.namespace/
const getNamespacedEventName = function(eventName, namespace) {
  const match = eventName.match(delegateEventSplitter);
  return `${ match[1] }.${ namespace } ${ match[2] }`;
};

export default getNamespacedEventName;
