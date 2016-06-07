// DOM Refresh
// -----------

import { triggerMethodOn } from './trigger-method';
import _ from 'underscore';

// Trigger method on children unless a pure Backbone.View
function triggerMethodChildren(view, event, shouldTrigger) {
  if (!view._getImmediateChildren) { return; }
  _.each(view._getImmediateChildren(), child => {
    if (!shouldTrigger(child)) { return; }
    triggerMethodOn(child, event, child);
  });
}

function shouldTriggerAttach(view) {
  return !view._isAttached;
}

function shouldAttach(view) {
  if (!shouldTriggerAttach(view)) { return false; }
  view._isAttached = true;
  return true;
}

function shouldTriggerDetach(view) {
  return view._isAttached;
}

function shouldDetach(view) {
  if (!shouldTriggerDetach(view)) { return false; }
  view._isAttached = false;
  return true;
}

// Monitor a view's state, propagating attach/detach events to children and firing dom:refresh
// whenever a rendered view is attached or an attached view is rendered.
function monitorViewEvents(view) {
  if (view._areViewEventsMonitored) { return; }

  view._areViewEventsMonitored = true;

  function handleBeforeAttach() {
    triggerMethodChildren(view, 'before:attach', shouldTriggerAttach);
  }

  function handleAttach() {
    triggerMethodChildren(view, 'attach', shouldAttach);
    triggerDOMRefresh();
  }

  function handleBeforeDetach() {
    triggerMethodChildren(view, 'before:detach', shouldTriggerDetach);
  }

  function handleDetach() {
    triggerMethodChildren(view, 'detach', shouldDetach);
  }

  function handleRender() {
    triggerDOMRefresh();
  }

  function triggerDOMRefresh() {
    if (view._isAttached && view._isRendered) {
      triggerMethodOn(view, 'dom:refresh', view);
    }
  }

  view.on({
    'before:attach': handleBeforeAttach,
    'attach': handleAttach,
    'before:detach': handleBeforeDetach,
    'detach': handleDetach,
    'render': handleRender
  });
}

export default monitorViewEvents;
