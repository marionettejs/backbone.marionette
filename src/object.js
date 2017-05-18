// Object
// ------

import _ from 'underscore';
import Backbone from 'backbone';
import extend from './utils/extend';
import { triggerMethod } from './common/trigger-method';
import CommonMixin from './mixins/common';
import RadioMixin from './mixins/radio';

const ClassOptions = [
  'channelName',
  'radioEvents',
  'radioRequests'
];

// A Base Class that other Classes should descend from.
// Object borrows many conventions and utilities from Backbone.
const MarionetteObject = function(options) {
  if (!this.hasOwnProperty('options')) {
    this._setOptions(options);
  }
  this.mergeOptions(options, ClassOptions);
  this._setCid();
  this._initRadio();
  this.initialize.apply(this, arguments);
};

MarionetteObject.extend = extend;

// Object Methods
// --------------

// Ensure it can trigger events with Backbone.Events
_.extend(MarionetteObject.prototype, Backbone.Events, CommonMixin, RadioMixin, {
  cidPrefix: 'mno',

  // for parity with Marionette.AbstractView lifecyle
  _isDestroyed: false,

  isDestroyed() {
    return this._isDestroyed;
  },

  //this is a noop method intended to be overridden by classes that extend from this base
  initialize() {},

  _setCid() {
    if (this.cid) { return; }
    this.cid = _.uniqueId(this.cidPrefix);
  },

  destroy(...args) {
    if (this._isDestroyed) { return this; }

    this.triggerMethod('before:destroy', this, ...args);

    this._isDestroyed = true;
    this.triggerMethod('destroy', this, ...args);
    this.stopListening();

    return this;
  },

  triggerMethod
});

export default MarionetteObject;
