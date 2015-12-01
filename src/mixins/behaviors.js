import _                        from 'underscore';
import Behaviors                from '../behaviors';
import _getValue                from '../utils/_getValue';
import getOption                from '../utils/getOption';
import { _triggerMethod }       from '../trigger-method';

export default {
  _initBehaviors: function() {
    var behaviors = _getValue(this.getOption('behaviors'), this);
    this._behaviors = Behaviors(this, behaviors);
  },

  _getBehaviorEvents: function() {
    return _.result(this, 'behaviorEvents', {});
  },

  _getBehaviorTriggers: function() {
    return _.result(this, 'behaviorTriggers', {});
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
