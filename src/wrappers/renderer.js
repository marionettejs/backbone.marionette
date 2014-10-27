(function(root, factory) {

  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone', './core', './template-cache'], function(_, Backbone, Marionette) {
      return factory(_, Backbone, Marionette);
    });
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Marionette = require('./core');
    require('./template-cache');
    module.exports = factory(_, Backbone, Marionette);
  } else {
    factory(root._, root.Backbone, root.Marionette);
  }

}(this, function(_, Backbone, Marionette) {
  'use strict';

  // @include ../renderer.js

  return Marionette.Renderer;
}));
