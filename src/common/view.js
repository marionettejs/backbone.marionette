export function renderView(view) {
  if (view._isRendered) {
    return;
  }

  if (!view.supportsRenderLifecycle) {
    view.triggerMethod('before:render', view);
  }

  view.render();

  if (!view.supportsRenderLifecycle) {
    view._isRendered = true;
    view.triggerMethod('render', view);
  }
}

export function destroyView(view) {
  if (view.destroy) {
    view.destroy();
    return;
  }

  if (!view.supportsDestroyLifecycle) {
    view.triggerMethod('before:destroy', view);
  }

  const shouldTriggerDetach = view._isAttached && !view._shouldDisableEvents;

  if (shouldTriggerDetach) {
    view.triggerMethod('before:detach', view);
  }

  view.remove();

  if (shouldTriggerDetach) {
    view._isAttached = false;
    view.triggerMethod('detach', view);
  }

  view._isDestroyed = true;

  if (!view.supportsDestroyLifecycle) {
    view.triggerMethod('destroy', view);
  }
}
