Marionette.FEATURES = {
  'class':  false
};

Marionette.isEnabled = function(name) {
  return !!Marionette.FEATURES[name];
};
