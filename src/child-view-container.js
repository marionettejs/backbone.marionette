import _ from 'underscore';
import emulateCollection from './utils/emulate-collection';

// Provide a container to store, retrieve and
// shut down child views.
const Container = function(views) {
  this._views = {};
  this._indexByModel = {};
  this._indexByCustom = {};
  this._updateLength();

  _.each(views, _.bind(this.add, this));
};

emulateCollection(Container.prototype, '_views');

// Container Methods
// -----------------

_.extend(Container.prototype, {

  // Add a view to this container. Stores the view
  // by `cid` and makes it searchable by the model
  // cid (and model itself). Optionally specify
  // a custom key to store an retrieve the view.
  add(view, customIndex) {
    return this._add(view, customIndex)._updateLength();
  },

  // To be used when avoiding call _updateLength
  // When you are done adding all your new views
  // call _updateLength
  _add(view, customIndex) {
    const viewCid = view.cid;

    // store the view
    this._views[viewCid] = view;

    // index it by model
    if (view.model) {
      this._indexByModel[view.model.cid] = viewCid;
    }

    // index by custom
    if (customIndex) {
      this._indexByCustom[customIndex] = viewCid;
    }

    return this;
  },

  // Find a view by the model that was attached to
  // it. Uses the model's `cid` to find it.
  findByModel(model) {
    return this.findByModelCid(model.cid);
  },

  // Find a view by the `cid` of the model that was attached to
  // it. Uses the model's `cid` to find the view `cid` and
  // retrieve the view using it.
  findByModelCid(modelCid) {
    const viewCid = this._indexByModel[modelCid];
    return this.findByCid(viewCid);
  },

  // Find a view by a custom indexer.
  findByCustom(index) {
    const viewCid = this._indexByCustom[index];
    return this.findByCid(viewCid);
  },

  // Find by index. This is not guaranteed to be a
  // stable index.
  findByIndex(index) {
    return _.values(this._views)[index];
  },

  // retrieve a view by its `cid` directly
  findByCid(cid) {
    return this._views[cid];
  },

  // Remove a view
  remove(view) {
    return this._remove(view)._updateLength();
  },

  // To be used when avoiding call _updateLength
  // When you are done adding all your new views
  // call _updateLength
  _remove(view) {
    const viewCid = view.cid;

    // delete model index
    if (view.model) {
      delete this._indexByModel[view.model.cid];
    }

    // delete custom index
    _.some(this._indexByCustom, _.bind(function(cid, key) {
      if (cid === viewCid) {
        delete this._indexByCustom[key];
        return true;
      }
    }, this));

    // remove the view from the container
    delete this._views[viewCid];

    return this;
  },

  // Update the `.length` attribute on this container
  _updateLength() {
    this.length = _.size(this._views);

    return this;
  }
});

export default Container;
