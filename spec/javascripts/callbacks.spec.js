describe("callbacks", function(){

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

  describe("when resetting a callback set that has already been run, and adding another callback function, and not re-running the set", function(){
    var cb1, cb2;

    beforeEach(function(){
      cb1 = jasmine.createSpy();
      cb2 = jasmine.createSpy();

      var callbacks = new Backbone.Marionette.Callbacks();
      callbacks.add(cb1);
      callbacks.run();

      callbacks.reset();

      callbacks.add(cb2);
    });

    it("should run the callback that was added before resetting, once", function(){
      expect(cb1.callCount).toBe(1);
    });

    it("should not run the callback callback that was added after resetting", function(){
      expect(cb2).not.toHaveBeenCalled();
    });

  });

  describe("when resetting a callback set that has already been run, adding another callback function, then running the set again", function(){
    var cb1, cb2;

    beforeEach(function(){
      cb1 = jasmine.createSpy();
      cb2 = jasmine.createSpy();

      var callbacks = new Backbone.Marionette.Callbacks();
      callbacks.add(cb1);
      callbacks.run();

      callbacks.reset();

      callbacks.add(cb2);
      callbacks.run();
    });

    it("should run the callback that was added before resetting, twice", function(){
      expect(cb1.callCount).toBe(2);
    });

    it("should run the callback that was added after resetting, once", function(){
      expect(cb2.callCount).toBe(1);
    });

  });

});
