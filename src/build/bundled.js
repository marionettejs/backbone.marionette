/*eslint wrap-iife:0 */
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
  // @include ../../tmp/backbone.babysitter.js

  /* istanbul ignore next */
  // @include ../../tmp/backbone.radio.js

  /* istanbul ignore next */
  // @include ../../tmp/backbone-metal.js

  // @include ./mn.js
  return Marionette;
}));
