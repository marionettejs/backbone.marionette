// Helpers
// -------

// For slicing `arguments` in functions
var slice = Array.prototype.slice;

// A simple wrapper method for deferring a callback until 
// after another method has been called, passing the
// results of the first method to the second. Uses jQuery's
// deferred / promise objects, and $.when/then to make it
// work.
var callDeferredMethod = function(fn, callback, context){
  var promise;
  if (fn) { promise = fn.call(context); }
  $.when(promise).then(_.bind(callback, context));
}

