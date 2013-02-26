// Marionette.RegionManager
// ------------------------
//
// Manage one or more related `Marionette.Region` objects.
Marionette.RegionManager = Marionette.Controller.extend({

  constructor: function(options){
    this._regions = {};
    Marionette.Controller.prototype.constructor.call(this, options);
  },

  // Add an individual region to the region manager,
  // and return the region instance
  addRegion: function(name, definition){
    var region = Marionette.Region.buildRegion(definition, Marionette.Region);
    this._storeRegion(name, region);
    this.triggerMethod("region:add");
    return region;
  },

  // Get a region by name
  get: function(name){
    return this._regions[name];
  },

  // Internal method to store a region
  _storeRegion: function(name, region){
    this._regions[name] = region;
  }

});
