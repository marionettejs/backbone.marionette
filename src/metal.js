var Class = Marionette.Class = Metal.Class.extend({
  constructor: function(options) {
    this.options = options || {};
    this.initialize.apply(this, arguments);
  },

  destroy: function() {
    this.triggerMethod('before:destroy');
    this.triggerMethod('destroy');
    this.stopListening();
  }
});

Marionette.Mixin = Class.extend.call(Metal.Mixin);

Marionette.deprecate = Metal.deprecate;

Marionette.Error = Metal.Error.extend({
  urlRoot: 'http://marionettejs.com/docs/v' + Marionette.VERSION + '/'
});
