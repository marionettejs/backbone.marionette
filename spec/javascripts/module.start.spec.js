describe("module start", function(){

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

  xdescribe("when splitting a module definition, one of them is set to not start with the app, and starting the app", function(){
    var MyApp, firstfunc, secondfunc;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      firstfunc = jasmine.createSpy();
      secondfunc = jasmine.createSpy();

      MyApp.module("MyModule", {
        startWithParent: false,
        define: firstfunc
      });
      MyApp.module("MyModule", secondfunc);

      MyApp.start();
    });

    it("should not run the first definition function", function(){
      expect(firstfunc).not.toHaveBeenCalled();
    });

    it("should not run the second definition function", function(){
      expect(secondfunc).not.toHaveBeenCalled();
    });

  });

  describe("when providing a module definition and starting the module", function(){
    var MyApp, moduleArgs, thisArg;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      module = MyApp.module("MyModule", function(){
        moduleArgs = arguments;
        thisArg = this;
      });

      module.start();
    });

    it("should run the module definition in the context of the module", function(){
      expect(thisArg).toBe(MyApp.MyModule);
    });

    it("should pass the module object as the first parameter", function(){
      expect(moduleArgs[0]).toBe(MyApp.MyModule);
    });

    it("should pass the application object as the second parameter", function(){
      expect(moduleArgs[1]).toBe(MyApp);
    });

    it("should pass Backbone as the third parameter", function(){
      expect(moduleArgs[2]).toBe(Backbone);
    });

    it("should pass Marionette as the fourth parameter", function(){
      expect(moduleArgs[3]).toBe(Backbone.Marionette);
    });

    it("should pass jQuery as the fifth parameter", function(){
      expect(moduleArgs[4]).toBe(jQuery);
    });

    it("should pass underscore as the sixth parameter", function(){
      expect(moduleArgs[5]).toBe(_);
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
  describe("when setting up a hierarchy of modules in reverse order and a child module is set not to start with parent and module initializer outside of the module definition function and starting the app", function(){
    var moduleAInitializer, moduleBInitializer;

    beforeEach(function(){
      var MyApp = new Marionette.Application(),
          ModuleA, ModuleB;

      ModuleB = MyApp.module("ModuleA.ModuleB", {
        startWithParent: false
      });

      moduleBInitializer = jasmine.createSpy("module b initializer");
      ModuleB.addInitializer(moduleBInitializer);

      ModuleA = MyApp.module("ModuleA");

      moduleAInitializer = jasmine.createSpy("module a initializer");
      ModuleA.addInitializer(function() {
        moduleAInitializer();
        ModuleB.start();
      });

      MyApp.start();
    });

    it("should run the module b initializer", function(){
      expect(moduleBInitializer).toHaveBeenCalled();
    });

    it("should run the module a initializer", function(){
      expect(moduleAInitializer).toHaveBeenCalled();
    });

  });
});
