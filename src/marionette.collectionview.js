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
  // option to pass `{sort: false}` to prevent the `CollectionView` from
  // maintaining the sorted order of the collection.
  // This will fallback onto appending childView's to the end.
  constructor: function(options){
    var initOptions = options || {};
    this.sort = _.isUndefined(initOptions.sort) ? true : initOptions.sort;

    this._initChildViewStorage();

    Marionette.View.apply(this, arguments);

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
    this._triggerBeforeShowBufferedChildren();
    this.attachBuffer(this, this.elBuffer);
    this._triggerShowBufferedChildren();
    this.initRenderBuffer();
  },

  _triggerBeforeShowBufferedChildren: function() {
    if (this._isShown) {
      _.invoke(this._bufferedChildren, 'triggerMethod', 'before:show');
    }
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
      this.listenTo(this.collection, 'add', this._onCollectionAdd);
      this.listenTo(this.collection, 'remove', this._onCollectionRemove);
      this.listenTo(this.collection, 'reset', this.render);

      if (this.sort) {
        this.listenTo(this.collection, 'sort', this._sortViews);
      }
    }
  },

  // Handle a child added to the collection
  _onCollectionAdd: function(child) {
    this.destroyEmptyView();
    var ChildView = this.getChildView(child);
    var index = this.collection.indexOf(child);
    this.addChild(child, ChildView, index);
  },

  // get the child view by model it holds, and remove it
  _onCollectionRemove: function(model) {
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

  // Render view after sorting. Override this method to
  // change how the view renders after a `sort` on the collection.
  // An example of this would be to only `renderChildren` in a `CompositeView`
  // rather than the full view.
  resortView: function() {
    this.render();
  },

  // Internal method. This checks for any changes in the order of the collection.
  // If the index of any view doesn't match, it will render.
  _sortViews: function() {
    // check for any changes in sort order of views
    var orderChanged = this.collection.find(function(item, index){
      var view = this.children.findByModel(item);
      return !view || view._index !== index;
    }, this);

    if (orderChanged) {
      this.resortView();
    }
  },

  // Internal method. Separated so that CompositeView can have
  // more control over events being triggered, around the rendering
  // process
  _renderChildren: function() {
    this.destroyEmptyView();
    this.destroyChildren();

    if (this.isEmpty(this.collection)) {
      this.showEmptyView();
    } else {
      this.triggerMethod('before:render:collection', this);
      this.startBuffering();
      this.showCollection();
      this.endBuffering();
      this.triggerMethod('render:collection', this);
    }
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
      this.triggerMethod('before:render:empty');

      this._showingEmptyView = true;
      var model = new Backbone.Model();
      this.addEmptyView(model, EmptyView);

      this.triggerMethod('render:empty');
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

  // Retrieve the empty view class
  getEmptyView: function() {
    return this.getOption('emptyView');
  },

  // Render and show the emptyView. Similar to addChild method
  // but "child:added" events are not fired, and the event from
  // emptyView are not forwarded
  addEmptyView: function(child, EmptyView){

    // get the emptyViewOptions, falling back to childViewOptions
    var emptyViewOptions = this.getOption('emptyViewOptions') ||
                          this.getOption('childViewOptions');

    if (_.isFunction(emptyViewOptions)){
      emptyViewOptions = emptyViewOptions.call(this);
    }

    // build the empty view
    var view = this.buildChildView(child, EmptyView, emptyViewOptions);

    // trigger the 'before:show' event on `view` if the collection view
    // has already been shown
    if (this._isShown){
      this.triggerMethod.call(view, 'before:show');
    }

    // Store the `emptyView` like a `childView` so we can properly
    // remove and/or close it later
    this.children.add(view);

    // Render it and show it
    this.renderChildView(view, -1);

    // call the 'show' method if the collection view
    // has already been shown
    if (this._isShown){
      this.triggerMethod.call(view, 'show');
    }
  },

  // Retrieve the `childView` class, either from `this.options.childView`
  // or from the `childView` in the object definition. The "options"
  // takes precedence.
  // This method receives the model that will be passed to the instance
  // created from this `childView`. Overriding methods may use the child
  // to determine what `childView` class to return.
  getChildView: function(child) {
    var childView = this.getOption('childView');

    if (!childView) {
      throwError('A "childView" must be specified', 'NoChildViewError');
    }

    return childView;
  },

  // Render the child's view and add it to the
  // HTML for the collection view at a given index.
  // This will also update the indices of later views in the collection
  // in order to keep the children in sync with the collection.
  addChild: function(child, ChildView, index) {
    var childViewOptions = this.getOption('childViewOptions');
    if (_.isFunction(childViewOptions)) {
      childViewOptions = childViewOptions.call(this, child, index);
    }

    var view = this.buildChildView(child, ChildView, childViewOptions);

    // increment indices of views after this one
    this._updateIndices(view, true, index);

    this._addChildView(view, index);

    return view;
  },

  // Internal method. This decrements or increments the indices of views after the
  // added/removed view to keep in sync with the collection.
  _updateIndices: function(view, increment, index) {
    if (!this.sort) {
      return;
    }

    if (increment) {
      // assign the index to the view
      view._index = index;

      // increment the index of views after this one
      this.children.each(function (laterView) {
        if (laterView._index >= view._index) {
          laterView._index++;
        }
      });
    }
    else {
      // decrement the index of views after this one
      this.children.each(function (laterView) {
        if (laterView._index >= view._index) {
          laterView._index--;
        }
      });
    }
  },


  // Internal Method. Add the view to children and render it at
  // the given index.
  _addChildView: function(view, index) {
    // set up the child view event forwarding
    this.proxyChildEvents(view);

    this.triggerMethod('before:add:child', view);

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

    this.triggerMethod('add:child', view);
  },

  // render the child view
  renderChildView: function(view, index) {
    view.render();
    this.attachHtml(this, view, index);
    return view;
  },

  // Build a `childView` for a model in the collection.
  buildChildView: function(child, ChildViewClass, childViewOptions) {
    var options = _.extend({model: child}, childViewOptions);
    return new ChildViewClass(options);
  },

  // Remove the child view and destroy it.
  // This function also updates the indices of
  // later views in the collection in order to keep
  // the children in sync with the collection.
  removeChildView: function(view) {

    if (view) {
      this.triggerMethod('before:remove:child', view);
      // call 'destroy' or 'remove', depending on which is found
      if (view.destroy) { view.destroy(); }
      else if (view.remove) { view.remove(); }

      this.stopListening(view);
      this.children.remove(view);
      this.triggerMethod('remove:child', view);

      // decrement the index of views after this one
      this._updateIndices(view, false);
    }

    return view;
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

  // You might need to override this if you've overridden attachHtml
  attachBuffer: function(collectionView, buffer) {
    collectionView.$el.append(buffer);
  },

  // Append the HTML to the collection's `el`.
  // Override this method to do something other
  // than `.append`.
  attachHtml: function(collectionView, childView, index) {
    if (collectionView.isBuffering) {
      // buffering happens on reset events and initial renders
      // in order to reduce the number of inserts into the
      // document, which are expensive.
      collectionView.elBuffer.appendChild(childView.el);
      collectionView._bufferedChildren.push(childView);
    }
    else {
      // If we've already rendered the main collection, append
      // the new child into the correct order if we need to. Otherwise
      // append to the end.
      if (!collectionView._insertBefore(childView, index)){
        collectionView._insertAfter(childView);
      }
    }
  },

  // Internal method. Check whether we need to insert the view into
  // the correct position.
  _insertBefore: function(childView, index) {
    var currentView;
    var findPosition = this.sort && (index < this.children.length - 1);
    if (findPosition) {
      // Find the view after this one
      currentView = this.children.find(function (view) {
        return view._index === index + 1;
      });
    }

    if (currentView) {
      currentView.$el.before(childView.el);
      return true;
    }

    return false;
  },

  // Internal method. Append a view to the end of the $el
  _insertAfter: function(childView) {
    this.$el.append(childView.el);
  },

  // Internal method to set up the `children` object for
  // storing all of the child views
  _initChildViewStorage: function() {
    this.children = new Backbone.ChildViewContainer();
  },

  // Handle cleanup and other destroying needs for the collection of views
  destroy: function() {
    if (this.isDestroyed) { return; }

    this.triggerMethod('before:destroy:collection');
    this.destroyChildren();
    this.triggerMethod('destroy:collection');

    return Marionette.View.prototype.destroy.apply(this, arguments);
  },

  // Destroy the child views that this collection view
  // is holding on to, if any
  destroyChildren: function() {
    var childViews = this.children.map(_.identity);
    this.children.each(this.removeChildView, this);
    this.checkEmpty();
    return childViews;
  },

  // Set up the child view event forwarding. Uses a "childview:"
  // prefix in front of all forwarded events.
  proxyChildEvents: function(view) {
    var prefix = this.getOption('childViewEventPrefix');

    // Forward all child view events through the parent,
    // prepending "childview:" to the event name
    this.listenTo(view, 'all', function() {
      var args = slice.call(arguments);
      var rootEvent = args[0];
      var childEvents = this.normalizeMethods(_.result(this, 'childEvents'));

      args[0] = prefix + ':' + rootEvent;
      args.splice(1, 0, view);

      // call collectionView childEvent if defined
      if (typeof childEvents !== 'undefined' && _.isFunction(childEvents[rootEvent])) {
        childEvents[rootEvent].apply(this, args.slice(1));
      }

      this.triggerMethod.apply(this, args);
    }, this);
  }
});
