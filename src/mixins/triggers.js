import _ from 'underscore';
import getUniqueEventName from '../utils/getUniqueEventName';

// Internal method to create an event handler for a given `triggerDef` like
// 'click:foo'
function buildViewTrigger(view, triggerDef) {
  if (_.isString(triggerDef)) {
    triggerDef = {event: triggerDef};
  }

  const eventName = triggerDef.event;
  const shouldPreventDefault = triggerDef.preventDefault !== false;
  const shouldStopPropagation = triggerDef.stopPropagation !== false;

  return function(e) {
    if (shouldPreventDefault) {
      e.preventDefault();
    }

    if (shouldStopPropagation) {
      e.stopPropagation();
    }

    view.triggerMethod(eventName, view);
  };
}

export default {

  // Configure `triggers` to forward DOM events to view
  // events. `triggers: {"click .foo": "do:foo"}`
  _getViewTriggers: function(view, triggers) {
    // Configure the triggers, prevent default
    // action and stop propagation of DOM events
    return _.reduce(triggers, (events, value, key) => {
      key = getUniqueEventName(key);
      events[key] = buildViewTrigger(view, value);
      return events;
    }, {});
  }

};
