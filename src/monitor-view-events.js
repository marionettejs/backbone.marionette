// DOM Refresh
// -----------

import _              from 'underscore';
import isNodeAttached from './utils/isNodeAttached';
import { triggerMethodOn, triggerMethodMany } from './trigger-method';

// Monitor a view's state, propagating attach/detach events to children and firing dom:refresh
// whenever a rendered view is attached or an attached view is rendered.
function MonitorViewEvents(view) {
  if (view._areViewEventsMonitored) { return; }
  view._areViewEventsMonitored = true;

  function handleBeforeAttach() {
    triggerMethodMany(view._getImmediateChildren(), 'before:attach');
  }

  function handleAttach() {
    view._isAttached = true;
    triggerMethodMany(view._getImmediateChildren(), 'attach');
    triggerDOMRefresh();
  }

  function handleBeforeDetach() {
    triggerMethodMany(view._getImmediateChildren(), 'before:detach');
  }

  function handleDetach() {
    view._isAttached = false;
    triggerMethodMany(view._getImmediateChildren(), 'detach');
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
