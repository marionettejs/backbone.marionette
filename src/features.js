Marionette.FEATURES = {
  'classify': false,
  'class':  false
};

Marionette.isEnabled = function(name) {
  return !!Marionette.FEATURES[name];
};
