// Controller
// ----------

// A multi-purpose object to use as a controller for
// modules and routers, and as a mediator for workflow
// and coordination of other objects, views, and more.
Marionette.Controller = Marionette.Class.extend({
  destroy: function() {
    Marionette._triggerMethod(this, 'before:destroy', arguments);
    Marionette._triggerMethod(this, 'destroy', arguments);

    this.stopListening();
    this.off();
    return this;
  }
});
