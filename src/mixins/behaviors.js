import _                        from 'underscore';
import _getValue                from '../utils/_getValue';
import getOption                from '../utils/getOption';
import { _triggerMethod }       from '../trigger-method';
import normalizeUIKeys          from '../utils/normalizeUIKeys';
import BehaviorTriggersBuilder  from '../utils/behavior-trigger-builder';
import parseBehaviors           from '../utils/parseBehaviors';

// Borrow event splitter from Backbone
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

function getBehaviorsUI(behavior) {
  return behavior._uiBindings || behavior.ui;
}

export default {
  _initBehaviors: function() {
    var behaviors = _getValue(this.getOption('behaviors'), this);
    var instanciatedBehaviors = {};

    // Behaviors defined on a view can be a flat object literal
    // or it can be a function that returns an object.
    if (_.isObject(this.behaviors)) {
      instanciatedBehaviors = parseBehaviors(this, behaviors);
    }

    this._behaviors = instanciatedBehaviors;
    return behaviors;
  },

  _getBehaviorEvents: function() {
    return _.result(this, 'behaviorEvents', {});
  },

  _getBehaviorTriggers: function() {
    return _.result(this, 'behaviorTriggers', {});
  },

  behaviorTriggers: function(unusedBehaviorTriggers) {
    var triggerBuilder = new BehaviorTriggersBuilder(this, this._behaviors);
    return triggerBuilder.buildBehaviorTriggers();
  },

  behaviorEvents: function(unusedBehaviorEvents) {
    var _behaviorsEvents = {};

    _.each(this._behaviors, function(b, i) {
      var _events = {};
      var behaviorEvents = _.clone(_.result(b, 'events')) || {};

      // Normalize behavior events hash to allow
      // a user to use the @ui. syntax.
      behaviorEvents = normalizeUIKeys(behaviorEvents, getBehaviorsUI(b));

      var j = 0;
      _.each(behaviorEvents, function(behaviorHandler, key) {
        var match     = key.match(delegateEventSplitter);

        // Set event name to be namespaced using the view cid,
        // the behavior index, and the behavior event index
        // to generate a non colliding event namespace
        // http://api.jquery.com/event.namespace/
        var eventName = match[1] + '.' + [this.cid, i, j++, ' '].join('');
        var selector  = match[2];

        var eventKey  = eventName + selector;
        var handler   = _.isFunction(behaviorHandler) ? behaviorHandler : b[behaviorHandler];

        _events[eventKey] = _.bind(handler, b);
      }, this);

      _behaviorsEvents = _.extend(_behaviorsEvents, _events);
    }, this);

    return _behaviorsEvents;
  },

  _proxyBehaviorViewProperties: function() {
    // proxy behavior $el to the view's $el.
    _.invoke(this._behaviors, 'proxyViewProperties', this);
  },

  _delegateBehaviorEntityEvents: function() {
    _.each(this._behaviors, function(behavior) {
      behavior.bindEntityEvents(this.model, behavior.getOption('modelEvents'));
      behavior.bindEntityEvents(this.collection, behavior.getOption('collectionEvents'));
    }, this);
  },

  _undelegateBehaviorEntityEvents: function() {
    _.each(this._behaviors, function(behavior) {
      behavior.unbindEntityEvents(this.model, behavior.getOption('modelEvents'));
      behavior.unbindEntityEvents(this.collection, behavior.getOption('collectionEvents'));
    }, this);
  },

  _destroyBehaviors: function(args) {
    // Call destroy on each behavior after
    // destroying the view.
    // This unbinds event listeners
    // that behaviors have registered for.
    _.invoke(this._behaviors, 'destroy', args);
  },

  _bindBehaviorUIElements: function() {
    _.invoke(this._behaviors, this._bindUIElements);
  },

  _unbindBehaviorUIElements: function() {
    _.invoke(this._behaviors, this._unbindUIElements);
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
