import _                 from 'underscore';
import normalizeUIString from './normalizeUIString';

// allows for the use of the @ui. syntax within
// a given key for triggers and events
// swaps the @ui with the associated selector.
// Returns a new, non-mutated, parsed events hash.
var normalizeUIKeys = function(hash, ui) {
  return _.reduce(hash, function(memo, val, key) {
    var normalizedKey = normalizeUIString(key, ui);
    memo[normalizedKey] = val;
    return memo;
  }, {});
};

export default normalizeUIKeys;
