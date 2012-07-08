// Module
// ------

// A simple module system, used to create privacy and encapsulation in
// Marionette applications
Marionette.Module = function(){
  this._initializerCallbacks = new Marionette.Callbacks();
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
    this._initializerCallbacks.run(options, this);
  }
});

// Function level methods to create modules
_.extend(Marionette.Module, {

  // Create a module, hanging off 'this' as the parent object. This
  // method must be called with .apply or .create
  create: function(moduleNames, moduleDefinition){
    var moduleName, module, moduleOverride;
    var parentObject = this;
    var parentModule = this;
    var moduleNames = moduleNames.split(".");

    // Loop through all the parts of the module definition
    var length = moduleNames.length;
    for(var i = 0; i < length; i++){
      var isLastModuleInChain = (i === length-1);

      // Get the module name, and check if it exists on
      // the current parent already
      moduleName = moduleNames[i];
      module = parentModule[moduleName];

      // Create a new module if we don't have one already
      if (!module){ 
        module = new Marionette.Module();
        parentObject.addInitializer(function(){
          module.start();
        });
      }

      // Check to see if we need to run the definition
      // for the module. Only run the definition if one
      // is supplied, and if we're at the last segment
      // of the "Module.Name" chain.
      if (isLastModuleInChain && moduleDefinition){
        // get the custom args passed in after the module definition and
        // get rid of the module name and definition function
        var customArgs = slice.apply(arguments);
        customArgs.shift();
        customArgs.shift();

        // final arguments list for the module definition
        var argsArray = [module, parentObject, Backbone, Marionette, jQuery, _, customArgs];

        // flatten the nested array
        var args = _.flatten(argsArray);

        // ensure the module definition's `this` is the module itself
        moduleDefinition.apply(module, args);
      }

      // If the defined module is not what we are
      // currently storing as the module, replace it
      if (parentModule[moduleName] !== module){
        parentModule[moduleName] = module;
      }

      // Reset the parent module so that the next child
      // in the list will be added to the correct parent
      parentModule = module;
    }

    // Return the last module in the definition chain
    return module;
  }
});
