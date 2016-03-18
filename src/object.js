// Object
// ------

import _ from 'underscore';
import Backbone from 'backbone';
import extend from './utils/extend';
import CommonMixin from './mixins/common';
import RadioMixin from './mixins/radio';
import { triggerMethod } from './trigger-method';

// A Base Class that other Classes should descend from.
// Object borrows many conventions and utilities from Backbone.
var MarionetteObject = function(options) {
  this._setOptions(options);
  this.cid = _.uniqueId(this.cidPrefix);
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

  isDestroyed: function() {
    return this._isDestroyed;
  },

  //this is a noop method intended to be overridden by classes that extend from this base
  initialize: function() {},

  destroy: function(...args) {
    if (this._isDestroyed) { return this; }

    this.triggerMethod('before:destroy', ...args);

    // mark as destroyed before doing the actual destroy, to
    // prevent infinite loops within "destroy" event handlers
    this._isDestroyed = true;
    this.triggerMethod('destroy', ...args);
    this.stopListening();

    return this;
  },

  triggerMethod: triggerMethod
});

export default MarionetteObject;
