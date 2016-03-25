import _                        from 'underscore';
import getValue                 from '../utils/getValue';
import _invoke                  from '../utils/_invoke';
import { triggerMethod }        from '../trigger-method';
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
  return getValue(Marionette.Behaviors.behaviorsLookup, options, key)[key];
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
    var behaviors = this.getValue(this.getOption('behaviors'));

    // Behaviors defined on a view can be a flat object literal
    // or it can be a function that returns an object.
    this._behaviors = _.isObject(behaviors) ? parseBehaviors(this, behaviors) : {};
  },

  _getBehaviorTriggers: function() {
    var triggers = _invoke(this._behaviors, 'getTriggers');
    return _.extend({}, ...triggers);
  },

  _getBehaviorEvents: function() {
    var events = _invoke(this._behaviors, 'getEvents');
    return _.extend({}, ...events);
  },

  // proxy behavior $el to the view's $el.
  _proxyBehaviorViewProperties: function() {
    _invoke(this._behaviors, 'proxyViewProperties');
  },

  // delegate modelEvents and collectionEvents
  _delegateBehaviorEntityEvents: function() {
    _invoke(this._behaviors, 'delegateEntityEvents');
  },

  // undelegate modelEvents and collectionEvents
  _undelegateBehaviorEntityEvents: function() {
    _invoke(this._behaviors, 'undelegateEntityEvents');
  },

  _destroyBehaviors: function(args) {
    // Call destroy on each behavior after
    // destroying the view.
    // This unbinds event listeners
    // that behaviors have registered for.
    _invoke(this._behaviors, 'destroy', ...args);
  },

  _bindBehaviorUIElements: function() {
    _invoke(this._behaviors, 'bindUIElements');
  },

  _unbindBehaviorUIElements: function() {
    _invoke(this._behaviors, 'unbindUIElements');
  },

  _triggerEventOnBehaviors: function(...args) {
    var behaviors = this._behaviors;
    // Use good ol' for as this is a very hot function
    for (var i = 0, length = behaviors && behaviors.length; i < length; i++) {
      triggerMethod.apply(behaviors[i], args);
    }
  }
};
