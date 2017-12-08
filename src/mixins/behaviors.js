import _ from 'underscore';
import MarionetteError from '../utils/error';
import _invoke from '../utils/invoke';

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

  throw new MarionetteError({
    message: 'Unable to get behavior class. A Behavior constructor should be passed directly or as behaviorClass property of options',
    url: 'marionette.behavior.html#defining-and-attaching-behaviors'
  });
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
    const triggers = _invoke(this._behaviors, '_getTriggers');
    return _.reduce(triggers, function(memo, _triggers) {
      return _.extend(memo, _triggers);
    }, {});
  },

  _getBehaviorEvents() {
    const events = _invoke(this._behaviors, '_getEvents');
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

  _destroyBehaviors(options) {
    // Call destroy on each behavior after
    // destroying the view.
    // This unbinds event listeners
    // that behaviors have registered for.
    _invoke(this._behaviors, 'destroy', options);
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

  _triggerEventOnBehaviors(eventName, view, options) {
    _invoke(this._behaviors, 'triggerMethod', eventName, view, options);
  }
};
