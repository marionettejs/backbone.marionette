(function(root, factory) {

  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], function(Backbone, _) {
      return (root.Marionette = factory(root, Backbone, _));
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    module.exports = factory(root, Backbone, _);
  } else {
    root.Marionette = factory(root, root.Backbone, root._);
  }

}(this, function(root, Backbone, _) {
  'use strict';

  /* istanbul ignore next */
  // @include ../../tmp/backbone.babysitter.bare.js

  /* istanbul ignore next */
  // @include ../../tmp/backbone.wreqr.bare.js

  var previousMarionette = root.Marionette;

  var Marionette = Backbone.Marionette = {};

  Marionette.VERSION = '<%= version %>';

  Marionette.noConflict = function() {
    root.Marionette = previousMarionette;
    return this;
  };

  Backbone.Marionette = Marionette;

  // Get the Deferred creator for later use
  Marionette.Deferred = Backbone.$.Deferred;

  // @include ../marionette.helpers.js
  // @include ../marionette.triggermethod.js
  // @include ../marionette.domRefresh.js

  // @include ../marionette.bindEntityEvents.js

  // @include ../marionette.callbacks.js
  // @include ../marionette.controller.js
  // @include ../marionette.object.js
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
