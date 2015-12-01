import _                        from 'underscore';
import _getValue                from '../utils/_getValue';
import getOption                from '../utils/getOption';
import { _triggerMethod }       from '../trigger-method';
import Marionette               from '../backbone.marionette';

// Takes care of getting the behavior class
// given options and a key.
// If a user passes in options.behaviorClass
// default to using that.
// If a user passes in a Behavior Class directly, use that
// Otherwise delegate the lookup to the users `behaviorsLookup` implementation.
function getBehaviorClass(options, key) {
  if (options.behaviorClass) {
    return options.behaviorClass;
    //treat functions as a Behavior constructor
  } else if (_.isFunction(options)) {
    return options;
  }

  // behaviorsLookup can be either a flat object or a method
  return _getValue(Marionette.Behaviors.behaviorsLookup, this, [options, key])[key];
}

// Iterate over the behaviors object, for each behavior
// instantiate it and get its grouped behaviors.
// This accepts a list of behaviors in either an object or array form
function parseBehaviors(view, behaviors) {
  return _.chain(behaviors).map(function(options, key) {
    var BehaviorClass = getBehaviorClass(options, key);
    //if we're passed a class directly instead of an object
    var _options = options === BehaviorClass ? {} : options;
    var behavior = new BehaviorClass(_options, view);
    var nestedBehaviors = parseBehaviors(view, _.result(behavior, 'behaviors'));

    return [behavior].concat(nestedBehaviors);
  }).flatten().value();
}

export default {
  _initBehaviors: function() {
    var behaviors = _getValue(this.getOption('behaviors'), this);

    // Behaviors defined on a view can be a flat object literal
    // or it can be a function that returns an object.
    this._behaviors = _.isObject(behaviors) ? parseBehaviors(this, behaviors) : {};
  },

  _getBehaviorTriggers: function() {
    return _.reduce(this._behaviors, function(triggers, behavior) {
      return _.extend(triggers, behavior._getTriggers());
    }, {});
  },

  _getBehaviorEvents: function() {
    return _.reduce(this._behaviors, function(events, behavior) {
      return _.extend(events, behavior._getEvents());
    }, {});
  },

  // proxy behavior $el to the view's $el.
  _proxyBehaviorViewProperties: function() {
    _.invoke(this._behaviors, 'proxyViewProperties');
  },

  // delegate modelEvents and collectionEvents
  _delegateBehaviorEntityEvents: function() {
    _.invoke(this._behaviors, 'delegateEntityEvents');
  },

  // undelegate modelEvents and collectionEvents
  _undelegateBehaviorEntityEvents: function() {
    _.invoke(this._behaviors, 'undelegateEntityEvents');
  },

  _destroyBehaviors: function(args) {
    // Call destroy on each behavior after
    // destroying the view.
    // This unbinds event listeners
    // that behaviors have registered for.
    _.invoke(this._behaviors, 'destroy', args);
  },

  _bindBehaviorUIElements: function() {
    _.invoke(this._behaviors, 'bindUIElements');
  },

  _unbindBehaviorUIElements: function() {
    _.invoke(this._behaviors, 'unbindUIElements');
  },

  _triggerEventOnBehaviors: function(args) {
    var triggerMethod = _triggerMethod;
    var behaviors = this._behaviors;
    // Use good ol' for as this is a very hot function
    for (var i = 0, length = behaviors && behaviors.length; i < length; i++) {
      triggerMethod(behaviors[i], args);
    }
  }
};
