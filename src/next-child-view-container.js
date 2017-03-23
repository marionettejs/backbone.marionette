import _ from 'underscore';
import emulateCollection from './utils/emulate-collection';

// Provide a container to store, retrieve and
// shut down child views.
const Container = function() {
  this._init();
};

emulateCollection(Container.prototype, '_views');

function stringComparator(comparator, view) {
  return view.model && view.model.get(comparator);
}

// Container Methods
// -----------------

_.extend(Container.prototype, {

  // Initializes an empty container
  _init() {
    this._views = [];
    this._viewsByCid = {};
    this._indexByModel = {};
    this._updateLength();
  },

  // Add a view to this container. Stores the view
  // by `cid` and makes it searchable by the model
  // cid (and model itself). Additionally it stores
  // the view by index in the _views array
  _add(view, index = this._views.length) {
    const viewCid = view.cid;

    // store the view
    this._viewsByCid[viewCid] = view;

    // index it by model
    if (view.model) {
      this._indexByModel[view.model.cid] = viewCid;
    }

    // add to end by default
    this._views.splice(index, 0, view);

    this._updateLength();
  },

  // Sort (mutate) and return the array of the child views.
  _sort(comparator) {
    if (typeof comparator === 'string') {
      comparator = _.partial(stringComparator, comparator);
      return this._sortBy(comparator);
    }

    if (comparator.length === 1) {
      return this._sortBy(comparator);
    }

    return this._views.sort(comparator);
  },

  // Makes `_.sortBy` mutate the array to match `this._views.sort`
  _sortBy(comparator) {
    const sortedViews = _.sortBy(this._views, comparator);

    this._set(sortedViews);

    return sortedViews;
  },

  // Replace array contents without overwriting the reference.
  _set(views) {
    this._views.length = 0;

    this._views.push.apply(this._views, views.slice(0));

    this._updateLength();
  },

  // Find a view by the model that was attached to it.
  // Uses the model's `cid` to find it.
  findByModel(model) {
    return this.findByModelCid(model.cid);
  },

  // Find a view by the `cid` of the model that was attached to it.
  // Uses the model's `cid` to find the view `cid` and
  // retrieve the view using it.
  findByModelCid(modelCid) {
    const viewCid = this._indexByModel[modelCid];
    return this.findByCid(viewCid);
  },

  // Find a view by index.
  findByIndex(index) {
    return this._views[index];
  },

  // Find the index of a view instance
  findIndexByView(view) {
    return this._views.indexOf(view);
  },

  // Retrieve a view by its `cid` directly
  findByCid(cid) {
    return this._viewsByCid[cid];
  },

  // Remove a view and clean up index references.
  _remove(view) {
    if (!this._viewsByCid[view.cid]) {
      return;
    }

    // delete model index
    if (view.model) {
      delete this._indexByModel[view.model.cid];
    }

    // remove the view from the container
    delete this._viewsByCid[view.cid];

    const index = this.findIndexByView(view);
    this._views.splice(index, 1);

    this._updateLength();
  },

  // Update the `.length` attribute on this container
  _updateLength() {
    this.length = this._views.length;
  }
});

export default Container;
