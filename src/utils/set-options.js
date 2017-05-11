import _ from 'underscore';

// Internal utility for setting options consistently across Mn
const setOptions = function(options) {
  this.options = _.extend({}, _.result(this, 'options'), options);
};

export default setOptions;
