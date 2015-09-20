// Missing Metal Items
// 1. Marionette.Class parity
// 2. Marionette.Deprecate

if (Marionette.isEnabled('class')) {
  Marionette.Class = Metal.Class.extend({});
}

function classify(obj) {
  return Marionette.Class.extend(
    _.extend(
      {constructor: obj},
      _.omit(obj.prototype, _.keys(Marionette.Class.prototype))
    )
  );
}

if (Marionette.isEnabled('class')) {
  Backbone.View         = classify(Backbone.View);
  Marionette.Mixin      = Metal.Mixin;
  Marionette.Events     = Backbone.Events     = new Marionette.Mixin(Backbone.Events);
  Marionette.Model      = Backbone.Model      = classify(Backbone.Model);
  Marionette.Collection = Backbone.Collection = classify(Backbone.Collection);
  Marionette.Router     = Backbone.Router     = classify(Backbone.Router);
  Marionette.History    = Backbone.History    = classify(Backbone.History);
  Marionette.history    = Backbone.history    = new Marionette.History();
}
