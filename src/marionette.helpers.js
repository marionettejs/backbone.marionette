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

/**
  * Proxies Backbone.Model.extend
  *
  * To create a derived class of your own, extend an existing class,
  * providing instance properties, protoProps, as well as optional
  * class properties, staticProps to be attached directly to the
  * new class's constructor function. This does not modify the existing class.
  *
  * @this A constructor function
  * @param {Object} protoProps - Properties to add to the prototype of the new class
  * @param {Object} staticProps - Properties to add to the constructor of the new class
  * @returns {Function} A new class created by adding the new properties to the existing class
  * @public
  */
Marionette.extend = Backbone.Model.extend;


/**
  * Obtain optionName from the target, if it exists.
  * First, it looks for target.options[optionName].
  * If that doesn't exist it looks for target[optionName].
  * It returns the first that it finds, returning undefined if nothing is found.
  *
  * @param {Object} target - The object to get the value from
  * @param {String} optionName - The name of the property to return from the target or its options
  * @returns {*} The value read from target.options or target
  * @public
  */
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

/**
  * Convenience method to add Marionette.getOption to an object.
  * Used on the prototypes of the Marionette Classes.
  *
  * @this {Object} Passed to Marionette.getOption as target
  * @param {String} optionName - Passed to Marionette.getOption as optionName
  * @returns {*} The value read from this or this.options
  * @public
  */
Marionette.proxyGetOption = function(optionName) {
  return Marionette.getOption(this, optionName);
};

/**
  * Converts a hash that maps strings to method names to a map of strings or
  * functions to the actual methods on this.
  * If the method does not exist on then that key-value pair will be dropped.
  * The normalized hash is returned.
  *
  * Used on the prototypes of the Marionette Classes.
  *
  * @example
  * // The following hash:
  * var hash = {
  *   'some:event': 'myCallback'
  * };
  *
  * // would be converted to:
  * var hash = {
  *   'some:event': this.myCallback
  * };
  *
  * @this {Object} - The context to extract functions from, given a function name
  * @param {Object} - The mapping of events => functions or function names to transform
  * @returns {Object} - The mapping of events => functions resulting from the transform
  * @public
  */
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


/**
  * Used internally by Views to parse the @ui syntax in a hash of DOM events.
  * It works by replacing the @ui reference with the corresponding element from the View's ui hash.
  *
  * @example
  *
  * // would be transformed to reference the element specified as view.ui.myButton.
  * var hash = {
  *  'click {@literal @}ui.myButton': 'onClickMyButton'
  * };
  *
  * @param {Object} hash - The object whose keys will be substituted
  * @param {Object} ui - The mapping of @ui.name => substitution to replace
  * @returns {Object} hash with the substitutions contained in ui
  * @public
  */
Marionette.normalizeUIKeys = function(hash, ui) {
  if (typeof(hash) === 'undefined') {
    return;
  }

  _.each(_.keys(hash), function(v) {
    var pattern = /@ui.[a-zA-Z_$0-9]*/g;
    if (v.match(pattern)) {
      hash[v.replace(pattern, function(r) {
        return ui[r.slice(4)];
      })] = hash[v];
      delete hash[v];
    }
  });

  return hash;
};

/**
  * Mixes in a number of Underscore methods for working with Collections to the object,
  * binding their context to the listProperty.
  * This is similar to how Backbone.Collection has Underscore methods on the prototype
  * that execute with the models of the Collection as the context.
  *
  * @param {Object} object - The object to place the methods on
  * @param {String} listProperty - The property on object that will be the target of the methods
  * @public
  */
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
