// LayoutView
// ----------

// Used for managing application layoutViews, nested layoutViews and
// multiple regions within an application or sub-application.
//
// A specialized view type that renders an area of HTML and then
// attaches `Region` instances to the specified `regions`.
// Used for composite view management and sub-application areas.
Marionette.LayoutView = Marionette.ItemView.extend({
  regionType: Marionette.Region,

  // Ensure the regions are available when the `initialize` method
  // is called.
  constructor: function(options) {
    options = options || {};

    this._firstRender = true;
    this._initializeRegions(options);

    Marionette.ItemView.prototype.constructor.call(this, options);
  },

  // LayoutView's render will use the existing region objects the
  // first time it is called. Subsequent calls will destroy the
  // views that the regions are showing and then reset the `el`
  // for the regions to the newly rendered DOM elements.
  render: function() {
    this._ensureViewIsIntact();

    if (this._firstRender) {
      // if this is the first render, don't do anything to
      // reset the regions
      this._firstRender = false;
    } else {
      // If this is not the first render call, then we need to
      // re-initialize the `el` for each region
      this._reInitializeRegions();
    }

    return Marionette.ItemView.prototype.render.apply(this, arguments);
  },

  // Handle destroying regions, and then destroy the view itself.
  destroy: function() {
    if (this.isDestroyed) { return; }

    this.regionManager.destroy();
    Marionette.ItemView.prototype.destroy.apply(this, arguments);
  },

  // Add a single region, by name, to the layoutView
  addRegion: function(name, definition) {
    var regions = {};
    regions[name] = definition;
    return this._buildRegions(regions)[name];
  },

  // Add multiple regions as a {name: definition, name2: def2} object literal
  addRegions: function(regions) {
    this.regions = _.extend({}, this.regions, regions);
    return this._buildRegions(regions);
  },

  // Remove a single region from the LayoutView, by name
  removeRegion: function(name) {
    delete this.regions[name];
    return this.regionManager.removeRegion(name);
  },

  // Provides alternative access to regions
  // Accepts the region name
  // getRegion('main')
  getRegion: function(region) {
    return this.regionManager.get(region);
  },

  // internal method to build regions
  _buildRegions: function(regions) {
    var that = this;

    var defaults = {
      regionType: Marionette.getOption(this, 'regionType'),
      parentEl: function() { return that.$el; }
    };

    return this.regionManager.addRegions(regions, defaults);
  },

  // Internal method to initialize the regions that have been defined in a
  // `regions` attribute on this layoutView.
  _initializeRegions: function(options) {
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
  _reInitializeRegions: function() {
    this.regionManager.destroyRegions();
    this.regionManager.each(function(region) {
      region.reset();
    });
  },

  // Internal method to initialize the region manager
  // and all regions in it
  _initRegionManager: function() {
    this.regionManager = new Marionette.RegionManager();

    this.listenTo(this.regionManager, 'region:add', function(name, region) {
      this[name] = region;
      this.trigger('region:add', name, region);
    });

    this.listenTo(this.regionManager, 'region:remove', function(name, region) {
      delete this[name];
      this.trigger('region:remove', name, region);
    });
  }
});
