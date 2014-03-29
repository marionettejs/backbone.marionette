describe("callbacks", function(){
  "use strict";

  describe("when registering callbacks and running them", function(){
    var specifiedOptions, specifiedContext,
        spyOne, spyTwo;

    beforeEach(function(){
      spyOne = sinon.spy();
      spyTwo = sinon.spy();
      var callbacks = new Backbone.Marionette.Callbacks();

      specifiedOptions = {};
      specifiedContext = {};

      callbacks.add(spyOne);
      callbacks.add(spyTwo);

      callbacks.run(specifiedOptions, specifiedContext);
    });

    it("should execute the first callback", function(){
      expect(spyOne).toHaveBeenCalled();
    });

    it("should execute the second callback", function(){
      expect(spyTwo).toHaveBeenCalled();
    });

    it("should pass the options along", function(){
      expect(spyOne).toHaveBeenCalledWith(specifiedOptions);
    });

    it("should execute in the specified context", function(){
      expect(spyOne).toHaveBeenCalledOn(specifiedContext);
    });
  });

  describe("when running with no callbacks, and then registering callbacks", function(){
    var spyOne, spyTwo;

    beforeEach(function(){
      spyOne = sinon.spy();
      spyTwo = sinon.spy();
      var callbacks = new Backbone.Marionette.Callbacks();
      callbacks.run();

      callbacks.add(spyOne);
      callbacks.add(spyTwo);
    });

    it("should execute the first", function(){
      expect(spyOne).toHaveBeenCalled();
    });

    it("should execute the second", function(){
      expect(spyTwo).toHaveBeenCalled();
    });
  });

  describe("when registering a callback with a specific context, and running the callbacks", function(){
    var spyOne, context;

    beforeEach(function(){
      spyOne  = sinon.spy();
      context = {};

      var callbacks = new Backbone.Marionette.Callbacks();
      callbacks.add(spyOne, context);

      callbacks.run();
    });

    it("should run the callback with the specified context", function(){
      expect(spyOne).toHaveBeenCalledOn(context);
    });
  });

  describe("when resetting callbacks and re-running them", function(){
    var spy, numCallbacks;

    beforeEach(function(){
      var callbacks = new Backbone.Marionette.Callbacks();

      spy = sinon.spy();
      callbacks.add(spy);

      callbacks.run();
      callbacks.reset();

      callbacks.run();

      numCallbacks = callbacks._callbacks.length;
    });

    it("should run the callbacks again", function(){
      expect(spy).toHaveBeenCalledTwice();
    });

    it("should not duplicate the callbacks", function() {
      expect(numCallbacks).toBe(1);
    });
  });

  describe("when registering callbacks that return promises and running them", function() {
    var callbacks, asyncCallback1, defer1, asyncCallback2, defer2, syncCallback, syncCallbackWithReturnedValue, result;

    beforeEach(function() {
      defer1 = new $.Deferred();
      asyncCallback1 = sinon.spy(function() {return defer1.promise()});

      defer2 = new $.Deferred();
      asyncCallback2 = sinon.spy(function() {return defer2.promise()});

      syncCallback = sinon.spy();
      syncCallbackWithReturnedValue = sinon.spy(function() {return {foo: "bar"};});

      callbacks = new Backbone.Marionette.Callbacks();

      callbacks.add(asyncCallback1);
      callbacks.add(asyncCallback2);
      callbacks.add(syncCallback);
      callbacks.add(syncCallbackWithReturnedValue);

      result = callbacks.run();
    });

    it("should execute the 1st callback", function(){
      expect(asyncCallback1).toHaveBeenCalled();
    });

    it("should execute the 2nd callback", function(){
      expect(asyncCallback2).toHaveBeenCalled();
    });

    it("should execute the 3rd callback", function(){
      expect(syncCallback).toHaveBeenCalled();
    });

    it("should execute the 4th callback", function(){
      expect(syncCallbackWithReturnedValue).toHaveBeenCalled();
    });

    it("should return promise", function() {
      expect(result).toBeDefined();
      expect(result.then).toEqual(jasmine.any(Function));
    });

    it("returned promise should not be resolved", function() {
      expect(result.state()).toBe("pending");
    });

    describe("when one async callback is resolved", function() {
      beforeEach(function() {
        defer1.resolve();
      });

      it("returned promise should not be resolved", function() {
        expect(result.state()).toBe("pending");
      });

      describe("when all async callbacks are resolved", function() {
        beforeEach(function() {
          defer2.resolve();
        });

        it("returned promise should be resolved", function() {
          expect(result.state()).toBe("resolved");
        });

        it("promise should be resolved without arguments", function() {
          var spy = sinon.spy();
          result.then(spy);
          expect(spy).toHaveBeenCalledWith();
        });
      });
    });
  });
});
