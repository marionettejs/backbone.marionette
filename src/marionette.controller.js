// Marionette Controller
// ---------------------
//
// A multi-purpose object to use as a controller for
// modules and routers, and as a mediator for workflow
// and coordination of other objects, views, and more.
Marionette.Controller = Marionette.Object.augment(
  Marionette.EventBinder,
  Marionette.EventAggregator
);
