// Collection View
// ---------------

import _ from 'underscore';
import Backbone from 'backbone';
import destroyBackboneView from './utils/destroy-backbone-view';
import isNodeAttached from './common/is-node-attached';
import monitorViewEvents from './common/monitor-view-events';
import { triggerMethodOn } from './common/trigger-method';
import ChildViewContainer from './child-view-container';
import MarionetteError from './error';
import ViewMixin from './mixins/view';

const ClassOptions = [
  'behaviors',
  'childView',
  'childViewEventPrefix',
  'childViewEvents',
  'childViewOptions',
  'childViewTriggers',
  'collectionEvents',
  'events',
  'filter',
  'emptyView',
  'emptyViewOptions',
  'modelEvents',
  'reorderOnSort',
  'sort',
  'triggers',
  'ui',
  'viewComparator'
];

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
  // option to pass `{viewComparator: compFunction()}` to allow the `CollectionView`
  // to use a custom sort order for the collection.
  constructor(options) {
    this.render = _.bind(this.render, this);

    this._setOptions(options);

    this.mergeOptions(options, ClassOptions);

    monitorViewEvents(this);

    this._initBehaviors();
    this.once('render', this._initialEvents);
    this._initChildViewStorage();
    this._bufferedChildren = [];

    const args = Array.prototype.slice.call(arguments);
    args[0] = this.options;
    Backbone.View.prototype.constructor.apply(this, args);

    this.delegateEntityEvents();

    this._triggerEventOnBehaviors('initialize', this);
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

  _getImmediateChildren() {
    return _.values(this.children._views);
  },

  // Configured the initial events that the collection view binds to.
  _initialEvents() {
    if (this.collection) {
      this.listenTo(this.collection, 'add', this._onCollectionAdd);
      this.listenTo(this.collection, 'update', this._onCollectionUpdate);
      this.listenTo(this.collection, 'reset', this.render);

      if (this.sort) {
        this.listenTo(this.collection, 'sort', this._sortViews);
      }
    }
  },

  // Handle a child added to the collection
  _onCollectionAdd(child, collection, opts) {
    // `index` is present when adding with `at` since BB 1.2; indexOf fallback for < 1.2
    let index = opts.at !== undefined && (opts.index || collection.indexOf(child));

    // When filtered or when there is no initial index, calculate index.
    if (this.filter || index === false) {
      index = _.indexOf(this._filteredSortedModels(index), child);
    }

    if (this._shouldAddChild(child, index)) {
      this._destroyEmptyView();
      this._addChild(child, index)
    }
  },

  // Handle collection update model removals
  _onCollectionUpdate(collection, options) {
    const changes = options.changes;
    this._removeChildModels(changes.removed);
  },

  // Remove the child views and destroy them.
  // This function also updates the indices of later views
  // in the collection in order to keep the children in sync with the collection.
  // "models" is an array of models and the corresponding views
  // will be removed and destroyed from the CollectionView
  _removeChildModels(models) {
    // Used to determine where to update the remaining
    // sibling view indices after these views are removed.
    const removedViews = this._getRemovedViews(models);

    if (!removedViews.length) {
      return;
    }

    this.children._updateLength();

    // decrement the index of views after this one
    this._updateIndices(removedViews, false);

    if (this.isEmpty()) {
      this._showEmptyView();
    }
  },

  // Returns the views that will be used for re-indexing
  // through CollectionView#_updateIndices.
  _getRemovedViews(models) {

    // Returning a view means something was removed.
    return _.reduce(models, (removingViews, model) => {
      const view = model && this.children.findByModel(model);

      if (!view || view._isDestroyed) {
        return removingViews;
      }

      this._removeChildView(view);

      removingViews.push(view);

      return removingViews;
    }, []);
  },

  _removeChildView(view) {
    this.triggerMethod('before:remove:child', this, view);

    this.children._remove(view);
    if (view.destroy) {
      view.destroy();
    } else {
      destroyBackboneView(view);
    }

    this.stopListening(view);
    this.triggerMethod('remove:child', this, view);
  },

  // Overriding Backbone.View's `setElement` to handle
  // if an el was previously defined. If so, the view might be
  // attached on setElement.
  setElement() {
    const hasEl = !!this.el;

    Backbone.View.prototype.setElement.apply(this, arguments);

    if (hasEl) {
      this._isAttached = isNodeAttached(this.el);
    }

    return this;
  },

  // Render children views. Override this method to provide your own implementation of a
  // render function for the collection view.
  render() {
    if (this._isDestroyed) { return this; }
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
      const previousModels = this._filteredSortedModels();
      this.filter = filter;
      const models = this._filteredSortedModels();
      this._applyModelDeltas(models, previousModels);
    } else {
      this.filter = filter;
    }

    return this;
  },

  // `removeFilter` is actually an alias for removing filters.
  removeFilter(options) {
    return this.setFilter(null, options);
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

    const removeModels = _.filter(previousModels, (prevModel) => {
      return !currentIds[prevModel.cid] && this.children.findByModel(prevModel);
    });

    this._removeChildModels(removeModels);
  },

  // Reorder DOM after sorting. When your element's rendering do not use their index,
  // you can pass reorderOnSort: true to only reorder the DOM after a sort instead of
  // rendering all the collectionView.
  reorder() {
    const children = this.children;
    const models = this._filteredSortedModels();

    if (!models.length && this._showingEmptyView) { return this; }

    const anyModelsAdded = _.some(models, function(model) {
      return !children.findByModel(model);
    });

    // If there are any new models added due to filtering we need to add child views,
    // so render as normal.
    if (anyModelsAdded) {
      this.render();
    } else {

      const filteredOutModels = [];

      // Get the DOM nodes in the same order as the models and
      // find the model that were children before but aren't in this new order.
      const elsToReorder = children.reduce(function(viewEls, view) {
        const index = _.indexOf(models, view.model);

        if (index === -1) {
          filteredOutModels.push(view.model);
          return viewEls;
        }

        view._index = index;

        viewEls[index] = view.el;

        return viewEls;
      }, new Array(models.length));

      this.triggerMethod('before:reorder', this);

      // Since append moves elements that are already in the DOM, appending the elements
      // will effectively reorder them.
      this._appendReorderedChildren(elsToReorder);

      // remove any views that have been filtered out
      this._removeChildModels(filteredOutModels);

      this.triggerMethod('reorder', this);
    }
    return this;
  },

  // Render view after sorting. Override this method to change how the view renders
  // after a `sort` on the collection.
  resortView() {
    if (this.reorderOnSort) {
      this.reorder();
    } else {
      this._renderChildren();
    }
    return this;
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
    this.appendChildren(this.el, children);
  },

  // Internal method. Separated so that CompositeView can have more control over events
  // being triggered, around the rendering process
  _renderChildren() {
    if (this._isRendered) {
      this._destroyEmptyView();
      this._destroyChildren();
    }

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

  _createView(model, index) {
    const ChildView = this._getChildView(model);
    const childViewOptions = this._getChildViewOptions(model, index);
    const view = this.buildChildView(model, ChildView, childViewOptions);
    return view;
  },

  _setupChildView(view, index) {
    monitorViewEvents(view);

    // set up the child view event forwarding
    this._proxyChildViewEvents(view);

    if (this.sort) {
      view._index = index;
    }
  },

  // Internal method to loop through collection and show each child view.
  _showCollection(models) {
    _.each(models, _.bind(this._addChild, this));
    this.children._updateLength();
  },

  // Allow the collection to be sorted by a custom view comparator
  _filteredSortedModels(addedAt) {
    if (!this.collection || !this.collection.length) { return []; }

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

  getViewComparator() {
    return this.viewComparator;
  },

  // Filter an array of models, if a filter exists
  _filterModels(models) {
    if (this.filter) {
      models = _.filter(models, (model, index) => {
        return this._shouldAddChild(model, index);
      });
    }
    return models;
  },

  _sortModelsBy(models, comparator) {
    if (typeof comparator === 'string') {
      return _.sortBy(models, (model) => {
        return model.get(comparator);
      });
    } else if (comparator.length === 1) {
      return _.sortBy(models, _.bind(comparator, this));
    } else {
      return _.clone(models).sort(_.bind(comparator, this));
    }
  },

  // Internal method to show an empty view in place of a collection of child views,
  // when the collection is empty
  _showEmptyView() {
    const EmptyView = this._getEmptyView();

    if (EmptyView && !this._showingEmptyView) {
      this._showingEmptyView = true;

      const model = new Backbone.Model();
      let emptyViewOptions =
        this.emptyViewOptions || this.childViewOptions;
      if (_.isFunction(emptyViewOptions)) {
        emptyViewOptions = emptyViewOptions.call(this, model, this._emptyViewIndex);
      }

      const view = this.buildChildView(model, EmptyView, emptyViewOptions);

      this.triggerMethod('before:render:empty', this, view);
      this.addChildView(view, 0);
      this.triggerMethod('render:empty', this, view);
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
  _getEmptyView() {
    const emptyView = this.emptyView;

    if (!emptyView) { return; }

    return this._getView(emptyView);
  },

  // Retrieve the `childView` class
  // The `childView` property can be either a view class or a function that
  // returns a view class. If it is a function, it will receive the model that
  // will be passed to the view instance (created from the returned view class)
  _getChildView(child) {
    let childView = this.childView;

    if (!childView) {
      throw new MarionetteError({
        name: 'NoChildViewError',
        message: 'A "childView" must be specified'
      });
    }

    childView = this._getView(childView, child);

    if (!childView) {
      throw new MarionetteError({
        name: 'InvalidChildViewError',
        message: '"childView" must be a view class or a function that returns a view class'
      });
    }

    return childView;
  },

  // First check if the `view` is a view class (the common case)
  // Then check if it's a function (which we assume that returns a view class)
  _getView(view, child) {
    if (view.prototype instanceof Backbone.View || view === Backbone.View) {
      return view;
    } else if (_.isFunction(view)) {
      return view.call(this, child);
    }
  },

  // Internal method for building and adding a child view
  _addChild(child, index) {
    const view = this._createView(child, index);
    this.addChildView(view, index);

    return view;
  },

  _getChildViewOptions(child, index) {
    if (_.isFunction(this.childViewOptions)) {
      return this.childViewOptions(child, index);
    }

    return this.childViewOptions;
  },

  // Render the child's view and add it to the HTML for the collection view at a given index.
  // This will also update the indices of later views in the collection in order to keep the
  // children in sync with the collection.
  addChildView(view, index) {
    this.triggerMethod('before:add:child', this, view);
    this._setupChildView(view, index);

    // Store the child view itself so we can properly remove and/or destroy it later
    if (this._isBuffering) {
      // Add to children, but don't update children's length.
      this.children._add(view);
    } else {
      // increment indices of views after this one
      this._updateIndices(view, true);
      this.children.add(view);
    }

    this._renderView(view);

    this._attachView(view, index);

    this.triggerMethod('add:child', this, view);

    return view;
  },

  // Internal method. This decrements or increments the indices of views after the added/removed
  // view to keep in sync with the collection.
  _updateIndices(views, increment) {
    if (!this.sort) {
      return;
    }

    if (!increment) {
      _.each(_.sortBy(this.children._views, '_index'), (view, index) => {
        view._index = index;
      });

      return;
    }

    const view = _.isArray(views) ? _.max(views, '_index') : views;

    if (_.isObject(view)) {
      // update the indexes of views after this one
      this.children.each((laterView) => {
        if (laterView._index >= view._index) {
          laterView._index += 1;
        }
      });
    }
  },

  _renderView(view) {
    if (view._isRendered) {
      return;
    }

    if (!view.supportsRenderLifecycle) {
      triggerMethodOn(view, 'before:render', view);
    }

    view.render();

    if (!view.supportsRenderLifecycle) {
      view._isRendered = true;
      triggerMethodOn(view, 'render', view);
    }
  },

  _attachView(view, index) {
    // Only trigger attach if already attached and not buffering,
    // otherwise _endBuffering() or Region#show() handles this.
    const shouldTriggerAttach = !view._isAttached && !this._isBuffering && this._isAttached;

    if (shouldTriggerAttach) {
      triggerMethodOn(view, 'before:attach', view);
    }

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
      return view;
    }

    this._removeChildView(view);
    this.children._updateLength();
    // decrement the index of views after this one
    this._updateIndices(view, false);
    return view;
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

  // You might need to override this if you've overridden attachHtml
  attachBuffer(collectionView, buffer) {
    this.appendChildren(collectionView.el, buffer);
  },

  // Create a fragment buffer from the currently buffered children
  _createBuffer() {
    const elBuffer = this.createBuffer();
    _.each(this._bufferedChildren, (b) => {
      this.appendChildren(elBuffer, b.el);
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
    const findPosition = this.sort && (index < this.children.length - 1);
    if (findPosition) {
      // Find the view after this one
      currentView = this.children.find((view) => {
        return view._index === index + 1;
      });
    }

    if (currentView) {
      this.beforeEl(currentView.el, childView.el);
      return true;
    }

    return false;
  },

  // Internal method. Append a view to the end of the $el
  _insertAfter(childView) {
    this.appendChildren(this.el, childView.el);
  },

  // Internal method to set up the `children` object for storing all of the child views
  _initChildViewStorage() {
    this.children = new ChildViewContainer();
  },

  // called by ViewMixin destroy
  _removeChildren() {
    this._destroyChildren();
  },

  // Destroy the child views that this collection view is holding on to, if any
  _destroyChildren(options) {
    if (!this.children.length) {
      return;
    }

    this.triggerMethod('before:destroy:children', this);
    this.children.each(_.bind(this._removeChildView, this));
    this.children._updateLength();
    this.triggerMethod('destroy:children', this);
  },

  // Return true if the given child should be shown. Return false otherwise.
  // The filter will be passed (child, index, collection), where
  //  'child' is the given model
  //  'index' is the index of that model in the collection
  //  'collection' is the collection referenced by this CollectionView
  _shouldAddChild(child, index) {
    const filter = this.filter;
    return !_.isFunction(filter) || filter.call(this, child, index, this.collection);
  }
});

_.extend(CollectionView.prototype, ViewMixin);

export default CollectionView;
