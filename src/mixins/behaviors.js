import _ from 'underscore';
import _invoke from '../utils/invoke';
import { triggerMethod } from '../common/trigger-method';
import Marionette from '../backbone.marionette';

// MixinOptions
// - behaviors

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
  if (_.isFunction(Marionette.Behaviors.behaviorsLookup)) {
    return Marionette.Behaviors.behaviorsLookup(options, key)[key];
  }

  return Marionette.Behaviors.behaviorsLookup[key];
}

// Iterate over the behaviors object, for each behavior
// instantiate it and get its grouped behaviors.
// This accepts a list of behaviors in either an object or array form
function parseBehaviors(view, behaviors) {
  return _.chain(behaviors).map(function(options, key) {
    const BehaviorClass = getBehaviorClass(options, key);
    //if we're passed a class directly instead of an object
    const _options = options === BehaviorClass ? {} : options;
    const behavior = new BehaviorClass(_options, view);
    const nestedBehaviors = parseBehaviors(view, _.result(behavior, 'behaviors'));

    return [behavior].concat(nestedBehaviors);
  }).flatten().value();
}

export default {
  _initBehaviors() {
    this._behaviors = this._getBehaviors();
  },

  _getBehaviors() {
    const behaviors = _.result(this, 'behaviors');

    // Behaviors defined on a view can be a flat object literal
    // or it can be a function that returns an object.
    return _.isObject(behaviors) ? parseBehaviors(this, behaviors) : {};
  },

  _getBehaviorTriggers() {
    const triggers = _invoke(this._behaviors, 'getTriggers');
    return _.reduce(triggers, function(memo, _triggers) {
      return _.extend(memo, _triggers);
    }, {});
  },

  _getBehaviorEvents() {
    const events = _invoke(this._behaviors, 'getEvents');
    return _.reduce(events, function(memo, _events) {
      return _.extend(memo, _events);
    }, {});
  },

  // proxy behavior $el to the view's $el.
  _proxyBehaviorViewProperties() {
    _invoke(this._behaviors, 'proxyViewProperties');
  },

  // delegate modelEvents and collectionEvents
  _delegateBehaviorEntityEvents() {
    _invoke(this._behaviors, 'delegateEntityEvents');
  },

  // undelegate modelEvents and collectionEvents
  _undelegateBehaviorEntityEvents() {
    _invoke(this._behaviors, 'undelegateEntityEvents');
  },

  _destroyBehaviors(...args) {
    // Call destroy on each behavior after
    // destroying the view.
    // This unbinds event listeners
    // that behaviors have registered for.
    _invoke(this._behaviors, 'destroy', ...args);
  },

  // Remove a behavior
  _removeBehavior(behavior) {
    // Don't worry about the clean up if the view is destroyed
    if (this._isDestroyed) { return; }
    this._behaviors = _.without(this._behaviors, behavior);
  },

  _bindBehaviorUIElements() {
    _invoke(this._behaviors, 'bindUIElements');
  },

  _unbindBehaviorUIElements() {
    _invoke(this._behaviors, 'unbindUIElements');
  },

  _triggerEventOnBehaviors() {
    const behaviors = this._behaviors;
    // Use good ol' for as this is a very hot function
    for (let i = 0, length = behaviors && behaviors.length; i < length; i++) {
      triggerMethod.apply(behaviors[i], arguments);
    }
  }
};
