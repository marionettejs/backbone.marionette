// Helpers
// -------

// For slicing `arguments` in functions
var protoSlice = Array.prototype.slice;
function slice(args) {
  return protoSlice.call(args);
}

function throwError(message, name) {
  var error = new Error(message);
  error.name = name || 'Error';
  throw error;
}

// Marionette.extend
// -----------------

// Borrow the Backbone `extend` method so we can use it as needed
Marionette.extend = Backbone.Model.extend;

// Marionette.getOption
// --------------------

// Retrieve an object, function or other value from a target
// object or its `options`, with `options` taking precedence.
Marionette.getOption = function(target, optionName){
  if (!target){ return; }

  // If only one argument was passed, use 'this' as the target
  if (!optionName){
    optionName = target;
    target = this;
  }
  var value;

  if (target.options && (optionName in target.options) && (target.options[optionName] !== undefined)){
    value = target.options[optionName];
  } else {
    value = target[optionName];
  }

  return value;
};

// Marionette.normalizeMethods
// ----------------------

// Pass in a mapping of events => functions or function names
// and return a mapping of events => functions
Marionette.normalizeMethods = function(hash) {
  var normalizedHash = {}, method;
  _.each(hash, function(fn, name) {
    method = fn;
    if (!_.isFunction(method)) {
      method = this[method];
    }
    if (!method) {
      return;
    }
    normalizedHash[name] = method;
  }, this);
  return normalizedHash;
};