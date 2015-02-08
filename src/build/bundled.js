(function(root, factory) {

  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], function(Backbone, _) {
      return (root.Marionette = root.Mn = factory(root, Backbone, _));
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    module.exports = factory(root, Backbone, _);
  } else {
    root.Marionette = root.Mn = factory(root, root.Backbone, root._);
  }

}(this, function(root, Backbone, _) {
  'use strict';

  /* istanbul ignore next */
  // @include ../../tmp/backbone.babysitter.bare.js

  var previousMarionette = root.Marionette;

  var Marionette = Backbone.Marionette = {};

  Marionette.VERSION = '<%= version %>';

  Marionette.noConflict = function() {
    root.Marionette = previousMarionette;
    return this;
  };

  Backbone.Marionette = Marionette;

  // @include ../helpers.js
  // @include ../trigger-method.js
  // @include ../bind-entity-events.js

  // @include ../error.js
  // @include ../object.js
  // @include ../region.js
  // @include ../region-manager.js

  // @include ../template-cache.js
  // @include ../renderer.js

  // @include ../abstract-view.js
  // @include ../view.js
  // @include ../collection-view.js
  // @include ../composite-view.js

  // @include ../behavior.js
  // @include ../behaviors.js

  // @include ../app-router.js
  // @include ../application.js

  return Marionette;
}));
