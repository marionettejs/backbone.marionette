// Object
// ------

import _                        from 'underscore';
import Backbone                 from 'backbone';
import extend                   from './utils/extend';
import proxyGetOption           from './utils/proxyGetOption';
import mergeOptions             from './utils/mergeOptions';
import { triggerMethod }        from './trigger-method';
import {
  proxyBindEntityEvents,
  proxyUnbindEntityEvents }     from './bind-entity-events';

import {
  proxyRadioHandlers,
  unproxyRadioHandlers }        from './radio-helpers';

// A Base Class that other Classes should descend from.
// Object borrows many conventions and utilities from Backbone.
var MarionetteObject = function(options) {
  this.options = _.extend({}, _.result(this, 'options'), options);
  proxyRadioHandlers.apply(this);
  this.cid = _.uniqueId(this.cidPrefix);
  this.initialize.apply(this, arguments);
};

MarionetteObject.extend = extend;

// Object Methods
// --------------

// Ensure it can trigger events with Backbone.Events
_.extend(MarionetteObject.prototype, Backbone.Events, {
  cidPrefix: 'mno',

  // for parity with Marionette.AbstractView lifecyle
  _isDestroyed: false,

  isDestroyed: function() {
    return this._isDestroyed();
  },

  //this is a noop method intended to be overridden by classes that extend from this base
  initialize: function() {},

  destroy: function() {
    if (this._isDestroyed) { return this; }

    this.triggerMethod('before:destroy');

    // mark as destroyed before doing the actual destroy, to
    // prevent infinite loops within "destroy" event handlers
    this._isDestroyed = true;
    this.triggerMethod('destroy');
    unproxyRadioHandlers.apply(this);
    this.stopListening();

    return this;
  },

  // Import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: triggerMethod,

  // A handy way to merge options onto the instance
  mergeOptions: mergeOptions,

  // Proxy `getOption` to enable getting options from this or this.options by name.
  getOption: proxyGetOption,

  // Proxy `bindEntityEvents` to enable binding view's events from another entity.
  bindEntityEvents: proxyBindEntityEvents,

  // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
  unbindEntityEvents: proxyUnbindEntityEvents

});

export default MarionetteObject;
