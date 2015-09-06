/* jshint maxstatements: 17, maxlen: 117 */

// Composite View
// --------------

// Used for rendering a branch-leaf, hierarchical structure.
// Extends directly from CollectionView and also renders an
// a child view as `modelView`, for the top leaf
Marionette.CompositeView = Marionette.CollectionView.extend({

  // Setting up the inheritance chain which allows changes to
  // Marionette.CollectionView.prototype.constructor which allows overriding
  // option to pass '{sort: false}' to prevent the CompositeView from
  // maintaining the sorted order of the collection.
  // This will fallback onto appending childView's to the end.
  constructor: function() {
    Marionette.CollectionView.prototype.constructor.apply(this, arguments);
  },

  // Configured the initial events that the composite view
  // binds to. Override this method to prevent the initial
  // events, or to add your own initial events.
  _initialEvents: function() {

    // Bind only after composite view is rendered to avoid adding child views
    // to nonexistent childViewContainer

    if (this.collection) {
      this.listenTo(this.collection, 'add', this._onCollectionAdd);
      this.listenTo(this.collection, 'remove', this._onCollectionRemove);
      this.listenTo(this.collection, 'reset', this._renderChildren);

      if (this.getOption('sort')) {
        this.listenTo(this.collection, 'sort', this._sortViews);
      }
    }
  },

  // Retrieve the `childView` to be used when rendering each of
  // the items in the collection. The default is to return
  // `this.childView` or Marionette.CompositeView if no `childView`
  // has been defined. As happens in CollectionView, `childView` can
  // be a function (which should return a view class).
  _getChildView: function(child) {
    var childView = this.getOption('childView');

    // for CompositeView, if `childView` is not specified, we'll get the same
    // composite view class rendered for each child in the collection
    // then check if the `childView` is a view class (the common case)
    // finally check if it's a function (which we assume that returns a view class)
    if (!childView) {
      return this.constructor;
    } else if (childView.prototype instanceof Backbone.View || childView === Backbone.View) {
      return childView;
    } else if (_.isFunction(childView)) {
      return childView.call(this, child);
    } else {
      throw new Marionette.Error({
        name: 'InvalidChildViewError',
        message: '"childView" must be a view class or a function that returns a view class'
      });
    }

  },

  // Return the serialized model
  serializeData: function() {
    return this.serializeModel();
  },

  // Renders the model and the collection.
  render: function() {
    this._ensureViewIsIntact();
    this._isRendering = true;
    this.resetChildViewContainer();

    this.triggerMethod('before:render', this);

    this._renderTemplate();
    this.bindUIElements();
    this._renderChildren();

    this._isRendering = false;
    this.isRendered = true;
    this.triggerMethod('render', this);
    return this;
  },

  _renderChildren: function() {
    if (this.isRendered || this._isRendering) {
      Marionette.CollectionView.prototype._renderChildren.call(this);
    }
  },

  // Attaches the content of the root.
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

  // You might need to override this if you've overridden attachHtml
  attachBuffer: function(compositeView, buffer) {
    var $container = this.getChildViewContainer(compositeView);
    $container.append(buffer);
  },

  // Internal method. Append a view to the end of the $el.
  // Overidden from CollectionView to ensure view is appended to
  // childViewContainer
  _insertAfter: function(childView) {
    var $container = this.getChildViewContainer(this, childView);
    $container.append(childView.el);
  },

  // Internal method. Append reordered childView'.
  // Overidden from CollectionView to ensure reordered views
  // are appended to childViewContainer
  _appendReorderedChildren: function(children) {
    var $container = this.getChildViewContainer(this);
    $container.append(children);
  },

  // Internal method to ensure an `$childViewContainer` exists, for the
  // `attachHtml` method to use.
  getChildViewContainer: function(containerView, childView) {
    if (!!containerView.$childViewContainer) {
      return containerView.$childViewContainer;
    }

    var container;
    var childViewContainer = Marionette.getOption(containerView, 'childViewContainer');
    if (childViewContainer) {

      var selector = Marionette._getValue(childViewContainer, containerView);

      if (selector.charAt(0) === '@' && containerView.ui) {
        container = containerView.ui[selector.substr(4)];
      } else {
        container = containerView.$(selector);
      }

      if (container.length <= 0) {
        throw new Marionette.Error({
          name: 'ChildViewContainerMissingError',
          message: 'The specified "childViewContainer" was not found: ' + containerView.childViewContainer
        });
      }

    } else {
      container = containerView.$el;
    }

    containerView.$childViewContainer = container;
    return container;
  },

  // Internal method to reset the `$childViewContainer` on render
  resetChildViewContainer: function() {
    if (this.$childViewContainer) {
      this.$childViewContainer = undefined;
    }
  }
});
