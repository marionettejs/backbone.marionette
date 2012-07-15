// Module
// ------

// A simple module system, used to create privacy and encapsulation in
// Marionette applications
Marionette.Module = function(moduleName, app, customArgs){
  this.moduleName = moduleName;

  this._initializerCallbacks = new Marionette.Callbacks();

  this._config = {};
  this._config.app = app;
  this._config.customArgs = customArgs;
  this._config.definitions = [];
};

// Extend the Module prototype with events / bindTo, so that the module
// can be used as an event aggregator or pub/sub.
_.extend(Marionette.Module.prototype, Backbone.Events, Marionette.BindTo, {

  // Initializer for a specific module. Initializers are run when the
  // module's `start` method is called.
  addInitializer: function(callback){
    this._initializerCallbacks.add(callback);
  },

  // Start the module, and run all of it's initializers
  start: function(options){
    this._define();
    // run the initializers
    this._initializerCallbacks.run(options, this);
  },

  // Configure the module with a definition function and any custom args
  // that are to be passed in to the definition function
  addDefinition: function(moduleDefinition){
    this._config.definitions.push(moduleDefinition);
  },

  // Internal method: run the module definition function with the correct
  // arguments
  _define: function(){
    if (this._config.definitions.length === 0) { return; }

    // build the correct list of arguments for the module definition
    var args = _.flatten([
      this, 
      this._config.app, 
      Backbone, 
      Marionette, 
      $, _, 
      this._config.customArgs
    ]);

    // run the module definition function with the correct args
    var definitionCount = this._config.definitions.length-1;
    for(var i=0; i <= definitionCount; i++){

      var definition = this._config.definitions[i];
      definition.apply(this, args);

    }
  }
});

// Function level methods to create modules
_.extend(Marionette.Module, {

  // Create a module, hanging off the app parameter as the parent object. 
  create: function(app, moduleNames, moduleDefinition){
    var parentModule = app;
    var moduleNames = moduleNames.split(".");

    // get the custom args passed in after the module definition and
    // get rid of the module name and definition function
    var customArgs = slice.apply(arguments);
    customArgs.splice(0, 3);

    // Loop through all the parts of the module definition
    var length = moduleNames.length;
    _.each(moduleNames, function(moduleName, i){
      var isLastModuleInChain = (i === length-1);

      // Get an existing module of this name if we have one
      var module = parentModule[moduleName];
      if (!module){ 
        // Create a new module if we don't
        module = new Marionette.Module(moduleName, app, customArgs);
      }

      // Only add a module definition and initializer when this is
      // the last module in a "parent.child.grandchild" hierarchy of
      // module names
      if (isLastModuleInChain ){

        // add the module definition
        if (moduleDefinition){
          module.addDefinition(moduleDefinition);
        }

        // start the module when the app starts
        app.addInitializer(function(options){
          module.start(options);
        });
      }

      // If the defined module is not what we are
      // currently storing as the module, replace it
      if (parentModule[moduleName] !== module){
        parentModule[moduleName] = module;
      }

      // Reset the parent module so that the next child
      // in the list will be added to the correct parent
      parentModule = module;
    });

    // Return the last module in the definition chain
    return parentModule;
  }
});
