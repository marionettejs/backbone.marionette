
var exports = {
  FEATURES = {},

  isEnabled: function(name) {
    return !!exports.FEATURES[name];
  }
};

export default exports;
