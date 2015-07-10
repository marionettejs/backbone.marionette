/* jshint unused: false *//* global console */

// allows for the use of the @ui. syntax within
// a given value for regions
// swaps the @ui with the associated selector
Marionette.normalizeUIValues = function(hash, ui, properties) {
  _.each(hash, function(val, key) {
    if (_.isString(val)) {
      hash[key] = Marionette.normalizeUIString(val, ui);
    } else if (_.isObject(val) && _.isArray(properties)) {
      _.extend(val, Marionette.normalizeUIValues(_.pick(val, properties), ui));
      /* Value is an object, and we got an array of embedded property names to normalize. */
      _.each(properties, function(property) {
        var propertyVal = val[property];
        if (_.isString(propertyVal)) {
          val[property] = Marionette.normalizeUIString(propertyVal, ui);
        }
      });
    }
  });
  return hash;
};
