/* jshint maxlen: 114, nonew: false */
// View
// ----

// The core view class that other Marionette views extend from.
Marionette.View = Backbone.View.extend({
  isDestroyed: false,
  supportsRenderLifecycle: true,
  supportsDestroyLifecycle: true,

  constructor: function(options) {
    this.render = _.bind(this.render, this);

    options = Marionette._getValue(options, this);

    // this exposes view options to the view initializer
    // this is a backfill since backbone removed the assignment
    // of this.options
    // at some point however this may be removed
    this.options = _.extend({}, _.result(this, 'options'), options);

    this._behaviors = Marionette.Behaviors(this);

    Backbone.View.call(this, this.options);

    Marionette.MonitorDOMRefresh(this);
  },

  // Get the template for this view
  // instance. You can set a `template` attribute in the view
  // definition or pass a `template: "whatever"` parameter in
  // to the constructor options.
  getTemplate: function() {
    return this.getOption('template');
  },

  // Serialize a model by returning its attributes. Clones
  // the attributes to allow modification.
  serializeModel: function(model) {
    return model.toJSON.apply(model, _.rest(arguments));
  },

  // Mix in template helper methods. Looks for a
  // `templateHelpers` attribute, which can either be an
  // object literal, or a function that returns an object
  // literal. All methods and attributes from this object
  // are copies to the object passed in.
  mixinTemplateHelpers: function(target) {
    target = target || {};
    var templateHelpers = this.getOption('templateHelpers');
    templateHelpers = Marionette._getValue(templateHelpers, this);
    return _.extend(target, templateHelpers);
  },

  // normalize the keys of passed hash with the views `ui` selectors.
  // `{"@ui.foo": "bar"}`
  normalizeUIKeys: function(hash) {
    var uiBindings = _.result(this, '_uiBindings');
    return Marionette.normalizeUIKeys(hash, uiBindings || _.result(this, 'ui'));
  },

  // normalize the values of passed hash with the views `ui` selectors.
  // `{foo: "@ui.bar"}`
  normalizeUIValues: function(hash, properties) {
    var ui = _.result(this, 'ui');
    var uiBindings = _.result(this, '_uiBindings');
    return Marionette.normalizeUIValues(hash, uiBindings || ui, properties);
  },

  // Configure `triggers` to forward DOM events to view
  // events. `triggers: {"click .foo": "do:foo"}`
  configureTriggers: function() {
    if (!this.triggers) { return; }

    // Allow `triggers` to be configured as a function
    var triggers = this.normalizeUIKeys(_.result(this, 'triggers'));

    // Configure the triggers, prevent default
    // action and stop propagation of DOM events
    return _.reduce(triggers, function(events, value, key) {
      events[key] = this._buildViewTrigger(value);
      return events;
    }, {}, this);
  },

  // Overriding Backbone.View's delegateEvents to handle
  // the `triggers`, `modelEvents`, and `collectionEvents` configuration
  delegateEvents: function(events) {
    this._delegateDOMEvents(events);
    this.bindEntityEvents(this.model, this.getOption('modelEvents'));
    this.bindEntityEvents(this.collection, this.getOption('collectionEvents'));

    _.each(this._behaviors, function(behavior) {
      behavior.bindEntityEvents(this.model, behavior.getOption('modelEvents'));
      behavior.bindEntityEvents(this.collection, behavior.getOption('collectionEvents'));
    }, this);

    return this;
  },

  // internal method to delegate DOM events and triggers
  _delegateDOMEvents: function(eventsArg) {
    var events = Marionette._getValue(eventsArg || this.events, this);

    // normalize ui keys
    events = this.normalizeUIKeys(events);
    if (_.isUndefined(eventsArg)) {this.events = events;}

    var combinedEvents = {};

    // look up if this view has behavior events
    var behaviorEvents = _.result(this, 'behaviorEvents') || {};
    var triggers = this.configureTriggers();
    var behaviorTriggers = _.result(this, 'behaviorTriggers') || {};

    // behavior events will be overriden by view events and or triggers
    _.extend(combinedEvents, behaviorEvents, events, triggers, behaviorTriggers);

    Backbone.View.prototype.delegateEvents.call(this, combinedEvents);
  },

  // Overriding Backbone.View's undelegateEvents to handle unbinding
  // the `triggers`, `modelEvents`, and `collectionEvents` config
  undelegateEvents: function() {
    Backbone.View.prototype.undelegateEvents.apply(this, arguments);

    this.unbindEntityEvents(this.model, this.getOption('modelEvents'));
    this.unbindEntityEvents(this.collection, this.getOption('collectionEvents'));

    _.each(this._behaviors, function(behavior) {
      behavior.unbindEntityEvents(this.model, behavior.getOption('modelEvents'));
      behavior.unbindEntityEvents(this.collection, behavior.getOption('collectionEvents'));
    }, this);

    return this;
  },

  // Internal helper method to verify whether the view hasn't been destroyed
  _ensureViewIsIntact: function() {
    if (this.isDestroyed) {
      throw new Marionette.Error({
        name: 'ViewDestroyedError',
        message: 'View (cid: "' + this.cid + '") has already been destroyed and cannot be used.'
      });
    }
  },

  // Default `destroy` implementation, for removing a view from the
  // DOM and unbinding it. Regions will call this method
  // for you. You can specify an `onDestroy` method in your view to
  // add custom code that is called after the view is destroyed.
  destroy: function() {
    if (this.isDestroyed) { return this; }

    var args = _.toArray(arguments);

    this.triggerMethod.apply(this, ['before:destroy'].concat(args));

    // mark as destroyed before doing the actual destroy, to
    // prevent infinite loops within "destroy" event handlers
    // that are trying to destroy other views
    this.isDestroyed = true;
    this.triggerMethod.apply(this, ['destroy'].concat(args));

    // unbind UI elements
    this.unbindUIElements();

    this.isRendered = false;

    // remove the view from the DOM
    this.remove();

    // Call destroy on each behavior after
    // destroying the view.
    // This unbinds event listeners
    // that behaviors have registered for.
    _.invoke(this._behaviors, 'destroy', args);

    return this;
  },

  bindUIElements: function() {
    this._bindUIElements();
    _.invoke(this._behaviors, this._bindUIElements);
  },

  // This method binds the elements specified in the "ui" hash inside the view's code with
  // the associated jQuery selectors.
  _bindUIElements: function() {
    if (!this.ui) { return; }

    // store the ui hash in _uiBindings so they can be reset later
    // and so re-rendering the view will be able to find the bindings
    if (!this._uiBindings) {
      this._uiBindings = this.ui;
    }

    // get the bindings result, as a function or otherwise
    var bindings = _.result(this, '_uiBindings');

    // empty the ui so we don't have anything to start with
    this.ui = {};

    // bind each of the selectors
    _.each(bindings, function(selector, key) {
      this.ui[key] = this.$(selector);
    }, this);
  },

  // This method unbinds the elements specified in the "ui" hash
  unbindUIElements: function() {
    this._unbindUIElements();
    _.invoke(this._behaviors, this._unbindUIElements);
  },

  _unbindUIElements: function() {
    if (!this.ui || !this._uiBindings) { return; }

    // delete all of the existing ui bindings
    _.each(this.ui, function($el, name) {
      delete this.ui[name];
    }, this);

    // reset the ui element to the original bindings configuration
    this.ui = this._uiBindings;
    delete this._uiBindings;
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

  setElement: function() {
    var ret = Backbone.View.prototype.setElement.apply(this, arguments);

    // proxy behavior $el to the view's $el.
    // This is needed because a view's $el proxy
    // is not set until after setElement is called.
    _.invoke(this._behaviors, 'proxyViewProperties', this);

    return ret;
  },

  // import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: function() {
    var ret = Marionette._triggerMethod(this, arguments);

    this._triggerEventOnBehaviors(arguments);
    this._triggerEventOnParentLayout(arguments[0], _.rest(arguments));

    return ret;
  },

  _triggerEventOnBehaviors: function(args) {
    var triggerMethod = Marionette._triggerMethod;
    var behaviors = this._behaviors;
    // Use good ol' for as this is a very hot function
    for (var i = 0, length = behaviors && behaviors.length; i < length; i++) {
      triggerMethod(behaviors[i], args);
    }
  },

  _triggerEventOnParentLayout: function(eventName, args) {
    var layoutView = this._parentLayoutView();
    if (!layoutView) {
      return;
    }

    // invoke triggerMethod on parent view
    var eventPrefix = Marionette.getOption(layoutView, 'childViewEventPrefix');
    var prefixedEventName = eventPrefix + ':' + eventName;
    var callArgs = [this].concat(args);

    Marionette._triggerMethod(layoutView, prefixedEventName, callArgs);

    // call the parent view's childEvents handler
    var childEvents = Marionette.getOption(layoutView, 'childEvents');

    // since childEvents can be an object or a function use Marionette._getValue
    // to handle the abstaction for us.
    childEvents = Marionette._getValue(childEvents, layoutView);
    var normalizedChildEvents = layoutView.normalizeMethods(childEvents);

    if (normalizedChildEvents && _.isFunction(normalizedChildEvents[eventName])) {
      normalizedChildEvents[eventName].apply(layoutView, callArgs);
    }
  },

  // This method returns any views that are immediate
  // children of this view
  _getImmediateChildren: function() {
    return [];
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

  // Walk the _parent tree until we find a layout view (if one exists).
  // Returns the parent layout view hierarchically closest to this view.
  _parentLayoutView: function() {
    var parent  = this._parent;

    while (parent) {
      if (parent instanceof Marionette.LayoutView) {
        return parent;
      }
      parent = parent._parent;
    }
  },

  // Imports the "normalizeMethods" to transform hashes of
  // events=>function references/names to a hash of events=>function references
  normalizeMethods: Marionette.normalizeMethods,

  // A handy way to merge passed-in options onto the instance
  mergeOptions: Marionette.mergeOptions,

  // Proxy `getOption` to enable getting options from this or this.options by name.
  getOption: Marionette.proxyGetOption,

  // Proxy `bindEntityEvents` to enable binding view's events from another entity.
  bindEntityEvents: Marionette.proxyBindEntityEvents,

  // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
  unbindEntityEvents: Marionette.proxyUnbindEntityEvents
});
