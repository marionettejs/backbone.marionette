// BindTo: Event Binding
// ---------------------

// BindTo facilitates the binding and unbinding of events
// from objects that extend `Backbone.Events`. It makes
// unbinding events, even with anonymous callback functions,
// easy. 
//
// Thanks to Johnny Oshika for this code.
// http://stackoverflow.com/questions/7567404/backbone-js-repopulate-or-recreate-the-view/7607853#7607853

Marionette.BindTo = {

  // Store the event binding in array so it can be unbound
  // easily, at a later point in time.
  bindTo: function (obj, eventName, callback, context) {
    context = context || this;
    obj.on(eventName, callback, context);

    if (!this.bindings) { this.bindings = []; }

    var binding = { 
      obj: obj, 
      eventName: eventName, 
      callback: callback, 
      context: context 
    }

    this.bindings.push(binding);

    return binding;
  },

  // Unbind from a single binding object. Binding objects are
  // returned from the `bindTo` method call. 
  unbindFrom: function(binding){
    binding.obj.off(binding.eventName, binding.callback, binding.context);
    this.bindings = _.reject(this.bindings, function(bind){return bind === binding});
  },

  // Unbind all of the events that we have stored.
  unbindAll: function () {
    var that = this;

    // The `unbindFrom` call removes elements from the array
    // while it is being iterated, so clone it first.
    var bindings = _.map(this.bindings, _.identity);
    _.each(bindings, function (binding, index) {
      that.unbindFrom(binding);
    });
  }
};

