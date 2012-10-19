// Marionette Object
// -----------------
//
// A basic object that allows you to `extend` and
// use an `initialize` method, like Backbone provides
// for it's constructs.
//
// Includes an `EventBinder` built in to it
Marionette.Object = function(options){
  Marionette.addEventBinder(this);

  if (_.isFunction(this.initialize)){
    this.initialize(options);
  }
};

Marionette.Object.extend = Marionette.extend;

// Object Methods
// --------------

_.extend(Marionette.Object.prototype, Backbone.Events, {

});
