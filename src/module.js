/* jshint maxparams: 9 */

// Module
// ------

// A simple module system, used to create privacy and encapsulation in
// Marionette applications
Marionette.Module = function(moduleName, app, options) {
  this.moduleName = moduleName;
  this.options = _.extend({}, this.options, options);
  // Allow for a user to overide the initialize
  // for a given module instance.
  this.initialize = options.initialize || this.initialize;

  // Set up an internal store for sub-modules.
  this.submodules = {};

  this._setupInitializersAndFinalizers();

  // Set an internal reference to the app
  // within a module.
  this.app = app;

  if (_.isFunction(this.initialize)) {
    this.initialize(moduleName, app, this.options);
  }
};

Marionette.Module.extend = Marionette.extend;

// Extend the Module prototype with events / listenTo, so that the module
// can be used as an event aggregator or pub/sub.
_.extend(Marionette.Module.prototype, Backbone.Events, {

  // By default modules start with their parents.
  startWithParent: true,

  // Initialize is an empty function by default. Override it with your own
  // initialization logic when extending Marionette.Module.
  initialize: function() {},

  // Initializer for a specific module. Initializers are run when the
  // module's `start` method is called.
  addInitializer: function(callback) {
    this._initializerCallbacks.add(callback);
  },

  // Finalizers are run when a module is stopped. They are used to teardown
  // and finalize any variables, references, events and other code that the
  // module had set up.
  addFinalizer: function(callback) {
    this._finalizerCallbacks.add(callback);
  },

  // Start the module, and run all of its initializers
  start: function(options) {
    // Prevent re-starting a module that is already started
    if (this._isInitialized) { return; }

    // start the sub-modules (depth-first hierarchy)
    _.each(this.submodules, function(mod) {
      // check to see if we should start the sub-module with this parent
      if (mod.startWithParent) {
        mod.start(options);
      }
    });

    // run the callbacks to "start" the current module
    this.triggerMethod('before:start', options);

    this._initializerCallbacks.run(options, this);
    this._isInitialized = true;

    this.triggerMethod('start', options);
  },

  // Stop this module by running its finalizers and then stop all of
  // the sub-modules for this module
  stop: function() {
    // if we are not initialized, don't bother finalizing
    if (!this._isInitialized) { return; }
    this._isInitialized = false;

    this.triggerMethod('before:stop');

    // stop the sub-modules; depth-first, to make sure the
    // sub-modules are stopped / finalized before parents
    _.each(this.submodules, function(mod) { mod.stop(); });

    // run the finalizers
    this._finalizerCallbacks.run(undefined, this);

    // reset the initializers and finalizers
    this._initializerCallbacks.reset();
    this._finalizerCallbacks.reset();

    this.triggerMethod('stop');
  },

  // Configure the module with a definition function and any custom args
  // that are to be passed in to the definition function
  addDefinition: function(moduleDefinition, customArgs) {
    this._runModuleDefinition(moduleDefinition, customArgs);
  },

  // Internal method: run the module definition function with the correct
  // arguments
  _runModuleDefinition: function(definition, customArgs) {
    // If there is no definition short circut the method.
    if (!definition) { return; }

    // build the correct list of arguments for the module definition
    var args = _.flatten([
      this,
      this.app,
      Backbone,
      Marionette,
      Backbone.$, _,
      customArgs
    ]);

    definition.apply(this, args);
  },

  // Internal method: set up new copies of initializers and finalizers.
  // Calling this method will wipe out all existing initializers and
  // finalizers.
  _setupInitializersAndFinalizers: function() {
    this._initializerCallbacks = new Marionette.Callbacks();
    this._finalizerCallbacks = new Marionette.Callbacks();
  },

  // import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: Marionette.triggerMethod
});

// Class methods to create modules
_.extend(Marionette.Module, {

  // Create a module, hanging off the app parameter as the parent object.
  create: function(app, moduleNames, moduleDefinition) {
    var module = app;

    // get the custom args passed in after the module definition and
    // get rid of the module name and definition function
    var customArgs = _.rest(arguments, 3);

    // Split the module names and get the number of submodules.
    // i.e. an example module name of `Doge.Wow.Amaze` would
    // then have the potential for 3 module definitions.
    moduleNames = moduleNames.split('.');
    var length = moduleNames.length;

    // store the module definition for the last module in the chain
    var moduleDefinitions = [];
    moduleDefinitions[length - 1] = moduleDefinition;

    // Loop through all the parts of the module definition
    _.each(moduleNames, function(moduleName, i) {
      var parentModule = module;
      module = this._getModule(parentModule, moduleName, app, moduleDefinition);
      this._addModuleDefinition(parentModule, module, moduleDefinitions[i], customArgs);
    }, this);

    // Return the last module in the definition chain
    return module;
  },

  _getModule: function(parentModule, moduleName, app, def, args) {
    var options = _.extend({}, def);
    var ModuleClass = this.getClass(def);

    // Get an existing module of this name if we have one
    var module = parentModule[moduleName];

    if (!module) {
      // Create a new module if we don't have one
      module = new ModuleClass(moduleName, app, options);
      parentModule[moduleName] = module;
      // store the module on the parent
      parentModule.submodules[moduleName] = module;
    }

    return module;
  },

  // ## Module Classes
  //
  // Module classes can be used as an alternative to the define pattern.
  // The extend function of a Module is identical to the extend functions
  // on other Backbone and Marionette classes.
  // This allows module lifecyle events like `onStart` and `onStop` to be called directly.
  getClass: function(moduleDefinition) {
    var ModuleClass = Marionette.Module;

    if (!moduleDefinition) {
      return ModuleClass;
    }

    // If all of the module's functionality is defined inside its class,
    // then the class can be passed in directly. `MyApp.module("Foo", FooModule)`.
    if (moduleDefinition.prototype instanceof ModuleClass) {
      return moduleDefinition;
    }

    return moduleDefinition.moduleClass || ModuleClass;
  },

  // Add the module definition and add a startWithParent initializer function.
  // This is complicated because module definitions are heavily overloaded
  // and support an anonymous function, module class, or options object
  _addModuleDefinition: function(parentModule, module, def, args) {
    var fn = this._getDefine(def);
    var startWithParent = this._getStartWithParent(def, module);

    if (fn) {
      module.addDefinition(fn, args);
    }

    this._addStartWithParent(parentModule, module, startWithParent);
  },

  _getStartWithParent: function(def, module) {
    var swp;

    if (_.isFunction(def) && (def.prototype instanceof Marionette.Module)) {
      swp = module.constructor.prototype.startWithParent;
      return _.isUndefined(swp) ? true : swp;
    }

    if (_.isObject(def)) {
      swp = def.startWithParent;
      return _.isUndefined(swp) ? true : swp;
    }

    return true;
  },

  _getDefine: function(def) {
    if (_.isFunction(def) && !(def.prototype instanceof Marionette.Module)) {
      return def;
    }

    if (_.isObject(def)) {
      return def.define;
    }

    return null;
  },

  _addStartWithParent: function(parentModule, module, startWithParent) {
    module.startWithParent = module.startWithParent && startWithParent;

    if (!module.startWithParent || !!module.startWithParentIsConfigured) {
      return;
    }

    module.startWithParentIsConfigured = true;

    parentModule.addInitializer(function(options) {
      if (module.startWithParent) {
        module.start(options);
      }
    });
  }
});
