// Item View
// ---------

// A single item view implementation that contains code for rendering
// with underscore.js templates, serializing the view's model or collection,
// and calling several methods on extended views, such as `onRender`.
Marionette.ItemView = Marionette.AbstractView.extend({

  // Setting up the inheritance chain which allows changes to
  // Marionette.AbstractView.prototype.constructor which allows overriding
  constructor: function() {
    Marionette.AbstractView.apply(this, arguments);
  },

  // Serialize the view's model *or* collection, if
  // it exists, for the template
  serializeData: function() {
    var data = {};

    if (!this.model && !this.collection) {
      return {};
    }

    // If we have a model, we serialize that
    if (this.model) {
      data = this.serializeModel();

    } else if (this.collection) {
      // Otherwise, we serialize the collection,
      // making it available under the `items` property
      data = {
        items: this.serializeCollection()
      };
    }

    return data;
  },

  // Serialize a collection by cloning each of
  // its model's attributes
  serializeCollection: function() {
    if (!this.collection) { return {}; }
    return _.pluck(this.collection.invoke('clone'), 'attributes');
  },

  // Render the view, defaulting to underscore.js templates.
  // You can override this in your view definition to provide
  // a very specific rendering for your view. In general, though,
  // you should override the `Marionette.Renderer` object to
  // change how Marionette renders views.
  render: function() {
    this._ensureViewIsIntact();

    this.triggerMethod('before:render', this);

    this._renderTemplate();
    this.isRendered = true;
    this.bindUIElements();

    this.triggerMethod('render', this);

    return this;
  },

  // Internal method to render the template with the serialized data
  // and template helpers via the `Marionette.Renderer` object.
  _renderTemplate: function() {
    var template = this.getTemplate();

    // Allow template-less item views
    if (template === false) {
      return;
    }

    // Add in entity data and template helpers
    var data = this.mixinTemplateHelpers(this.serializeData());

    // Render and add to el
    var html = Marionette.Renderer.render(template, data, this);
    this.attachElContent(html);

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
  }
});
