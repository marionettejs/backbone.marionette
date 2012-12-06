// Item View
// ---------

// A single item view implementation that contains code for rendering
// with underscore.js templates, serializing the view's model or collection,
// and calling several methods on extended views, such as `onRender`.
Marionette.ItemView =  Marionette.View.extend({
  constructor: function(){
    var args = Array.prototype.slice.apply(arguments);
    Marionette.View.prototype.constructor.apply(this, args);

    if (this.initialEvents){
      this.initialEvents();
    }

    this.bindTo(this, "show", this._handleShow, this);
    this.bindTo(this, "render", this._handleRender, this);
  },

  // internal event handler to track when the view has been rendered
  _handleShow: function(){
    this._isShown = true;
    this.triggerDOMRefresh();
  },

  // internal event handler to track when the view has been shown in the DOM,
  // using a Marionette.Region (or by other means of triggering "show")
  _handleRender: function(){
    this._isRendered = true;
    this.triggerDOMRefresh();
  },

  // Trigger the "dom:refresh" event and corresponding "onDomRefresh" method
  triggerDOMRefresh: function(){
    if (this._isShown && this._isRendered){
      this.triggerMethod("dom:refresh");
    }
  },

  // Serialize the model or collection for the view. If a model is
  // found, `.toJSON()` is called. If a collection is found, `.toJSON()`
  // is also called, but is used to populate an `items` array in the
  // resulting data. If both are found, defaults to the model.
  // You can override the `serializeData` method in your own view
  // definition, to provide custom serialization for your view's data.
  serializeData: function(){
    var data = {};

    if (this.model) {
      data = this.model.toJSON();
    }
    else if (this.collection) {
      data = { items: this.collection.toJSON() };
    }

    return data;
  },

  // Render the view, defaulting to underscore.js templates.
  // You can override this in your view definition to provide
  // a very specific rendering for your view. In general, though,
  // you should override the `Marionette.Renderer` object to
  // change how Marionette renders views.
  render: function(){
    this.isClosed = false;

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

  // Override the default close event to add a few
  // more events that are triggered.
  close: function(){
    if (this.isClosed){ return; }

    this.triggerMethod('item:before:close');

    var args = Array.prototype.slice.apply(arguments);
    Marionette.View.prototype.close.apply(this, args);

    this.triggerMethod('item:closed');
  }
});
