Marionette.Behaviors = (function(Marionette, _) {

  function Behaviors(view) {
    this.behaviors = Behaviors.parseBehaviors(view, view.behaviors);

    Behaviors.wrap(view, this.behaviors, [
      'bindUIElements', 'unbindUIElements',
      'delegateEvents', 'undelegateEvents',
      'onShow', 'onClose',
      'behaviorEvents', 'triggerMethod'
    ]);
  }

  var methods = {
    onShow: function(onShow, behaviors) {
      var args = _.tail(arguments, 2);

      _.each(behaviors, function(b) {
        Marionette.triggerMethod.apply(b, ["show"].concat(args));
      });

      if (_.isFunction(onShow)) {
        onShow.apply(this, args);
      }
    },

    onClose: function(onClose, behaviors){
      var args = _.tail(arguments, 2);

      _.each(behaviors, function(b) {
        Marionette.triggerMethod.apply(b, ["close"].concat(args));
      });

      if (_.isFunction(onClose)) {
        onClose.apply(this, args);
      }
    },

    bindUIElements: function(bindUIElements, behaviors) {
      bindUIElements.apply(this);
      _.invoke(behaviors, bindUIElements);
    },

    unbindUIElements: function(unbindUIElements, behaviors) {
      unbindUIElements.apply(this);
      _.invoke(behaviors, unbindUIElements);
    },

    triggerMethod: function(triggerMethod, behaviors) {
      var args = _.tail(arguments, 2);
      triggerMethod.apply(this, args);

      _.each(behaviors, function(b) {
        triggerMethod.apply(b, args);
      });
    },

    delegateEvents: function(delegateEvents, behaviors) {
      var args = _.tail(arguments, 2);
      delegateEvents.apply(this, args);

      _.each(behaviors, function(b){
        Marionette.bindEntityEvents(this, this.model, Marionette.getOption(b, "modelEvents"));
        Marionette.bindEntityEvents(this, this.collection, Marionette.getOption(b, "collectionEvents"));
      }, this);
    },

    undelegateEvents: function(undelegateEvents, behaviors) {
      var args = _.tail(arguments, 2);
      undelegateEvents.apply(this, args);

      _.each(behaviors, function(b) {
        Marionette.unbindEntityEvents(this, this.model, Marionette.getOption(b, "modelEvents"));
        Marionette.unbindEntityEvents(this, this.collection, Marionette.getOption(b, "collectionEvents"));
      }, this);
    },

    behaviorEvents: function(behaviorEvents, behaviors) {
      var _behaviorsEvents = {};

      _.each(behaviors, function(b, i) {
        var behaviorEvents = _.result(b, 'events') || {};
        var _events = {};

        _.each(_.keys(behaviorEvents), function(key) {
          // append white-space at the end of each key to prevent behavior key collisions
          // this is relying on the fact backbone events considers "click .foo" the same  "click .foo "
          var whitespace = (new Array(i+1)).join(" ");
          _events[key + whitespace] = behaviorEvents[key];
        });

        _behaviorsEvents = _.extend(_behaviorsEvents, _events);
      });

      return _behaviorsEvents;
    }
 };

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

    getBehaviorClass: function(options, key) {
      if (options.behaviorClass) {
        return options.behaviorClass;
      }

      return Behaviors.behaviorsLookup[key];
    },

    parseBehaviors: function(view, behaviors){
      // if behaviors is an array
      if (_.isArray(behaviors)) {
        return _.map(behaviors, function(v){
          var key     = _.keys(v)[0];
          var options = _.values(v)[0];
          var BehaviorClass = Behaviors.getBehaviorClass(options, key);
          return new BehaviorClass(options, view);
        });
      }

      // if behaviors is a flat object
      return _.map(behaviors, function(options, key){
        var BehaviorClass = Behaviors.getBehaviorClass(options, key);
        return new BehaviorClass(options, view);
      });
    },

    // wrap view internal methods so that they delegate to behaviors.
    // For example, onClose should trigger close on all of the behaviors and then close itself.
    // i.e.
    //
    // view.delegateEvents = _.partial(methods.delegateEvents, view.delegateEvents, behaviors);
    wrap: function(view, behaviors, methodNames) {
      _.each(methodNames, function(methodName) {
        view[methodName] = _.partial(methods[methodName], view[methodName], behaviors);
      });
    }
  });

  return Behaviors;

})(Marionette, _);
