// Add Feature flags here
// e.g. 'class' => false
var FEATURES = {
};

function isEnabled(name) {
  return !!FEATURES[name];
}

function setEnabled(name, state) {
  return FEATURES[name] = state;
}

export default {
  FEATURES: FEATURES,
  setEnabled: setEnabled,
  isEnabled: isEnabled
};
