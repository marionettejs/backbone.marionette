// Helpers
// -------

// For slicing `arguments` in functions
var slice = Array.prototype.slice;

// For retrieving either a value or result of a function call
var getAttribute = function(obj, attr){
  var value = obj[attr];
  if (_.isFunction(value)){
    value = value.call(obj);
  }
  return value;
}
