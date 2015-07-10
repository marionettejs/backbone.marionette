// allows for the use of the @ui. syntax within
// a given key for triggers and events
// swaps the @ui with the associated selector.
// Returns a new, non-mutated, parsed events hash.
Marionette.normalizeUIKeys = function(hash, ui) {
  return _.reduce(hash, function(memo, val, key) {
    var normalizedKey = Marionette.normalizeUIString(key, ui);
    memo[normalizedKey] = val;
    return memo;
  }, {});
};
