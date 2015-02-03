Marionette.Features = {
  behavior_trigger_proxy: false,
};


Marionette.Features.isEnabled = function(name) {
    return !!Marionette.Features[name];
};