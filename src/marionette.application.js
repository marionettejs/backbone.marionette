/**
 * Creates a new Application.
 *
 * The constructor function calls initialize if it exists, and sets the properties of the Application. Note that Applications are unique in
 * that their options are automatically attached to the Application instead of a separate options object. 
 *
 * @class
 * @classdesc - Applications are the entry point into most Marionette Applications. For all but the simplest of webapps you'll want
 *    to instantiate a new Application to act as the hub for the rest of your code.
 *    Applications let you do accomplish three things. Firstly, they provide a place to put start up code for your app through its
 *    Initializers. Secondly, they allow you to group your code into logical sections with the Module system. Lastly, they give you
 *    a way to connect Views to the document through its Regions.
 * @param {...*} options - Options to be available on the Application instance directly.
 */
Marionette.Application = function(options) {
  this._initRegionManager();
  this._initCallbacks = new Marionette.Callbacks();
  var globalCh = Backbone.Wreqr.radio.channel('global');

  /**
   * @desc The eventAggregator from the global Channel to be used for Application-level events.
   * @type {Backbone.Wreqr.EventAggregator}
   */
  this.vent = globalCh.vent;

  /**
   * @desc The commands instance from the global Channel to be used for Application-level commands.
   * @type {Backbone.Wreqr.Commands}
   */
  this.commands = globalCh.commands;

  /**
   * @desc The RequestResponse instance from the global Channel to be used for Application-level requests.
   * @type {Backbone.Wreqr.RequestResponse}
   */
  this.reqres = globalCh.reqres;

  /**
   * @desc The container for the Application's modules. Modules are stored with their name as the key,
   *   and the module itself as the value.
   * @type {Object}
   */
  this.submodules = {};

  _.extend(this, options);
};

_.extend(Marionette.Application.prototype, Backbone.Events, {

  /**
   * A convenience method to access the execute method
   * on the instance of Backbone.Wreqr.Commands attached to
   * every instance of Marionette.Application.
   *
   * This method is alternatively available as app.commands.execute,
   * where app is the instance name of the Application.
   *
   * @param {String} commandName - The command to be executed.
   * @param {...*} args - Additional arguments to pass to the command callback.
   * @api public
   */
  execute: function() {
    this.commands.execute.apply(this.commands, arguments);
  },

  /**
   * A convenience method to access the request method
   * on the instance of Backbone.Wreqr.RequestResponse attached to
   * every instance of Marionette.Application.
   *
   * This method is alternatively available as app.reqres.request,
   * where app is the instance name of the Application.
   *
   * @param {String} requestName - The name of the request.
   * @param {...*} args - Additional arguments to pass to the response callback.
   * @api public
   */
  request: function() {
    return this.reqres.request.apply(this.reqres, arguments);
  },

  /**
   * Adds an initializer that runs once the Application has started,
   * or immediately if the app has already been started.
   *
   * @param {Function} initializer - The function to be executed as an initializer.
   * @api public
   */
  addInitializer: function(initializer) {
    this._initCallbacks.add(initializer);
  },

  /**
   * Start the Application, triggering the Initializers array of callbacks.
   *
   * @param {...*} options - Options to pass to the `start` triggerMethods and the Initializers functions.
   * @api public
   */
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

  /**
   * Empties all of the Application's Regions by destroying the View within each Region.
   *
   * @api public
   */
  emptyRegions: function() {
    this._regionManager.emptyRegions();
  },

  /**
   * Removes the specified Region from the Application. The Region's view, if it exists,
   * will be destroyed.
   *
   * @param regionName - The name of the Region to be removed.
   * @api public
   */
  removeRegion: function(region) {
    this._regionManager.removeRegion(region);
  },

  /**
   * Returns a Region by name.
   *
   * @param regionName - The name of the Region to receive.
   * @api public
   */
  getRegion: function(region) {
    return this._regionManager.get(region);
  },

  /**
   * Returns an array of every Region from the RegionManager.
   *
   * @api public
   */
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

  /**
   * Instantiates the RegionManager for the Application object, and forwards
   * the events from the RegionManager to the Application itself.
   *
   * @api private
   */
  _initRegionManager: function() {
    this._regionManager = new Marionette.RegionManager();

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

  /**
   * Marionette's triggerMethod helper function. It first fires an associated callback for the event, if it exists,
   * then triggers the event on the object. For more refer to the triggerMethod documentation.
   *
   * @param {String} eventName - The name of the event to fire.
   * @param {...*} args - Additional arguments to pass to the event.
   * @api public
   */
  triggerMethod: Marionette.triggerMethod
});

/**
 * Backbone's extend method. Used to construct a new Class using the Application as the base.
 *
 * @param {Object} protoProps - Properties to attach to each instance of the new Class.
 * @param {Object} staticProps - Properties to attach to the new Class directly.
 * @api public
 */
Marionette.Application.extend = Marionette.extend;
