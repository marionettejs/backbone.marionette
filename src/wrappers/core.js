(function(root, factory) {

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

  var previousMarionette = root.Marionette;

  var Marionette = Backbone.Marionette = {};

  Marionette.VERSION = '<%= version %>';

  Marionette.noConflict = function() {
    root.Marionette = previousMarionette;
    return this;
  };

  // Get the Deferred creator for later use
  Marionette.Deferred = Backbone.$.Deferred;

  // @include ../helpers.js
  // @include ../trigger-method.js
  // @include ../dom-refresh.js
  // @include ../bind-entity-events.js
  // @include ../error.js

  return Marionette;
}));
