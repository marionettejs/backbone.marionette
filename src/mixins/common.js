import _ from 'underscore';
import Backbone from 'backbone';

import getOption from '../common/get-option';
import mergeOptions from '../common/merge-options';
import normalizeMethods from '../common/normalize-methods';
import triggerMethod from '../common/trigger-method';
import {
  bindEvents,
  unbindEvents
} from '../common/bind-events';
import {
  bindRequests,
  unbindRequests
} from '../common/bind-requests';

const CommonMixin = {

  // Imports the "normalizeMethods" to transform hashes of
  // events=>function references/names to a hash of events=>function references
  normalizeMethods,

  _setOptions(options, classOptions) {
    this.options = _.extend({}, _.result(this, 'options'), options);
    this.mergeOptions(options, classOptions);
  },

  // A handy way to merge passed-in options onto the instance
  mergeOptions,

  // Enable getting options from this or this.options by name.
  getOption,

  // Enable binding view's events from another entity.
  bindEvents,

  // Enable unbinding view's events from another entity.
  unbindEvents,

  // Enable binding view's requests.
  bindRequests,

  // Enable unbinding view's requests.
  unbindRequests,

  triggerMethod
};

_.extend(CommonMixin, Backbone.Events);

export default CommonMixin;
