(function(root, factory) {

  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone', './core', './item-view', './region-manager'], function(_, Backbone, Marionette) {
      return factory(_, Backbone, Marionette);
    });
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Marionette = require('./core');
    require('./item-view');
    require('./region-manager');
    module.exports = factory(_, Backbone, Marionette);
  } else {
    factory(root._, root.Backbone, root.Marionette);
  }

}(this, function(_, Backbone, Marionette, ItemView) {
  'use strict';

  // @include ../layout-view.js
  
  return Marionette.LayoutView;
}));
