// Mix in methods from Underscore, for iteration, and other
// collection related features.
// Borrowing this code from Backbone.Collection:
// https://github.com/jashkenas/backbone/blob/1.1.2/backbone.js#L962

import _ from 'underscore';

const methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
                'select', 'reject', 'every', 'all', 'some', 'any', 'include',
                'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
                'last', 'without', 'isEmpty', 'pluck', 'reduce', 'partition'];

const emulateCollection = function(object, listProperty) {
  _.each(methods, function(method) {
    object[method] = function() {
      const list = _.values(_.result(this, listProperty));
      const args = [list].concat(_.toArray(arguments));
      return _[method].apply(_, args);
    };
  });
};

export default emulateCollection;
