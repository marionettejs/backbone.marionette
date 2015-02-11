(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore', 'backbone.wreqr', 'backbone.babysitter'], function(Backbone, _) {
      return (root.Marionette = root.Mn = factory(root, Backbone, _));
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    var Wreqr = require('backbone.wreqr');
    var BabySitter = require('backbone.babysitter');
    module.exports = factory(root, Backbone, _);
  } else {
    root.Marionette = root.Mn = factory(root, root.Backbone, root._);
  }

}(this, function(root, Backbone, _) {
  'use strict';

  var previousMarionette = root.Marionette;
  var previousMn = root.Mn;

  var Marionette = Backbone.Marionette = {};

  Marionette.VERSION = '<%= version %>';

  Marionette.noConflict = function() {
    root.Marionette = previousMarionette;
    root.Mn = previousMn;
    return this;
  };

  // Get the Deferred creator for later use
  Marionette.Deferred = Backbone.$.Deferred;

  // @include ../features.js
  // @include ../helpers.js
  // @include ../trigger-method.js
  // @include ../dom-refresh.js
  // @include ../bind-entity-events.js

  // @include ../error.js
  // @include ../callbacks.js
  // @include ../controller.js
  // @include ../object.js
  // @include ../region.js
  // @include ../region-manager.js

  // @include ../template-cache.js
  // @include ../renderer.js

  // @include ../view.js
  // @include ../item-view.js
  // @include ../collection-view.js
  // @include ../composite-view.js
  // @include ../layout-view.js

  // @include ../behavior.js
  // @include ../behaviors.js

  // @include ../app-router.js
  // @include ../application.js
  // @include ../module.js

  return Marionette;
}));
