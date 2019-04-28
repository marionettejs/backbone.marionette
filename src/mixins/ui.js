import _ from 'underscore';

const uiRegEx = /@ui\.[a-zA-Z-_$0-9]*/g;

// utility method for parsing @ui. syntax strings
// into associated selector
const normalizeUIString = function(uiString, ui) {
  return uiString.replace(uiRegEx, (r) => {
    return ui[r.slice(4)];
  });
};

export default {

  // allows for the use of the @ui. syntax within
  // a given key for triggers and events
  // swaps the @ui with the associated selector.
  // Returns a new, non-mutated, parsed events hash.
  normalizeUIKeys(hash) {
    const uiBindings = this._getUIBindings();
    return _.reduce(hash, (memo, val, key) => {
      const normalizedKey = normalizeUIString(key, uiBindings);
      memo[normalizedKey] = val;
      return memo;
    }, {});
  },

  // normalize the passed string with the views `ui` selectors.
  // `"@ui.bar"`
  normalizeUIString(uiString) {
    const uiBindings = this._getUIBindings();
    return normalizeUIString(uiString, uiBindings);
  },

  _getUIBindings() {
    const uiBindings = _.result(this, '_uiBindings');
    return uiBindings || _.result(this, 'ui');
  },

  // This method binds the elements specified in the "ui" hash inside the view's code with
  // the associated jQuery selectors.
  _bindUIElements() {
    if (!this.ui) { return; }

    // store the ui hash in _uiBindings so they can be reset later
    // and so re-rendering the view will be able to find the bindings
    if (!this._uiBindings) {
      this._uiBindings = this.ui;
    }

    // get the bindings result, as a function or otherwise
    const bindings = _.result(this, '_uiBindings');

    // empty the ui so we don't have anything to start with
    this._ui = {};

    // bind each of the selectors
    _.each(bindings, (selector, key) => {
      this._ui[key] = this.$(selector);
    });

    this.ui = this._ui;
  },

  _unbindUIElements() {
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

  _getUI(name) {
    return this._ui[name];
  }
};
