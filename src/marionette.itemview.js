// Item View
// ---------

// A single item view implementation that contains code for rendering
// with underscore.js templates, serializing the view's model or collection,
// and calling several methods on extended views, such as `onRender`.
Marionette.ItemView = Marionette.View.extend({
  
  // Setting up the inheritance chain which allows changes to 
  // Marionette.View.prototype.constructor which allows overriding
  constructor: function(){
    Marionette.View.prototype.constructor.apply(this, slice(arguments));
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
      data = this.serializeModel(this.model);
    }
    else if (this.collection) {
      data = { items: this.serializeCollection(this.collection) };
    }

    return data;
  },

  // Serialize a collection by serializing each of its models.
  serializeCollection: function(collection){
    return collection.map(function(model){ return this.serializeModel(model); }, this);
  },

  // Render the view, defaulting to underscore.js templates.
  // You can override this in your view definition to provide
  // a very specific rendering for your view. In general, though,
  // you should override the `Marionette.Renderer` object to
  // change how Marionette renders views.
  render: function(){
    this.ensureViewIsIntact();

    this.triggerMethod("before:render", this);
    this.triggerMethod("item:before:render", this);

    var data = this.serializeData();
    data = this.mixinTemplateHelpers(data);

    var template = this.getTemplate();
    var html = Marionette.Renderer.render(template, data);

    this.$el.html(html);
    this.bindUIElements();

    this.triggerMethod("render", this);
    this.triggerMethod("item:rendered", this);

    return this;
  },

  // Override the default destroy event to add a few
  // more events that are triggered.
  destroy: function(){
    if (this.isDestroyed){ return; }

    this.triggerMethod('item:before:destroy');

    Marionette.View.prototype.destroy.apply(this, slice(arguments));

    this.triggerMethod('item:destroyed');
  }
});
