/* jshint unused: false *//* global console */

// Proxy `Marionette.getOption`
Marionette.proxyGetOption = function(optionName) {
  return Marionette.getOption(this, optionName);
};
