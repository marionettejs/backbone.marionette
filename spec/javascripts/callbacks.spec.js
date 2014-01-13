describe("callbacks", function(){
  "use strict";

  describe("when registering callbacks and running them", function(){
    var wasCalled, secondCall,
        options, specifiedOptions,
        context, specifiedContext;

    beforeEach(function(){
      var callbacks = new Backbone.Marionette.Callbacks();
      specifiedOptions = {};
      specifiedContext = {};

      callbacks.add(function(opts){
        wasCalled = true;
        options = opts;
        context = this;
      });

      callbacks.add(function(){
        secondCall = true;
      });

      callbacks.run(specifiedOptions, specifiedContext);
    });

    it("should execute the first", function(){
      expect(wasCalled).toBeTruthy();
    });

    it("should execute the second", function(){
      expect(secondCall).toBeTruthy();
    });

    it("should pass the options along", function(){
      expect(options).toBe(specifiedOptions);
    });

    it("should execute in the specified context", function(){
      expect(context).toBe(specifiedContext);
    });
  });

  describe("when running with no callbacks, and then registering callbacks", function(){
    var wasCalled, secondCall;

    beforeEach(function(){
      var callbacks = new Backbone.Marionette.Callbacks();
      callbacks.run();

      callbacks.add(function(){
        wasCalled = true;
      });

      callbacks.add(function(){
        secondCall = true;
      });
    });

    it("should execute the first", function(){
      expect(wasCalled).toBeTruthy();
    });

    it("should execute the second", function(){
      expect(secondCall).toBeTruthy();
    });
  });

  describe("when registering a callback with a specific context, and running the callbacks", function(){
    var cb, context, runContext;

    beforeEach(function(){
      context = {};
      cb = function(){ runContext = this; }

      var callbacks = new Backbone.Marionette.Callbacks();
      callbacks.add(cb, context);

      callbacks.run();
    });

    it("should run the callback with the specified context", function(){
      expect(runContext).toBe(context);
    });
  });

  describe("when resetting callbacks and re-running them", function(){
    var cb, numCallbacks;

    beforeEach(function(){
      var callbacks = new Backbone.Marionette.Callbacks();

      cb = jasmine.createSpy();
      callbacks.add(cb);

      callbacks.run();
      callbacks.reset();

      callbacks.run();

      numCallbacks = callbacks._callbacks.length;
    });

    it("should run the callbacks again", function(){
      expect(cb.callCount).toBe(2);
    });

    it("should not duplicate the callbacks", function() {
      expect(numCallbacks).toBe(1);
    });
  });

});
