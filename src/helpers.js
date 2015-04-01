
/* jshint unused: false *//* global console */

// Helpers
// -------

import _        from 'underscore';
import Backbone from 'Backbone'; // Backbone should be modularized too!

// Marionette.extend
// -----------------

// Borrow the Backbone `extend` method so we can use it as needed
var extend = Backbone.Model.extend;

// Marionette.isNodeAttached
// -------------------------

// Determine if `el` is a child of the document
function isNodeAttached(el) {
  return Backbone.$.contains(document.documentElement, el);
}

// Merge `keys` from `options` onto `this`
function mergeOptions(options, keys) {
  if (!options) { return; }
  _.extend(this, _.pick(options, keys));
}

// Marionette.getOption
// --------------------

// Retrieve an object, function or other value from a target
// object or its `options`, with `options` taking precedence.
function getOption(target, optionName) {
  if (!target || !optionName) { return; }
  if (target.options && (target.options[optionName] !== undefined)) {
    return target.options[optionName];
  } else {
    return target[optionName];
  }
}

// Proxy `Marionette.getOption`
function proxyGetOption(optionName) {
  return getOption(this, optionName);
}

// Similar to `_.result`, this is a simple helper
// If a function is provided we call it with context
// otherwise just return the value. If the value is
// undefined return a default value
function _getValue(value, context, params) {
  if (_.isFunction(value)) {
    value = params ? value.apply(context, params) : value.call(context);
  }
  return value;
}

// Marionette.normalizeMethods
// ----------------------

// Pass in a mapping of events => functions or function names
// and return a mapping of events => functions
function normalizeMethods(hash) {
  return _.reduce(hash, function(normalizedHash, method, name) {
    if (!_.isFunction(method)) {
      method = this[method];
    }
    if (method) {
      normalizedHash[name] = method;
    }
    return normalizedHash;
  }, {}, this);
}

// utility method for parsing @ui. syntax strings
// into associated selector
function normalizeUIString(uiString, ui) {
  return uiString.replace(/@ui\.[a-zA-Z_$0-9]*/g, function(r) {
    return ui[r.slice(4)];
  });
}

// allows for the use of the @ui. syntax within
// a given key for triggers and events
// swaps the @ui with the associated selector.
// Returns a new, non-mutated, parsed events hash.
function normalizeUIKeys(hash, ui) {
  return _.reduce(hash, function(memo, val, key) {
    var normalizedKey = normalizeUIString(key, ui);
    memo[normalizedKey] = val;
    return memo;
  }, {});
}

// allows for the use of the @ui. syntax within
// a given value for regions
// swaps the @ui with the associated selector
function normalizeUIValues(hash, ui, properties) {
  _.each(hash, function(val, key) {
    if (_.isString(val)) {
      hash[key] = normalizeUIString(val, ui);
    } else if (_.isObject(val) && _.isArray(properties)) {
      _.extend(val, normalizeUIValues(_.pick(val, properties), ui));
      /* Value is an object, and we got an array of embedded property names to normalize. */
      _.each(properties, function(property) {
        var propertyVal = val[property];
        if (_.isString(propertyVal)) {
          val[property] = normalizeUIString(propertyVal, ui);
        }
      });
    }
  });
  return hash;
}

// Mix in methods from Underscore, for iteration, and other
// collection related features.
// Borrowing this code from Backbone.Collection:
// http://backbonejs.org/docs/backbone.html#section-121
function actAsCollection(object, listProperty) {
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
}

function deprecate(message, test) {
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
}
deprecate._warn = typeof console !== 'undefined' && (console.warn || console.log) || function() {};
deprecate._cache = {};

export default {
  extend: extend,
  isNodeAttached: isNodeAttached,
  mergeOptions: mergeOptions,
  getOption: getOption,
  proxyGetOption: proxyGetOption,
  _getValue: _getValue,
  normalizeMethods: normalizeMethods,
  normalizeUIString: normalizeUIString,
  normalizeUIKeys:h normalizeUIKeys,
  normalizeUIValues: normalizeUIValues,
  actAsCollection: actAsCollection,
  deprecate: deprecate
};
