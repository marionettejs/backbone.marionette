
exports = {
  FEATURES = {},

  isEnabled: function(name) {
    return !!exports.FEATURES[name];
  }
};
