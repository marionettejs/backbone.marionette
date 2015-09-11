// Application
// -----------

// A container for a Marionette application.
Marionette.Application = Marionette.Object.extend({
  cidPrefix: 'mna',

  // kick off all of the application's processes.
  // initializes all of the regions that have been added
  // to the app, and runs all of the initializer functions
  start: function(options) {
    this.triggerMethod('before:start', options);
    this.triggerMethod('start', options);
  }
});
