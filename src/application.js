// Application
// -----------

import MNObject from './object';

// A container for a Marionette application.
var Application = MNObject.extend({
  cidPrefix: 'mna',

  // kick off all of the application's processes.
  // initializes all of the regions that have been added
  // to the app, and runs all of the initializer functions
  start: function(options) {
    this.triggerMethod('before:start', options);
    this.triggerMethod('start', options);
  }
});

export default Application;
