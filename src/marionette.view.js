/* jshint maxlen: 114, nonew: false */
// Marionette.View
// ---------------

// The core view class that other Marionette views extend from.
Marionette.View = Backbone.View.extend({

  constructor: function(options) {
    _.bindAll(this, 'render');

    // this exposes view options to the view initializer
    // this is a backfill since backbone removed the assignment
    // of this.options
    // at some point however this may be removed
    this.options = _.extend({}, _.result(this, 'options'), _.isFunction(options) ? options.call(this) : options);

    this._behaviors = Marionette.Behaviors(this);

    Backbone.View.apply(this, arguments);

    Marionette.MonitorDOMRefresh(this);
    this.listenTo(this, 'show', this.onShowCalled);
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
  serializeModel: function(model){
    return model.toJSON.apply(model, slice.call(arguments, 1));
  },

  // Mix in template helper methods. Looks for a
  // `templateHelpers` attribute, which can either be an
  // object literal, or a function that returns an object
  // literal. All methods and attributes from this object
  // are copies to the object passed in.
  mixinTemplateHelpers: function(target) {
    target = target || {};
    var templateHelpers = this.getOption('templateHelpers');
    if (_.isFunction(templateHelpers)) {
      templateHelpers = templateHelpers.call(this);
    }
    return _.extend(target, templateHelpers);
  },

  // normalize the keys of passed hash with the views `ui` selectors.
  // `{"@ui.foo": "bar"}`
  normalizeUIKeys: function(hash) {
    var ui = _.result(this, 'ui');
    var uiBindings = _.result(this, '_uiBindings');
    return Marionette.normalizeUIKeys(hash, uiBindings || ui);
  },

  // normalize the values of passed hash with the views `ui` selectors.
  // `{foo: "@ui.bar"}`
  normalizeUIValues: function(hash) {
    var ui = _.result(this, 'ui');
    var uiBindings = _.result(this, '_uiBindings');
    return Marionette.normalizeUIValues(hash, uiBindings || ui);
  },

  // Configure `triggers` to forward DOM events to view
  // events. `triggers: {"click .foo": "do:foo"}`
  configureTriggers: function() {
    if (!this.triggers) { return; }

    var triggerEvents = {};

    // Allow `triggers` to be configured as a function
    var triggers = this.normalizeUIKeys(_.result(this, 'triggers'));

    // Configure the triggers, prevent default
    // action and stop propagation of DOM events
    _.each(triggers, function(value, key) {
      triggerEvents[key] = this._buildViewTrigger(value);
    }, this);

    return triggerEvents;
  },

  // Overriding Backbone.View's delegateEvents to handle
  // the `triggers`, `modelEvents`, and `collectionEvents` configuration
  delegateEvents: function(events) {
    this._delegateDOMEvents(events);
    this.bindEntityEvents(this.model, this.getOption('modelEvents'));
    this.bindEntityEvents(this.collection, this.getOption('collectionEvents'));
    return this;
  },

  // internal method to delegate DOM events and triggers
  _delegateDOMEvents: function(eventsArg) {
    var events = eventsArg || this.events;
    if (_.isFunction(events)) { events = events.call(this); }

    // normalize ui keys
    events = this.normalizeUIKeys(events);
    if(_.isUndefined(eventsArg)) {this.events = events;}

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
    var args = slice.call(arguments);
    Backbone.View.prototype.undelegateEvents.apply(this, args);
    this.unbindEntityEvents(this.model, this.getOption('modelEvents'));
    this.unbindEntityEvents(this.collection, this.getOption('collectionEvents'));
    return this;
  },

  // Internal method, handles the `show` event.
  onShowCalled: function() {},

  // Internal helper method to verify whether the view hasn't been destroyed
  _ensureViewIsIntact: function() {
    if (this.isDestroyed) {
      throwError('View (cid: "' + this.cid +
          '") has already been destroyed and cannot be used.',
          'ViewDestroyedError');
    }
  },

  // Default `destroy` implementation, for removing a view from the
  // DOM and unbinding it. Regions will call this method
  // for you. You can specify an `onDestroy` method in your view to
  // add custom code that is called after the view is destroyed.
  destroy: function() {
    if (this.isDestroyed) { return; }

    var args = slice.call(arguments);

    this.triggerMethod.apply(this, ['before:destroy'].concat(args));

    // mark as destroyed before doing the actual destroy, to
    // prevent infinite loops within "destroy" event handlers
    // that are trying to destroy other views
    this.isDestroyed = true;
    this.triggerMethod.apply(this, ['destroy'].concat(args));

    // unbind UI elements
    this.unbindUIElements();

    // remove the view from the DOM
    this.remove();
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
    _.each(_.keys(bindings), function(key) {
      var selector = bindings[key];
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
    var hasOptions = _.isObject(triggerDef);

    var options = _.defaults({}, (hasOptions ? triggerDef : {}), {
      preventDefault: true,
      stopPropagation: true
    });

    var eventName = hasOptions ? options.event : triggerDef;

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

  // import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: function() {
    var args = arguments;
    var triggerMethod = Marionette.triggerMethod;

    var ret = triggerMethod.apply(this, args);
    _.each(this._behaviors, function(b) {
      triggerMethod.apply(b, args);
    });

    return ret;
  },

  // Imports the "normalizeMethods" to transform hashes of
  // events=>function references/names to a hash of events=>function references
  normalizeMethods: Marionette.normalizeMethods,

  // Proxy `getOption` to enable getting options from this or this.options by name.
  getOption: Marionette.proxyGetOption,

  // Proxy `unbindEntityEvents` to enable binding view's events from another entity.
  bindEntityEvents: Marionette.proxyBindEntityEvents,

  // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
  unbindEntityEvents: Marionette.proxyUnbindEntityEvents
});
