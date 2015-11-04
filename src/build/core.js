/*eslint wrap-iife:0 */
(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore','backbone.radio', 'backbone.babysitter'],
      function(Backbone, _) {
      return (root.Marionette = root.Mn = factory(root, Backbone, _));
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    var BabySitter = require('backbone.babysitter');
    var Radio = require('backbone.radio');
    module.exports = factory(root, Backbone, _);
  } else {
    root.Marionette = root.Mn = factory(root, root.Backbone, root._);
  }

}(this, function(root, Backbone, _) {
  'use strict';

  // @include ./mn.js
  return Marionette;
}));
