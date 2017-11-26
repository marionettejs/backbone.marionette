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

// Object borrows many conventions and utilities from Backbone.
const MarionetteObject = function(options) {
  this._setOptions(options, ClassOptions);
  this.cid = _.uniqueId(this.cidPrefix);
  this._initRadio();
  this.initialize.apply(this, arguments);
};

MarionetteObject.extend = extend;

// Object Methods
// --------------

// Ensure it can trigger events with Backbone.Events
_.extend(MarionetteObject.prototype, Backbone.Events, CommonMixin, DestroyMixin, RadioMixin, {
  cidPrefix: 'mno',

  // This is a noop method intended to be overridden
  initialize() {},

  triggerMethod
});

export default MarionetteObject;
