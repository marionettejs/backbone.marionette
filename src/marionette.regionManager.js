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
    this._regions[name] = region;
    this.triggerMethod("region:add", name, region);
    return region;
  },

  // Get a region by name
  get: function(name){
    return this._regions[name];
  },

  // Remove a region by name
  remove: function(name){
    var region = this._regions[name];
    region.close();
    delete this._regions[name];
    this.triggerMethod("region:remove", name, region);
  }

});
