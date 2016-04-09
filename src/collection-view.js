// Collection View
// ---------------

import _                  from 'underscore';
import Backbone           from 'backbone';
import ChildViewContainer from 'backbone.babysitter';
import MarionetteError    from './error';
import ViewMixin          from './mixins/view';
import monitorViewEvents  from './monitor-view-events';
import destroyBackboneView from './utils/destroyBackboneView';
import { triggerMethodOn } from './trigger-method';

// A view that iterates over a Backbone.Collection
// and renders an individual child view for each model.
const CollectionView = Backbone.View.extend({

  // flag for maintaining the sorted order of the collection
  sort: true,

  // constructor
  // option to pass `{sort: false}` to prevent the `CollectionView` from
  // maintaining the sorted order of the collection.
  // This will fallback onto appending childView's to the end.
  //
  // option to pass `{comparator: compFunction()}` to allow the `CollectionView`
  // to use a custom sort order for the collection.
  constructor(options) {
    this.render = _.bind(this.render, this);

    this._setOptions(options);

    monitorViewEvents(this);

    this._initBehaviors();
    this.once('render', this._initialEvents);
    this._initChildViewStorage();
    this._bufferedChildren = [];

    Backbone.View.prototype.constructor.call(this, this.options);

    this.delegateEntityEvents();
  },

  // Instead of inserting elements one by one into the page, it's much more performant to insert
  // elements into a document fragment and then insert that document fragment into the page
  _startBuffering() {
    this._isBuffering = true;
  },

  _endBuffering() {
    const shouldTriggerAttach = !!this._isAttached;
    const triggerOnChildren = shouldTriggerAttach ? this._getImmediateChildren() : [];

    this._isBuffering = false;

    _.each(triggerOnChildren, child => {
      triggerMethodOn(child, 'before:attach', child);
    });

    this.attachBuffer(this, this._createBuffer());

    _.each(triggerOnChildren, child => {
      child._isAttached = true;
      triggerMethodOn(child, 'attach', child);
    });

    this._bufferedChildren = [];
  },

  // Configured the initial events that the collection view binds to.
  _initialEvents() {
    if (this.collection) {
      this.listenTo(this.collection, 'add', this._onCollectionAdd);
      this.listenTo(this.collection, 'remove', this._onCollectionRemove);
      this.listenTo(this.collection, 'reset', this.render);

      if (this.getOption('sort')) {
        this.listenTo(this.collection, 'sort', this._sortViews);
      }
    }
  },

  // Handle a child added to the collection
  _onCollectionAdd(child, collection, opts) {
    // `index` is present when adding with `at` since BB 1.2; indexOf fallback for < 1.2
    let index = opts.at !== undefined && (opts.index || collection.indexOf(child));

    // When filtered or when there is no initial index, calculate index.
    if (this.getOption('filter') || index === false) {
      index = _.indexOf(this._filteredSortedModels(index), child);
    }

    if (this._shouldAddChild(child, index)) {
      this._destroyEmptyView();
      const ChildView = this._getChildView(child);
      this._addChild(child, ChildView, index);
    }
  },

  // get the child view by model it holds, and remove it
  _onCollectionRemove(model) {
    const view = this.children.findByModel(model);
    this.removeChildView(view);
    this._checkEmpty();
  },

  // Render children views. Override this method to provide your own implementation of a
  // render function for the collection view.
  render() {
    this._ensureViewIsIntact();
    this.triggerMethod('before:render', this);
    this._renderChildren();
    this._isRendered = true;
    this.triggerMethod('render', this);
    return this;
  },

  // An efficient rendering used for filtering. Instead of modifying the whole DOM for the
  // collection view, we are only adding or removing the related childrenViews.
  setFilter(filter, {preventRender} = {}) {
    const canBeRendered = this._isRendered && !this._isDestroyed;
    const filterChanged = this.filter !== filter;
    const shouldRender = canBeRendered && filterChanged && !preventRender;

    if (shouldRender) {
      this.triggerMethod('before:apply:filter', this);
      const previousModels = this._filteredSortedModels();
      this.filter = filter;
      const models = this._filteredSortedModels();
      this._applyModelDeltas(models, previousModels);
      this.triggerMethod('apply:filter', this);
    } else {
      this.filter = filter;
    }
  },

  // `removeFilter` is actually an alias for removing filters.
  removeFilter(options) {
    this.setFilter(null, options);
  },

  // Calculate and apply difference by cid between `models` and `previousModels`.
  _applyModelDeltas(models, previousModels) {
    const currentIds = {};
    _.each(models, (model, index) => {
      const addedChildNotExists = !this.children.findByModel(model);
      if (addedChildNotExists) {
        this._onCollectionAdd(model, this.collection, {at: index});
      }
      currentIds[model.cid] = true;
    });
    _.each(previousModels, (prevModel) => {
      const removedChildExists = !currentIds[prevModel.cid] && this.children.findByModel(prevModel);
      if (removedChildExists) {
        this._onCollectionRemove(prevModel);
      }
    });
  },

  // Reorder DOM after sorting. When your element's rendering do not use their index,
  // you can pass reorderOnSort: true to only reorder the DOM after a sort instead of
  // rendering all the collectionView.
  reorder() {
    const children = this.children;
    const models = this._filteredSortedModels();
    const anyModelsAdded = _.some(models, function(model) {
      return !children.findByModel(model);
    });

    // If there are any new models added due to filtering we need to add child views,
    // so render as normal.
    if (anyModelsAdded) {
      this.render();
    } else {
      // Get the DOM nodes in the same order as the models.
      const elsToReorder = _.map(models, function(model, index) {
        const view = children.findByModel(model);
        view._index = index;
        return view.el;
      });

      // Find the views that were children before but aren't in this new ordering.
      const filteredOutViews = children.filter(function(view) {
        return !_.contains(elsToReorder, view.el);
      });

      this.triggerMethod('before:reorder', this);

      // Since append moves elements that are already in the DOM, appending the elements
      // will effectively reorder them.
      this._appendReorderedChildren(elsToReorder);

      // remove any views that have been filtered out
      _.each(filteredOutViews, _.bind(this.removeChildView, this));
      this._checkEmpty();

      this.triggerMethod('reorder', this);
    }
  },

  // Render view after sorting. Override this method to change how the view renders
  // after a `sort` on the collection.
  resortView() {
    if (this.getOption('reorderOnSort')) {
      this.reorder();
    } else {
      this._renderChildren();
    }
  },

  // Internal method. This checks for any changes in the order of the collection.
  // If the index of any view doesn't match, it will render.
  _sortViews() {
    const models = this._filteredSortedModels();

    // check for any changes in sort order of views
    const orderChanged = _.find(models, (item, index) => {
      const view = this.children.findByModel(item);
      return !view || view._index !== index;
    });

    if (orderChanged) {
      this.resortView();
    }
  },

  // Internal reference to what index a `emptyView` is.
  _emptyViewIndex: -1,

  // Internal method. Separated so that CompositeView can append to the childViewContainer
  // if necessary
  _appendReorderedChildren(children) {
    this.$el.append(children);
  },

  // Internal method. Separated so that CompositeView can have more control over events
  // being triggered, around the rendering process
  _renderChildren() {
    this._destroyEmptyView();
    this._destroyChildren({checkEmpty: false});

    const models = this._filteredSortedModels();
    if (this.isEmpty({processedModels: models})) {
      this._showEmptyView();
    } else {
      this.triggerMethod('before:render:children', this);
      this._startBuffering();
      this._showCollection(models);
      this._endBuffering();
      this.triggerMethod('render:children', this);
    }
  },

  // Internal method to loop through collection and show each child view.
  _showCollection(models) {
    _.each(models, (child, index) => {
      const ChildView = this._getChildView(child);
      this._addChild(child, ChildView, index);
    });
  },

  // Allow the collection to be sorted by a custom view comparator
  _filteredSortedModels(addedAt) {
    if (!this.collection) { return []; }

    const viewComparator = this.getViewComparator();
    let models = this.collection.models;
    addedAt = Math.min(Math.max(addedAt, 0), models.length - 1);

    if (viewComparator) {
      let addedModel;
      // Preserve `at` location, even for a sorted view
      if (addedAt) {
        addedModel = models[addedAt];
        models = models.slice(0, addedAt).concat(models.slice(addedAt + 1));
      }
      models = this._sortModelsBy(models, viewComparator);
      if (addedModel) {
        models.splice(addedAt, 0, addedModel);
      }
    }

    // Filter after sorting in case the filter uses the index
    models = this._filterModels(models);

    return models;
  },

  // Filter an array of models, if a filter exists
  _filterModels(models) {
    if (this.getOption('filter')) {
      models = _.filter(models, (model, index) => {
        return this._shouldAddChild(model, index);
      });
    }
    return models;
  },

  _sortModelsBy(models, comparator) {
    if (typeof comparator === 'string') {
      return _.sortBy(models, function(model) {
        return model.get(comparator);
      });
    } else if (comparator.length === 1) {
      return _.sortBy(models, _.bind(comparator, this));
    } else {
      return models.sort(_.bind(comparator, this));
    }
  },

  // Internal method to show an empty view in place of a collection of child views,
  // when the collection is empty
  _showEmptyView() {
    const EmptyView = this.getEmptyView();

    if (EmptyView && !this._showingEmptyView) {
      this._showingEmptyView = true;

      const model = new Backbone.Model();
      let emptyViewOptions =
        this.getOption('emptyViewOptions') || this.getOption('childViewOptions');
      if (_.isFunction(emptyViewOptions)) {
        emptyViewOptions = emptyViewOptions.call(this, model, this._emptyViewIndex);
      }

      const view = this.buildChildView(model, EmptyView, emptyViewOptions);

      this.triggerMethod('before:render:empty', this, view);
      this._addChildView(view, 0);
      this.triggerMethod('render:empty', this, view);

      view._parent = this;
    }
  },

  // Internal method to destroy an existing emptyView instance if one exists. Called when
  // a collection view has been rendered empty, and then a child is added to the collection.
  _destroyEmptyView() {
    if (this._showingEmptyView) {
      this.triggerMethod('before:remove:empty', this);

      this._destroyChildren();
      delete this._showingEmptyView;

      this.triggerMethod('remove:empty', this);
    }
  },

  // Retrieve the empty view class
  getEmptyView() {
    return this.getOption('emptyView');
  },

  // Retrieve the `childView` class, either from `this.options.childView` or from
  // the `childView` in the object definition. The "options" takes precedence.
  // The `childView` property can be either a view class or a function that
  // returns a view class. If it is a function, it will receive the model that
  // will be passed to the view instance (created from the returned view class)
  _getChildView(child) {
    const childView = this.getOption('childView');

    if (!childView) {
      throw new MarionetteError({
        name: 'NoChildViewError',
        message: 'A "childView" must be specified'
      });
    }

    // first check if the `childView` is a view class (the common case)
    // then check if it's a function (which we assume that returns a view class)
    if (childView.prototype instanceof Backbone.View || childView === Backbone.View) {
      return childView;
    } else if (_.isFunction(childView)) {
      return childView.call(this, child);
    } else {
      throw new MarionetteError({
        name: 'InvalidChildViewError',
        message: '"childView" must be a view class or a function that returns a view class'
      });
    }
  },

  // Internal method for building and adding a child view
  _addChild(child, ChildView, index) {
    const childViewOptions = this.getValue(this.getOption('childViewOptions'), child, index);

    const view = this.buildChildView(child, ChildView, childViewOptions);

    this.addChildView(view, index);

    return view;
  },

  // Render the child's view and add it to the HTML for the collection view at a given index.
  // This will also update the indices of later views in the collection in order to keep the
  // children in sync with the collection.
  addChildView(view, index) {
    this.triggerMethod('before:add:child', this, view);

    // increment indices of views after this one
    this._updateIndices(view, true, index);

    view._parent = this;

    this._addChildView(view, index);

    this.triggerMethod('add:child', this, view);

    return view;
  },

  // Internal method. This decrements or increments the indices of views after the added/removed
  // view to keep in sync with the collection.
  _updateIndices(view, increment, index) {
    if (!this.getOption('sort')) {
      return;
    }

    if (increment) {
      // assign the index to the view
      view._index = index;
    }

    // update the indexes of views after this one
    this.children.each(function(laterView) {
      if (laterView._index >= view._index) {
        laterView._index += increment ? 1 : -1;
      }
    });
  },

  // Internal Method. Add the view to children and render it at the given index.
  _addChildView(view, index) {
    // Only trigger attach if already attached and not buffering,
    // otherwise _endBuffering() or Region#show() handles this.
    const shouldTriggerAttach = !this._isBuffering && this._isAttached;

    monitorViewEvents(view);

    // set up the child view event forwarding
    this._proxyChildEvents(view);

    // Store the child view itself so we can properly remove and/or destroy it later
    this.children.add(view);

    if (!view.supportsRenderLifecycle) {
      triggerMethodOn(view, 'before:render', view);
    }

    // Render view
    view.render();

    if (!view.supportsRenderLifecycle) {
      view._isRendered = true;
      triggerMethodOn(view, 'render', view);
    }

    if (shouldTriggerAttach) {
      triggerMethodOn(view, 'before:attach', view);
    }

    // Attach view
    this.attachHtml(this, view, index);

    if (shouldTriggerAttach) {
      view._isAttached = true;
      triggerMethodOn(view, 'attach', view);
    }
  },

  // Build a `childView` for a model in the collection.
  buildChildView(child, ChildViewClass, childViewOptions) {
    const options = _.extend({model: child}, childViewOptions);
    return new ChildViewClass(options);
  },

  // Remove the child view and destroy it. This function also updates the indices of later views
  // in the collection in order to keep the children in sync with the collection.
  removeChildView(view) {
    if (!view || view._isDestroyed) {
      return;
    }

    this.triggerMethod('before:remove:child', this, view);

    if (view.destroy) {
      view.destroy();
    } else {
      destroyBackboneView(view);
    }

    delete view._parent;
    this.stopListening(view);
    this.children.remove(view);
    this.triggerMethod('remove:child', this, view);

    // decrement the index of views after this one
    this._updateIndices(view, false);
  },

  // check if the collection is empty or optionally whether an array of pre-processed models is empty
  isEmpty(options) {
    let models;
    if (_.result(options, 'processedModels')) {
      models = options.processedModels;
    } else {
      models = this.collection ? this.collection.models : [];
      models = this._filterModels(models);
    }
    return models.length === 0;
  },

  // If empty, show the empty view
  _checkEmpty() {
    if (this.isEmpty()) {
      this._showEmptyView();
    }
  },

  // You might need to override this if you've overridden attachHtml
  attachBuffer(collectionView, buffer) {
    collectionView.$el.append(buffer);
  },

  // Create a fragment buffer from the currently buffered children
  _createBuffer() {
    const elBuffer = document.createDocumentFragment();
    _.each(this._bufferedChildren, function(b) {
      elBuffer.appendChild(b.el);
    });
    return elBuffer;
  },

  // Append the HTML to the collection's `el`. Override this method to do something other
  // than `.append`.
  attachHtml(collectionView, childView, index) {
    if (collectionView._isBuffering) {
      // buffering happens on reset events and initial renders
      // in order to reduce the number of inserts into the
      // document, which are expensive.
      collectionView._bufferedChildren.splice(index, 0, childView);
    } else {
      // If we've already rendered the main collection, append
      // the new child into the correct order if we need to. Otherwise
      // append to the end.
      if (!collectionView._insertBefore(childView, index)) {
        collectionView._insertAfter(childView);
      }
    }
  },

  // Internal method. Check whether we need to insert the view into the correct position.
  _insertBefore(childView, index) {
    let currentView;
    const findPosition = this.getOption('sort') && (index < this.children.length - 1);
    if (findPosition) {
      // Find the view after this one
      currentView = this.children.find(function(view) {
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
  _insertAfter(childView) {
    this.$el.append(childView.el);
  },

  // Internal method to set up the `children` object for storing all of the child views
  _initChildViewStorage() {
    this.children = new ChildViewContainer();
  },

  // called by ViewMixin destroy
  _removeChildren() {
    this._destroyChildren({checkEmpty: false});
  },

  // Destroy the child views that this collection view is holding on to, if any
  _destroyChildren({checkEmpty} = {}) {
    this.triggerMethod('before:destroy:children', this);
    const shouldCheckEmpty = checkEmpty !== false;
    const childViews = this.children.map(_.identity);

    this.children.each(_.bind(this.removeChildView, this));

    if (shouldCheckEmpty) {
      this._checkEmpty();
    }

    this.triggerMethod('destroy:children', this);
    return childViews;
  },

  // Return true if the given child should be shown. Return false otherwise.
  // The filter will be passed (child, index, collection), where
  //  'child' is the given model
  //  'index' is the index of that model in the collection
  //  'collection' is the collection referenced by this CollectionView
  _shouldAddChild(child, index) {
    const filter = this.getOption('filter');
    return !_.isFunction(filter) || filter.call(this, child, index, this.collection);
  },

  // Set up the child view event forwarding. Uses a "childview:" prefix in front of all forwarded events.
  _proxyChildEvents(view) {
    const prefix = this.getOption('childViewEventPrefix');

    // Forward all child view events through the parent,
    // prepending "childview:" to the event name
    this.listenTo(view, 'all', function(eventName, ...args) {

      const childEventName = prefix + ':' + eventName;

      const childViewEvents = this.normalizeMethods(this._childViewEvents);

      // call collectionView childViewEvent if defined
      if (typeof childViewEvents !== 'undefined' && _.isFunction(childViewEvents[eventName])) {
        childViewEvents[eventName].apply(this, args);
      }

      // use the parent view's proxyEvent handlers
      const childViewTriggers = this._childViewTriggers;

      // Call the event with the proxy name on the parent layout
      if (childViewTriggers && _.isString(childViewTriggers[eventName])) {
        this.triggerMethod(childViewTriggers[eventName], ...args);
      }

      this.triggerMethod(childEventName, ...args);
    });
  },

  _getImmediateChildren() {
    return _.values(this.children._views);
  },

  getViewComparator() {
    return this.getOption('viewComparator');
  }
});

_.extend(CollectionView.prototype, ViewMixin);

export default CollectionView;
