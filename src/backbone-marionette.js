import
  {
    bindEntityEvents,
    unbindEntityEvents,
    proxyBindEntityEvents,
    proxyUnbindEntityEvents
  } from './bind-entity-events';

import extend             from './utils/extend';
import isNodeAttached     from './utils/isNodeAttached';
import mergeOptions       from './utils/mergeOptions';
import getOption          from './utils/getOption';
import proxyGetOption     from './utils/proxyGetOption';
import _getValue          from './utils/_getValue';
import normalizeMethods   from './utils/normalizeMethods';
import normalizeUIString  from './utils/normalizeUIString';
import normalizeUIKeys    from './utils/normalizeUIKeys';
import normalizeUIValues  from './utils/normalizeUIValues';
import actAsCollection    from './utils/actAsCollection';
import deprecate          from './utils/deprecate';

import MonitorDOMRefresh from './dom-refresh';
import
  {
    _triggerMethod,
    triggerMethod,
    triggerMethodOn,
    triggerMethodMany
  } from './trigger-method';

import { FEATURES, isEnabled } from './features';

import MarionetteError from './error';

Marionette = Marionette || {};

// extend Marionette in the meantime
Object.assign(Marionette, {
  bindEntityEvents,
  unbindEntityEvents,
  proxyBindEntityEvents,
  proxyUnbindEntityEvents,
  extend,
  isNodeAttached,
  mergeOptions,
  getOption,
  proxyGetOption,
  _getValue,
  normalizeMethods,
  normalizeUIString,
  normalizeUIKeys,
  normalizeUIValues,
  actAsCollection,
  deprecate,
  MonitorDOMRefresh,
  _triggerMethod,
  triggerMethod,
  triggerMethodOn,
  triggerMethodMany,
  FEATURES,
  isEnabled,
  MarionetteError
});

export default Marionette;
