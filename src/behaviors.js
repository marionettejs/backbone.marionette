/* jshint maxlen: 143 */
// Behaviors
// ---------

// Behaviors is a utility class that takes care of
// gluing your behavior instances to their given View.
// The most important part of this class is that you
// **MUST** override the class level behaviorsLookup
// method for things to work properly.

Marionette.Behaviors = (function(Marionette, _) {
  // Borrow event splitter from Backbone
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  function Behaviors(view, behaviors) {

    if (!_.isObject(view.behaviors)) {
      return {};
    }

    // Behaviors defined on a view can be a flat object literal
    // or it can be a function that returns an object.
    behaviors = Behaviors.parseBehaviors(view, behaviors || _.result(view, 'behaviors'));

    // Wraps several of the view's methods
    // calling the methods first on each behavior
    // and then eventually calling the method on the view.
    Behaviors.wrap(view, behaviors, _.keys(methods));
    return behaviors;
  }

  var methods = {
    behaviorTriggers: function(behaviorTriggers, behaviors) {
      var triggerBuilder = new BehaviorTriggersBuilder(this, behaviors);
      return triggerBuilder.buildBehaviorTriggers();
    },

    behaviorEvents: function(behaviorEvents, behaviors) {
      var _behaviorsEvents = {};

      _.each(behaviors, function(b, i) {
        var _events = {};
        var behaviorEvents = _.clone(_.result(b, 'events')) || {};

        // Normalize behavior events hash to allow
        // a user to use the @ui. syntax.
        behaviorEvents = Marionette.normalizeUIKeys(behaviorEvents, getBehaviorsUI(b));

        var j = 0;
        _.each(behaviorEvents, function(behaviour, key) {
          var match     = key.match(delegateEventSplitter);

          // Set event name to be namespaced using the view cid,
          // the behavior index, and the behavior event index
          // to generate a non colliding event namespace
          // http://api.jquery.com/event.namespace/
          var eventName = match[1] + '.' + [this.cid, i, j++, ' '].join('');
          var selector  = match[2];

          var eventKey  = eventName + selector;
          var handler   = _.isFunction(behaviour) ? behaviour : b[behaviour];

          _events[eventKey] = _.bind(handler, b);
        }, this);

        _behaviorsEvents = _.extend(_behaviorsEvents, _events);
      }, this);

      return _behaviorsEvents;
    }
  };

  _.extend(Behaviors, {

    // Placeholder method to be extended by the user.
    // The method should define the object that stores the behaviors.
    // i.e.
    //
    // ```js
    // Marionette.Behaviors.behaviorsLookup: function() {
    //   return App.Behaviors
    // }
    // ```
    behaviorsLookup: function() {
      throw new Marionette.Error({
        message: 'You must define where your behaviors are stored.',
        url: 'marionette.behaviors.html#behaviorslookup'
      });
    },

    // Takes care of getting the behavior class
    // given options and a key.
    // If a user passes in options.behaviorClass
    // default to using that. Otherwise delegate
    // the lookup to the users `behaviorsLookup` implementation.
    getBehaviorClass: function(options, key) {
      if (options.behaviorClass) {
        return options.behaviorClass;
      }

      // Get behavior class can be either a flat object or a method
      return Marionette._getValue(Behaviors.behaviorsLookup, this, [options, key])[key];
    },

    // Iterate over the behaviors object, for each behavior
    // instantiate it and get its grouped behaviors.
    parseBehaviors: function(view, behaviors) {
      return _.chain(behaviors).map(function(options, key) {
        var BehaviorClass = Behaviors.getBehaviorClass(options, key);

        var behavior = new BehaviorClass(options, view);
        var nestedBehaviors = Behaviors.parseBehaviors(view, _.result(behavior, 'behaviors'));

        return [behavior].concat(nestedBehaviors);
      }).flatten().value();
    },

    // Wrap view internal methods so that they delegate to behaviors. For example,
    // `onDestroy` should trigger destroy on all of the behaviors and then destroy itself.
    // i.e.
    //
    // `view.delegateEvents = _.partial(methods.delegateEvents, view.delegateEvents, behaviors);`
    wrap: function(view, behaviors, methodNames) {
      _.each(methodNames, function(methodName) {
        view[methodName] = _.partial(methods[methodName], view[methodName], behaviors);
      });
    }
  });

  // Class to build handlers for `triggers` on behaviors
  // for views
  function BehaviorTriggersBuilder(view, behaviors) {
    this._view      = view;
    this._behaviors = behaviors;
    this._triggers  = {};
  }

  _.extend(BehaviorTriggersBuilder.prototype, {
    // Main method to build the triggers hash with event keys and handlers
    buildBehaviorTriggers: function() {
      _.each(this._behaviors, this._buildTriggerHandlersForBehavior, this);
      return this._triggers;
    },

    // Internal method to build all trigger handlers for a given behavior
    _buildTriggerHandlersForBehavior: function(behavior, i) {
      var triggersHash = _.clone(_.result(behavior, 'triggers')) || {};

      triggersHash = Marionette.normalizeUIKeys(triggersHash, getBehaviorsUI(behavior));

      _.each(triggersHash, _.bind(this._setHandlerForBehavior, this, behavior, i));
    },

    // Internal method to create and assign the trigger handler for a given
    // behavior
    _setHandlerForBehavior: function(behavior, i, eventName, trigger) {
      // Unique identifier for the `this._triggers` hash
      var triggerKey = trigger.replace(/^\S+/, function(triggerName) {
        return triggerName + '.' + 'behaviortriggers' + i;
      });

      this._triggers[triggerKey] = this._view._buildViewTrigger(eventName);
    }
  });

  function getBehaviorsUI(behavior) {
    return behavior._uiBindings || behavior.ui;
  }

  return Behaviors;

})(Marionette, _);
