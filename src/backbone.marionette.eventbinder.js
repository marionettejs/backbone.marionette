// EventBinder
// -----------

// The event binder facilitates the binding and unbinding of events
// from objects that extend `Backbone.Events`. It makes
// unbinding events, even with anonymous callback functions,
// easy. 
//
// Inspired by [Johnny Oshika](http://stackoverflow.com/questions/7567404/backbone-js-repopulate-or-recreate-the-view/7607853#7607853)

Marionette.EventBinder = function(){
  this._eventBindings = [];
};

_.extend(Marionette.EventBinder.prototype, {
  // Store the event binding in array so it can be unbound
  // easily, at a later point in time.
  bindTo: function (obj, eventName, callback, context) {
    context = context || this;
    obj.on(eventName, callback, context);

    var binding = { 
      obj: obj, 
      eventName: eventName, 
      callback: callback, 
      context: context 
    };

    this._eventBindings.push(binding);

    return binding;
  },

  // Unbind from a single binding object. Binding objects are
  // returned from the `bindTo` method call. 
  unbindFrom: function(binding){
    binding.obj.off(binding.eventName, binding.callback, binding.context);
    this._eventBindings = _.reject(this._eventBindings, function(bind){return bind === binding;});
  },

  // Unbind all of the events that we have stored.
  unbindAll: function () {
    var that = this;

    // The `unbindFrom` call removes elements from the array
    // while it is being iterated, so clone it first.
    var bindings = _.map(this._eventBindings, _.identity);
    _.each(bindings, function (binding, index) {
      that.unbindFrom(binding);
    });
  }
});

// Copy the `extend` function used by Backbone's classes
Marionette.EventBinder.extend = Backbone.View.extend;
