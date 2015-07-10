/* jshint unused: false *//* global console */

// Marionette.normalizeMethods
// ----------------------

// Pass in a mapping of events => functions or function names
// and return a mapping of events => functions
Marionette.normalizeMethods = function(hash) {
  return _.reduce(hash, function(normalizedHash, method, name) {
    if (!_.isFunction(method)) {
      method = this[method];
    }
    if (method) {
      normalizedHash[name] = method;
    }
    return normalizedHash;
  }, {}, this);
};
