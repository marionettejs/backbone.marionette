// Application
// -----------

// Contain and manage the composite application as a whole.
// Stores and starts up `Region` objects, includes an
// event aggregator as `app.vent`
Marionette.Application = function(options) {
  this._initializeRegions(options);
  this._initCallbacks = new Marionette.Callbacks();
  this.submodules = {};
  _.extend(this, options);
  this._initChannel();
  this.initialize.apply(this, arguments);
};

_.extend(Marionette.Application.prototype, Backbone.Events, {
  // Initialize is an empty function by default. Override it with your own
  // initialization logic.
  initialize: function() {},

  // Command execution, facilitated by Backbone.Wreqr.Commands
  execute: function() {
    this.commands.execute.apply(this.commands, arguments);
  },

  // Request/response, facilitated by Backbone.Wreqr.RequestResponse
  request: function() {
    return this.reqres.request.apply(this.reqres, arguments);
  },

  // Add an initializer that is either run at when the `start`
  // method is called, or run immediately if added after `start`
  // has already been called.
  addInitializer: function(initializer) {
    this._initCallbacks.add(initializer);
  },

  // kick off all of the application's processes.
  // initializes all of the regions that have been added
  // to the app, and runs all of the initializer functions
  start: function(options) {
    this.triggerMethod('before:start', options);
    this._initCallbacks.run(options, this);
    this.triggerMethod('start', options);
  },

  // Add regions to your app.
  // Accepts a hash of named strings or Region objects
  // addRegions({something: "#someRegion"})
  // addRegions({something: Region.extend({el: "#someRegion"}) });
  addRegions: function(regions) {
    return this._regionManager.addRegions(regions);
  },

  // Empty all regions in the app, without removing them
  emptyRegions: function() {
    return this._regionManager.emptyRegions();
  },

  // Removes a region from your app, by name
  // Accepts the regions name
  // removeRegion('myRegion')
  removeRegion: function(region) {
    return this._regionManager.removeRegion(region);
  },

  // Provides alternative access to regions
  // Accepts the region name
  // getRegion('main')
  getRegion: function(region) {
    return this._regionManager.get(region);
  },

  // Get all the regions from the region manager
  getRegions: function(){
    return this._regionManager.getRegions();
  },

  // Create a module, attached to the application
  module: function(moduleNames, moduleDefinition) {

    // Overwrite the module class if the user specifies one
    var ModuleClass = Marionette.Module.getClass(moduleDefinition);

    // slice the args, and add this application object as the
    // first argument of the array
    var args = slice.call(arguments);
    args.unshift(this);

    // see the Marionette.Module object for more information
    return ModuleClass.create.apply(ModuleClass, args);
  },

  // Enable easy overriding of the default `RegionManager`
  // for customized region interactions and business-specific
  // view logic for better control over single regions.
  getRegionManager: function() {
    return new Marionette.RegionManager();
  },

  // Internal method to initialize the regions that have been defined in a
  // `regions` attribute on the application instance
  _initializeRegions: function(options) {
    var regions = _.isFunction(this.regions) ? this.regions(options) : this.regions || {};

    this._initRegionManager();

    // Enable users to define `regions` in instance options.
    var optionRegions = Marionette.getOption(options, 'regions');

    // Enable region options to be a function
    if (_.isFunction(optionRegions)) {
      optionRegions = optionRegions.call(this, options);
    }

    // Overwrite current regions with those passed in options
    _.extend(regions, optionRegions);

    this.addRegions(regions);

    return this;
  },

  // Internal method to set up the region manager
  _initRegionManager: function() {
    this._regionManager = this.getRegionManager();

    this.listenTo(this._regionManager, 'before:add:region', function(name) {
      this.triggerMethod('before:add:region', name);
    });

    this.listenTo(this._regionManager, 'add:region', function(name, region) {
      this[name] = region;
      this.triggerMethod('add:region', name, region);
    });

    this.listenTo(this._regionManager, 'before:remove:region', function(name) {
      this.triggerMethod('before:remove:region', name);
    });

    this.listenTo(this._regionManager, 'remove:region', function(name, region) {
      delete this[name];
      this.triggerMethod('remove:region', name, region);
    });
  },

  // Internal method to setup the Wreqr.radio channel
  _initChannel: function() {
    this.channelName = _.result(this, 'channelName') || 'global';
    this.channel = _.result(this, 'channel') || Backbone.Wreqr.radio.channel(this.channelName);
    this.vent = _.result(this, 'vent') || this.channel.vent;
    this.commands = _.result(this, 'commands') || this.channel.commands;
    this.reqres = _.result(this, 'reqres') || this.channel.reqres;
  },

  // import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: Marionette.triggerMethod,

  // Proxy `getOption` to enable getting options from this or this.options by name.
  getOption: Marionette.proxyGetOption
});

// Copy the `extend` function used by Backbone's classes
Marionette.Application.extend = Marionette.extend;
