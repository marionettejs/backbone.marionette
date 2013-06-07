// Layout
// ------

// Used for managing application layouts, nested layouts and
// multiple regions within an application or sub-application.
//
// A specialized view type that renders an area of HTML and then
// attaches `Region` instances to the specified `regions`.
// Used for composite view management and sub-application areas.
Marionette.Layout = Marionette.ItemView.extend({
  regionType: Marionette.Region,
  
  // Ensure the regions are available when the `initialize` method
  // is called.
  constructor: function (options) {
    options = options || {};

    this._firstRender = true;
    this._initializeRegions(options);
    
    Marionette.ItemView.call(this, options);
  },

  // Layout's render will use the existing region objects the
  // first time it is called. Subsequent calls will close the
  // views that the regions are showing and then reset the `el`
  // for the regions to the newly rendered DOM elements.
  render: function(){

    if (this.isClosed){
      // a previously closed layout means we need to 
      // completely re-initialize the regions
      this._initializeRegions();
    }
    if (this._firstRender) {
      // if this is the first render, don't do anything to
      // reset the regions
      this._firstRender = false;
    } else if (!this.isClosed){
      // If this is not the first render call, then we need to 
      // re-initializing the `el` for each region
      this._reInitializeRegions();
    }

    var args = Array.prototype.slice.apply(arguments);
    var result = Marionette.ItemView.prototype.render.apply(this, args);

    return result;
  },

  // Handle closing regions, and then close the view itself.
  close: function () {
    if (this.isClosed){ return; }
    this.regionManager.close();
    var args = Array.prototype.slice.apply(arguments);
    Marionette.ItemView.prototype.close.apply(this, args);
  },

  // Add a single region, by name, to the layout
  addRegion: function(name, definition){
    var regions = {};
    regions[name] = definition;
    return this.addRegions(regions)[name];
  },

  // Add multiple regions as a {name: definition, name2: def2} object literal
  addRegions: function(regions){
    this.regions = _.extend(this.regions || {}, regions);
    return this._buildRegions(regions);
  },

  // Remove a single region from the Layout, by name
  removeRegion: function(name){
    return this.regionManager.removeRegion(name);
  },

  // internal method to build regions
  _buildRegions: function(regions){
    var that = this;

    var defaults = {
      parentEl: function(){ return that.$el; }
    };

    return this.regionManager.addRegions(regions, defaults);
  },

  // Internal method to initialize the regions that have been defined in a
  // `regions` attribute on this layout. 
  _initializeRegions: function (options) {
    var regions;
    this._initRegionManager();

    if (_.isFunction(this.regions)) {
      regions = this.regions(options);
    } else {
      regions = this.regions || {};
    }

    this.addRegions(regions);
  },

  // Internal method to re-initialize all of the regions by updating the `el` that
  // they point to
  _reInitializeRegions: function(){
    this.regionManager.closeRegions();
    this.regionManager.each(function(region){
      region.reset();
    });
  },

  // Internal method to initialize the region manager
  // and all regions in it
  _initRegionManager: function(){
    this.regionManager = new Marionette.RegionManager();

    this.listenTo(this.regionManager, "region:add", function(name, region){
      this[name] = region;
      this.trigger("region:add", name, region);
    });

    this.listenTo(this.regionManager, "region:remove", function(name, region){
      delete this[name];
      this.trigger("region:remove", name, region);
    });
  }
});
