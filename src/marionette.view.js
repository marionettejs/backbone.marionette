// Marionette.View
// ---------------

var MIXIN_DOMAIN = '$mixins',
		INITIALIZE_DOMAIN = '$initialize',
		MODEL_EVENTS = 'modelEvents',
		COLLECTION_EVENTS = 'collectionEvents';
		
// merge a list of events hashes to a single events hash
function mergeEvents(list) {
	if (!_.isArray(list)) {
		return list;
	} else if (list.length === 1) {
		return list[0];
	}

	var events = {},
			compositeKeys = [];

	// merge all event values together
	_.each(list, function(_events) {
		if (_.isFunction(_events)) { _events = _events.call(this); } 

		_.each(_events, function(value, key) {
			var eventsValue = events[key];
			if (!eventsValue) {
				events[key] = value;
			} else if (_.isArray(eventsValue)) {
				eventsValue.push(value);
			} else {
				events[key] = [eventsValue, value];
				compositeKeys.push(key);
			}
		});
	});

	// deal with any key clashes
	_.each(compositeKeys, function(key) {
		var fns = events[key];
		events[key] = function() {
			for (var i=0; i<fns.length; i++) {
				fns[i].apply(this, arguments);
			}
		};
	});

	return events;
}

// The core view type that other Marionette views extend from.
Marionette.View = Backbone.View.extend({

  constructor: function(options){
    _.bindAll(this, "render");

    var args = Array.prototype.slice.apply(arguments);

		// cache init args to support mixin initialize
		this.viewData(INITIALIZE_DOMAIN).args = args;

    Backbone.View.prototype.constructor.apply(this, args);
    this.options = options;

    Marionette.MonitorDOMRefresh(this);
    this.listenTo(this, "show", this.onShowCalled, this);
  },

  // return a unique data hash for the provided domain
  // this is used to store metadata without polluting the view root attributes
  viewData: function(domain){
    var data = this._data || (this._data = {}),
        _data = data[domain];
    if (!_data) {
      _data = data[domain] = {};
    }
    return _data;
  },

	// multiple unique mixin parameters are allowed.  Each mixin can be a View class
	// or a simple hash.  View classes will not have superclass properties mixed in.
	// Mixin properties will not override the parent View properties.
	// events, modelEvents, collectionEvents and initialize will also be obeyed.
	// triggers will not be obeyed.
	mixin: function() {
		var mixins = arguments;
		_.each(mixins, function(mixin) {
			if (mixin.prototype) {
				// allow the class object to be passed or a simple hash
				mixin = mixin.prototype;
			}
			var props = _.clone(mixin);
			if (props.initialize) {
				props.initialize.apply(this, this.viewData(INITIALIZE_DOMAIN).args || []);
			}

			_.each(['initialize', 'events', 'triggers', MODEL_EVENTS, COLLECTION_EVENTS], function(name) {
				if (props[name]) { delete props[name]; }
			});

			// save the mixin for event delegation
			_.defaults(this, props);
			var data = this.viewData(MIXIN_DOMAIN),
					list = data.list;
			if (!list) {
				data.list = list = [];
			}
			list.push(mixin);
		}, this);

		this.delegateEvents();
	},

  // import the "triggerMethod" to trigger events with corresponding
  // methods if the method exists
  triggerMethod: Marionette.triggerMethod,

  // Get the template for this view
  // instance. You can set a `template` attribute in the view
  // definition or pass a `template: "whatever"` parameter in
  // to the constructor options.
  getTemplate: function(){
    return Marionette.getOption(this, "template");
  },

  // Serialize a model by returning its attributes. Clones
  // the attributes to allow modification.
  serializeModel: function(model){
    return _.clone(model.attributes);
  },

  // Mix in template helper methods. Looks for a
  // `templateHelpers` attribute, which can either be an
  // object literal, or a function that returns an object
  // literal. All methods and attributes from this object
  // are copies to the object passed in.
  mixinTemplateHelpers: function(target){
    target = target || {};
    var templateHelpers = Marionette.getOption(this, "templateHelpers");
    if (_.isFunction(templateHelpers)){
      templateHelpers = templateHelpers.call(this);
    }
    return _.extend(target, templateHelpers);
  },

  // Configure `triggers` to forward DOM events to view
  // events. `triggers: {"click .foo": "do:foo"}`
  configureTriggers: function(){
    if (!this.triggers) { return; }

    var triggerEvents = {};

    // Allow `triggers` to be configured as a function
    var triggers = _.result(this, "triggers");

    // Configure the triggers, prevent default
    // action and stop propagation of DOM events
    _.each(triggers, function(value, key){

      var hasOptions = _.isObject(value);
      var eventName = hasOptions ? value.event : value;

      // build the event handler function for the DOM event
      triggerEvents[key] = function(e){

        // stop the event in its tracks
        if (e) {
          var prevent = e.preventDefault;
          var stop = e.stopPropagation;

          var shouldPrevent = hasOptions ? value.preventDefault : prevent;
          var shouldStop = hasOptions ? value.stopPropagation : stop;

          if (shouldPrevent && prevent) { prevent(); }
          if (shouldStop && stop) { stop(); }
        }

        // build the args for the event
        var args = {
          view: this,
          model: this.model,
          collection: this.collection
        };

        // trigger the event
        this.triggerMethod(eventName, args);
      };

    }, this);

    return triggerEvents;
  },

  // Overriding Backbone.View's delegateEvents to handle
  // the `triggers`, `modelEvents`, and `collectionEvents` configuration
  delegateEvents: function(events){
    events = events || this.events;

    // follow the backbone API
    this.undelegateEvents();

    var mixinEvents = this._getMixinDOMEvents();
    mixinEvents.push(events);
    events = mergeEvents.call(this, mixinEvents);
 
    this._delegateDOMEvents(events);
		this._delegateEntityEvents(this);
		this._delegateMixinEntityEvents();
  },

	_getMixinDOMEvents: function() {
		var events = [],
				mixins = this.viewData(MIXIN_DOMAIN).list || [];
		_.each(mixins, function(mixin) {
			if (mixin.events) {
				events.push(mixin.events);
			}
		});
		return events;
	},

	_delegateMixinEntityEvents: function() {
		var mixins = this.viewData(MIXIN_DOMAIN).list || [];
		_.each(mixins, this._delegateEntityEvents, this);
	},

	_delegateEntityEvents: function(target){
		Marionette.bindEntityEvents(this, this.model, Marionette.getOption(target, MODEL_EVENTS));
    Marionette.bindEntityEvents(this, this.collection, Marionette.getOption(target, COLLECTION_EVENTS));
	},

  // internal method to delegate DOM events and triggers
  _delegateDOMEvents: function(events){
    events = events || this.events;
    if (_.isFunction(events)){ events = events.call(this); }

    var combinedEvents = {};
    var triggers = this.configureTriggers();
    _.extend(combinedEvents, events, triggers);

    Backbone.View.prototype.delegateEvents.call(this, combinedEvents);
  },

  // Overriding Backbone.View's undelegateEvents to handle unbinding
  // the `triggers`, `modelEvents`, and `collectionEvents` config
  undelegateEvents: function(){
    var args = Array.prototype.slice.call(arguments);
    Backbone.View.prototype.undelegateEvents.apply(this, args);

		this._undelegateEntityEvents();
  },

	_undelegateEntityEvents: function(){
    Marionette.unbindEntityEvents(this, this.model, Marionette.getOption(this, MODEL_EVENTS));
    Marionette.unbindEntityEvents(this, this.collection, Marionette.getOption(this, COLLECTION_EVENTS));

		var mixins = this.viewData(MIXIN_DOMAIN).list || [];
		_.each(mixins, function(mixin) {
      Marionette.unbindEntityEvents(this, this.model, Marionette.getOption(mixin, MODEL_EVENTS));
      Marionette.unbindEntityEvents(this, this.collection, Marionette.getOption(mixin, COLLECTION_EVENTS));
		}, this);
	},

  // Internal method, handles the `show` event.
  onShowCalled: function(){},

  // Default `close` implementation, for removing a view from the
  // DOM and unbinding it. Regions will call this method
  // for you. You can specify an `onClose` method in your view to
  // add custom code that is called after the view is closed.
  close: function(){
    if (this.isClosed) { return; }

    // allow the close to be stopped by returning `false`
    // from the `onBeforeClose` method
    var shouldClose = this.triggerMethod("before:close");
    if (shouldClose === false){
      return;
    }

    // mark as closed before doing the actual close, to
    // prevent infinite loops within "close" event handlers
    // that are trying to close other views
    this.isClosed = true;
    this.triggerMethod("close");

    // unbind UI elements
    this.unbindUIElements();

    // remove the view from the DOM
    this.remove();
  },

  // This method binds the elements specified in the "ui" hash inside the view's code with
  // the associated jQuery selectors.
  bindUIElements: function(){
    if (!this.ui) { return; }

    // store the ui hash in _uiBindings so they can be reset later
    // and so re-rendering the view will be able to find the bindings
    if (!this._uiBindings){
      this._uiBindings = this.ui;
    }

    // get the bindings result, as a function or otherwise
    var bindings = _.result(this, "_uiBindings");

    // empty the ui so we don't have anything to start with
    this.ui = {};

    // bind each of the selectors
    _.each(_.keys(bindings), function(key) {
      var selector = bindings[key];
      this.ui[key] = this.$(selector);
    }, this);
  },

  // This method unbinds the elements specified in the "ui" hash
  unbindUIElements: function(){
    if (!this.ui || !this._uiBindings){ return; }

    // delete all of the existing ui bindings
    _.each(this.ui, function($el, name){
      delete this.ui[name];
    }, this);

    // reset the ui element to the original bindings configuration
    this.ui = this._uiBindings;
    delete this._uiBindings;
  }
});
