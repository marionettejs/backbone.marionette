// LayoutView
// ----------

// Used for managing application layoutViews, nested layoutViews and
// multiple regions within an application or sub-application.
//
// A specialized view class that renders an area of HTML and then
// attaches `Region` instances to the specified `regions`.
// Used for composite view management and sub-application areas.
Marionette.LayoutView = Marionette.ItemView.extend({
  regionClass: Marionette.Region,

  // Ensure the regions are available when the `initialize` method
  // is called.
  constructor: function(options) {
    options = options || {};

    this._firstRender = true;
    this._initializeRegions(options);

    Marionette.ItemView.call(this, options);
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
    if (this.isDestroyed) { return this; }

    this.regionManager.destroy();
    return Marionette.ItemView.prototype.destroy.apply(this, arguments);
  },

  // Add a single region, by name, to the layoutView
  addRegion: function(name, definition) {
    this.triggerMethod('before:region:add', name);
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
    this.triggerMethod('before:region:remove', name);
    delete this.regions[name];
    return this.regionManager.removeRegion(name);
  },

  // Provides alternative access to regions
  // Accepts the region name
  // getRegion('main')
  getRegion: function(region) {
    return this.regionManager.get(region);
  },

  // Get all regions
  getRegions: function(){
    return this.regionManager.getRegions();
  },

  // internal method to build regions
  _buildRegions: function(regions) {
    var that = this;

    var defaults = {
      regionClass: this.getOption('regionClass'),
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

    // Enable users to define `regions` as instance options.
    var regionOptions = this.getOption.call(options, 'regions');

    // enable region options to be a function
    if (_.isFunction(regionOptions)) {
      regionOptions = regionOptions.call(this, options);
    }

    _.extend(regions, regionOptions);

    this.addRegions(regions);
  },

  // Internal method to re-initialize all of the regions by updating the `el` that
  // they point to
  _reInitializeRegions: function() {
    this.regionManager.emptyRegions();
    this.regionManager.each(function(region) {
      region.reset();
    });
  },

  // Enable easy overriding of the default `RegionManager`
  // for customized region interactions and business specific
  // view logic for better control over single regions.
  getRegionManager: function() {
    return new Marionette.RegionManager();
  },

  // Internal method to initialize the region manager
  // and all regions in it
  _initRegionManager: function() {
    this.regionManager = this.getRegionManager();

    this.listenTo(this.regionManager, 'before:add:region', function(name) {
      this.triggerMethod('before:add:region', name);
    });

    this.listenTo(this.regionManager, 'add:region', function(name, region) {
      this[name] = region;
      this.triggerMethod('add:region', name, region);
    });

    this.listenTo(this.regionManager, 'before:remove:region', function(name) {
      this.triggerMethod('before:remove:region', name);
    });

    this.listenTo(this.regionManager, 'remove:region', function(name, region) {
      delete this[name];
      this.triggerMethod('remove:region', name, region);
    });
  }
});
