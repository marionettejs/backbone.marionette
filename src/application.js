// Application
// -----------

// A container for a Marionette application.
Marionette.Application = Marionette.View.extend({
  cidPrefix: 'mna',

  el: 'body',

  template: false,

  // kick off all of the application's processes.
  start: function(options) {
    this.triggerMethod('before:start', options);

    this.render();

    this.triggerMethod('start', options);
  }
});
