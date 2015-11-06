// View
// ---------

// The standard view. Includes view events, automatic rendering
// of Underscore templates, nested views, and more.
Marionette.View = Marionette.AbstractView.extend({

  options: {
    destroyImmediate: false
  },

  // used as the prefix for child view events
  // that are forwarded through the layoutview
  childViewEventPrefix: 'childview',

  // Setting up the inheritance chain which allows changes to
  // Marionette.AbstractView.prototype.constructor which allows overriding
  constructor: function(options) {
    options = options || {};

    this._initRegions(options);

    Marionette.AbstractView.prototype.constructor.apply(this, arguments);
  },

  // Serialize the view's model *or* collection, if
  // it exists, for the template
  serializeData: function() {
    if (!this.model && !this.collection) {
      return {};
    }

    // If we have a model, we serialize that
    if (this.model) {
      return this.serializeModel();
    }

    // Otherwise, we serialize the collection,
    // making it available under the `items` property
    return {
      items: this.serializeCollection()
    };
  },

  // Serialize a collection by cloning each of
  // its model's attributes
  serializeCollection: function() {
    if (!this.collection) { return {}; }
    return this.collection.map(function(model) { return _.clone(model.attributes); });
  },

  // Render the view, defaulting to underscore.js templates.
  // You can override this in your view definition to provide
  // a very specific rendering for your view. In general, though,
  // you should override the `Marionette.Renderer` object to
  // change how Marionette renders views.
  // Subsequent renders after the first will re-render all nested
  // views.
  render: function() {
    this._ensureViewIsIntact();

    this.triggerMethod('before:render', this);

    // If this is not the first render call, then we need to
    // re-initialize the `el` for each region
    if (this._isRendered) {
      this._reInitRegions();
    }

    this._renderTemplate();
    this._isRendered = true;
    this.bindUIElements();

    this.triggerMethod('render', this);

    return this;
  },

  // Attaches the content of a given view.
  // This method can be overridden to optimize rendering,
  // or to render in a non standard way.
  //
  // For example, using `innerHTML` instead of `$el.html`
  //
  // ```js
  // attachElContent: function(html) {
  //   this.el.innerHTML = html;
  //   return this;
  // }
  // ```
  attachElContent: function(html) {
    this.$el.html(html);

    return this;
  },

  // Handle destroying regions, and then destroy the view itself.
  destroy: function() {
    if (this._isDestroyed) { return this; }

    // #2134: remove parent element before destroying the child views, so
    // removing the child views doesn't retrigger repaints
    if (this.getOption('destroyImmediate') === true) {
      this.$el.remove();
    }

    this.removeRegions();

    return Marionette.AbstractView.prototype.destroy.apply(this, arguments);
  }
});

_.extend(Marionette.View.prototype, Marionette.RegionsMixin);
