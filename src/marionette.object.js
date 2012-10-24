// Marionette Object
// -----------------
//
// A basic object that allows you to `extend` and
// use an `initialize` method, like Backbone provides
// for it's constructs.
//
// Includes an `EventBinder` built in to it
Marionette.Object = function(options){
  if (_.isFunction(this.initialize)){
    this.initialize(options);
  }

  Marionette.addEventBinder(this);
};

Marionette.Object.extend = Marionette.extend;

// Object Methods
// --------------

_.extend(Marionette.Object.prototype, Backbone.Events);
