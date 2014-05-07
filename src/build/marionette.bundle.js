var Marionette = (function(global, Backbone, _){
  "use strict";

  // @include ../../tmp/backbone.babysitter.bare.js
  // @include ../../tmp/backbone.wreqr.bare.js

  // Define and export the Marionette namespace
  var Marionette = {};
  Backbone.Marionette = Marionette;

  // Get the DOM manipulator for later use
  Marionette.$ = Backbone.$;

// @include ../marionette.helpers.js
// @include ../marionette.triggermethod.js
// @include ../marionette.domRefresh.js

// @include ../marionette.bindEntityEvents.js

// @include ../marionette.callbacks.js
// @include ../marionette.controller.js
// @include ../marionette.region.js
// @include ../marionette.regionManager.js

// @include ../marionette.templatecache.js
// @include ../marionette.renderer.js

// @include ../marionette.view.js
// @include ../marionette.itemview.js
// @include ../marionette.collectionview.js
// @include ../marionette.compositeview.js
// @include ../marionette.layout.js

// @include ../marionette.behavior.js
// @include ../marionette.behaviors.js

// @include ../marionette.approuter.js
// @include ../marionette.application.js
// @include ../marionette.module.js

  return Marionette;
})(this, Backbone, _);
