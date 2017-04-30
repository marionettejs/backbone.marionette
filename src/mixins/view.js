// ViewMixin
//  ---------

import Backbone from 'backbone';
import _ from 'underscore';
import { triggerMethod } from '../common/trigger-method';
import BehaviorsMixin from './behaviors';
import CommonMixin from './common';
import DelegateEntityEventsMixin from './delegate-entity-events';
import DomMixin from './dom';
import TriggersMixin from './triggers';
import UIMixin from './ui';
import { isEnabled } from '../config/features';

// MixinOptions
// - behaviors
// - childViewEventPrefix
// - childViewEvents
// - childViewTriggers
// - collectionEvents
// - modelEvents
// - triggers
// - ui


const ViewMixin = {
  supportsRenderLifecycle: true,
  supportsDestroyLifecycle: true,

  _isDestroyed: false,

  isDestroyed() {
    return !!this._isDestroyed;
  },

  _isRendered: false,

  isRendered() {
    return !!this._isRendered;
  },

  _isAttached: false,

  isAttached() {
    return !!this._isAttached;
  },

  // Overriding Backbone.View's `delegateEvents` to handle
  // `events` and `triggers`
  delegateEvents(eventsArg) {

    this._proxyBehaviorViewProperties();
    this._buildEventProxies();

    const viewEvents = this._getEvents(eventsArg);

    if (typeof eventsArg === 'undefined') {
      this.events = viewEvents;
    }

    const combinedEvents = _.extend({},
      this._getBehaviorEvents(),
      viewEvents,
      this._getBehaviorTriggers(),
      this.getTriggers()
    );

    Backbone.View.prototype.delegateEvents.call(this, combinedEvents);

    return this;
  },

  _getEvents(eventsArg) {
    const events = eventsArg || this.events;

    if (_.isFunction(events)) {
      return this.normalizeUIKeys(events.call(this));
    }

    return this.normalizeUIKeys(events);
  },

  // Configure `triggers` to forward DOM events to view
  // events. `triggers: {"click .foo": "do:foo"}`
  getTriggers() {
    if (!this.triggers) { return; }

    // Allow `triggers` to be configured as a function
    const triggers = this.normalizeUIKeys(_.result(this, 'triggers'));

    // Configure the triggers, prevent default
    // action and stop propagation of DOM events
    return this._getViewTriggers(this, triggers);
  },

  // Handle `modelEvents`, and `collectionEvents` configuration
  delegateEntityEvents() {
    this._delegateEntityEvents(this.model, this.collection);

    // bind each behaviors model and collection events
    this._delegateBehaviorEntityEvents();

    return this;
  },

  // Handle unbinding `modelEvents`, and `collectionEvents` configuration
  undelegateEntityEvents() {
    this._undelegateEntityEvents(this.model, this.collection);

    // unbind each behaviors model and collection events
    this._undelegateBehaviorEntityEvents();

    return this;
  },

  // Handle destroying the view and its children.
  destroy(...args) {
    if (this._isDestroyed) { return this; }
    const shouldTriggerDetach = !!this._isAttached;

    this.triggerMethod('before:destroy', this, ...args);
    if (shouldTriggerDetach) {
      this.triggerMethod('before:detach', this);
    }

    // unbind UI elements
    this.unbindUIElements();

    // remove the view from the DOM
    this.removeEl(this.el);

    if (shouldTriggerDetach) {
      this._isAttached = false;
      this.triggerMethod('detach', this);
    }

    // remove children after the remove to prevent extra paints
    this._removeChildren();

    this._isDestroyed = true;
    this._isRendered = false;

    // Destroy behaviors after _isDestroyed flag
    this._destroyBehaviors(...args);

    this.triggerMethod('destroy', this, ...args);

    this.stopListening();

    return this;
  },

  bindUIElements() {
    this._bindUIElements();
    this._bindBehaviorUIElements();

    return this;
  },

  // This method unbinds the elements specified in the "ui" hash
  unbindUIElements() {
    this._unbindUIElements();
    this._unbindBehaviorUIElements();

    return this;
  },

  getUI(name) {
    return this._getUI(name);
  },

  // used as the prefix for child view events
  // that are forwarded through the layoutview
  childViewEventPrefix() {
    return isEnabled('childViewEventPrefix') ? 'childview' : false;
  },

  // import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod() {
    const ret = triggerMethod.apply(this, arguments);

    this._triggerEventOnBehaviors.apply(this, arguments);

    return ret;
  },

  // Cache `childViewEvents` and `childViewTriggers`
  _buildEventProxies() {
    this._childViewEvents = _.result(this, 'childViewEvents');
    this._childViewTriggers = _.result(this, 'childViewTriggers');
  },

  _proxyChildViewEvents(view) {
    this.listenTo(view, 'all', this._childViewEventHandler);
  },

  _childViewEventHandler(eventName, ...args) {
    const childViewEvents = this.normalizeMethods(this._childViewEvents);

    // call collectionView childViewEvent if defined
    if (typeof childViewEvents !== 'undefined' && _.isFunction(childViewEvents[eventName])) {
      childViewEvents[eventName].apply(this, args);
    }

    // use the parent view's proxyEvent handlers
    const childViewTriggers = this._childViewTriggers;

    // Call the event with the proxy name on the parent layout
    if (childViewTriggers && _.isString(childViewTriggers[eventName])) {
      this.triggerMethod(childViewTriggers[eventName], ...args);
    }

    const prefix = _.result(this, 'childViewEventPrefix');

    if (prefix !== false) {
      const childEventName = prefix + ':' + eventName;

      this.triggerMethod(childEventName, ...args);
    }
  }
};

_.extend(ViewMixin, DomMixin, BehaviorsMixin, CommonMixin, DelegateEntityEventsMixin, TriggersMixin, UIMixin);

export default ViewMixin;
