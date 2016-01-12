// DOM Refresh
// -----------

import { triggerMethodOn } from './trigger-method';

// Trigger method on children unless a pure Backbone.View
function triggerMethodChildren(view, event, beforeEachTrigger) {
  if (!view._getImmediateChildren) { return; }
  _.each(view._getImmediateChildren(), child => {
    if (beforeEachTrigger) {
      beforeEachTrigger(child);
    }
    triggerMethodOn(child, event, child);
  });
}

function setIsAttached(view) {
  view._isAttached = true;
}

function unsetIsAttached(view) {
  view._isAttached = false;
}

// Monitor a view's state, propagating attach/detach events to children and firing dom:refresh
// whenever a rendered view is attached or an attached view is rendered.
function MonitorViewEvents(view) {
  if (view._areViewEventsMonitored) { return; }

  view._areViewEventsMonitored = true;

  function handleBeforeAttach() {
    triggerMethodChildren(view, 'before:attach');
  }

  function handleAttach() {
    triggerMethodChildren(view, 'attach', setIsAttached);
    triggerDOMRefresh();
  }

  function handleBeforeDetach() {
    triggerMethodChildren(view, 'before:detach');
  }

  function handleDetach() {
    triggerMethodChildren(view, 'detach', unsetIsAttached);
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
    'attach':        handleAttach,
    'before:detach': handleBeforeDetach,
    'detach':        handleDetach,
    'render':        handleRender
  });
}

export default MonitorViewEvents;
