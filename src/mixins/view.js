// ViewMixin
//  ---------

import Backbone from 'backbone';
import _ from 'underscore';
import BehaviorsMixin from './behaviors';
import CommonMixin from './common';
import DelegateEntityEventsMixin from './delegate-entity-events';
import TemplateRenderMixin from './template-render';
import TriggersMixin from './triggers';
import UIMixin from './ui';
import { isEnabled } from '../config/features';
import DomApi from '../config/dom';

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
  Dom: DomApi,

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
  delegateEvents(events) {
    this._proxyBehaviorViewProperties();
    this._buildEventProxies();

    const combinedEvents = _.extend({},
      this._getBehaviorEvents(),
      this._getEvents(events),
      this._getBehaviorTriggers(),
      this._getTriggers()
    );

    Backbone.View.prototype.delegateEvents.call(this, combinedEvents);

    return this;
  },

  // Allows Backbone.View events to utilize `@ui.` selectors
  _getEvents(events) {
    if (events) {
      return this.normalizeUIKeys(events);
    }

    if (!this.events) { return; }

    return this.normalizeUIKeys(_.result(this, 'events'));
  },

  // Configure `triggers` to forward DOM events to view
  // events. `triggers: {"click .foo": "do:foo"}`
  _getTriggers() {
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
  destroy(options) {
    if (this._isDestroyed) { return this; }
    const shouldTriggerDetach = this._isAttached && !this._disableDetachEvents;

    this.triggerMethod('before:destroy', this, options);
    if (shouldTriggerDetach) {
      this.triggerMethod('before:detach', this);
    }

    // unbind UI elements
    this.unbindUIElements();

    // remove the view from the DOM
    this._removeElement();

    if (shouldTriggerDetach) {
      this._isAttached = false;
      this.triggerMethod('detach', this);
    }

    // remove children after the remove to prevent extra paints
    this._removeChildren();

    this._isDestroyed = true;
    this._isRendered = false;

    // Destroy behaviors after _isDestroyed flag
    this._destroyBehaviors(options);

    this._deleteEntityEventHandlers();

    this.triggerMethod('destroy', this, options);
    this._triggerEventOnBehaviors('destroy', this, options);

    this.stopListening();

    return this;
  },

  // Equates to this.$el.remove
  _removeElement() {
    this.$el.off().removeData();
    this.Dom.detachEl(this.el, this.$el);
  },

  // This method binds the elements specified in the "ui" hash
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

  // Cache `childViewEvents` and `childViewTriggers`
  _buildEventProxies() {
    this._childViewEvents = this.normalizeMethods(_.result(this, 'childViewEvents'));
    this._childViewTriggers = _.result(this, 'childViewTriggers');
    this._eventPrefix = this._getEventPrefix();
  },

  _getEventPrefix() {
    const defaultPrefix = isEnabled('childViewEventPrefix') ? 'childview' : false;
    const prefix = _.result(this, 'childViewEventPrefix', defaultPrefix);

    return (prefix === false) ? prefix : prefix + ':';
  },

  _proxyChildViewEvents(view) {
    if (this._childViewEvents || this._childViewTriggers || this._eventPrefix) {
      this.listenTo(view, 'all', this._childViewEventHandler);
    }
  },

  _childViewEventHandler(eventName, ...args) {
    const childViewEvents = this._childViewEvents;

    // call collectionView childViewEvent if defined
    if (childViewEvents && childViewEvents[eventName]) {
      childViewEvents[eventName].apply(this, args);
    }

    // use the parent view's proxyEvent handlers
    const childViewTriggers = this._childViewTriggers;

    // Call the event with the proxy name on the parent layout
    if (childViewTriggers && childViewTriggers[eventName]) {
      this.triggerMethod(childViewTriggers[eventName], ...args);
    }

    if (this._eventPrefix) {
      this.triggerMethod(this._eventPrefix + eventName, ...args);
    }
  }
};

_.extend(ViewMixin, BehaviorsMixin, CommonMixin, DelegateEntityEventsMixin, TemplateRenderMixin, TriggersMixin, UIMixin);

export default ViewMixin;
