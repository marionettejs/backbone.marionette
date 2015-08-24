
var FEATURES = {};

function isEnabled(name) {
  return !!FEATURES[name];
}

export default {
  FEATURES: FEATURES,
  isEnabled: isEnabled
};
