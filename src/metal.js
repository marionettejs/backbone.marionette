// Missing Metal Items
// 1. Marionette.Error
// 2. Marionette.Deprecate

Marionette.Class = Metal.Class.extend({
  constructor: function(options) {
    this.options = _.extend({}, _.result(this, 'options'), options);
    Marionette.proxyRadioHandlers.apply(this);
    this.cid = _.uniqueId(this.cidPrefix);
    this.initialize.apply(this, arguments);
  },

  cidPrefix: 'mnc',

  destroy: function() {
    this.triggerMethod('before:destroy');
    this.triggerMethod('destroy');
    Marionette.unproxyRadioHandlers.apply(this);
    this.stopListening();

    return this;
  },

  // Import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: Marionette.triggerMethod,

  // A handy way to merge options onto the instance
  mergeOptions: Marionette.mergeOptions,

  // Proxy `getOption` to enable getting options from this or this.options by name.
  getOption: Marionette.proxyGetOption,

  // Proxy `bindEntityEvents` to enable binding view's events from another entity.
  bindEntityEvents: Marionette.proxyBindEntityEvents,

  // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
  unbindEntityEvents: Marionette.proxyUnbindEntityEvents
});

var props = _.keys(Metal.Class.prototype);
function classify(obj) {
  return Marionette.Class.extend(
    _.extend(
      {constructor: obj},
      _.omit(obj.prototype, props)
    )
  );
}

Backbone.View         = classify(Backbone.View);
Marionette.Mixin      = Metal.Mixin;
Marionette.Events     = Backbone.Events     = new Marionette.Mixin(Backbone.Events);
Marionette.Model      = Backbone.Model      = classify(Backbone.Model);
Marionette.Collection = Backbone.Collection = classify(Backbone.Collection);
Marionette.Router     = Backbone.Router     = classify(Backbone.Router);
Marionette.History    = Backbone.History    = classify(Backbone.History);
Marionette.history    = Backbone.history    = new Marionette.History();
