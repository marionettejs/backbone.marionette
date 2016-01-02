// DOM Refresh
// -----------

import { triggerMethodOn, triggerMethodMany } from './trigger-method';

// Trigger method on children unless a pure Backbone.View
function triggerMethodChildren(view, event) {
  if (view._getImmediateChildren) {
    triggerMethodMany(view._getImmediateChildren(), view, event);
  }
}

// Monitor a view's state, propagating attach/detach events to children and firing dom:refresh
// whenever a rendered view is attached or an attached view is rendered.
function MonitorViewEvents(view) {
  if (view._areViewEventsMonitored) { return; }

  view._areViewEventsMonitored = true;

  function handleBeforeAttach() {
    if (view.triggerAttach !== false) {
      triggerMethodChildren(view, 'before:attach');
    }
  }

  function handleAttach() {
    view._isAttached = true;
    if (view.triggerAttach !== false) {
      triggerMethodChildren(view, 'attach');
    }
    triggerDOMRefresh();
  }

  function handleBeforeDetach() {
    if (view.triggerDetach !== false) {
      triggerMethodChildren(view, 'before:detach');
    }
  }

  function handleDetach() {
    view._isAttached = false;
    if (view.triggerDetach !== false) {
      triggerMethodChildren(view, 'detach');
    }
  }

  function handleRender() {
    view._isRendered = true;
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
