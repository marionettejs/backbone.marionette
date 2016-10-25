import _setOptions from '../utils/set-options';
import getOption from '../common/get-option';
import mergeOptions from '../common/merge-options';
import normalizeMethods from '../common/normalize-methods';
import {
  bindEvents,
  unbindEvents
} from '../common/bind-events';

export default {

  // Imports the "normalizeMethods" to transform hashes of
  // events=>function references/names to a hash of events=>function references
  normalizeMethods: normalizeMethods,

  _setOptions: _setOptions,

  // A handy way to merge passed-in options onto the instance
  mergeOptions: mergeOptions,

  // Enable getting options from this or this.options by name.
  getOption: getOption,

  // Enable binding view's events from another entity.
  bindEvents: bindEvents,

  // Enable unbinding view's events from another entity.
  unbindEvents: unbindEvents
};
