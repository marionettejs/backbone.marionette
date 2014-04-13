/* jshint maxlen: 143, nonew: false */
// Marionette.Behaviors
// --------

// Behaviors is a utility class that takes care of
// glueing your behavior instances to their given View.
// The most important part of this class is that you
// **MUST** override the class level behaviorsLookup
// method for things to work properly.

Marionette.Behaviors = (function(Marionette, _) {

  function Behaviors(view, behaviors) {
    // Behaviors defined on a view can be a flat object literal
    // or it can be a function that returns an object.
    behaviors = Behaviors.parseBehaviors(view, behaviors || _.result(view, 'behaviors'));

    // Wraps several of the view's methods
    // calling the methods first on each behavior
    // and then eventually calling the method on the view.
    Behaviors.wrap(view, behaviors, [
      'bindUIElements', 'unbindUIElements',
      'delegateEvents', 'undelegateEvents',
      'behaviorEvents', 'triggerMethod',
      'setElement', 'destroy'
    ]);
  }

  var methods = {
    setElement: function(setElement, behaviors) {
      setElement.apply(this, _.tail(arguments, 2));

      // proxy behavior $el to the view's $el.
      // This is needed because a view's $el proxy
      // is not set until after setElement is called.
      _.each(behaviors, function(b) {
        b.$el = this.$el;
      }, this);
    },

    destroy: function(destroy, behaviors) {
      var args = _.tail(arguments, 2);
      destroy.apply(this, args);

      // Call close on each behavior after
      // closing down the view.
      // This unbinds event listeners
      // that behaviors have registerd for.
      _.invoke(behaviors, 'destroy', args);
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

      _.each(behaviors, function(b) {
        Marionette.bindEntityEvents(b, this.model, Marionette.getOption(b, 'modelEvents'));
        Marionette.bindEntityEvents(b, this.collection, Marionette.getOption(b, 'collectionEvents'));
      }, this);
    },

    undelegateEvents: function(undelegateEvents, behaviors) {
      var args = _.tail(arguments, 2);
      undelegateEvents.apply(this, args);

      _.each(behaviors, function(b) {
        Marionette.unbindEntityEvents(b, this.model, Marionette.getOption(b, 'modelEvents'));
        Marionette.unbindEntityEvents(b, this.collection, Marionette.getOption(b, 'collectionEvents'));
      }, this);
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
      throw new Error('You must define where your behaviors are stored.' +
        'See https://github.com/marionettejs/backbone.marionette' +
        '/blob/master/docs/marionette.behaviors.md#behaviorslookup');
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

  return Behaviors;

})(Marionette, _);
