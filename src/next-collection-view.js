// Collection View
// ---------------

import _                  from 'underscore';
import Backbone           from 'backbone';
import destroyBackboneView from './utils/destroy-backbone-view';
import isNodeAttached     from './common/is-node-attached';
import monitorViewEvents  from './common/monitor-view-events';
import { triggerMethodOn } from './common/trigger-method';
import ChildViewContainer from './next-child-view-container';
import MarionetteError    from './error';
import Region    from './region';
import ViewMixin          from './mixins/view';

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
  'filter',
  'modelEvents',
  'sortWithCollection',
  'triggers',
  'ui',
  'viewComparator'
];

// A view that iterates over a Backbone.Collection
// and renders an individual child view for each model.
const CollectionView = Backbone.View.extend({
  // flag for maintaining the sorted order of the collection
  sortWithCollection: true,

  // constructor
  // option to pass `{sort: false}` to prevent the `CollectionView` from
  // maintaining the sorted order of the collection.
  // This will fallback onto appending childView's to the end.
  //
  // option to pass `{viewComparator: compFunction()}` to allow the `CollectionView`
  // to use a custom sort order for the collection.
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
  },

  // Internal method to set up the `children` object for storing all of the child views
  _initChildViewStorage() {
    this.children = new ChildViewContainer();
  },

  // Create an region to show the emptyView
  _initEmptyRegion() {
    this.emptyRegion = new Region({ el: this.el })

    this.emptyRegion._parent = this;
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
  // If the index of any view doesn't match, it will render.
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

  // Handle collection update model removals
  _onCollectionUpdate(collection, options) {
    const changes = options.changes;

    // Remove first since it'll be a shorter array lookup.
    const removedViews = this._removeChildModels(changes.removed);

    this._addChildModels(changes.added);

    // Removed views are passed to showChildren for detachment
    this._showChildren(removedViews);

    // Destroy removed child views after all of the render is complete
    this._removeChildViews(removedViews)
  },

  _removeChildModels(models) {
    return _.map(models, _.bind(this._removeChildModel, this));
  },

  _removeChildModel(model) {
    const view = this.children.findByModel(model);

    this.children._remove(view);

    return view;
  },

  // Added views are returned for consistency with _removeChildModels
  _addChildModels(models) {
    return _.map(models, _.bind(this._addChildModel, this));
  },

  _addChildModel(model) {
    const view = this._createChildView(model);

    this._setupChildView(view);
    this.children._add(view);

    return view;
  },

  _createChildView(model) {
    const ChildView = this._getChildView(model);
    const childViewOptions = this._getChildViewOptions(model);
    const view = this.buildChildView(model, ChildView, childViewOptions);

    return view;
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

    // set up the child view event forwarding
    this.listenTo(view, 'all', this._childViewEventHandler);

    // We need to listen for if a view is destroyed in a way other
    // than through the CollectionView.
    // If this happens we need to remove the reference to the view
    // since once a view has been destroyed we can not reuse it.
    view.on('destroy', this.removeChildView, this);

    view._parent = this;
  },

  // used by `_childViewEventHandler`
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
    this._ensureViewIsIntact();
    this.triggerMethod('before:render', this);

    this._destroyChildren();

    // After all children have been destroyed re-init the container
    this._initChildViewStorage();

    this._addChildModels(this.collection.models);

    this._showChildren();

    this._isRendered = true;

    this.triggerMethod('render', this);
    return this;
  },

  sort() {
    this._showChildren();
    return this;
  },

  _showChildren(removedViews = []) {
    if (this.isEmpty()) {
      this._showEmptyView();
      return;
    }

    this._destroyEmptyView();

    this.triggerMethod('before:sort', this);

    this._sortChildren();

    const filteredViews = this._filterChildren(removedViews);

    this._detachChildren(filteredViews.detaching);

    // Check if all views have been filtered out
    if (this.isEmpty(!filteredViews.attaching.length)) {
      this._showEmptyView()
    } else {
      this._renderChildren(filteredViews.attaching);
    }

    // Sort event reflects the DOM sort and not the children sort
    this.triggerMethod('sort', this);
  },

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
    const viewComparator = this.getViewComparator();

    if(_.isFunction(viewComparator)) {
      viewComparator = _.bind(viewComparator, this);
    }

    this.children._sort(viewComparator);

  },

  // If viewComparator is overriden it will be returned here.
  // Additionally override this function to provide custom
  // viewComparator logic
  getViewComparator() {
    return this.viewComparator || this._viewComparator;
  },

  // Default internal view comparator that order the views by
  // the order of the collection
  _viewComparator(view) {
    return this.collection.indexOf(view.model);
  },

  setFilter(filter, {preventRender} = {}) {
    const canBeRendered = this._isRendered && !this._isDestroyed;
    const filterChanged = this.filter !== filter;
    const shouldRender = canBeRendered && filterChanged && !preventRender;

    this.filter = filter;

    if (shouldRender) {
      this._showChildren();
    }

    return this;
  },

  removeFilter(options) {
    return this.setFilter(null, options);
  },

  _filterChildren(removedViews) {
    const filteredViews = {
      attaching: [],
      detaching: removedViews
    };

    if (!_.isFunction(this.filter)) {
      filteredViews.attaching = this.children._views;

      return filteredViews;
    }

    const filterReducer = _.bind(this._filterReducer, this);

    return this.children.reduce(filterReducer, filteredViews);
  },

  _filterReducer(filteredViews, view, index) {
    const shouldAttach = this.filter.call(this, view, index, this.collection);

    if (shouldAttach) {
      filteredViews.attaching.push(view);
    } else {
      filteredViews.detaching.push(view);
    }

    return filteredViews;
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
    view.$el.detach();
  },

  _renderChildren(views) {
    this.triggerMethod('before:render:children', this);

    const els = this._getBuffer(views);

    this._attachChildren(els, views);

    this.triggerMethod('render:children', this);
  },

  _attachChildren(els, views) {
    const shouldTriggerAttach = !!this._isAttached;

    views = shouldTriggerAttach ? views : [];

    _.each(views, view => {
      if (view._isAttached) { return }
      triggerMethodOn(view, 'before:attach', view);
    });

    this.attachHtml(this, els);

    _.each(views, view => {
      if (view._isAttached) { return }
      view._isAttached = true;
      triggerMethodOn(view, 'attach', view);
    });
  },

  // Renders each view in children and creates a fragment buffer from them
  _getBuffer(views) {
    const elBuffer = document.createDocumentFragment();

    _.each(views, view => {
      this._renderChildView(view);
      elBuffer.appendChild(view.el);
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
  attachHtml(collectionView, els) {
    collectionView.$el.append(els);
  },

  // Render the child's view and add it to the HTML for the collection view at a given index, based on the current sort
  addChildView(view, index) {
    this._setupChildView(view);
    this.children._add(view, index);
    this._showChildren();

    return view;
  },

  // Detach a view from the children.  Best used when adding a
  // childView from `addChildView`
  detachChildView(view) {
    if (!view || view._isDestroyed) {
      return view;
    }

    this._removeChildView(view, true);

    return view;
  },

  // Remove the child view and destroy it.  Best used when adding a
  // childView from `addChildView`
  removeChildView(view) {
    if (!view) {
      return view;
    }

    this._removeChildView(view);

    this.children._remove(view);

    if (this.isEmpty()) {
      this._showEmptyView();
    }

    return view;
  },

  _removeChildViews(views) {
    _.each(views, _.bind(this._removeChildView, this));
  },

  _removeChildView(view, shouldDetach) {
    view.off('destroy', this.removeChildView, this);

    if (shouldDetach) {
      this._detachChildView(view);
    } else {
      this._destroyChildView(view);
    }

    delete view._parent;
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
