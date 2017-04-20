// Add Feature flags here
// e.g. 'class' => false
const FEATURES = {
  childViewEventPrefix: true,
  triggersStopPropagation: true,
  triggersPreventDefault: true
};

function isEnabled(name) {
  return !!FEATURES[name];
}

function setEnabled(name, state) {
  return FEATURES[name] = state;
}

export {
  FEATURES,
  setEnabled,
  isEnabled
};
