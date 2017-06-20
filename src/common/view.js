import { triggerMethodOn } from '../common/trigger-method';

export function renderView(view) {
  if (view._isRendered) {
    return;
  }

  if (!view.supportsRenderLifecycle) {
    triggerMethodOn(view, 'before:render', view);
  }

  view.render();

  if (!view.supportsRenderLifecycle) {
    view._isRendered = true;
    triggerMethodOn(view, 'render', view);
  }
}

export function destroyView(view) {
  if (view.destroy) {
    view.destroy();
    return;
  }

  if (!view.supportsDestroyLifecycle) {
    triggerMethodOn(view, 'before:destroy', view);
  }

  const shouldTriggerDetach = view._isAttached && !view._shouldDisableEvents;

  if (shouldTriggerDetach) {
    triggerMethodOn(view, 'before:detach', view);
  }

  view.remove();

  if (shouldTriggerDetach) {
    view._isAttached = false;
    triggerMethodOn(view, 'detach', view);
  }

  view._isDestroyed = true;

  if (!view.supportsDestroyLifecycle) {
    triggerMethodOn(view, 'destroy', view);
  }
}
