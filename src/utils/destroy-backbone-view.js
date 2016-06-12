import { triggerMethodOn } from '../common/trigger-method';

export default function destroyBackboneView(view) {
  if (!view.supportsDestroyLifecycle) {
    triggerMethodOn(view, 'before:destroy', view);
  }

  const shouldTriggerDetach = !!view._isAttached;

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
