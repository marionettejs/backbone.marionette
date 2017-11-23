// Object
// ------

import _ from 'underscore';
import Backbone from 'backbone';
import extend from './utils/extend';
import triggerMethod from './common/trigger-method';
import CommonMixin from './mixins/common';
import DestroyMixin from './mixins/destroy';
import RadioMixin from './mixins/radio';

const ClassOptions = [
  'channelName',
  'radioEvents',
  'radioRequests'
];

const MnObject = extend.call(Object, {
  constructor(options) {
    Object.prototype.constructor.apply(this, arguments);
    this._setOptions(options);
    this.mergeOptions(options, ClassOptions);
    this.cid = _.uniqueId(this.cidPrefix);
    this._initRadio();
    this.initialize.apply(this, arguments);
  },

  cidPrefix: 'mno',

  // This is a noop method intended to be overridden
  initialize() {},

  triggerMethod
}, { extend });

_.extend(MnObject.prototype, Backbone.Events, CommonMixin, DestroyMixin, RadioMixin);

export default MnObject;
