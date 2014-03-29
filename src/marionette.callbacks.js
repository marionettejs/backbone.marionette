// Callbacks
// ---------

// A simple way of managing a collection of callbacks
// and executing them at a later point in time, using jQuery's
// `Deferred` object.
Marionette.Callbacks = function(){
  this._deferred = Marionette.$.Deferred();
  this._callbacks = [];
  this._callbacksPromises = [];
};

_.extend(Marionette.Callbacks.prototype, {

  // Add a callback to be executed. Callbacks added here are
  // guaranteed to execute, even if they are added after the
  // `run` method is called.
  add: function(callback, contextOverride){
    var callbackPromise = this._deferred.then(function(context, options){
      if (contextOverride){ context = contextOverride; }
      return callback.call(context, options);
    });

    this._callbacks.push({cb: callback, ctx: contextOverride});
    this._callbacksPromises.push(callbackPromise);
  },

  // Run all registered callbacks with the context specified and
  // return promise that will be resolved when all returned promises
  // from callbacks will be resolved.
  // Additional callbacks can be added after this has been run
  // and they will still be executed.
  run: function(options, context){
    this._deferred.resolve(context, options);
    return $.when.apply(null, this._callbacksPromises).then($.noop);
  },

  // Resets the list of callbacks to be run, allowing the same list
  // to be run multiple times - whenever the `run` method is called.
  reset: function(){
    var callbacks = this._callbacks;
    this._deferred = Marionette.$.Deferred();
    this._callbacks = [];
    this._callbacksPromises = [];

    _.each(callbacks, function(cb){
      this.add(cb.cb, cb.ctx);
    }, this);
  }
});

