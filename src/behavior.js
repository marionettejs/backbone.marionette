// Behavior
// --------

// A Behavior is an isolated set of DOM /
// user interactions that can be mixed into any View.
// Behaviors allow you to blackbox View specific interactions
// into portable logical chunks, keeping your views simple and your code DRY.

import _ from 'underscore';
import deprecate from './utils/deprecate';
import getUniqueEventName from './utils/get-unique-event-name';
import MarionetteObject from './object';
import DelegateEntityEventsMixin from './mixins/delegate-entity-events';
import TriggersMixin from './mixins/triggers';
import UIMixin from './mixins/ui';

const ClassOptions = [
  'collectionEvents',
  'events',
  'modelEvents',
  'triggers',
  'ui'
];

const Behavior = MarionetteObject.extend({
  cidPrefix: 'mnb',

  constructor(options, view) {
    // Setup reference to the view.
    // this comes in handle when a behavior
    // wants to directly talk up the chain
    // to the view.
    this.view = view;

    if (this.defaults) {
      deprecate('Behavior defaults are deprecated. For similar functionality set options on the Behavior class.');
    }

    this.defaults = _.clone(_.result(this, 'defaults', {}));

    this._setOptions(this.defaults, options);
    this.mergeOptions(this.options, ClassOptions);

    // Construct an internal UI hash using
    // the behaviors UI hash and then the view UI hash.
    // This allows the user to use UI hash elements
    // defined in the parent view as well as those
    // defined in the given behavior.
    // This order will help the reuse and share of a behavior
    // between multiple views, while letting a view override a
    // selector under an UI key.
    this.ui = _.extend({}, _.result(this, 'ui'), _.result(view, 'ui'));

    MarionetteObject.apply(this, arguments);
  },

  // proxy behavior $ method to the view
  // this is useful for doing jquery DOM lookups
  // scoped to behaviors view.
  $() {
    return this.view.$.apply(this.view, arguments);
  },

  // Stops the behavior from listening to events.
  // Overrides Object#destroy to prevent additional events from being triggered.
  destroy() {
    this.stopListening();

    this.view._removeBehavior(this);

    return this;
  },

  proxyViewProperties() {
    this.$el = this.view.$el;
    this.el = this.view.el;

    return this;
  },

  bindUIElements() {
    this._bindUIElements();

    return this;
  },

  unbindUIElements() {
    this._unbindUIElements();

    return this;
  },

  getUI(name) {
    return this._getUI(name);
  },

  // Handle `modelEvents`, and `collectionEvents` configuration
  delegateEntityEvents() {
    this._delegateEntityEvents(this.view.model, this.view.collection);

    return this;
  },

  undelegateEntityEvents() {
    this._undelegateEntityEvents(this.view.model, this.view.collection);

    return this;
  },

  getEvents() {
    // Normalize behavior events hash to allow
    // a user to use the @ui. syntax.
    const behaviorEvents = this.normalizeUIKeys(_.result(this, 'events'));

    // binds the handler to the behavior and builds a unique eventName
    return _.reduce(behaviorEvents, (events, behaviorHandler, key) => {
      if (!_.isFunction(behaviorHandler)) {
        behaviorHandler = this[behaviorHandler];
      }
      if (!behaviorHandler) { return; }
      key = getUniqueEventName(key);
      events[key] = _.bind(behaviorHandler, this);
      return events;
    }, {});
  },

  // Internal method to build all trigger handlers for a given behavior
  getTriggers() {
    if (!this.triggers) { return; }

    // Normalize behavior triggers hash to allow
    // a user to use the @ui. syntax.
    const behaviorTriggers = this.normalizeUIKeys(_.result(this, 'triggers'));

    return this._getViewTriggers(this.view, behaviorTriggers);
  }

});

_.extend(Behavior.prototype, DelegateEntityEventsMixin, TriggersMixin, UIMixin);

export default Behavior;
