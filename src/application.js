// Application
// -----------

// A container for a Marionette application.
Marionette.Application = Marionette.Object.extend({
  constructor: function(options) {
    this._initCallbacks = new Marionette.Callbacks();
    this.submodules = {};
    _.extend(this, options);
    Marionette.Object.call(this, options);
  },

  // Command execution, facilitated by Backbone.Wreqr.Commands
  execute: function() {
    this.commands.execute.apply(this.commands, arguments);
  },

  // Request/response, facilitated by Backbone.Wreqr.RequestResponse
  request: function() {
    return this.reqres.request.apply(this.reqres, arguments);
  },

  // Add an initializer that is either run at when the `start`
  // method is called, or run immediately if added after `start`
  // has already been called.
  addInitializer: function(initializer) {
    this._initCallbacks.add(initializer);
  },

  // kick off all of the application's processes.
  // initializes all of the regions that have been added
  // to the app, and runs all of the initializer functions
  start: function(options) {
    this.triggerMethod('before:start', options);
    this._initCallbacks.run(options, this);
    this.triggerMethod('start', options);
  },

  // Create a module, attached to the application
  module: function(moduleNames, moduleDefinition) {

    // Overwrite the module class if the user specifies one
    var ModuleClass = Marionette.Module.getClass(moduleDefinition);

    var args = _.toArray(arguments);
    args.unshift(this);

    // see the Marionette.Module object for more information
    return ModuleClass.create.apply(ModuleClass, args);
  }
});
