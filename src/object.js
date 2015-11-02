// Object
// ------

// A Base Class that other Classes should descend from.
// Object borrows many conventions and utilities from Backbone.
Marionette.Object = function(options) {
  this.options = _.extend({}, _.result(this, 'options'), options);

  this.initialize.apply(this, arguments);
};

Marionette.Object.extend = Marionette.extend;

// Object Methods
// --------------

// Ensure it can trigger events with Backbone.Events
_.extend(Marionette.Object.prototype, Backbone.Events, {

  //this is a noop method intended to be overridden by classes that extend from this base
  initialize: function() {},

  destroy: function(options) {
    options = options || {};

    this.triggerMethod('before:destroy', options);
    this.triggerMethod('destroy', options);
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
