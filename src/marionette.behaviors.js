/* jshint maxlen: 143 */
// Marionette.Behaviors
// --------

// Behaviors is a utility class that takes care of
// glueing your behavior instances to their given View.
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

    return behaviors;
  }


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
      throwError('You must define where your behaviors are stored. ' +
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
    }
  });


  return Behaviors;

})(Marionette, _);
