/* jshint maxstatements: 14 */

// Collection View
// ---------------

// A view that iterates over a Backbone.Collection
// and renders an individual child view for each model.
Marionette.CollectionView = Marionette.View.extend({

  // used as the prefix for child view events
  // that are forwarded through the collectionview
  childViewEventPrefix: 'childview',

  // constructor
  constructor: function(options) {
    this._initChildViewStorage();

    Marionette.View.prototype.constructor.apply(this, arguments);

    this._initialEvents();
    this.initRenderBuffer();
  },

  // Instead of inserting elements one by one into the page,
  // it's much more performant to insert elements into a document
  // fragment and then insert that document fragment into the page
  initRenderBuffer: function() {
    this.elBuffer = document.createDocumentFragment();
    this._bufferedChildren = [];
  },

  startBuffering: function() {
    this.initRenderBuffer();
    this.isBuffering = true;
  },

  endBuffering: function() {
    this.isBuffering = false;
    this.appendBuffer(this, this.elBuffer);
    this._triggerShowBufferedChildren();
    this.initRenderBuffer();
  },

  _triggerShowBufferedChildren: function() {
    if (this._isShown) {
      _.each(this._bufferedChildren, function (child) {
        if (_.isFunction(child.triggerMethod)) {
          child.triggerMethod('show');
        } else {
          Marionette.triggerMethod.call(child, 'show');
        }
      });
      this._bufferedChildren = [];
    }
  },

  // Configured the initial events that the collection view
  // binds to.
  _initialEvents: function() {
    if (this.collection) {
      this.listenTo(this.collection, 'add', this.onChildAdd);
      this.listenTo(this.collection, 'remove', this.onChildRemove);
      this.listenTo(this.collection, 'reset', this.render);
    }
  },

  // Handle a child added to the collection
  onChildAdd: function(child, collection, options) {
    this.destroyEmptyView();
    var ChildView = this.getChildView(child);
    var index = this.collection.indexOf(child);
    this.addChild(child, ChildView, index);
  },

  // get the child view by model it holds, and remove it
  onChildRemove: function(model) {
    var view = this.children.findByModel(model);
    this.removeChildView(view);
    this.checkEmpty();
  },

  // Override from `Marionette.View` to trigger show on child views
  onShowCalled: function(){
    this.children.each(function(child){
      if (_.isFunction(child.triggerMethod)) {
        child.triggerMethod('show');
      } else {
        Marionette.triggerMethod.call(child, 'show');
      }
    });
  },

  // Render children views. Override this method to
  // provide your own implementation of a render function for
  // the collection view.
  render: function() {
    this._ensureViewIsIntact();
    this.triggerMethod('before:render', this);
    this._renderChildren();
    this.triggerMethod('render', this);
    return this;
  },

  // Internal method. Separated so that CompositeView can have
  // more control over events being triggered, around the rendering
  // process
  _renderChildren: function() {
    this.startBuffering();

    this.destroyEmptyView();
    this.destroyChildren();

    if (!this.isEmpty(this.collection)) {
      this.triggerMethod('collection:before:render', this);
      this.showCollection();
      this.triggerMethod('collection:rendered', this);
    } else {
      this.showEmptyView();
    }

    this.endBuffering();
  },

  // Internal method to loop through collection and show each child view.
  showCollection: function() {
    var ChildView;
    this.collection.each(function(child, index) {
      ChildView = this.getChildView(child);
      this.addChild(child, ChildView, index);
    }, this);
  },

  // Internal method to show an empty view in place of
  // a collection of child views, when the collection is empty
  showEmptyView: function() {
    var EmptyView = this.getEmptyView();

    if (EmptyView && !this._showingEmptyView) {
      this._showingEmptyView = true;
      var model = new Backbone.Model();
      this.addChild(model, EmptyView, 0);
    }
  },

  // Internal method to destroy an existing emptyView instance
  // if one exists. Called when a collection view has been
  // rendered empty, and then a child is added to the collection.
  destroyEmptyView: function() {
    if (this._showingEmptyView) {
      this.destroyChildren();
      delete this._showingEmptyView;
    }
  },

  // Retrieve the empty view type
  getEmptyView: function() {
    return Marionette.getOption(this, 'emptyView');
  },

  // Retrieve the childView type, either from `this.options.childView`
  // or from the `childView` in the object definition. The "options"
  // takes precedence.
  getChildView: function(child) {
    var childView = Marionette.getOption(this, 'childView');

    if (!childView) {
      throwError('A "childView" must be specified', 'NoChildViewError');
    }

    return childView;
  },

  // Render the child's view and add it to the
  // HTML for the collection view.
  addChild: function(child, ChildView, index) {
    var childViewOptions = Marionette.getOption(this, 'childViewOptions');
    if (_.isFunction(childViewOptions)) {
      childViewOptions = childViewOptions.call(this, child, index);
    }

    var view = this.buildChildView(child, ChildView, childViewOptions);
    this.proxyChildEvents(view);
    this.triggerMethod('before:child:added', view);

    // Store the child view itself so we can properly
    // remove and/or destroy it later
    this.children.add(view);
    this.renderChildView(view, index);

    if (this._isShown && !this.isBuffering){
      if (_.isFunction(view.triggerMethod)) {
        view.triggerMethod('show');
      } else {
        Marionette.triggerMethod.call(view, 'show');
      }
    }

    this.triggerMethod('after:child:added', view);

    return view;
  },

  // render the child view
  renderChildView: function(view, index) {
    view.render();
    this.appendHtml(this, view, index);
  },

  // Build a `childView` for a model in the collection.
  buildChildView: function(child, ChilddViewType, childViewOptions) {
    var options = _.extend({model: child}, childViewOptions);
    return new ChilddViewType(options);
  },

  // Remove the child view and destroy it
  removeChildView: function(view) {

    if (view) {
      // call 'destroy' or 'remove', depending on which is found
      if (view.destroy) { view.destroy(); }
      else if (view.remove) { view.remove(); }

      this.stopListening(view);
      this.children.remove(view);
    }

    this.triggerMethod('child:removed', view);
  },

  // check if the collection is empty
  isEmpty: function(collection) {
    return !this.collection || this.collection.length === 0;
  },

  // If empty, show the empty view
  checkEmpty: function() {
    if (this.isEmpty(this.collection)) {
      this.showEmptyView();
    }
  },

  // You might need to override this if you've overridden appendHtml
  appendBuffer: function(collectionView, buffer) {
    collectionView.$el.append(buffer);
  },

  // Append the HTML to the collection's `el`.
  // Override this method to do something other
  // than `.append`.
  appendHtml: function(collectionView, childView, index) {
    if (collectionView.isBuffering) {
      // buffering happens on reset events and initial renders
      // in order to reduce the number of inserts into the
      // document, which are expensive.
      collectionView.elBuffer.appendChild(childView.el);
      collectionView._bufferedChildren.push(childView);
    }
    else {
      // If we've already rendered the main collection, just
      // append the new items directly into the element.
      collectionView.$el.append(childView.el);
    }
  },

  // Internal method to set up the `children` object for
  // storing all of the child views
  _initChildViewStorage: function() {
    this.children = new Backbone.ChildViewContainer();
  },

  // Handle cleanup and other destroying needs for the collection of views
  destroy: function() {
    if (this.isDestroyed) { return; }

    this.triggerMethod('collection:before:destroy');
    this.destroyChildren();
    this.triggerMethod('collection:destroyed');

    Marionette.View.prototype.destroy.apply(this, arguments);
  },

  // Destroy the child views that this collection view
  // is holding on to, if any
  destroyChildren: function() {
    this.children.each(this.removeChildView, this);
    this.checkEmpty();
  },

  // Set up the child view event forwarding. Uses a "childview:"
  // prefix in front of all forwarded events.
  proxyChildEvents: function(view) {
    var prefix = Marionette.getOption(this, 'childViewEventPrefix');

    // Forward all child view events through the parent,
    // prepending "childview:" to the event name
    this.listenTo(view, 'all', function() {
      var args = Array.prototype.slice.call(arguments);
      var rootEvent = args[0];
      var childEvents = this.normalizeMethods(_.result(this, 'childEvents'));

      args[0] = prefix + ':' + rootEvent;
      args.splice(1, 0, view);

      // call collectionView childEvent if defined
      if (typeof childEvents !== 'undefined' && _.isFunction(childEvents[rootEvent])) {
        childEvents[rootEvent].apply(this, args);
      }

      Marionette.triggerMethod.apply(this, args);
    }, this);
  }
});
