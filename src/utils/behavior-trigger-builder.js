import _                        from 'underscore';
import normalizeUIKeys          from '../utils/normalizeUIKeys';

// Class to build handlers for `triggers` on behaviors
// for views
function BehaviorTriggersBuilder(view, behaviors) {
  this._view      = view;
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
    var triggersHash = _.clone(_.result(behavior, 'triggers')) || {};

    triggersHash = normalizeUIKeys(triggersHash, getBehaviorsUI(behavior));

    _.each(triggersHash, _.bind(this._setHandlerForBehavior, this, behavior, i));
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

function getBehaviorsUI(behavior) {
  return behavior._uiBindings || behavior.ui;
}

export default BehaviorTriggersBuilder;
