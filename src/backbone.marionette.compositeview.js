// Composite View
// --------------

// Used for rendering a branch-leaf, hierarchical structure.
// Extends directly from CollectionView and also renders an
// an item view as `modelView`, for the top leaf
Marionette.CompositeView = Marionette.CollectionView.extend({
  constructor: function(options){
    Marionette.CollectionView.apply(this, arguments);
    this.itemView = this.getItemView();
  },

  // Configured the initial events that the composite view 
  // binds to. Override this method to prevent the initial
  // events, or to add your own initial events.
  initialEvents: function(){
    if (this.collection){
      this.bindTo(this.collection, "add", this.addChildView, this);
      this.bindTo(this.collection, "remove", this.removeItemView, this);
      this.bindTo(this.collection, "reset", this.renderCollection, this);
    }
  },

  // Retrieve the `itemView` to be used when rendering each of
  // the items in the collection. The default is to return
  // `this.itemView` or Marionette.CompositeView if no `itemView`
  // has been defined
  getItemView: function(){
    return this.itemView || this.constructor;
  },

  // Renders the model once, and the collection once. Calling
  // this again will tell the model's view to re-render itself
  // but the collection will not re-render.
  render: function(){
    var that = this;

    this.resetItemViewContainer();

    var html = this.renderModel();
    this.$el.html(html);
    // the ui bindings is done here here and not at the end of render since they should be
    // available before the collection is rendered.
    this.bindUIElements();
    this.trigger("composite:model:rendered");
    this.trigger("render");

    this.renderCollection();
    this.trigger("composite:rendered");
    return this;
  },

  // Render the collection for the composite view
  renderCollection: function(){
    Marionette.CollectionView.prototype.render.apply(this, arguments);
    this.trigger("composite:collection:rendered");
  },

  // Render an individual model, if we have one, as
  // part of a composite view (branch / leaf). For example:
  // a treeview.
  renderModel: function(){
    var data = {};
    data = this.serializeData();

    var template = this.getTemplate();
    return Marionette.Renderer.render(template, data);
  },

  // Appends the `el` of itemView instances to the specified
  // `itemViewContainer` (a jQuery selector). Override this method to
  // provide custom logic of how the child item view instances have their
  // HTML appended to the composite view instance.
  appendHtml: function(cv, iv){
    var $container = this.getItemViewContainer(cv);
    $container.append(iv.el);
  },

  // Internal method to ensure an `$itemViewContainer` exists, for the
  // `appendHtml` method to use.
  getItemViewContainer: function(containerView){
    var container;
    if ("$itemViewContainer" in containerView){
      container = containerView.$itemViewContainer;
    } else {
      if (containerView.itemViewContainer){
        container = containerView.$(_.result(containerView, "itemViewContainer"));
      } else {
        container = containerView.$el;
      }
      containerView.$itemViewContainer = container;
    }
    return container;
  },

  // Internal method to reset the `$itemViewContainer` on render
  resetItemViewContainer: function(){
    if (this.$itemViewContainer){
      delete this.$itemViewContainer;
    }
  }
});

