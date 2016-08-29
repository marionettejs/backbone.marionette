import _ from 'underscore';

// Called with the context of the parent view
const childViewEventHandler = function(eventName, ...args) {
  const prefix = _.result(this, 'childViewEventPrefix');

  const childEventName = prefix + ':' + eventName;

  const childViewEvents = this.normalizeMethods(this._childViewEvents);

  // call collectionView childViewEvent if defined
  if (typeof childViewEvents !== 'undefined' && _.isFunction(childViewEvents[eventName])) {
    childViewEvents[eventName].apply(this, args);
  }

  // use the parent view's proxyEvent handlers
  const childViewTriggers = this._childViewTriggers;

  // Call the event with the proxy name on the parent layout
  if (childViewTriggers && _.isString(childViewTriggers[eventName])) {
    this.triggerMethod(childViewTriggers[eventName], ...args);
  }

  this.triggerMethod(childEventName, ...args);
};

export default childViewEventHandler;
