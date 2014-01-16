describe("module start", function(){
  "use strict";

  describe("when starting a module", function(){
    var MyApp, myModule, initializer;

    beforeEach(function(){
      initializer = jasmine.createSpy();

      MyApp = new Backbone.Marionette.Application();
      myModule = MyApp.module("MyModule", function(MyMod){
        MyMod.addInitializer(initializer);
      });

      myModule.start();
    });

    it("should run the module initializers", function(){
      expect(initializer).toHaveBeenCalled();
    });

  });

  describe("when splitting a module defininition in to two parts and starting the module", function(){
    var initializer, definition;

    beforeEach(function(){
      initializer = jasmine.createSpy();
      definition = jasmine.createSpy();

      var MyApp = new Backbone.Marionette.Application();

      MyApp.module("MyModule", function(MyMod){
        MyMod.addInitializer(initializer);
      });

      MyApp.module("MyModule", definition);

      MyApp.module("MyModule").start();
    });

    it("should run the module initializers once", function(){
      expect(initializer.callCount).toBe(1);
    });

    it("should run the definition functions only once", function(){
      expect(definition.callCount).toBe(1);
    });

  });

  describe("when splitting a module defininition in to two parts and starting the app", function(){
    var initializer, definition;

    beforeEach(function(){
      initializer = jasmine.createSpy();
      definition = jasmine.createSpy();

      var MyApp = new Backbone.Marionette.Application();

      MyApp.module("MyModule", function(MyMod){
        MyMod.addInitializer(initializer);
      });

      MyApp.module("MyModule", definition);

      MyApp.start();
    });

    it("should run the module initializers once", function(){
      expect(initializer.callCount).toBe(1);
    });

    it("should run the definition functions only once", function(){
      expect(definition.callCount).toBe(1);
    });

  });

  describe("when starting a module that has sub-modules", function(){
    var MyApp, mod1, mod2, mod3;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      mod1 = MyApp.module("Mod1");
      mod2 = MyApp.module("Mod1.Mod2");
      mod3 = MyApp.module("Mod1.Mod3");

      spyOn(mod2, "start");
      spyOn(mod3, "start");

      mod1.start();
    });

    it("should start all sub-modules", function(){
      expect(mod2.start).toHaveBeenCalled();
      expect(mod3.start).toHaveBeenCalled();
    });
  });

  describe("when providing a module definition and not starting the module", function(){
    var MyApp, definitionFunction

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      definitionFunction = jasmine.createSpy();

      MyApp.module("MyModule", definitionFunction);
    });

    it("should run the definition function", function(){
      expect(definitionFunction).toHaveBeenCalled();
    });

  });

  describe("when providing a module definition and starting the module", function(){
    var MyApp, spy;

    beforeEach(function(){
      spy   = sinon.spy();
      MyApp = new Backbone.Marionette.Application();
      var module = MyApp.module("MyModule", spy);
      module.start();
    });

    it("should run the module definition in the context of the module", function(){
      expect(spy).toHaveBeenCalledOn(MyApp.MyModule);
    });

    it("should pass the module object as the first parameter", function(){
      expect(spy).toHaveBeenCalledWith(MyApp.MyModule);
    });

    it("should pass the application object as the second parameter", function(){
      expect(spy.args[0][1]).toBe(MyApp);
    });

    it("should pass Backbone as the third parameter", function(){
      expect(spy.args[0][2]).toBe(Backbone);
    });

    it("should pass Marionette as the fourth parameter", function(){
      expect(spy.args[0][3]).toBe(Backbone.Marionette);
    });

    it("should pass jQuery as the fifth parameter", function(){
      expect(spy.args[0][4]).toBe(jQuery);
    });

    it("should pass underscore as the sixth parameter", function(){
      expect(spy.args[0][5]).toBe(_);
    });
  });

  describe("when adding a module initializer outside of the module definition function and starting the app", function(){
    var initializer;

    beforeEach(function(){
      var MyApp = new Marionette.Application();
      var module = MyApp.module("MyModule");

      initializer = jasmine.createSpy("module initializer");
      module.addInitializer(initializer);

      MyApp.start();
    });

    it("should run the initializer", function(){
      expect(initializer).toHaveBeenCalled();
    });

  });

  describe("when starting the app that owns the module", function(){
    var MyApp, myModule, options;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      myModule = MyApp.module("MyModule");
      spyOn(myModule, "start");

      options = {};
      MyApp.start(options);
    });

    it("should start the module", function(){
      expect(myModule.start).toHaveBeenCalled();
    });

    it("should pass the options along to the module initializer", function(){
      expect(myModule.start.mostRecentCall.args[0]).toBe(options);
    });

  });

  describe("when loading a module after the app has been started", function(){
    var MyApp, myModule, options, moduleSpy, initializerSpy;

    beforeEach(function(){
      moduleSpy      = sinon.spy();
      initializerSpy = sinon.spy();
      options        = {};

      MyApp = new Backbone.Marionette.Application();
      MyApp.start(options);

      myModule = MyApp.module("MyModule", moduleSpy);
      myModule.addInitializer(initializerSpy);
    });

    it("should start the module", function(){
      expect(moduleSpy).toHaveBeenCalled();
    });

    it("should pass the options along to the module initializer", function(){
      expect(initializerSpy).toHaveBeenCalledWith(options);
    });

  });

});
