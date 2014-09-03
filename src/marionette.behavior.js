// Behavior
// -----------

// A Behavior is an isolated set of DOM /
// user interactions that can be mixed into any View.
// Behaviors allow you to blackbox View specific interactions
// into portable logical chunks, keeping your views simple and your code DRY.

Marionette.Behavior = (function(_, Backbone) {
  function Behavior(options, view) {
    // Setup reference to the view.
    // this comes in handle when a behavior
    // wants to directly talk up the chain
    // to the view.
    this.view = view;
    this.defaults = _.result(this, 'defaults') || {};
    this.options  = _.extend({}, this.defaults, options);

    // proxy behavior $ method to the view
    // this is useful for doing jquery DOM lookups
    // scoped to behaviors view.
    this.$ = function() {
      return this.view.$.apply(this.view, arguments);
    };

    // Call the initialize method passing
    // the arguments from the instance constructor
    this.initialize.apply(this, arguments);
  }

  _.extend(Behavior.prototype, Backbone.Events, {
    initialize: function() {},

    // stopListening to behavior `onListen` events.
    destroy: function() {
      this.stopListening();
    },

    // import the `triggerMethod` to trigger events with corresponding
    // methods if the method exists
    triggerMethod: Marionette.triggerMethod,

    // Proxy `getOption` to enable getting options from this or this.options by name.
    getOption: Marionette.proxyGetOption,

    // Proxy `unbindEntityEvents` to enable binding view's events from another entity.
    bindEntityEvents: Marionette.proxyBindEntityEvents,

    // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
    unbindEntityEvents: Marionette.proxyUnbindEntityEvents
  });

  // Borrow Backbones extend implementation
  // this allows us to setup a proper
  // inheritance pattern that follow in suite
  // with the rest of Marionette views.
  Behavior.extend = Marionette.extend;

  return Behavior;
})(_, Backbone);
