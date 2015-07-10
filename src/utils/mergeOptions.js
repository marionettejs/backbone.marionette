/* jshint unused: false *//* global console */

// Merge `keys` from `options` onto `this`
Marionette.mergeOptions = function(options, keys) {
  if (!options) { return; }
  _.extend(this, _.pick(options, keys));
};
