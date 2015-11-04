Marionette.FEATURES = {
};

Marionette.isEnabled = function(name) {
  return !!Marionette.FEATURES[name];
};
