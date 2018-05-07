// Collection View
// ---------------

import _ from 'underscore';
import Backbone from 'backbone';
import MarionetteError from './utils/error';
import { renderView, destroyView } from './common/view';
import monitorViewEvents from './common/monitor-view-events';
import ChildViewContainer from './child-view-container';
import Region from './region';
import ViewMixin from './mixins/view';
import { setDomApi } from './config/dom';
import { setRenderer } from './config/renderer';

const classErrorName = 'CollectionViewError';

const ClassOptions = [
  'behaviors',
  'childView',
  'childViewContainer',
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
  'template',
  'templateContext',
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
    this._setOptions(options, ClassOptions);

    monitorViewEvents(this);

    this.once('render', this._initialEvents);

    // This children container isn't really used by a render, but it provides
    // the ability to check `this.children.length` prior to rendering
    // It also allows for cases where only addChildView is used
    this._initChildViewStorage();
    this._initBehaviors();

    Backbone.View.prototype.constructor.apply(this, arguments);

    // Init empty region
    this.getEmptyRegion();

    this.delegateEntityEvents();

    this._triggerEventOnBehaviors('initialize', this, options);
  },

  // Internal method to set up the `children` object for storing all of the child views
  _initChildViewStorage() {
    this.children = new ChildViewContainer();
  },

  // Create an region to show the emptyView
  getEmptyRegion() {
    if (this._emptyRegion && !this._emptyRegion.isDestroyed()) {
      return this._emptyRegion;
    }

    this._emptyRegion = new Region({ el: this.el, replaceElement: false });

    this._emptyRegion._parentView = this;

    return this._emptyRegion;
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
  _onCollectionSort(collection, { add, merge, remove }) {
    if (!this.sortWithCollection || this.viewComparator === false) {
      return;
    }

    // If the data is changing we will handle the sort later in `_onCollectionUpdate`
    if (add || remove || merge) {
      return;
    }

    // If the only thing happening here is sorting, sort.
    this.sort();
  },

  _onCollectionReset() {
    this._destroyChildren();

    this.children._init();

    this._addChildModels(this.collection.models);

    this._showChildren();
  },

  // Handle collection update model additions and  removals
  _onCollectionUpdate(collection, options) {
    const changes = options.changes;

    // Remove first since it'll be a shorter array lookup.
    const removedViews = changes.removed.length && this._removeChildModels(changes.removed);

    this._addedViews = changes.added.length && this._addChildModels(changes.added);

    this._detachChildren(removedViews);

    this._showChildren();

    // Destroy removed child views after all of the render is complete
    this._removeChildViews(removedViews);
  },

  _removeChildModels(models) {
    return _.reduce(models, (views, model) => {
      const removeView = this._removeChildModel(model);

      if (removeView) { views.push(removeView); }

      return views;
    }, []);
  },

  _removeChildModel(model) {
    const view = this.children.findByModel(model);

    if (view) { this._removeChild(view); }

    return view;
  },

  _removeChild(view) {
    this.triggerMethod('before:remove:child', this, view);

    this.children._remove(view);

    this.triggerMethod('remove:child', this, view);
  },

  // Added views are returned for consistency with _removeChildModels
  _addChildModels(models) {
    return _.map(models, this._addChildModel.bind(this));
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
        name: classErrorName,
        message: 'A "childView" must be specified',
        url: 'marionette.collectionview.html#collectionviews-childview'
      });
    }

    childView = this._getView(childView, child);

    if (!childView) {
      throw new MarionetteError({
        name: classErrorName,
        message: '"childView" must be a view class or a function that returns a view class',
        url: 'marionette.collectionview.html#collectionviews-childview'
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
    Backbone.View.prototype.setElement.apply(this, arguments);

    this._isAttached = this.Dom.hasEl(document.documentElement, this.el);

    return this;
  },

  // Render children views.
  render() {
    if (this._isDestroyed) { return this; }

    this._destroyChildren();

    // After all children have been destroyed re-init the container
    this.children._init();

    //this line was before 281: this._destroyChildren();
    //so, adding child views in before:render hook was useless
    //now its possible, because children container is ready
    this.triggerMethod('before:render', this);

    if (this.collection) {
      this._addChildModels(this.collection.models);
    }

    const template = this.getTemplate();

    if (template) {
      this._renderTemplate(template);
      this.bindUIElements();
    }
    this._getChildViewContainer();
    this._showChildren();

    this._isRendered = true;

    this.triggerMethod('render', this);
    return this;
  },

  // Get a container within the template to add the children within
  _getChildViewContainer() {
    const childViewContainer = _.result(this, 'childViewContainer');
    this.$container = childViewContainer ? this.$(childViewContainer) : this.$el;

    if (!this.$container.length) {
      throw new MarionetteError({
        name: classErrorName,
        message: `The specified "childViewContainer" was not found: ${childViewContainer}`,
        url: 'marionette.collectionview.html#collectionviews-childviewcontainer'
      });
    }
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

    const emptyRegion = this.getEmptyRegion();

    emptyRegion.show(new EmptyView(options));
  },

  // Retrieve the empty view class
  _getEmptyView() {
    const emptyView = this.emptyView;

    if (!emptyView) { return; }

    return this._getView(emptyView);
  },

  // Remove the emptyView
  _destroyEmptyView() {
    const emptyRegion = this.getEmptyRegion();
    // Only empty if a view is show so the region
    // doesn't detach any other unrelated HTML
    if (emptyRegion.hasView()) {
      emptyRegion.empty();
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
    let viewComparator = this.getComparator();

    if (!viewComparator) { return; }

    // If children are sorted prevent added to end perf
    delete this._addedViews;

    this.triggerMethod('before:sort', this);

    this.children._sort(viewComparator, this);

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
    if (this.viewComparator) { return this.viewComparator }

    if (!this.sortWithCollection || this.viewComparator === false || !this.collection) {
      return false;
    }

    return this._viewComparator;
  },

  // Default internal view comparator that order the views by
  // the order of the collection
  _viewComparator(view) {
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
    const addedViews = this._addedViews;

    delete this._addedViews;

    if (!viewFilter) {
      if (addedViews) { return addedViews; }

      return this.children._views;
    }

    this.triggerMethod('before:filter', this);

    const attachViews = [];
    const detachViews = [];

    _.each(this.children._views, (view, key, children) => {
      (viewFilter.call(this, view, key, children) ? attachViews : detachViews).push(view);
    });

    this._detachChildren(detachViews);

    this.triggerMethod('filter', this, attachViews, detachViews);

    return attachViews;
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
      name: classErrorName,
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
    _.each(detachingViews, this._detachChildView.bind(this));
  },

  _detachChildView(view) {
    const shouldTriggerDetach = view._isAttached && this.monitorViewEvents !== false;
    if (shouldTriggerDetach) {
      view.triggerMethod('before:detach', view);
    }

    this.detachHtml(view);

    if (shouldTriggerDetach) {
      view._isAttached = false;
      view.triggerMethod('detach', view);
    }
  },

  // Override this method to change how the collectionView detaches a child view
  detachHtml(view) {
    this.Dom.detachEl(view.el, view.$el);
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
    const shouldTriggerAttach = this._isAttached && this.monitorViewEvents !== false;

    views = shouldTriggerAttach ? views : [];

    _.each(views, view => {
      if (view._isAttached) { return; }
      view.triggerMethod('before:attach', view);
    });

    this.attachHtml(els);

    _.each(views, view => {
      if (view._isAttached) { return; }
      view._isAttached = true;
      view.triggerMethod('attach', view);
    });
  },

  // Renders each view in children and creates a fragment buffer from them
  _getBuffer(views) {
    const elBuffer = this.Dom.createBuffer();

    _.each(views, view => {
      renderView(view);
      this.Dom.appendContents(elBuffer, view.el, {_$contents: view.$el});
    });

    return elBuffer;
  },

  // Override this method to do something other than `.append`.
  // You can attach any HTML at this point including the els.
  attachHtml(els) {
    this.Dom.appendContents(this.$container[0], els, {_$el: this.$container});
  },

  swapChildViews(view1, view2) {
    if (!this.children.hasView(view1) || !this.children.hasView(view2)) {
      throw new MarionetteError({
        name: classErrorName,
        message: 'Both views must be children of the collection view to swap.',
        url: 'marionette.collectionviewadvanced.html#collectionviews-swapchildviews'
      });
    }

    this.children._swap(view1, view2);
    this.Dom.swapEl(view1.el, view2.el);

    // If the views are not filtered the same, refilter
    if (this.Dom.hasEl(this.el, view1.el) !== this.Dom.hasEl(this.el, view2.el)) {
      this.filter();
    }

    return this;
  },

  addChildViews(views, opts = {}) {
    if (!_.isArray(views)) {
      return;
    }

    _.each(views, (view, index) => this.addChildView(view, (opts.index == null ? null : opts.index + index), false));

    if (this.isRendered() && opts.shouldTriggerShow !== false) {
      this._showChildren();
    }
  },

  // Render the child's view and add it to the HTML for the collection view at a given index, based on the current sort
  addChildView(view, index, shouldTriggerShow = true) {
    if (!view || view._isDestroyed) {
      return view;
    }

    // Only cache views if added to the end
    if (index == null || index >= this.children.length) {
      this._addedViews || (this._addedViews = []);
      this._addedViews.push(view);
    }
    this._addChild(view, index);

    if (this.isRendered() && shouldTriggerShow !== false) {
      this._showChildren();
    }

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
    _.each(views, this._removeChildView.bind(this));
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

    const shouldDisableEvents = this.monitorViewEvents === false;
    destroyView(view, shouldDisableEvents);
  },

  // called by ViewMixin destroy
  _removeChildren() {
    this._destroyChildren();
    const emptyRegion = this.getEmptyRegion();
    emptyRegion.destroy();
    delete this._addedViews;
  },

  // Destroy the child views that this collection view is holding on to, if any
  _destroyChildren() {
    if (!this.children || !this.children.length) {
      return;
    }

    this.triggerMethod('before:destroy:children', this);
    if (this.monitorViewEvents === false) {
      this.Dom.detachContents(this.el, this.$el);
    }
    _.each(this.children._views, this._removeChildView.bind(this));
    this.triggerMethod('destroy:children', this);
  }
}, {
  setDomApi,
  setRenderer
});

_.extend(CollectionView.prototype, ViewMixin);

export default CollectionView;
