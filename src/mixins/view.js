// ViewMixin
//  ---------

import Backbone from 'backbone';
import _ from 'underscore';
import MarionetteError from '../error';
import BehaviorsMixin from './behaviors';
import CommonMixin from './common';
import DelegateEntityEventsMixin from './delegate-entity-events';
import TriggersMixin from './triggers';
import UIMixin from './ui';
import View from '../view';
import { triggerMethod } from '../trigger-method';

var ViewMixin = {
  supportsRenderLifecycle: true,
  supportsDestroyLifecycle: true,

  _isDestroyed: false,

  isDestroyed: function() {
    return !!this._isDestroyed;
  },

  _isRendered: false,

  isRendered: function() {
    return !!this._isRendered;
  },

  _isAttached: false,

  isAttached() {
    return !!this._isAttached;
  },

  // Mix in template context methods. Looks for a
  // `templateContext` attribute, which can either be an
  // object literal, or a function that returns an object
  // literal. All methods and attributes from this object
  // are copies to the object passed in.
  mixinTemplateContext: function(target = {}) {
    const templateContext = this.getValue(this.getOption('templateContext'));
    return _.extend(target, templateContext);
  },

  // Overriding Backbone.View's `delegateEvents` to handle
  // `events` and `triggers`
  delegateEvents: function(eventsArg) {

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

  _getEvents: function(eventsArg) {
    const events = this.getValue(eventsArg || this.events);

    return this.normalizeUIKeys(events);
  },

  // Configure `triggers` to forward DOM events to view
  // events. `triggers: {"click .foo": "do:foo"}`
  getTriggers: function() {
    if (!this.triggers) { return; }

    // Allow `triggers` to be configured as a function
    const triggers = this.normalizeUIKeys(_.result(this, 'triggers'));

    // Configure the triggers, prevent default
    // action and stop propagation of DOM events
    return this._getViewTriggers(this, triggers);
  },

  // Handle `modelEvents`, and `collectionEvents` configuration
  delegateEntityEvents: function() {
    this._delegateEntityEvents(this.model, this.collection);

    // bind each behaviors model and collection events
    this._delegateBehaviorEntityEvents();

    return this;
  },

  // Handle unbinding `modelEvents`, and `collectionEvents` configuration
  undelegateEntityEvents: function() {
    this._undelegateEntityEvents(this.model, this.collection);

    // unbind each behaviors model and collection events
    this._undelegateBehaviorEntityEvents();

    return this;
  },

  // Internal helper method to verify whether the view hasn't been destroyed
  _ensureViewIsIntact: function() {
    if (this._isDestroyed) {
      throw new MarionetteError({
        name: 'ViewDestroyedError',
        message: 'View (cid: "' + this.cid + '") has already been destroyed and cannot be used.'
      });
    }
  },

  // Handle destroying the view and its children.
  destroy: function(...args) {
    if (this._isDestroyed) { return this; }
    const shouldTriggerDetach = !!this._isAttached;

    this.triggerMethod('before:destroy', this, ...args);
    if (shouldTriggerDetach) {
      this.triggerMethod('before:detach', this);
    }

    // unbind UI elements
    this.unbindUIElements();

    // remove the view from the DOM
    // https://github.com/jashkenas/backbone/blob/1.2.3/backbone.js#L1235
    this._removeElement();

    if (shouldTriggerDetach) {
      this._isAttached = false;
      this.triggerMethod('detach', this);
    }

    // remove children after the remove to prevent extra paints
    this._removeChildren();

    this._destroyBehaviors(args);

    this._isDestroyed = true;
    this._isRendered = false;
    this.triggerMethod('destroy', this, ...args);

    this.stopListening();

    return this;
  },

  bindUIElements: function() {
    this._bindUIElements();
    this._bindBehaviorUIElements();

    return this;
  },

  // This method unbinds the elements specified in the "ui" hash
  unbindUIElements: function() {
    this._unbindUIElements();
    this._unbindBehaviorUIElements();

    return this;
  },

  getUI: function(name) {
    this._ensureViewIsIntact();
    return this._getUI(name);
  },

  // used as the prefix for child view events
  // that are forwarded through the layoutview
  childViewEventPrefix: 'childview',

  // import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: function(...args) {
    const ret = triggerMethod.apply(this, args);

    this._triggerEventOnBehaviors(...args);
    this._triggerEventOnParentLayout(...args);

    return ret;
  },

  // Cache `childViewEvents` and `childViewTriggers`
  _buildEventProxies: function() {
    this._childViewEvents = this.getValue(this.getOption('childViewEvents'));
    this._childViewTriggers = this.getValue(this.getOption('childViewTriggers'));
  },

  _triggerEventOnParentLayout: function(eventName, ...args) {
    const layoutView = this._parentView();
    if (!layoutView) {
      return;
    }

    // invoke triggerMethod on parent view
    const eventPrefix = layoutView.getOption('childViewEventPrefix');
    const prefixedEventName = eventPrefix + ':' + eventName;

    layoutView.triggerMethod(prefixedEventName, ...args);

    // use the parent view's childViewEvents handler
    const childViewEvents = layoutView.normalizeMethods(layoutView._childViewEvents);

    if (!!childViewEvents && _.isFunction(childViewEvents[eventName])) {
      childViewEvents[eventName].apply(layoutView, args);
    }

    // use the parent view's proxyEvent handlers
    const childViewTriggers = layoutView._childViewTriggers;

    // Call the event with the proxy name on the parent layout
    if (childViewTriggers && _.isString(childViewTriggers[eventName])) {
      layoutView.triggerMethod(childViewTriggers[eventName], ...args);
    }
  },

  // Walk the _parent tree until we find a view (if one exists).
  // Returns the parent view hierarchically closest to this view.
  _parentView: function() {
    let parent = this._parent;

    while (parent) {
      if (parent instanceof View) {
        return parent;
      }
      parent = parent._parent;
    }
  }
};

_.extend(ViewMixin, BehaviorsMixin, CommonMixin, DelegateEntityEventsMixin, TriggersMixin,  UIMixin);

export default ViewMixin;
