// Next Collection View
// ---------------

import _ from 'underscore';
import Backbone from 'backbone';
import destroyBackboneView from './utils/destroy-backbone-view';
import isNodeAttached from './common/is-node-attached';
import monitorViewEvents from './common/monitor-view-events';
import { triggerMethodOn } from './common/trigger-method';
import ChildViewContainer from './next-child-view-container';
import MarionetteError from './error';
import Region from './region';
import ViewMixin from './mixins/view';

const ClassOptions = [
  'behaviors',
  'childView',
  'childViewEventPrefix',
  'childViewEvents',
  'childViewOptions',
  'childViewTriggers',
  'collectionEvents',
  'emptyView',
  'emptyViewOptions',
  'events',
  'modelEvents',
  'sortWithCollection',
  'triggers',
  'ui',
  'viewComparator',
  'viewFilter'
];

// A view that iterates over a Backbone.Collection
// and renders an individual child view for each model.
const CollectionView = Backbone.View.extend({
  // flag for maintaining the sorted order of the collection
  sortWithCollection: true,

  // constructor
  constructor(options) {
    this._setOptions(options);

    this.mergeOptions(options, ClassOptions);

    monitorViewEvents(this);

    this.once('render', this._initialEvents);

    // This children container isn't really used by a render, but it provides
    // the ability to check `this.children.length` prior to rendering
    // It also allows for cases where only addChildView is used
    this._initChildViewStorage();
    this._initBehaviors();

    const args = Array.prototype.slice.call(arguments);
    args[0] = this.options;
    Backbone.View.prototype.constructor.apply(this, args);

    this._initEmptyRegion();

    this.delegateEntityEvents();

    this._triggerEventOnBehaviors('initialize', this);
  },

  // Internal method to set up the `children` object for storing all of the child views
  _initChildViewStorage() {
    this.children = new ChildViewContainer();
  },

  // Create an region to show the emptyView
  _initEmptyRegion() {
    this.emptyRegion = new Region({ el: this.el })

    this.emptyRegion._parentView = this;
  },

  // Configured the initial events that the collection view binds to.
  _initialEvents() {
    this.listenTo(this.collection, {
      'sort': this._onCollectionSort,
      'reset': this._onCollectionReset,
      'update': this._onCollectionUpdate
    });
  },

  // Internal method. This checks for any changes in the order of the collection.
  // If the index of any view doesn't match, it will re-sort.
  _onCollectionSort() {
    if (!this.sortWithCollection) {
      return;
    }

    // If the data is changing we will handle the sort later
    if (this.collection.length !== this.children.length) {
      return;
    }

    // Additional check if the data is changing
    const hasAddedModel = this.collection.some(model => {
      return !this.children.findByModel(model);
    });

    if (hasAddedModel) {
      return;
    }

    // If the only thing happening here is sorting, sort.
    this.sort();
  },

  _onCollectionReset() {
    this.render();
  },

  // Handle collection update model additions and  removals
  _onCollectionUpdate(collection, options) {
    const changes = options.changes;

    // Remove first since it'll be a shorter array lookup.
    const removedViews = this._removeChildModels(changes.removed);

    this._addChildModels(changes.added);

    this._detachChildren(removedViews);

    this._showChildren();

    // Destroy removed child views after all of the render is complete
    this._removeChildViews(removedViews);
  },

  _removeChildModels(models) {
    return _.map(models, _.bind(this._removeChildModel, this));
  },

  _removeChildModel(model) {
    const view = this.children.findByModel(model);

    this._removeChild(view);

    return view;
  },

  _removeChild(view) {
    this.triggerMethod('before:remove:child', this, view);

    this.children._remove(view);

    this.triggerMethod('remove:child', this, view);
  },

  // Added views are returned for consistency with _removeChildModels
  _addChildModels(models) {
    return _.map(models, _.bind(this._addChildModel, this));
  },

  _addChildModel(model) {
    const view = this._createChildView(model);

    this._addChild(view);

    return view;
  },

  _createChildView(model) {
    const ChildView = this._getChildView(model);
    const childViewOptions = this._getChildViewOptions(model);
    const view = this.buildChildView(model, ChildView, childViewOptions);

    return view;
  },

  _addChild(view, index) {
    this.triggerMethod('before:add:child', this, view);

    this._setupChildView(view);
    this.children._add(view, index);

    this.triggerMethod('add:child', this, view);
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

  _getChildViewOptions(child) {
    if (_.isFunction(this.childViewOptions)) {
      return this.childViewOptions(child);
    }

    return this.childViewOptions;
  },

  // Build a `childView` for a model in the collection.
  // Override to customize the build
  buildChildView(child, ChildViewClass, childViewOptions) {
    const options = _.extend({model: child}, childViewOptions);
    return new ChildViewClass(options);
  },

  _setupChildView(view) {
    monitorViewEvents(view);

    // We need to listen for if a view is destroyed in a way other
    // than through the CollectionView.
    // If this happens we need to remove the reference to the view
    // since once a view has been destroyed we can not reuse it.
    view.on('destroy', this.removeChildView, this);

    // set up the child view event forwarding
    this._proxyChildViewEvents(view);
  },

  // used by ViewMixin's `_childViewEventHandler`
  _getImmediateChildren() {
    return this.children._views;
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

  // Render children views.
  render() {
    if (this._isDestroyed) { return this; }
    this.triggerMethod('before:render', this);

    this._destroyChildren();

    // After all children have been destroyed re-init the container
    this.children._init();

    if (this.collection) {
      this._addChildModels(this.collection.models);
    }

    this._showChildren();

    this._isRendered = true;

    this.triggerMethod('render', this);
    return this;
  },

  // Sorts the children then filters and renders the results.
  sort() {
    if (this._isDestroyed) { return this; }

    if (!this.children.length) { return this; }

    this._showChildren();

    return this;
  },

  _showChildren() {
    if (this.isEmpty()) {
      this._showEmptyView();
      return;
    }

    this._sortChildren();

    this.filter();
  },

  // Returns true if the collectionView is considered empty.
  // This is called twice during a render. Once to check the data,
  // and again when views are filtered. Override this function to
  // customize what empty means.
  isEmpty(allViewsFiltered) {
    return allViewsFiltered || !this.children.length;
  },

  _showEmptyView() {
    const EmptyView = this._getEmptyView();

    if (!EmptyView) {
      return;
    }

    const options = this._getEmptyViewOptions();

    this.emptyRegion.show(new EmptyView(options));
  },

  // Retrieve the empty view class
  _getEmptyView() {
    const emptyView = this.emptyView;

    if (!emptyView) { return; }

    return this._getView(emptyView);
  },

  // Remove the emptyView
  _destroyEmptyView() {

    // Only empty if a view is show so the region
    // doesn't detach any other unrelated HTML
    if (this.emptyRegion.hasView()) {
      this.emptyRegion.empty();
    }
  },

  //
  _getEmptyViewOptions() {
    const emptyViewOptions = this.emptyViewOptions || this.childViewOptions;

    if (_.isFunction(emptyViewOptions)) {
      return emptyViewOptions.call(this);
    }

    return emptyViewOptions;
  },

  // Sorts views by viewComparator and sets the children to the new order
  _sortChildren() {
    this.triggerMethod('before:sort', this);

    let viewComparator = this.getComparator();

    if (_.isFunction(viewComparator)) {
      // Must use native bind to preserve length
      viewComparator = viewComparator.bind(this);
    }

    this.children._sort(viewComparator);

    this.triggerMethod('sort', this);
  },

  // Sets the view's `viewComparator` and applies the sort if the view is ready.
  // To prevent the render pass `{ preventRender: true }` as the 2nd argument.
  setComparator(comparator, {preventRender} = {}) {
    const comparatorChanged = this.viewComparator !== comparator;
    const shouldSort = comparatorChanged && !preventRender;

    this.viewComparator = comparator;

    if (shouldSort) {
      this.sort();
    }

    return this;
  },

  // Clears the `viewComparator` and follows the same rules for rendering as `setComparator`.
  removeComparator(options) {
    return this.setComparator(null, options);
  },

  // If viewComparator is overriden it will be returned here.
  // Additionally override this function to provide custom
  // viewComparator logic
  getComparator() {
    return this.viewComparator || this._viewComparator;
  },

  // Default internal view comparator that order the views by
  // the order of the collection
  _viewComparator(view) {
    if (!this.collection) { return; }
    return this.collection.indexOf(view.model);
  },

  // This method re-filters the children views and re-renders the results
  filter() {
    if (this._isDestroyed) { return this; }

    if (!this.children.length) { return this; }

    const filteredViews = this._filterChildren();

    this._renderChildren(filteredViews);

    return this;
  },

  _filterChildren() {
    const viewFilter = this._getFilter();

    if (!viewFilter) {
      return this.children._views;
    }

    this.triggerMethod('before:filter', this);

    const filteredViews = this.children.partition(_.bind(viewFilter, this));

    this._detachChildren(filteredViews[1]);

    this.triggerMethod('filter', this);

    return filteredViews[0];
  },

  // This method returns a function for the viewFilter
  _getFilter() {
    const viewFilter = this.getFilter();

    if (!viewFilter) { return false; }

    if (_.isFunction(viewFilter)) {
      return viewFilter;
    }

    // Support filter predicates `{ fooFlag: true }`
    if (_.isObject(viewFilter)) {
      const matcher = _.matches(viewFilter);
      return function(view) {
        return matcher(view.model && view.model.attributes);
      };
    }

    // Filter by model attribute
    if (_.isString(viewFilter)) {
      return function(view) {
        return view.model && view.model.get(viewFilter);
      };
    }

    throw new MarionetteError({
      name: 'InvalidViewFilterError',
      message: '"viewFilter" must be a function, predicate object literal, a string indicating a model attribute, or falsy'
    });
  },

  // Override this function to provide custom
  // viewFilter logic
  getFilter() {
    return this.viewFilter;
  },

  // Sets the view's `viewFilter` and applies the filter if the view is ready.
  // To prevent the render pass `{ preventRender: true }` as the 2nd argument.
  setFilter(filter, {preventRender} = {}) {
    const filterChanged = this.viewFilter !== filter;
    const shouldRender = filterChanged && !preventRender;

    this.viewFilter = filter;

    if (shouldRender) {
      this.filter();
    }

    return this;
  },

  // Clears the `viewFilter` and follows the same rules for rendering as `setFilter`.
  removeFilter(options) {
    return this.setFilter(null, options);
  },

  _detachChildren(detachingViews) {
    _.each(detachingViews, _.bind(this._detachChildView, this));
  },

  _detachChildView(view) {
    const shouldTriggerDetach = !!view._isAttached;
    if (shouldTriggerDetach) {
      triggerMethodOn(view, 'before:detach', view);
    }

    this.detachHtml(view);

    if (shouldTriggerDetach) {
      view._isAttached = false;
      triggerMethodOn(view, 'detach', view);
    }
  },

  // Override this method to change how the collectionView detaches a child view
  detachHtml(view) {
    this.detachEl(view.el);
  },

  _renderChildren(views) {
    if (this.isEmpty(!views.length)) {
      this._showEmptyView();
      return;
    }

    this._destroyEmptyView();

    this.triggerMethod('before:render:children', this, views);

    const els = this._getBuffer(views);

    this._attachChildren(els, views);

    this.triggerMethod('render:children', this, views);
  },

  _attachChildren(els, views) {
    const shouldTriggerAttach = !!this._isAttached;

    views = shouldTriggerAttach ? views : [];

    _.each(views, view => {
      if (view._isAttached) { return; }
      triggerMethodOn(view, 'before:attach', view);
    });

    this.attachHtml(this, els);

    _.each(views, view => {
      if (view._isAttached) { return; }
      view._isAttached = true;
      triggerMethodOn(view, 'attach', view);
    });
  },

  // Renders each view in children and creates a fragment buffer from them
  _getBuffer(views) {
    const elBuffer = this.createBuffer();

    _.each(views, view => {
      this._renderChildView(view);
      this.appendChildren(elBuffer, view.el);
    });

    return elBuffer;
  },

  _renderChildView(view) {
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

  // Override this method to do something other than `.append`.
  // You can attach any HTML at this point including the els.
  attachHtml(collectionView, els) {
    this.appendChildren(collectionView.el, els);
  },

  // Render the child's view and add it to the HTML for the collection view at a given index, based on the current sort
  addChildView(view, index) {
    if (!view || view._isDestroyed) {
      return view;
    }

    this._addChild(view, index);
    this._showChildren();

    return view;
  },

  // Detach a view from the children.  Best used when adding a
  // childView from `addChildView`
  detachChildView(view) {
    this.removeChildView(view, { shouldDetach: true });

    return view;
  },

  // Remove the child view and destroy it.  Best used when adding a
  // childView from `addChildView`
  // The options argument is for internal use only
  removeChildView(view, options) {
    if (!view) {
      return view;
    }

    this._removeChildView(view, options);

    this._removeChild(view);

    if (this.isEmpty()) {
      this._showEmptyView();
    }

    return view;
  },

  _removeChildViews(views) {
    _.each(views, _.bind(this._removeChildView, this));
  },

  _removeChildView(view, {shouldDetach} = {}) {
    view.off('destroy', this.removeChildView, this);

    if (shouldDetach) {
      this._detachChildView(view);
    } else {
      this._destroyChildView(view);
    }

    this.stopListening(view);
  },

  _destroyChildView(view) {
    if (view._isDestroyed) {
      return;
    }

    if (view.destroy) {
      view.destroy();
    } else {
      destroyBackboneView(view);
    }
  },

  // called by ViewMixin destroy
  _removeChildren() {
    this._destroyChildren();
    this.emptyRegion.destroy();
  },

  // Destroy the child views that this collection view is holding on to, if any
  _destroyChildren() {
    if (!this.children || !this.children.length) {
      return;
    }

    this.triggerMethod('before:destroy:children', this);
    this.children.each(_.bind(this._removeChildView, this));
    this.triggerMethod('destroy:children', this);
  }
});

_.extend(CollectionView.prototype, ViewMixin);

export default CollectionView;
