Marionette.Behavior = (function(_, Backbone){
  function Behavior(options, view){
    this.view = view;
    this.defaults = _.result(this, "defaults") || {};
    this.options  = _.extend({}, this.defaults, options);

    // proxy behavior $ method to the view
    this.$ = function() {
      return this.view.$.apply(this.view, arguments);
    };

    // proxy behavior $el method to the view
    this.$el = function() {
      return this.view.$el.apply(this.view, arguments);
    };

    this.initialize.apply(this, arguments);
  }

  _.extend(Behavior.prototype, {
    initialize: function(){},

    triggerMethod: Marionette.triggerMethod
  });

  // Borrow Backbones extend implementation
  _.extend(Behavior, {
    extend: Backbone.View.extend
  });

  return Behavior;
})(_, Backbone);
