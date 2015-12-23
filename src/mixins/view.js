// ViewMixin
//  ---------

import Backbone                 from 'backbone';
import _                        from 'underscore';
import getValue                 from '../utils/getValue';
import getUniqueEventName       from '../utils/getUniqueEventName';
import MarionetteError          from '../error';
import Renderer                 from '../renderer';
import View                     from '../view';
import { triggerMethod }        from '../trigger-method';

export default {
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

  // Mix in template context methods. Looks for a
  // `templateContext` attribute, which can either be an
  // object literal, or a function that returns an object
  // literal. All methods and attributes from this object
  // are copies to the object passed in.
  mixinTemplateContext: function(target = {}) {
    var templateContext = this.getValue(this.getOption('templateContext'));
    return _.extend(target, templateContext);
  },

  // Overriding Backbone.View's `delegateEvents` to handle
  // `events` and `triggers`
  delegateEvents: function(eventsArg) {

    this._proxyBehaviorViewProperties();
    this._buildEventProxies();

    var viewEvents = this._getEvents(eventsArg);

    if (typeof eventsArg === 'undefined') {
      this.events = viewEvents;
    }

    var combinedEvents = _.extend({},
      this._getBehaviorEvents(),
      viewEvents,
      this._getBehaviorTriggers(),
      this._getTriggers()
    );

    Backbone.View.prototype.delegateEvents.call(this, combinedEvents);

    return this;
  },

  _getEvents: function(eventsArg) {
    var events = this.getValue(eventsArg || this.events);

    return this.normalizeUIKeys(events);
  },

  // Configure `triggers` to forward DOM events to view
  // events. `triggers: {"click .foo": "do:foo"}`
  _getTriggers: function() {
    if (!this.triggers) { return; }

    // Allow `triggers` to be configured as a function
    var triggers = this.normalizeUIKeys(_.result(this, 'triggers'));

    // Configure the triggers, prevent default
    // action and stop propagation of DOM events
    return _.reduce(triggers, function(events, value, key) {
      key = getUniqueEventName(key);
      events[key] = this._buildViewTrigger(value);
      return events;
    }, {}, this);
  },

  // Internal method to create an event handler for a given `triggerDef` like
  // 'click:foo'
  _buildViewTrigger: function(triggerDef) {
    if (_.isString(triggerDef)) {
      triggerDef = { event: triggerDef };
    }

    const eventName = triggerDef.event;
    const shouldPreventDefault = triggerDef.preventDefault !== false;
    const shouldStopPropagation = triggerDef.stopPropagation !== false;

    return function(e) {
      if (shouldPreventDefault) {
        e.preventDefault();
      }

      if (shouldStopPropagation) {
        e.stopPropagation();
      }

      this.triggerMethod(eventName, this);
    };
  },

  // Handle `modelEvents`, and `collectionEvents` configuration
  delegateEntityEvents: function() {
    var modelEvents = this.getValue(this.getOption('modelEvents'));
    this.bindEntityEvents(this.model, modelEvents);

    var collectionEvents = this.getValue(this.getOption('collectionEvents'));
    this.bindEntityEvents(this.collection, collectionEvents);

    // bind each behaviors model and collection events
    this._delegateBehaviorEntityEvents();

    return this;
  },

  // Handle unbinding `modelEvents`, and `collectionEvents` configuration
  undelegateEntityEvents: function() {
    var modelEvents = this.getValue(this.getOption('modelEvents'));
    this.unbindEntityEvents(this.model, modelEvents);

    var collectionEvents = this.getValue(this.getOption('collectionEvents'));
    this.unbindEntityEvents(this.collection, collectionEvents);

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

    this.triggerMethod('before:destroy', ...args);

    // update lifecycle flags
    this._isDestroyed = true;
    this._isRendered = false;

    // unbind UI elements
    this.unbindUIElements();

    // remove the view from the DOM
    // https://github.com/jashkenas/backbone/blob/1.2.3/backbone.js#L1235
    this._removeElement();

    // remove children after the remove to prevent extra paints
    this._removeChildren();

    this._destroyBehaviors(args);

    this.triggerMethod('destroy', ...args);

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
    var ret = triggerMethod.apply(this, args);

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
    var layoutView = this._parentItemView();
    if (!layoutView) {
      return;
    }

    // invoke triggerMethod on parent view
    var eventPrefix = layoutView.getOption('childViewEventPrefix');
    var prefixedEventName = eventPrefix + ':' + eventName;

    layoutView.triggerMethod(prefixedEventName, ...args);

    // use the parent view's childViewEvents handler
    var childViewEvents = layoutView.normalizeMethods(layoutView._childViewEvents);

    if (!!childViewEvents && _.isFunction(childViewEvents[eventName])) {
      childViewEvents[eventName].apply(layoutView, args);
    }

    // use the parent view's proxyEvent handlers
    var childViewTriggers = layoutView._childViewTriggers;

    // Call the event with the proxy name on the parent layout
    if (childViewTriggers && _.isString(childViewTriggers[eventName])) {
      layoutView.triggerMethod(childViewTriggers[eventName], ...args);
    }
  },

  // Returns an array of every nested view within this view
  _getNestedViews: function() {
    var children = this._getImmediateChildren();

    if (!children.length) { return children; }

    return _.reduce(children, function(memo, view) {
      if (!view._getNestedViews) { return memo; }
      return memo.concat(view._getNestedViews());
    }, children);
  },

  // Walk the _parent tree until we find a view (if one exists).
  // Returns the parent view hierarchically closest to this view.
  _parentItemView: function() {
    var parent  = this._parent;

    while (parent) {
      if (parent instanceof View) {
        return parent;
      }
      parent = parent._parent;
    }
  }
};
