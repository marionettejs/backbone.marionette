// Promises
// ---------

// Modelled closely on Marionette.Callbacks to provide a
// stack of promises which all must be resolved/rejected before
// before the whole is resolved/rejected
Marionette.Promises = function(){
  this._deferred = new $.Deferred();
  this._callbacks = [];
  this._promises = [];
};

_.extend(Marionette.Promises.prototype, {

  // Add a callback to be executed. Callbacks added here are
  // guaranteed to execute, even if they are added after the 
  // `run` method is called.
  // The callback must return a promise object!
  add: function(callback, contextOverride){
    this._callbacks.push({cb: callback, ctx: contextOverride});
    //when this._deferred is resolved, call all callbacks and add their return
    //value to the stack of promises
    //any functions which do not return a promise will simply be evaluated as 
    //immediately resolved
    this._deferred
      .done(_(function(context, options){
        if (contextOverride){ context = contextOverride; }
        //call the callback and add it's return value (should be a promise)
        //to the promises stack
        //for convenience, the callback is provided with a deferred object
        //it can use to resolve/reject a non-promise asychronous dependency
        this._promises.push( callback.call(context, options, new $.Deferred()) );
      }).bind(this));
  },

  // Run all registered callbacks with the context specified. 
  // Additional callbacks can be added after this has been run 
  // and they will still be executed.
  // This method returns a single promise which will be resolved
  // or rejected when the result of all callbacks 
  run: function(options, context){
    var deferred = new $.Deferred();
    this._deferred.resolve(context, options);

    //when all promises returned by the callbacks are resolved/rejected,
    //resolve/reject the promise returned by this method
    $.when.apply(this, this._promises)
      .done(function(){
        deferred.resolve();
      })
      .fail(function(){
        deferred.reject();
      });

    return deferred.promise();
  },

  // Resets the list of callbacks to be run, allowing the same list
  // to be run multiple times - whenever the `run` method is called.
  reset: function(){
    var that = this;
    var callbacks = this._callbacks;
    this._deferred = $.Deferred();
    this._callbacks = [];
    this._promises = [];
    _.each(callbacks, function(cb){
      that.add(cb.cb, cb.ctx);
    });
  }
});

