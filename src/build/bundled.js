(function(root, factory) {

  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore', 'backbone-metal'], function(Backbone, _, Metal) {
      return (root.Marionette = root.Mn = factory(root, Backbone, _, Metal));
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    var Metal = require('backbone-metal');
    module.exports = factory(root, Backbone, _, Metal);
  } else {
    root.Marionette = root.Mn = factory(root, root.Backbone, root._, root.Backbone.Metal);
  }

}(this, function(root, Backbone, _, Metal) {
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
  // @include ../dom-refresh.js
  // @include ../bind-entity-events.js

  // @include ../metal.js

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
