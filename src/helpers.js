/* jshint unused: false *//* global console */

// Helpers
// -------

// Marionette.extend
// -----------------

// Borrow the Backbone `extend` method so we can use it as needed
Marionette.extend = Backbone.Model.extend;

// Marionette.isNodeAttached
// -------------------------

// Determine if `el` is a child of the document
Marionette.isNodeAttached = function(el) {
  return Backbone.$.contains(document.documentElement, el);
};


// Marionette.getOption
// --------------------

// Retrieve an object, function or other value from a target
// object or its `options`, with `options` taking precedence.
Marionette.getOption = function(target, optionName) {
  if (!target || !optionName) { return; }
  if (target.options && (target.options[optionName] !== undefined)) {
    return target.options[optionName];
  } else {
    return target[optionName];
  }
};

// Proxy `Marionette.getOption`
Marionette.proxyGetOption = function(optionName) {
  return Marionette.getOption(this, optionName);
};

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
  return _.reduce(hash, function(memo, val, key) {
    var normalizedKey = Marionette.normalizeUIString(key, ui);
    memo[normalizedKey] = val;
    return memo;
  }, {});
};

// allows for the use of the @ui. syntax within
// a given value for regions
// swaps the @ui with the associated selector
Marionette.normalizeUIValues = function(hash, ui, properties) {
  _.each(hash, function(val, key) {
    if (_.isString(val)) {
      hash[key] = Marionette.normalizeUIString(val, ui);
    }
    else if (_.isObject(val) && _.isArray(properties)) {
      _.extend(val, Marionette.normalizeUIValues(_.pick(val, properties), ui));
      /* Value is an object, and we got an array of embedded property names to normalize. */
      _.each(properties, function(property) {
        var propertyVal = val[property];
        if (_.isString(propertyVal)) {
          val[property] = Marionette.normalizeUIString(propertyVal, ui);
        }
      });
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

var deprecate = Marionette.deprecate = function(message, test) {
  if (_.isObject(message)) {
    message = (
      message.prev + ' is going to be removed in the future. ' +
      'Please use ' + message.next + ' instead.' +
      (message.url ? ' See: ' + message.url : '')
    );
  }

  if ((test === undefined || !test) && !deprecate._cache[message]) {
    deprecate._warn('Deprecation warning: ' + message);
    deprecate._cache[message] = true;
  }
};

deprecate._warn = typeof console !== 'undefined' && (console.warn || console.log) || function() {};
deprecate._cache = {};
