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
  
  // Ensure the regions are avialable when the `initialize` method
  // is called.
  constructor: function (options) {
    this._firstRender = true;
    this.initializeRegions(options || {});
    
    var args = Array.prototype.slice.apply(arguments);
    Marionette.ItemView.apply(this, args);
  },

  // Layout's render will use the existing region objects the
  // first time it is called. Subsequent calls will close the
  // views that the regions are showing and then reset the `el`
  // for the regions to the newly rendered DOM elements.
  render: function(){

    if (this._firstRender){
      // if this is the first render, don't do anything to
      // reset the regions
      this._firstRender = false;
    } else {
      // If this is not the first render call, then we need to 
      // re-initializing the `el` for each region
      this.closeRegions();
      this.reInitializeRegions();
    }

    var args = Array.prototype.slice.apply(arguments);
    var result = Marionette.ItemView.prototype.render.apply(this, args);

    return result;
  },

  // Handle closing regions, and then close the view itself.
  close: function () {
    if (this.isClosed){ return; }

    this.closeRegions();
    this.destroyRegions();

    var args = Array.prototype.slice.apply(arguments);
    Marionette.ItemView.prototype.close.apply(this, args);
  },

  // Initialize the regions that have been defined in a
  // `regions` attribute on this layout. The key of the
  // hash becomes an attribute on the layout object directly.
  // For example: `regions: { menu: ".menu-container" }`
  // will product a `layout.menu` object which is a region
  // that controls the `.menu-container` DOM element.
  initializeRegions: function (options) {
    if (!this.regionManagers){
      this.regionManagers = {};
    }

    var that = this;
    
    var regions;
    if (_.isFunction(this.regions)) {
      regions = this.regions(options);
    } else {
      regions = this.regions || {};
    }
    _.each(regions, function (region, name) {

      var regionManager = Marionette.Region.buildRegion(region, that.regionType);
      regionManager.getEl = function(selector){
        return that.$(selector);
      };

      that.regionManagers[name] = regionManager;
      that[name] = regionManager;
    });

  },

  // Re-initialize all of the regions by updating the `el` that
  // they point to
  reInitializeRegions: function(){
    if (this.regionManagers && _.size(this.regionManagers)===0){
      this.initializeRegions(this.options || {});
    } else {
      _.each(this.regionManagers, function(region){
        region.reset();
      });
    }
  },

  // Close all of the regions that have been opened by
  // this layout. This method is called when the layout
  // itself is closed.
  closeRegions: function () {
    var that = this;
    _.each(this.regionManagers, function (manager, name) {
      manager.close();
    });
  },

  // Destroys all of the regions by removing references
  // from the Layout
  destroyRegions: function(){
    var that = this;
    _.each(this.regionManagers, function (manager, name) {
      delete that[name];
    });
    this.regionManagers = {};
  }
});

