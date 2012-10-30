(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['backbone'], factory);
  } else {
    // Browser globals
    factory(root.Backbone);
  }
}(this, function (Backbone) {
  "use strict";

  function augment(/* augments... */) {
    var self = this;
    for (var i = 0; i < arguments.length; i++) {
      var aug = arguments[i];
      if (aug && aug.augment) {
        self = aug.augment(self);
      }
    }
    return self;
  }

  Backbone.Model.augment = Backbone.Collection.augment = Backbone.View.augment = augment;

  return augment;
}));
