// Object
// ------

// A Base Class that other Classes should descend from.
// Object borrows many conventions and utilities from Backbone.
Marionette.Object = function(options) {
  this.options = _.extend({}, _.result(this, 'options'), options);
  Marionette.proxyRadioHandlers.apply(this);
  this.cid = _.uniqueId(this.cidPrefix);
  this.initialize.apply(this, arguments);
};

Marionette.Object.extend = Marionette.extend;

// Object Methods
// --------------

// Ensure it can trigger events with Backbone.Events
_.extend(Marionette.Object.prototype, Backbone.Events, {
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
    Marionette.unproxyRadioHandlers.apply(this);
    this.stopListening();

    return this;
  },

  // Import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: Marionette.triggerMethod,

  // A handy way to merge options onto the instance
  mergeOptions: Marionette.mergeOptions,

  // Proxy `getOption` to enable getting options from this or this.options by name.
  getOption: Marionette.proxyGetOption,

  // Proxy `bindEntityEvents` to enable binding view's events from another entity.
  bindEntityEvents: Marionette.proxyBindEntityEvents,

  // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
  unbindEntityEvents: Marionette.proxyUnbindEntityEvents

});
