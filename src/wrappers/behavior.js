(function(root, factory) {

  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone', './core'], function(_, Backbone, Marionette) {
      return factory(_, Backbone, Marionette);
    });
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Marionette = require('./core');
    module.exports = factory(_, Backbone, Marionette);
  } else {
    factory(root._, root.Backbone, root.Marionette);
  }

}(this, function(_, Backbone, Marionette) {
  'use strict';

  // @include ../behavior.js
  
  return Marionette.Behavior;
}));
