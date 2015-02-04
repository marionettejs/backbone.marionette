// Application
// -----------

// A container for a Marionette application.
Marionette.Application = Marionette.Object.extend({
  constructor: function(options) {
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

  // kick off all of the application's processes.
  // initializes all of the regions that have been added
  // to the app, and runs all of the initializer functions
  start: function(options) {
    this.triggerMethod('before:start', options);
    this.triggerMethod('start', options);
  }
});
