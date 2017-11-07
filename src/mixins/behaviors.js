import _ from 'underscore';
import _invoke from '../utils/invoke';
import triggerMethod from '../common/trigger-method';
import MarionetteError from '../error';

// MixinOptions
// - behaviors

// Takes care of getting the behavior class
// given options and a key.
// If a user passes in options.behaviorClass
// default to using that.
// If a user passes in a Behavior Class directly, use that
// Otherwise an error is thrown
function getBehaviorClass(options) {
  if (options.behaviorClass) {
    return { BehaviorClass: options.behaviorClass, options };
  }

  //treat functions as a Behavior constructor
  if (_.isFunction(options)) {
    return { BehaviorClass: options, options: {} };
  }

  throw new MarionetteError('Unable to get behavior class. A Behavior constructor should be passed directly or as behaviorClass property of options');
}

// Iterate over the behaviors object, for each behavior
// instantiate it and get its grouped behaviors.
// This accepts a list of behaviors in either an object or array form
function parseBehaviors(view, behaviors, allBehaviors) {
  return _.reduce(behaviors, (reducedBehaviors, behaviorDefiniton) => {
    const { BehaviorClass, options } = getBehaviorClass(behaviorDefiniton);
    const behavior = new BehaviorClass(options, view);
    reducedBehaviors.push(behavior);

    return parseBehaviors(view, _.result(behavior, 'behaviors'), reducedBehaviors);
  }, allBehaviors);
}

export default {
  _initBehaviors() {
    this._behaviors = parseBehaviors(this, _.result(this, 'behaviors'), []);
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

    // Remove behavior-only triggers and events
    this.undelegate(`.trig${ behavior.cid } .${ behavior.cid }`);

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
