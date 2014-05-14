// Marionette Object
// ---------------------
//
// A Base Class that other Classes should descend from.
// Object borrows many conventions and utilities from Backbone.
Marionette.Object = function(options) {

  this.options = _.extend({}, _.result(this, 'options'), options);

  this.initialize(this.options);
};

Marionette.Object.extend = Marionette.extend;

// Object Methods
// --------------

_.extend(Marionette.Object.prototype, {

  //this is a noop method intended to be overridden by classes that extend from this base
  initialize: function() {},

  destroy: function() {
    this.triggerMethod('before:destroy');
    this.triggerMethod('destroy');
    this.stopListening();
  },

  // Import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: Marionette.triggerMethod,

  // Proxy `getOption` to enable getting options from this or this.options by name.
  getOption: Marionette.proxyGetOption,

  // Proxy `unbindEntityEvents` to enable binding view's events from another entity.
  bindEntityEvents: Marionette.proxyBindEntityEvents,

  // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
  unbindEntityEvents: Marionette.proxyUnbindEntityEvents
});

// Ensure it can trigger events with Backbone.Events
_.extend(Marionette.Object.prototype, Backbone.Events);
