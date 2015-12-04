import _ from 'underscore';

// Internal utility for setting options consistently across Mn
var _setOptions = function(...args) {
  this.options = _.extend({}, _.result(this, 'options'), ...args);
};

export default _setOptions;
