(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore','backbone.radio', 'backbone.babysitter','backbone-metal'],
      function(Backbone, _) {
      return (root.Marionette = root.Mn = factory(root, Backbone, _));
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    var BabySitter = require('backbone.babysitter');
    var Radio = require('backbone.radio');
    var Metal = require('backbone-metal');
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

  // @include ../features.js

  // @include ../utils/extend.js
  // @include ../utils/isNodeAttached.js
  // @include ../utils/mergeOptions.js
  // @include ../utils/getOption.js
  // @include ../utils/proxyGetOption.js
  // @include ../utils/_getValue.js
  // @include ../utils/normalizeMethods.js
  // @include ../utils/normalizeUIString.js
  // @include ../utils/normalizeUIKeys.js
  // @include ../utils/normalizeUIValues.js
  // @include ../utils/actAsCollection.js
  // @include ../utils/deprecate.js

  // @include ../trigger-method.js
  // @include ../dom-refresh.js
  // @include ../bind-entity-events.js
  // @include ../radio-helpers.js

  // @include ../error.js
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
