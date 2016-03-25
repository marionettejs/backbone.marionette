import _ from 'underscore';
// allows for the use of the @ui. syntax within
// a given key for triggers and events
// swaps the @ui with the associated selector.
// Returns a new, non-mutated, parsed events hash.
var normalizeUIKeys = function(hash, ui) {
  return _.reduce(hash, function(memo, val, key) {
    var normalizedKey = normalizeUIString(key, ui);
    memo[normalizedKey] = val;
    return memo;
  }, {});
};

// utility method for parsing @ui. syntax strings
// into associated selector
var normalizeUIString = function(uiString, ui) {
  return uiString.replace(/@ui\.[a-zA-Z_$0-9]*/g, function(r) {
    return ui[r.slice(4)];
  });
};

// allows for the use of the @ui. syntax within
// a given value for regions
// swaps the @ui with the associated selector
var normalizeUIValues = function(hash, ui, properties) {
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
};

export default {

  // normalize the keys of passed hash with the views `ui` selectors.
  // `{"@ui.foo": "bar"}`
  normalizeUIKeys: function(hash) {
    var uiBindings = this._getUIBindings();
    return normalizeUIKeys(hash, uiBindings);
  },

  // normalize the values of passed hash with the views `ui` selectors.
  // `{foo: "@ui.bar"}`
  normalizeUIValues: function(hash, properties) {
    var uiBindings = this._getUIBindings();
    return normalizeUIValues(hash, uiBindings, properties);
  },

  _getUIBindings: function() {
    var uiBindings = _.result(this, '_uiBindings');
    var ui = _.result(this, 'ui');
    return uiBindings || ui;
  },

  // This method binds the elements specified in the "ui" hash inside the view's code with
  // the associated jQuery selectors.
  _bindUIElements: function() {
    if (!this.ui) { return; }

    // store the ui hash in _uiBindings so they can be reset later
    // and so re-rendering the view will be able to find the bindings
    if (!this._uiBindings) {
      this._uiBindings = this.ui;
    }

    // get the bindings result, as a function or otherwise
    var bindings = _.result(this, '_uiBindings');

    // empty the ui so we don't have anything to start with
    this._ui = {};

    // bind each of the selectors
    _.each(bindings, (selector, key) => {
      this._ui[key] = this.$(selector);
    });

    this.ui = this._ui;
  },

  _unbindUIElements: function() {
    if (!this.ui || !this._uiBindings) { return; }

    // delete all of the existing ui bindings
    _.each(this.ui, ($el, name) => {
      delete this.ui[name];
    });

    // reset the ui element to the original bindings configuration
    this.ui = this._uiBindings;
    delete this._uiBindings;
    delete this._ui;
  },

  _getUI: function(name) {
    return this._ui[name];
  }
};
