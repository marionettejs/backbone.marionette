// Item View
// ---------

// A single item view implementation that contains code for rendering
// with underscore.js templates, serializing the view's model or collection,
// and calling several methods on extended views, such as `onRender`.
Marionette.ItemView = Marionette.View.extend({

  // Setting up the inheritance chain which allows changes to
  // Marionette.View.prototype.constructor which allows overriding
  constructor: function() {
    Marionette.View.apply(this, arguments);
  },

  // Serialize the model or collection for the view. If a model is
  // found, the view's `serializeModel` is called. If a collection is found,
  // each model in the collection is serialized by calling
  // the view's `serializeCollection` and put into an `items` array in
  // the resulting data. If both are found, defaults to the model.
  // You can override the `serializeData` method in your own view definition,
  // to provide custom serialization for your view's data.
  serializeData: function(){
    var data = {};

    if (this.model) {
      data = _.partial(this.serializeModel, this.model).apply(this, arguments);
    }
    else if (this.collection) {
      data = { items: _.partial(this.serializeCollection, this.collection).apply(this, arguments) };
    }

    return data;
  },

  // Serialize a collection by serializing each of its models.
  serializeCollection: function(collection){
    return collection.toJSON.apply(collection, slice.call(arguments, 1));
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
    this.bindUIElements();

    this.triggerMethod('render', this);

    return this;
  },

  // Internal method to render the template with the serialized data
  // and template helpers via the `Marionette.Renderer` object.
  // Throws an `UndefinedTemplateError` error if the template is
  // any falsely value but literal `false`.
  _renderTemplate: function() {
    var template = this.getTemplate();

    // Allow template-less item views
    if (template === false) {
      return;
    }

    if (!template) {
      throw new Marionette.Error({
        name: 'UndefinedTemplateError',
        message: 'Cannot render the template since it is null or undefined.'
      });
    }

    // Add in entity data and template helpers
    var data = this.serializeData();
    data = this.mixinTemplateHelpers(data);

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
  },

  // Override the default destroy event to add a few
  // more events that are triggered.
  destroy: function() {
    if (this.isDestroyed) { return; }

    return Marionette.View.prototype.destroy.apply(this, arguments);
  }
});
