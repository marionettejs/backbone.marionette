Marionette.Class = Metal.Class.extend({
  // destroy: function() {
  //   this.triggerMethod('before:destroy');
  //   this.triggerMethod('destroy');
  //   this.stopListening();
  // },

  // Import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: Marionette.triggerMethod,

  // Proxy `getOption` to enable getting options from this or this.options by name.
  getOption: Marionette.proxyGetOption,

  // Proxy `bindEntityEvents` to enable binding view's events from another entity.
  bindEntityEvents: Marionette.proxyBindEntityEvents,

  // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
  unbindEntityEvents: Marionette.proxyUnbindEntityEvents

});

Marionette.Error = Metal.Error.extend({
  urlRoot: 'http://marionettejs.com/docs/v' + Marionette.VERSION + '/'
});

function classify(obj) {
  return Marionette.Class.extend(
    _.extend({ constructor: obj }, _.omit(obj.prototype, _.keys(Backbone.Events))),
    _.omit(obj, _.keys(Marionette.Class))
  );
}

Marionette.deprecate = Metal.deprecate;
Marionette.Mixin      = Metal.Mixin;
Marionette.Events     = Backbone.Events     = new Marionette.Mixin(Backbone.Events);
Marionette.Model      = Backbone.Model      = classify(Backbone.Model);
Marionette.Collection = Backbone.Collection = classify(Backbone.Collection);
Marionette.View       = Backbone.View       = classify(Backbone.View);
Marionette.Router     = Backbone.Router     = classify(Backbone.Router);
Marionette.History    = Backbone.History    = classify(Backbone.History);
Marionette.history    = Backbone.history    = new Marionette.History();
