// Marionette.getOption
// --------------------

// Retrieve an object, function or other value from a target
// object or its `options`, with `options` taking precedence.
var getOption = function(target, optionName) {
  if (!target || !optionName) { return; }
  if (target.options && (target.options[optionName] !== undefined)) {
    return target.options[optionName];
  } else {
    return target[optionName];
  }
};

export default getOption;
