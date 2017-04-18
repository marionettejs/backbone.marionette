import _ from 'underscore';
import getUniqueEventName from '../utils/get-unique-event-name';
import { isEnabled } from '../config/features';

// Internal method to create an event handler for a given `triggerDef` like
// 'click:foo'
function buildViewTrigger(view, triggerDef) {
  if (_.isString(triggerDef)) {
    triggerDef = {event: triggerDef};
  }

  const eventName = triggerDef.event;

  let shouldPreventDefault = !!triggerDef.preventDefault;

  if (isEnabled('triggersPreventDefault')) {
    shouldPreventDefault = triggerDef.preventDefault !== false;
  }

  let shouldStopPropagation = !!triggerDef.stopPropagation;

  if (isEnabled('triggersStopPropagation')) {
    shouldStopPropagation = triggerDef.stopPropagation !== false;
  }

  return function(event) {
    if (shouldPreventDefault) {
      event.preventDefault();
    }

    if (shouldStopPropagation) {
      event.stopPropagation();
    }

    view.triggerMethod(eventName, view, event);
  };
}

export default {

  // Configure `triggers` to forward DOM events to view
  // events. `triggers: {"click .foo": "do:foo"}`
  _getViewTriggers(view, triggers) {
    // Configure the triggers, prevent default
    // action and stop propagation of DOM events
    return _.reduce(triggers, (events, value, key) => {
      key = getUniqueEventName(key);
      events[key] = buildViewTrigger(view, value);
      return events;
    }, {});
  }

};
