// Helpers
// -------

// For slicing `arguments` in functions
var slice = Array.prototype.slice;

// Copy the `extend` function used by Backbone's classes
var extend = Marionette.View.extend;
Marionette.Region.extend = extend;
Marionette.Application.extend = extend;

// Copy the features of `BindTo` on to these objects
_.extend(Marionette.View.prototype, Marionette.BindTo);
_.extend(Marionette.Application.prototype, Marionette.BindTo);
_.extend(Marionette.Region.prototype, Marionette.BindTo);

// A simple wrapper method for deferring a callback until 
// after another method has been called, passing the
// results of the first method to the second. Uses jQuery's
// deferred / promise objects, and $.when/then to make it
// work.
var callDeferredMethod = function(fn, callback, context){
  var promise;
  if (fn) { promise = fn.call(context); }
  $.when(promise).then(callback);
}

