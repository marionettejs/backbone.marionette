/* jshint unused: false */

// Helpers
// -------

// For slicing `arguments` in functions
var slice = Array.prototype.slice;

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
Marionette.getOption = function(target, optionName) {
  if (!target || !optionName) { return; }
  var value;

  if (target.options && (target.options[optionName] !== undefined)) {
    value = target.options[optionName];
  } else {
    value = target[optionName];
  }

  return value;
};

// Proxy `Marionette.getOption`
Marionette.proxyGetOption = function(optionName) {
  return Marionette.getOption(this, optionName);
};

// Marionette.normalizeMethods
// ----------------------

// Pass in a mapping of events => functions or function names
// and return a mapping of events => functions
Marionette.normalizeMethods = function(hash) {
  var normalizedHash = {};
  _.each(hash, function(method, name) {
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

// utility method for parsing @ui. syntax strings
// into associated selector
Marionette.normalizeUIString = function(uiString, ui) {
  return uiString.replace(/@ui\.[a-zA-Z_$0-9]*/g, function(r) {
    return ui[r.slice(4)];
  });
};

// allows for the use of the @ui. syntax within
// a given key for triggers and events
// swaps the @ui with the associated selector.
// Returns a new, non-mutated, parsed events hash.
Marionette.normalizeUIKeys = function(hash, ui) {
  if (typeof(hash) === 'undefined') {
    return;
  }

  hash = _.clone(hash);

  _.each(_.keys(hash), function(key) {
    var normalizedKey = Marionette.normalizeUIString(key, ui);
    if (normalizedKey !== key) {
      hash[normalizedKey] = hash[key];
      delete hash[key];
    }
  });

  return hash;
};

// allows for the use of the @ui. syntax within
// a given value for regions
// swaps the @ui with the associated selector
Marionette.normalizeUIValues = function(hash, ui) {
  if (typeof(hash) === 'undefined') {
    return;
  }

  _.each(hash, function(val, key) {
    if (_.isString(val)) {
      hash[key] = Marionette.normalizeUIString(val, ui);
    }
  });

  return hash;
};

// Mix in methods from Underscore, for iteration, and other
// collection related features.
// Borrowing this code from Backbone.Collection:
// http://backbonejs.org/docs/backbone.html#section-121
Marionette.actAsCollection = function(object, listProperty) {
  var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
    'select', 'reject', 'every', 'all', 'some', 'any', 'include',
    'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
    'last', 'without', 'isEmpty', 'pluck'];

  _.each(methods, function(method) {
    object[method] = function() {
      var list = _.values(_.result(this, listProperty));
      var args = [list].concat(_.toArray(arguments));
      return _[method].apply(_, args);
    };
  });
};
