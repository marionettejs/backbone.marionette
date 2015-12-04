import getOption                from '../utils/getOption';
import getValue                 from '../utils/getValue';
import mergeOptions             from '../utils/mergeOptions';
import normalizeMethods         from '../utils/normalizeMethods';
import _setOptions              from '../utils/_setOptions';
import {
  bindEntityEvents,
  unbindEntityEvents
}                               from '../bind-entity-events';

export default {
  getValue: getValue,

  // Imports the "normalizeMethods" to transform hashes of
  // events=>function references/names to a hash of events=>function references
  normalizeMethods: normalizeMethods,

  _setOptions: _setOptions,

  // A handy way to merge passed-in options onto the instance
  mergeOptions: mergeOptions,

  // Enable getting options from this or this.options by name.
  getOption: getOption,

  // Enable binding view's events from another entity.
  bindEntityEvents: bindEntityEvents,

  // Enable unbinding view's events from another entity.
  unbindEntityEvents: unbindEntityEvents
};
