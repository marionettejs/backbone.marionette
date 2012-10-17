(function (root, factory) {
  if (typeof exports === 'object') {

    var jquery = require('jquery');
    var underscore = require('underscore');
    var backbone = require('backbone');

    module.exports = factory(jquery, underscore, backbone);

  } else if (typeof define === 'function' && define.amd) {

    define(['jquery', 'underscore', 'backbone', 'backbone.wreqr', 'backbone.eventbinder'], factory);

  } 
}(this, function ($, _, Backbone) {

  //= marionette.js
  return Backbone.Marionette; 

}));
