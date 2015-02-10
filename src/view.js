// View
// ---------

// The standard view. Includes view events, automatic rendering
// of Underscore templates, nested views, and more.
Marionette.View = Marionette.AbstractView.extend({
  regionClass: Marionette.Region,

  options: {
    destroyImmediate: false
  },

  // used as the prefix for child view events
  // that are forwarded through the layoutview
  childViewEventPrefix: 'childview',

  // Setting up the inheritance chain which allows changes to
  // Marionette.AbstractView.prototype.constructor which allows overriding
  constructor: function(options) {
    options = options || {};

    this._firstRender = true;
    this._initializeRegions(options);

    Marionette.AbstractView.apply(this, arguments);
  },

  // Serialize the view's model *or* collection, if
  // it exists, for the template
  serializeData: function() {
    var data = {};

    if (!this.model && !this.collection) {
      return {};
    }

    // If we have a model, we serialize that
    if (this.model) {
      data = this.serializeModel();

    } else if (this.collection) {
      // Otherwise, we serialize the collection,
      // making it available under the `items` property
      data = {
        items: this.serializeCollection()
      };
    }

    return data;
  },

  // Serialize a collection by cloning each of
  // its model's attributes
  serializeCollection: function() {
    if (!this.collection) { return {}; }
    return _.pluck(this.collection.invoke('clone'), 'attributes');
  },

  // Render the view, defaulting to underscore.js templates.
  // You can override this in your view definition to provide
  // a very specific rendering for your view. In general, though,
  // you should override the `Marionette.Renderer` object to
  // change how Marionette renders views.
  // Subsequent renders after the first will re-render all nested
  // views.
  render: function() {
    this._ensureViewIsIntact();

    this.triggerMethod('before:render', this);

    if (this._firstRender) {
      // if this is the first render, don't do anything to
      // reset the regions
      this._firstRender = false;
    } else {
      // If this is not the first render call, then we need to
      // re-initialize the `el` for each region
      this._reInitializeRegions();
    }

    this._renderTemplate();
    this.isRendered = true;
    this.bindUIElements();

    this.triggerMethod('render', this);

    return this;
  },

  // Internal method to render the template with the serialized data
  // and template helpers via the `Marionette.Renderer` object.
  _renderTemplate: function() {
    var template = this.getTemplate();

    // Allow template-less item views
    if (template === false) {
      return;
    }

    // Add in entity data and template helpers
    var data = this.mixinTemplateHelpers(this.serializeData());

    // Render and add to el
    var html = Marionette.Renderer.render(template, data, this);
    this.attachElContent(html);

    return this;
  },

  // Attaches the content of a given view.
  // This method can be overridden to optimize rendering,
  // or to render in a non standard way.
  //
  // For example, using `innerHTML` instead of `$el.html`
  //
  // ```js
  // attachElContent: function(html) {
  //   this.el.innerHTML = html;
  //   return this;
  // }
  // ```
  attachElContent: function(html) {
    this.$el.html(html);

    return this;
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

  showChildView: function(regionName, view) {
    return this.getRegion(regionName).show(view);
  },

  getChildView: function(regionName) {
    return this.getRegion(regionName).currentView;
  },

  // Provides alternative access to regions
  // Accepts the region name
  // getRegion('main')
  getRegion: function(region) {
    return this.regionManager.get(region);
  },

  // Get all regions
  getRegions: function() {
    return this.regionManager.getRegions();
  },

  // Enable easy overriding of the default `RegionManager`
  // for customized region interactions and business specific
  // view logic for better control over single regions.
  getRegionManager: function() {
    return new Marionette.RegionManager();
  },

  // Handle destroying regions, and then destroy the view itself.
  destroy: function() {
    if (this.isDestroyed) { return this; }

    // #2134: remove parent element before destroying the child views, so
    // removing the child views doesn't retrigger repaints
    if (this.getOption('destroyImmediate') === true) {
      this.$el.remove();
    }
    this.regionManager.destroy();
    return Marionette.AbstractView.prototype.destroy.apply(this, arguments);
  },

  // Internal method to initialize the regions that have been defined in a
  // `regions` attribute on this layoutView.
  _initializeRegions: function(options) {
    var regions;
    this._initRegionManager();

    regions = Marionette._getValue(this.regions, this, [options]) || {};

    // Enable users to define `regions` as instance options.
    var regionOptions = this.getOption.call(options, 'regions');

    // enable region options to be a function
    regionOptions = Marionette._getValue(regionOptions, this, [options]);

    _.extend(regions, regionOptions);

    // Normalize region selectors hash to allow
    // a user to use the @ui. syntax.
    regions = this.normalizeUIValues(regions, ['selector', 'el']);

    this.addRegions(regions);
  },

  // internal method to build regions
  _buildRegions: function(regions) {
    var defaults = {
      regionClass: this.getOption('regionClass'),
      parentEl: _.partial(_.result, this, 'el')
    };

    return this.regionManager.addRegions(regions, defaults);
  },

  // Internal method to re-initialize all of the regions by updating
  // the `el` that they point to
  _reInitializeRegions: function() {
    this.regionManager.invoke('reset');
  },

  // Internal method to initialize the region manager
  // and all regions in it
  _initRegionManager: function() {
    this.regionManager = this.getRegionManager();
    this.regionManager._parent = this;

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
  },

  _getImmediateChildren: function() {
    return _.chain(this.regionManager.getRegions())
      .pluck('currentView')
      .compact()
      .value();
  }
});
