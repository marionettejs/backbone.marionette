// Controller
// ----------
//
// A multi-purpose object to use as a controller for
// modules and routers, and as a mediator for workflow
// and coordination of other objects, views, and more.
Marionette.Controller = function(options){
  Marionette.addEventBinder(this);

  if (_.isFunction(this.initialize)){
    this.initialize(options);
  }
};

Marionette.Controller.extend = Marionette.extend;
