import normalizeUIKeys          from '../utils/normalizeUIKeys';
import normalizeUIValues        from '../utils/normalizeUIValues';

export default {
  // normalize the keys of passed hash with the views `ui` selectors.
  // `{"@ui.foo": "bar"}`
  normalizeUIKeys: function(hash) {
    var uiBindings = _.result(this, '_uiBindings');
    return normalizeUIKeys(hash, uiBindings || _.result(this, 'ui'));
  },

  // normalize the values of passed hash with the views `ui` selectors.
  // `{foo: "@ui.bar"}`
  normalizeUIValues: function(hash, properties) {
    var ui = _.result(this, 'ui');
    var uiBindings = _.result(this, '_uiBindings');
    return normalizeUIValues(hash, uiBindings || ui, properties);
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
    _.each(bindings, function(selector, key) {
      this._ui[key] = this.$(selector);
    }, this);

    this.ui = this._ui;
  },

  _unbindUIElements: function() {
    if (!this.ui || !this._uiBindings) { return; }

    // delete all of the existing ui bindings
    _.each(this.ui, function($el, name) {
      delete this.ui[name];
    }, this);

    // reset the ui element to the original bindings configuration
    this.ui = this._uiBindings;
    delete this._uiBindings;
    delete this._ui;
  },

  getUI: function(name) {
    this._ensureViewIsIntact();
    return this._ui[name];
  }
};
