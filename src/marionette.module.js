// Module
// ------

// A simple module system, used to create privacy and encapsulation in
// Marionette applications
Marionette.Module = function(moduleName, app){
  this.moduleName = moduleName;

  // store sub-modules
  this.submodules = {};

  this._setupInitializersAndFinalizers();

  // store the configuration for this module
  this.config = {};
  this.config.app = app;

  // extend this module with an event binder
  Marionette.addEventBinder(this);
};

// Extend the Module prototype with events / bindTo, so that the module
// can be used as an event aggregator or pub/sub.
_.extend(Marionette.Module.prototype, Backbone.Events, {

  // Initializer for a specific module. Initializers are run when the
  // module's `start` method is called.
  addInitializer: function(callback){
    this._initializerCallbacks.add(callback);
  },

  // Finalizers are run when a module is stopped. They are used to teardown
  // and finalize any variables, references, events and other code that the
  // module had set up.
  addFinalizer: function(callback){
    this._finalizerCallbacks.add(callback);
  },

  // Start the module, and run all of it's initializers
  start: function(options){
    // Prevent re-start the module
    if (this._isInitialized){ return; }

    // start the sub-modules (depth-first hierarchy)
    _.each(this.submodules, function(mod){
      if (mod.config.options.startWithParent){
        mod.start(options);
      }
    });

    // run the callbacks to "start" the current module
    this._initializerCallbacks.run(options, this);
    this._isInitialized = true;
  },

  // Stop this module by running its finalizers and then stop all of
  // the sub-modules for this module
  stop: function(){
    // if we are not initialized, don't bother finalizing
    if (!this._isInitialized){ return; }
    this._isInitialized = false;

    // stop the sub-modules; depth-first, to make sure the
    // sub-modules are stopped / finalized before parents
    _.each(this.submodules, function(mod){ mod.stop(); });

    // run the finalizers
    this._finalizerCallbacks.run();

    // reset the initializers and finalizers
    this._initializerCallbacks.reset();
    this._finalizerCallbacks.reset();
  },

  // Configure the module with a definition function and any custom args
  // that are to be passed in to the definition function
  addDefinition: function(moduleDefinition, customArgs){
    this._runModuleDefinition(moduleDefinition, customArgs);
  },

  // Internal method: run the module definition function with the correct
  // arguments
  _runModuleDefinition: function(definition, customArgs){
    if (!definition){ return; }

    // build the correct list of arguments for the module definition
    var args = _.flatten([
      this, 
      this.config.app, 
      Backbone, 
      Marionette, 
      $, _, 
      customArgs
    ]);

    definition.apply(this, args);
  },

  // Internal method: set up new copies of initializers and finalizers.
  // Calling this method will wipe out all existing initializers and
  // finalizers.
  _setupInitializersAndFinalizers: function(){
    this._initializerCallbacks = new Marionette.Callbacks();
    this._finalizerCallbacks = new Marionette.Callbacks();
  }
});

// Function level methods to create modules
_.extend(Marionette.Module, {

  // Create a module, hanging off the app parameter as the parent object. 
  create: function(app, moduleNames, moduleDefinition){
    var that = this;
    var parentModule = app;
    moduleNames = moduleNames.split(".");

    // get the custom args passed in after the module definition and
    // get rid of the module name and definition function
    var customArgs = slice.apply(arguments);
    customArgs.splice(0, 3);

    // Loop through all the parts of the module definition
    var length = moduleNames.length;
    _.each(moduleNames, function(moduleName, i){
      var isLastModuleInChain = (i === length-1);

      var module = that._getModuleDefinition(parentModule, moduleName, app);
      module.config.options = that._getModuleOptions(parentModule, moduleDefinition);

      // if it's the first module in the chain, configure it
      // for auto-start, as specified by the options
      if (isLastModuleInChain){
        that._configureAutoStart(app, module);
      }

      // Only add a module definition and initializer when this is
      // the last module in a "parent.child.grandchild" hierarchy of
      // module names
      if (isLastModuleInChain && module.config.options.hasDefinition){
        module.addDefinition(module.config.options.definition, customArgs);
      }

      // Reset the parent module so that the next child
      // in the list will be added to the correct parent
      parentModule = module;
    });

    // Return the last module in the definition chain
    return parentModule;
  },

  _configureAutoStart: function(app, module){
    // Only add the initializer if it's the first module, and
    // if it is set to auto-start, and if it has not yet been added
    if (module.config.options.startWithParent && !module.config.autoStartConfigured){
      // start the module when the app starts
      app.addInitializer(function(options){
        module.start(options);
      });
    }

    // prevent this module from being configured for
    // auto start again. the first time the module
    // is defined, determines it's auto-start
    module.config.autoStartConfigured = true;
  },

  _getModuleDefinition: function(parentModule, moduleName, app){
    // Get an existing module of this name if we have one
    var module = parentModule[moduleName];

    if (!module){ 
      // Create a new module if we don't have one
      module = new Marionette.Module(moduleName, app);
      parentModule[moduleName] = module;
      // store the module on the parent
      parentModule.submodules[moduleName] = module;
    }

    return module;
  },

  _getModuleOptions: function(parentModule, moduleDefinition){
    // default to starting the module with the app
    var options = { 
      startWithParent: true,
      hasDefinition: !!moduleDefinition
    };

    // short circuit if we don't have a module definition
    if (!options.hasDefinition){ return options; }

    if (_.isFunction(moduleDefinition)){
      // if the definition is a function, assign it directly
      // and use the defaults
      options.definition = moduleDefinition;

    } else {

      // the definition is an object. 

      // grab the "define" attribute
      options.hasDefinition = !!moduleDefinition.define;
      options.definition = moduleDefinition.define;
      
      // grab the "startWithParent" attribute if one exists
      if (moduleDefinition.hasOwnProperty("startWithParent")){
        options.startWithParent = moduleDefinition.startWithParent;
      }
    }

    return options;
  }
});
