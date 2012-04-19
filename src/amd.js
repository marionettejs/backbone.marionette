(function (root, factory) {
  if (typeof exports === 'object') {

    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    var jquery = require('jquery');
    var underscore = require('underscore');
    var backbone = require('backbone');

    module.exports = factory(jquery, underscore, backbone);

  } else if (typeof define === 'function' && define.amd) {

    // AMD. Register as an anonymous module.
    define(['jquery', 'underscore', 'backbone'], factory);

  } 
}(this, function ($, _, Backbone) {
  // import "backbone.marionette.js"
  return Backbone.Marionette; 
}));
