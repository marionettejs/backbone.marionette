// Marionette Controller
// ---------------------
//
// A multi-purpose object to use as a controller for
// modules and routers, and as a mediator for workflow
// and coordination of other objects, views, and more.
Marionette.Controller = function(options) {
  this.triggerMethod = Marionette.triggerMethod;
  this.options = options || {};
  this.pickOptions(options);

  if (_.isFunction(this.initialize)) {
    this.initialize(this.options);
  }
};

Marionette.Controller.extend = Marionette.extend;

// Controller Methods
// --------------

// Ensure it can trigger events with Backbone.Events
_.extend(Marionette.Controller.prototype, Backbone.Events, {

  // A list of keys that will be merged onto the object directly from the passed-in options
  // during instantiation
  mergeOptions: [],

  destroy: function() {
    var args = Array.prototype.slice.call(arguments);
    this.triggerMethod.apply(this, ['before:destroy'].concat(args));
    this.triggerMethod.apply(this, ['destroy'].concat(args));

    this.stopListening();
    this.off();
    return this;
  },

  // import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: Marionette.triggerMethod,

  // Proxy `getOption` to enable getting options from this or this.options by name.
  getOption: Marionette.proxyGetOption,

  // Import Marionette's pickOptions for pulling out values from the options during instantiation
  pickOptions: Marionette.pickOptions
});
