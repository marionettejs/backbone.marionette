// Callbacks
// ---------

// A simple way of managing a collection of callbacks
// and executing them at a later point in time, using jQuery's
// `Deferred` object.
Marionette.Callbacks = function(){
  this._callbackList = [];
  this._setupDeferredForCallbacks();
};

_.extend(Marionette.Callbacks.prototype, {

  // Add a callback to be executed. Callbacks added here are
  // guaranteed to execute, even if they are added after the 
  // `run` method is called.
  add: function(callback, contextOverride){
    this._callbackList.push({callback: callback, context: contextOverride});
    this._addCallbackToPromise(callback, contextOverride);
  },

  // Run all registered callbacks with the context specified. 
  // Additional callbacks can be added after this has been run 
  // and they will still be executed.
  run: function(options, context){
    this._deferred.resolve(context, options);
  },

  // Resets the callbacks to a state of not having been fired.
  // Existing callbacks that were added before this callback set is
  // reset will remain in the callback set and will be run again, when
  // the callback set is run.
  reset: function(){
    this._setupDeferredForCallbacks();

    var that = this;
    var length = this._callbackList.length;

    for (var i=0; i<length; i++){
      var cb = this._callbackList[i];
      that._addCallbackToPromise(cb.callback, cb.context);
    }
  },

  // Private method used internally.
  _addCallbackToPromise: function(callback, contextOverride){
    this._deferred.done(function(context, options){
      if (contextOverride){ context = contextOverride; }
      callback.call(context, options);
    });
  },

  // Private method used internally.
  _setupDeferredForCallbacks: function(){
    this._deferred = $.Deferred();
  }
});

