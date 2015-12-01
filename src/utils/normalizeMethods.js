import _ from 'underscore';

// Marionette.normalizeMethods
// ----------------------

// For a target object:
// Pass in a mapping of events => functions or function names
// and return a mapping of events => functions
var normalizeMethods = function(target, hash) {
  return _.reduce(hash, function(normalizedHash, method, name) {
    if (!_.isFunction(method)) {
      method = target[method];
    }
    if (method) {
      normalizedHash[name] = method;
    }
    return normalizedHash;
  }, {});
};

export default normalizeMethods;
