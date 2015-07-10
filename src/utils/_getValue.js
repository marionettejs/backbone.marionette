/* jshint unused: false *//* global console */

// Similar to `_.result`, this is a simple helper
// If a function is provided we call it with context
// otherwise just return the value. If the value is
// undefined return a default value
Marionette._getValue = function(value, context, params) {
  if (_.isFunction(value)) {
    value = params ? value.apply(context, params) : value.call(context);
  }
  return value;
};
