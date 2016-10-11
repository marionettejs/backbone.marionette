// Mix in methods from Underscore, for iteration, and other
// collection related features.
// Borrowing this code from Backbone.Collection:
// https://github.com/jashkenas/backbone/blob/1.3.3/backbone.js#L99

import _ from 'underscore';

const collectionMethods = {
  forEach: 3, each: 3, map: 3, collect: 3, reduce: 0,
  foldl: 0, inject: 0, reduceRight: 0, foldr: 0, find: 3, detect: 3, filter: 3,
  select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 3, includes: 3,
  contains: 3, invoke: 0, max: 3, min: 3, toArray: 1, size: 1, first: 3,
  head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3,
  without: 0, difference: 0, indexOf: 3, shuffle: 1, lastIndexOf: 3,
  isEmpty: 1, chain: 1, sample: 3, partition: 3, groupBy: 3, countBy: 3,
  sortBy: 3, indexBy: 3, findIndex: 3, findLastIndex: 3
};

const emulateCollection = function(object, listProperty) {
  _.each(collectionMethods, function(length, method) {
    if (_[method]) {
      object.prototype[method] = addMethod(length, method, listProperty);
    }
  });
};

// Proxy Backbone class methods to Underscore functions, wrapping the model's
// `attributes` object or collection's `models` array behind the scenes.
//
// collection.filter(function(model) { return model.get('age') > 10 });
// collection.each(this.addView);
//
// `Function#apply` can be slow so we use the method's arg count, if we know it.
const addMethod = function(length, method, attribute) {
  switch (length) {
    case 1: return function() {
      return _[method](this[attribute]);
    };
//    case 2: return function(value) {
//      return _[method](this[attribute], value);
//    };
    case 3: return function(iteratee, context) {
      return _[method](this[attribute], iteratee, context);
    };
//    case 4: return function(iteratee, defaultVal, context) {
//      return _[method](this[attribute], iteratee, defaultVal, context);
//    };
    default: return function() {
      const args = Array.prototype.slice.call(arguments);
      args.unshift(this[attribute]);
      return _[method].apply(_, args);
    };
  }
};

export default emulateCollection;
