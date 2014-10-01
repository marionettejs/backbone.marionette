(function(root, factory) {

  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(function(require) {
      var _ = require('underscore');
      var Backbone = require('backbone');
      var Marionette = require('./core');
      require('./view');
      require('backbone.babysitter');
      return factory(_, Backbone, Marionette);
    });
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Marionette = require('./core');
    require('./view');
    require('backbone.babysitter');
    module.exports = factory(_, Backbone, Marionette);
  } else {
    factory(root._, root.Backbone, root.Marionette);
  }

}(this, function(_, Backbone, Marionette) {
  'use strict';

  // @include ../collection-view.js
  
  return Marionette.CollectionView;
}));
