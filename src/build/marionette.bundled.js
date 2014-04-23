(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['exports', 'backbone', 'underscore'], function(exports, Backbone, _) {
      root.Marionette = factory(root, exports, Backbone, _);
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    factory(root, exports, Backbone, _);
  } else {
    root.Marionette = factory(root, {}, root.Backbone, root._);
  }

}(this, function(root, Marionette, Backbone, _) {
  'use strict';

  var previousMarionette = root.Marionette;

  Marionette.noConflict = function() {
    root.Marionette = previousMarionette;
    return this;
  };

  Backbone.Marionette = Marionette;

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
  // @include ../marionette.layoutview.js

  // @include ../marionette.behavior.js
  // @include ../marionette.behaviors.js

  // @include ../marionette.approuter.js
  // @include ../marionette.application.js
  // @include ../marionette.module.js

  return Marionette;
}));
