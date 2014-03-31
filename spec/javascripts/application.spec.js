describe("marionette application", function(){
  "use strict";

  describe("when registering an initializer and starting the application", function(){
    var MyModule, MyApp, result;
    var someOptions = {};

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      MyModule = (function(MyApp){
        var module = {};
        module.initializer = function(options){};

        sinon.spy(module, "initializer");
        MyApp.addInitializer(module.initializer);

        return module
      })(MyApp);

      spyOn(MyApp, "trigger").andCallThrough();

      result = MyApp.start(someOptions);
    });

    afterEach(function() {
      MyModule.initializer.restore();
    });

    it("should notify me before initialization starts", function(){
      expect(MyApp.trigger).toHaveBeenCalledWith("initialize:before", someOptions);
    });

    it("should notify me after initialization", function(){
      expect(MyApp.trigger).toHaveBeenCalledWith("initialize:after", someOptions);
    });

    it("should call the initializer", function(){
      expect(MyModule.initializer).toHaveBeenCalled();
    });

    it("should pass the options through to the initializer", function(){
      expect(MyModule.initializer).toHaveBeenCalledWith(someOptions);
    });

    it("should run the initializer with the context of the app object", function(){
      expect(MyModule.initializer).toHaveBeenCalledOn(MyApp);
    });

    it("should return resolved promise", function() {
      expect(result.state()).toBe("resolved");
    });
  });

  describe("when an app has been started, and registering another initializer", function(){
    var MyApp, initialized;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();
      MyApp.start();

      MyApp.addInitializer(function(){
        initialized = true;
      });
    });

    it("should run the initializer immediately", function(){
      expect(initialized).toBeTruthy();
    });
  });

  describe("when instantiating an app with options specified", function(){
    var MyApp;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application({
        someOption: "some value"
      });
    });

    it("should merge those options into the app", function(){
      expect(MyApp.someOption).toEqual("some value");
    });
  });

  describe("when specifying an on start callback, and starting the app", function(){
    var started, options, onStartOptions;

    beforeEach(function(){
      var MyApp = new Backbone.Marionette.Application();
      options = {};

      MyApp.on("start", function(opts){
        started = true;
        onStartOptions = opts;
      });

      MyApp.start(options);
    });

    it("should run the onStart callback", function(){
      expect(started).toBeTruthy();
    });

    it("should pass the startup option to the callback", function(){
      expect(onStartOptions).toBe(options);
    });
  });

  describe("when registering an async initializer and starting the application", function() {
    var MyApp, defer, asyncInitializerSpy, someOptions, result;

    beforeEach(function(){
      defer = $.Deferred();
      asyncInitializerSpy = sinon.spy(function() { return defer.promise();});
      someOptions = {};

      MyApp = new Backbone.Marionette.Application();

      MyApp.addInitializer(asyncInitializerSpy);

      spyOn(MyApp, "trigger").andCallThrough();

      result = MyApp.start(someOptions);
    });

    it("should call the initializer", function(){
      expect(asyncInitializerSpy).toHaveBeenCalled();
    });

    it("should pass the options through to the initializer", function(){
      expect(asyncInitializerSpy).toHaveBeenCalledWith(someOptions);
    });

    it("should run the initializer with the context of the app object", function(){
      expect(asyncInitializerSpy).toHaveBeenCalledOn(MyApp);
    });

    it("should notify me before initialization starts", function(){
      expect(MyApp.trigger).toHaveBeenCalledWith("initialize:before", someOptions);
    });

    it("shouldn't notify me after initialization", function(){
      expect(MyApp.trigger).not.toHaveBeenCalledWith("initialize:after", someOptions);
    });

    it("shouldn't notify me on start", function(){
      expect(MyApp.trigger).not.toHaveBeenCalledWith("start", someOptions);
    });

    describe("returned promise", function() {
      it("shouldn't be resolved", function() {
        expect(result.state()).toBe("pending");
      });
    });

    describe("when the async initializer is resolved", function() {
      beforeEach(function() {
        defer.resolve();
      });

      it("should notify me after initialization", function(){
        expect(MyApp.trigger).toHaveBeenCalledWith("initialize:after", someOptions);
      });

      it("should notify me on start", function(){
        expect(MyApp.trigger).toHaveBeenCalledWith("start", someOptions);
      });

      describe("returned promise", function() {
        it("shouldn't be resolved", function() {
          expect(result.state()).toBe("resolved");
        });
      });
    });
  });

  describe("when starting an application multiple times", function() {
    var onInitializeBeforeSpy, onInitializeAfterSpy, onStartSpy, result1, result2;

    beforeEach(function() {
      var MyApp = new Backbone.Marionette.Application();

      onInitializeBeforeSpy = sinon.spy();
      onInitializeAfterSpy = sinon.spy();
      onStartSpy = sinon.spy();

      MyApp.on("initialize:before", onInitializeBeforeSpy);
      MyApp.on("initialize:after", onInitializeAfterSpy);
      MyApp.on("start", onStartSpy);

      result1 = MyApp.start();
      result2 = MyApp.start();
    });

    it("should trigger 'initialize:before' only once", function(){
      expect(onInitializeBeforeSpy).toHaveBeenCalledOnce();
    });

    it("should trigger 'initialize:after' only once", function(){
      expect(onInitializeAfterSpy).toHaveBeenCalledOnce();
    });

    it("should trigger 'start' only once", function(){
      expect(onStartSpy).toHaveBeenCalledOnce();
    });

    it("should return same promise", function() {
      expect(result1).toBe(result2);
    });
  });
});
