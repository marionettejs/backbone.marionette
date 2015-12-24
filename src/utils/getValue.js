import _ from 'underscore';

// Similar to `_.result`, this is a simple helper
// If a function is provided we call it with context
// otherwise just return the value. If the value is
// undefined return a default value
var getValue = function(value, ...args) {
  if (_.isFunction(value)) {
    return value.apply(this, args);
  }
  return value;
};

export default getValue;
