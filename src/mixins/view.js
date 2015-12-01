// ViewMixin
//  ---------

import Backbone                 from 'backbone';
import _                        from 'underscore';
import _getValue                from '../utils/_getValue';
import getOption                from '../utils/getOption';
import normalizeMethods         from '../utils/normalizeMethods';
import mergeOptions             from '../utils/mergeOptions';
import proxyGetOption           from '../utils/proxyGetOption';
import MarionetteError          from '../error';
import Renderer                 from '../renderer';
import View                     from '../view';
import {
  proxyBindEntityEvents,
  proxyUnbindEntityEvents
}                               from '../bind-entity-events';
import { _triggerMethod }       from '../trigger-method';

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

  // Get the template for this view
  // instance. You can set a `template` attribute in the view
  // definition or pass a `template: "whatever"` parameter in
  // to the constructor options.
  getTemplate: function() {
    return this.getOption('template');
  },

  // Internal method to render the template with the serialized data
  // and template context via the `Marionette.Renderer` object.
  _renderTemplate: function() {
    var template = this.getTemplate();

    // Allow template-less views
    if (template === false) {
      return;
    }

    // Add in entity data and template context
    var data = this.mixinTemplateContext(this.serializeData());

    // Render and add to el
    var html = Renderer.render(template, data, this);
    this.attachElContent(html);
  },

  // Prepares the special `model` property of a view
  // for being displayed in the template. By default
  // we simply clone the attributes. Override this if
  // you need a custom transformation for your view's model
  serializeModel: function() {
    if (!this.model) { return {}; }
    return _.clone(this.model.attributes);
  },

  // Mix in template context methods. Looks for a
  // `templateContext` attribute, which can either be an
  // object literal, or a function that returns an object
  // literal. All methods and attributes from this object
  // are copies to the object passed in.
  mixinTemplateContext: function(target = {}) {
    var templateContext = this.getOption('templateContext');
    templateContext = _getValue(templateContext, this);
    return _.extend(target, templateContext);
  },

  // Configure `triggers` to forward DOM events to view
  // events. `triggers: {"click .foo": "do:foo"}`
  configureTriggers: function() {
    if (!this.triggers) { return; }

    // Allow `triggers` to be configured as a function
    var triggers = this.normalizeUIKeys(_.result(this, 'triggers', {}));

    // Configure the triggers, prevent default
    // action and stop propagation of DOM events
    return _.reduce(triggers, function(events, value, key) {
      events[key] = this._buildViewTrigger(value);
      return events;
    }, {}, this);
  },

  // Overriding Backbone.View's `delegateEvents` to handle
  // `events` and `triggers`
  delegateEvents: function(eventsArg) {

    this._proxyBehaviorViewProperties();

    var events = this.normalizeUIKeys(
      _getValue(eventsArg || this.events, this)
    );

    if (typeof eventsArg === 'undefined') {
      this.events = events;
    }

    var combinedEvents = _.extend({},
      this._getBehaviorEvents(),
      events,
      this._getBehaviorTriggers(),
      this.configureTriggers()
    );

    Backbone.View.prototype.delegateEvents.call(this, combinedEvents);

    return this;
  },

  // Handle `modelEvents`, and `collectionEvents` configuration
  delegateEntityEvents: function() {
    this.undelegateEntityEvents();

    this.bindEntityEvents(this.model, this.getOption('modelEvents'));
    this.bindEntityEvents(this.collection, this.getOption('collectionEvents'));

    // bind each behaviors model and collection events
    this._delegateBehaviorEntityEvents();

    return this;
  },

  // Handle unbinding `modelEvents`, and `collectionEvents` configuration
  undelegateEntityEvents: function() {
    this.unbindEntityEvents(this.model, this.getOption('modelEvents'));
    this.unbindEntityEvents(this.collection, this.getOption('collectionEvents'));

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
  },

  // This method unbinds the elements specified in the "ui" hash
  unbindUIElements: function() {
    this._unbindUIElements();
    this._unbindBehaviorUIElements();
  },

  // Internal method to create an event handler for a given `triggerDef` like
  // 'click:foo'
  _buildViewTrigger: function(triggerDef) {
    var options = _.defaults({}, triggerDef, {
      preventDefault: true,
      stopPropagation: true
    });

    var eventName = _.isObject(triggerDef) ? options.event : triggerDef;

    return function(e) {
      if (e) {
        if (e.preventDefault && options.preventDefault) {
          e.preventDefault();
        }

        if (e.stopPropagation && options.stopPropagation) {
          e.stopPropagation();
        }
      }

      var args = {
        view: this,
        model: this.model,
        collection: this.collection
      };

      this.triggerMethod(eventName, args);
    };
  },

  // used as the prefix for child view events
  // that are forwarded through the layoutview
  childViewEventPrefix: 'childview',

  // import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: function(eventName, ...args) {
    var ret = _triggerMethod(this, arguments);

    this._triggerEventOnBehaviors(arguments);
    this._triggerEventOnParentLayout(eventName, args);

    return ret;
  },

  _triggerEventOnParentLayout: function(eventName, args) {
    var layoutView = this._parentItemView();
    if (!layoutView) {
      return;
    }

    // invoke triggerMethod on parent view
    var eventPrefix = getOption(layoutView, 'childViewEventPrefix');
    var prefixedEventName = eventPrefix + ':' + eventName;
    var callArgs = [this].concat(args);

    _triggerMethod(layoutView, [prefixedEventName].concat(callArgs));

    // call the parent view's childViewEvents handler
    var childViewEvents = getOption(layoutView, 'childViewEvents');

    // since childViewEvents can be an object or a function use Marionette._getValue
    // to handle the abstaction for us.
    childViewEvents = _getValue(childViewEvents, layoutView);
    var normalizedChildEvents = layoutView.normalizeMethods(childViewEvents);

    if (!!normalizedChildEvents && _.isFunction(normalizedChildEvents[eventName])) {
      normalizedChildEvents[eventName].apply(layoutView, callArgs);
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
  },

  // Imports the "normalizeMethods" to transform hashes of
  // events=>function references/names to a hash of events=>function references
  normalizeMethods: normalizeMethods,

  // A handy way to merge passed-in options onto the instance
  mergeOptions: mergeOptions,

  // Proxy `getOption` to enable getting options from this or this.options by name.
  getOption: proxyGetOption,

  // Proxy `bindEntityEvents` to enable binding view's events from another entity.
  bindEntityEvents: proxyBindEntityEvents,

  // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
  unbindEntityEvents: proxyUnbindEntityEvents
};
