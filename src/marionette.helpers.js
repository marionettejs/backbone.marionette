// Helpers
// -------

// For slicing `arguments` in functions
var slice = Array.prototype.slice;

// Borrow the Backbone `extend` method so we can use it as needed
Marionette.extend = Backbone.Model.extend;

// A wrapper / shim for `Object.create`. Uses native `Object.create`
// if available, otherwise shims it in place for Marionette to use.
Marionette.createObject = (function(){
  var createObject;

  if (typeof Object.create === "function"){

    // found native, use it
    createObject = Object.create;

  } else {

    // native not found, shim it
    createObject = function (o) {
      function F() {}
      F.prototype = o;
      return new F();
    };

  }

  return createObject;
})();

