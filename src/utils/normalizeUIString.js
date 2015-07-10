/* jshint unused: false *//* global console */

// utility method for parsing @ui. syntax strings
// into associated selector
Marionette.normalizeUIString = function(uiString, ui) {
  return uiString.replace(/@ui\.[a-zA-Z_$0-9]*/g, function(r) {
    return ui[r.slice(4)];
  });
};
