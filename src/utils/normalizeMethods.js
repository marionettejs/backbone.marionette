import _ from 'underscore';

// Marionette.normalizeMethods
// ----------------------

// Pass in a mapping of events => functions or function names
// and return a mapping of events => functions
var normalizeMethods = function(hash) {
  return _.reduce(hash, (normalizedHash, method, name) => {
    if (!_.isFunction(method)) {
      method = this[method];
    }
    if (method) {
      normalizedHash[name] = method;
    }
    return normalizedHash;
  }, {});
};

export default normalizeMethods;
