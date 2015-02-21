// Controller
// ----------

// A multi-purpose object to use as a controller for
// modules and routers, and as a mediator for workflow
// and coordination of other objects, views, and more.
Marionette.Controller = function(options) {
  this.options = options || {};
  this.isDestroyed = false;

  if (_.isFunction(this.initialize)) {
    this.initialize(this.options);
  }
};

Marionette.Controller.extend = Marionette.extend;

// Controller Methods
// --------------

// Ensure it can trigger events with Backbone.Events
_.extend(Marionette.Controller.prototype, Backbone.Events, {
  destroy: function() {
    if (this.isDestroyed) { return this; }

    Marionette._triggerMethod(this, 'before:destroy', arguments);
    this.isDestroyed = true;
    Marionette._triggerMethod(this, 'destroy', arguments);

    this.stopListening();
    this.off();
    return this;
  },

  // import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: Marionette.triggerMethod,

  // A handy way to merge options onto the instance
  mergeOptions: Marionette.mergeOptions,

  // Proxy `getOption` to enable getting options from this or this.options by name.
  getOption: Marionette.proxyGetOption

});
