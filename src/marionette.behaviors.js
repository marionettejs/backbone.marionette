Marionette.Behaviors = (function(Marionette, _) {
  function Behaviors(view) {
    // lookup view behaviors from behaviors array or object
    this.behaviors = Behaviors.parseBehaviors(view, view.behaviors);

    var bindUIElements    = view.bindUIElements;
    var unbindUIElements  = view.unbindUIElements;

    var triggerMethod     = view.triggerMethod;
    var undelegateEvents  = view.undelegateEvents;
    var delegateEvents    = view.delegateEvents;

    // onShow and onClose are special cases because they are dispatched
    // via marionette.region and marionette.triggerMethod without
    // going through the view. Due to this fact we have to create
    // a fake handler method for the view to handle to behavior proxy
    var onShow            = view.onShow;
    var onClose           = view.onClose;

    var _this = this;

    view.behaviorEvents = function() {
      var behaviors = {};

      // mix down all of the behaviors events into
      // a single hash of events
      _.each(_this.behaviors, function(b, i) {
        var behaviorEvents = _.result(b, 'events') || {};
        var _events = {};

        _.each(_.keys(behaviorEvents), function(key) {
          // append white-space at the end of each key
          // to prevent behavior key collisions
          //
          // this is relying on the fact that
          // "click .foo" === "click .foo "
          // from within the backbone event context
          _events[key + (new Array(i+1)).join(" ")] = behaviorEvents[key];
        });

        behaviors = _.extend(behaviors, _events);
      });

      return behaviors;
    };

    view.onShow = function() {
      var args = arguments;

      _.each(_this.behaviors, function(b) {
        Marionette.triggerMethod.call(b, "show");
      });

      if (_.isFunction(onShow)) {
        onShow.apply(view);
      }
    };

    view.onClose = function(){
      var args = arguments;

      _.each(_this.behaviors, function(b) {
        Marionette.triggerMethod.call(b, "close");
      });

      if (_.isFunction(onClose)) {
        onClose.apply(view);
      }
    };

    view.bindUIElements = function() {
      bindUIElements.apply(view);

      _.each(_this.behaviors, function(b) {
        bindUIElements.apply(b);
      });
    };

    view.unbindUIElements = function() {
      unbindUIElements.apply(view);

      _.each(_this.behaviors, function(b) {
        unbindUIElements.apply(b);
      });
    };

    view.triggerMethod = function() {
      var args = arguments;
      // call the views trigger method
      triggerMethod.apply(view, args);

      // loop through each behavior and trigger methods
      _.each(_this.behaviors, function(b) {
        // call triggerMethod on each behavior
        // to proxy through any triggerMethod
        triggerMethod.apply(b, args);
      });
    };

    view.delegateEvents = function() {
      delegateEvents.apply(view, arguments);

      _.each(_this.behaviors, function(b){
        Marionette.bindEntityEvents(view, view.model, Marionette.getOption(b, "modelEvents"));
        Marionette.bindEntityEvents(view, view.collection, Marionette.getOption(b, "collectionEvents"));
      });
    };

    view.undelegateEvents = function() {
      undelegateEvents.apply(view, arguments);

      _.each(_this.behaviors, function(b) {
        Marionette.unbindEntityEvents(view, view.model, Marionette.getOption(b, "modelEvents"));
        Marionette.unbindEntityEvents(view, view.collection, Marionette.getOption(b, "collectionEvents"));
      });
    };
  }

  // Behavior class level method definitions
  _.extend(Behaviors, {
    // placeholder method to be extended by the user
    // should define the object that stores the behaviors
    // i.e.
    //
    // Marionette.Behaviors.behaviorsLookup: function() {
    //   return App.Behaviors
    // }
    behaviorsLookup: function() {
      throw new Error("You must define where your behaviors are stored. See http://www.marionette.com/using-behaviors");
    },

    parseBehaviors: function(view, behaviors) {
      return _.map(behaviors, function(options, key) {
        return new (_.result(Behaviors, "behaviorsLookup")[key])(options, view);
      });
    }
  });

  return Behaviors;

})(Marionette, _);
