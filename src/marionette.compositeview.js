// Composite View
// --------------

// Used for rendering a branch-leaf, hierarchical structure.
// Extends directly from CollectionView and also renders an
// a child view as `modelView`, for the top leaf
Marionette.CompositeView = Marionette.CollectionView.extend({

  // Setting up the inheritance chain which allows changes to
  // Marionette.CollectionView.prototype.constructor which allows overriding
  constructor: function(){
    Marionette.CollectionView.prototype.constructor.apply(this, arguments);
  },

  // Configured the initial events that the composite view
  // binds to. Override this method to prevent the initial
  // events, or to add your own initial events.
  _initialEvents: function(){

    // Bind only after composite view is rendered to avoid adding child views
    // to nonexistent childViewContainer
    this.once('render', function () {
      if (this.collection){
        this.listenTo(this.collection, "add", this.addChildView);
        this.listenTo(this.collection, "remove", this.onChildRemove);
        this.listenTo(this.collection, "reset", this._renderChildren);
      }
    });

  },

  // Retrieve the `childView` to be used when rendering each of
  // the items in the collection. The default is to return
  // `this.childView` or Marionette.CompositeView if no `childView`
  // has been defined
  getChildView: function(child){
    var childView = Marionette.getOption(this, "childView") || this.constructor;

    if (!childView){
      throwError("A `childView` must be specified", "NoChildViewError");
    }

    return childView;
  },

  // Serialize the collection for the view.
  // You can override the `serializeData` method in your own view
  // definition, to provide custom serialization for your view's data.
  serializeData: function(){
    var data = {};

    if (this.model){
      data = this.model.toJSON();
    }

    return data;
  },

  // Renders the model once, and the collection once. Calling
  // this again will tell the model's view to re-render itself
  // but the collection will not re-render.
  render: function(){
    this.isRendered = true;
    this.isClosed = false;
    this.resetChildViewContainer();

    this.triggerBeforeRender();
    var html = this.renderModel();
    this.$el.html(html);
    // the ui bindings is done here and not at the end of render since they
    // will not be available until after the model is rendered, but should be
    // available before the collection is rendered.
    this.bindUIElements();
    this.triggerMethod("composite:model:rendered");

    this._renderChildren();

    this.triggerMethod("composite:rendered");
    this.triggerRendered();
    return this;
  },

  _renderChildren: function(){
    if (this.isRendered){
      this.triggerMethod("composite:collection:before:render");
      Marionette.CollectionView.prototype._renderChildren.call(this);
      this.triggerMethod("composite:collection:rendered");
    }
  },

  // Render an individual model, if we have one, as
  // part of a composite view (branch / leaf). For example:
  // a treeview.
  renderModel: function(){
    var data = {};
    data = this.serializeData();
    data = this.mixinTemplateHelpers(data);

    var template = this.getTemplate();
    return Marionette.Renderer.render(template, data);
  },


  // You might need to override this if you've overridden appendHtml
  appendBuffer: function(compositeView, buffer) {
    var $container = this.getChildViewContainer(compositeView);
    $container.append(buffer);
  },

  // Appends the `el` of childView instances to the specified
  // `childViewContainer` (a jQuery selector). Override this method to
  // provide custom logic of how the child view instances have their
  // HTML appended to the composite view instance.
  appendHtml: function(compositeView, childView, index){
    if (compositeView.isBuffering) {
      compositeView.elBuffer.appendChild(childView.el);
      compositeView._bufferedChildren.push(childView);
    }
    else {
      // If we've already rendered the main collection, just
      // append the new items directly into the element.
      var $container = this.getChildViewContainer(compositeView);
      $container.append(childView.el);
    }
  },

  // Internal method to ensure an `$childViewContainer` exists, for the
  // `appendHtml` method to use.
  getChildViewContainer: function(containerView){
    if ("$childViewContainer" in containerView){
      return containerView.$childViewContainer;
    }

    var container;
    var childViewContainer = Marionette.getOption(containerView, "childViewContainer");
    if (childViewContainer){

      var selector = _.isFunction(childViewContainer) ? childViewContainer.call(containerView) : childViewContainer;

      if (selector.charAt(0) === "@" && containerView.ui) {
        container = containerView.ui[selector.substr(4)];
      } else {
        container = containerView.$(selector);
      }

      if (container.length <= 0) {
        throwError("The specified `childViewContainer` was not found: " + containerView.childViewContainer, "ChildViewContainerMissingError");
      }

    } else {
      container = containerView.$el;
    }

    containerView.$childViewContainer = container;
    return container;
  },

  // Internal method to reset the `$childViewContainer` on render
  resetChildViewContainer: function(){
    if (this.$childViewContainer){
      delete this.$childViewContainer;
    }
  }
});
