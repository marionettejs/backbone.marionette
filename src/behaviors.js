/* jshint maxlen: 143 */
// Behaviors
// ---------

// Behaviors is a utility class that takes care of
// gluing your behavior instances to their given View.
// The most important part of this class is that you
// **MUST** override the class level behaviorsLookup
// method for things to work properly.

Marionette.Behaviors = (function(Marionette, _) {

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
      var viewUI = _.result(this, 'ui');

      _.each(behaviors, function(b, i) {
        var _events = {};
        var behaviorEvents = _.clone(_.result(b, 'events')) || {};
        var behaviorUI = _.result(b, 'ui');

        // Construct an internal UI hash first using
        // the views UI hash and then the behaviors UI hash.
        // This allows the user to use UI hash elements
        // defined in the parent view as well as those
        // defined in the given behavior.
        var ui = _.extend({}, viewUI, behaviorUI);

        // Normalize behavior events hash to allow
        // a user to use the @ui. syntax.
        behaviorEvents = Marionette.normalizeUIKeys(behaviorEvents, ui);

        _.each(_.keys(behaviorEvents), function(key) {
          // Append white-space at the end of each key to prevent behavior key collisions.
          // This is relying on the fact that backbone events considers "click .foo" the same as
          // "click .foo ".

          // +2 is used because new Array(1) or 0 is "" and not " "
          var whitespace = (new Array(i + 2)).join(' ');
          var eventKey   = key + whitespace;
          var handler    = _.isFunction(behaviorEvents[key]) ? behaviorEvents[key] : b[behaviorEvents[key]];

          _events[eventKey] = _.bind(handler, b);
        });

        _behaviorsEvents = _.extend(_behaviorsEvents, _events);
      });

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
      return _.isFunction(Behaviors.behaviorsLookup) ? Behaviors.behaviorsLookup.apply(this, arguments)[key] : Behaviors.behaviorsLookup[key];
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
    this._viewUI    = _.result(view, 'ui');
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
      var ui = _.extend({}, this._viewUI, _.result(behavior, 'ui'));
      var triggersHash = _.clone(_.result(behavior, 'triggers')) || {};

      triggersHash = Marionette.normalizeUIKeys(triggersHash, ui);

      _.each(triggersHash, _.partial(this._setHandlerForBehavior, behavior, i), this);
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

  return Behaviors;

})(Marionette, _);
