describe("application modules", function(){
  "use strict";

  describe("when specifying a module on an application", function(){
    var MyApp, myModule, initializeBefore, initializeAfter;

    beforeEach(function(){
      initializeBefore = jasmine.createSpy("before handler");
      initializeAfter = jasmine.createSpy("after handler");

      MyApp = new Backbone.Marionette.Application();
      myModule = MyApp.module("MyModule");
      myModule.on("before:start", initializeBefore);
      myModule.on("start", initializeAfter);

      myModule.start();
    });

    it("should notify me before initialization starts", function(){
      expect(initializeBefore).toHaveBeenCalled();
      expect(initializeBefore.callCount).toBe(1);
    });

    it("should notify me after initialization", function(){
      expect(initializeAfter).toHaveBeenCalled();
      expect(initializeAfter.callCount).toBe(1);
    });

    it("should add an object of that name to the app", function(){
      expect(MyApp.MyModule).not.toBeUndefined();
    });

    it("should return the module", function(){
      expect(myModule).toBe(MyApp.MyModule);
    });
  });

  describe("when specifying a module on an application with a define function", function(){
    var MyApp, ModuleClass, myModule, initializeBefore, initializeAfter;

    beforeEach(function(){
      initializeBefore = jasmine.createSpy("before handler");
      initializeAfter = jasmine.createSpy("after handler");

      MyApp = new Backbone.Marionette.Application();
      myModule = MyApp.module("MyModule", function(MyModule, MyApp) {
          MyModule.on("before:start", initializeBefore);
          MyModule.on("start", initializeAfter);
      });

      myModule.start();
    });

    it("should notify me before initialization starts", function(){
      expect(initializeBefore).toHaveBeenCalled();
      expect(initializeBefore.callCount).toBe(1);
    });

    it("should notify me after initialization", function(){
      expect(initializeAfter).toHaveBeenCalled();
      expect(initializeAfter.callCount).toBe(1);
    });

    it("should add an object of that name to the app", function(){
      expect(MyApp.MyModule).not.toBeUndefined();
    });

    it("should return the module", function(){
      expect(myModule).toBe(MyApp.MyModule);
    });
  });
  describe("when specifying a module on an application with options object", function(){
    var MyApp, ModuleClass, myModule, initializer, initializeBefore, initializeAfter;

    beforeEach(function(){
      initializer = jasmine.createSpy("initialize handler");
      initializeBefore = jasmine.createSpy("before handler");
      initializeAfter = jasmine.createSpy("after handler");

      MyApp = new Backbone.Marionette.Application();
      ModuleClass = Backbone.Marionette.Module.extend({
          initialize: initializer,
          onBeforeStart: initializeBefore,
          onStart: initializeAfter
      });
      myModule = MyApp.module("MyModule", {moduleClass: ModuleClass});

      myModule.start();
    });

    it("should run the initialize function one time", function(){
      expect(initializer).toHaveBeenCalled();
      expect(initializer.callCount).toBe(1);
    });

    it("should notify me before initialization starts", function(){
      expect(initializeBefore).toHaveBeenCalled();
      expect(initializeBefore.callCount).toBe(1);
    });

    it("should notify me after initialization", function(){
      expect(initializeAfter).toHaveBeenCalled();
      expect(initializeAfter.callCount).toBe(1);
    });

    it("should add an object of that name to the app", function(){
      expect(MyApp.MyModule).not.toBeUndefined();
    });

    it("should return the module", function(){
      expect(myModule).toBe(MyApp.MyModule);
    });
  });

  describe("when specifying a module on an application with a module class", function(){
    var MyApp, ModuleClass, myModule, initializer, initializeBefore, initializeAfter;

    beforeEach(function(){
      initializer = jasmine.createSpy("initialize");
      initializeBefore = jasmine.createSpy("before handler");
      initializeAfter = jasmine.createSpy("after handler");

      MyApp = new Backbone.Marionette.Application();
      ModuleClass = Backbone.Marionette.Module.extend({
          initialize: initializer,
          onBeforeStart: initializeBefore,
          onStart: initializeAfter
      });
      myModule = MyApp.module("MyModule", ModuleClass);

      myModule.start();
    });

    it("should run the initialize function one time", function(){
      expect(initializer).toHaveBeenCalled();
      expect(initializer.callCount).toBe(1);
    });

    it("should notify me before initialization starts", function(){
      expect(initializeBefore).toHaveBeenCalled();
      expect(initializeBefore.callCount).toBe(1);
    });

    it("should notify me after initialization", function(){
      expect(initializeAfter).toHaveBeenCalled();
      expect(initializeAfter.callCount).toBe(1);
    });

    it("should add an object of that name to the app", function(){
      expect(MyApp.MyModule).not.toBeUndefined();
    });

    it("should return the module", function(){
      expect(myModule).toBe(MyApp.MyModule);
    });
  });

  describe("when specifying sub-modules with a . notation", function(){
    var MyApp, lastModule, parentModule, childModule;

    describe("and the parent module already exists", function(){
      beforeEach(function(){
        MyApp = new Backbone.Marionette.Application();
        MyApp.module("Parent");
        parentModule = MyApp.Parent;

        lastModule = MyApp.module("Parent.Child");

        lastModule.start();
      });

      it("should not replace the parent module", function(){
        expect(MyApp.Parent).toBe(parentModule);
      });

      it("should create the child module on the parent module", function(){
        expect(MyApp.Parent.Child).not.toBeUndefined();
      });

      it("should return the last sub-module in the list", function(){
        expect(lastModule).toBe(MyApp.Parent.Child);
      });
    });

    describe("and the parent module does not exist", function(){
      beforeEach(function(){
        MyApp = new Backbone.Marionette.Application();
        lastModule = MyApp.module("Parent.Child.GrandChild");

        lastModule.start();
      });

      it("should create the parent module on the application", function(){
        expect(MyApp.Parent).not.toBeUndefined;
      });

      it("should create the child module on the parent module", function(){
        expect(MyApp.Parent.Child).not.toBeUndefined;
      });

      it("should create the grandchild module on the parent module", function(){
        expect(MyApp.Parent.Child.GrandChild).not.toBeUndefined;
      });

      it("should return the last sub-module in the list", function(){
        expect(lastModule).toBe(MyApp.Parent.Child.GrandChild);
      });
    });

    describe("When defining a grand-child module with an un-defined child, and starting the parent directly", function(){
      var handler;

      beforeEach(function(){
        handler = jasmine.createSpy("initializer");

        MyApp = new Backbone.Marionette.Application();

        MyApp.module("Parent.Child.GrandChild", function(mod){
          mod.addInitializer(handler);
        });

        MyApp.module("Parent").start();
      });

      it("should create the parent module on the application", function(){
        expect(MyApp.Parent).not.toBeUndefined;
      });

      it("should create the child module on the parent module", function(){
        expect(MyApp.Parent.Child).not.toBeUndefined;
      });

      it("should create the grandchild module on the parent module", function(){
        expect(MyApp.Parent.Child.GrandChild).not.toBeUndefined;
      });

      it("should start the grandchild module", function(){
        expect(handler).toHaveBeenCalled();
      });
    });

    describe("and a module definition callback is provided", function(){
      var definition;

      beforeEach(function(){
        definition = jasmine.createSpy();

        MyApp = new Backbone.Marionette.Application();
        lastModule = MyApp.module("Parent.Child", definition);

        lastModule.start();
      });

      it("should call the module definition for the last module specified", function(){
        expect(definition).toHaveBeenCalled();
      });

      it("should only run the module definition once", function(){
        expect(definition.callCount).toBe(1);
      });

    });
  });

  describe("when specifying the same module twice", function(){
    var MyApp, MyModule;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      MyApp.module("MyModule", function(){});
      MyModule = MyApp.MyModule;

      MyApp.module("MyModule", function(){});
    });

    it("should only create the module once", function(){
      expect(MyApp.MyModule).toBe(MyModule);
    });
  });

  describe("when attaching a method to the module parameter in the module definition", function(){
    var MyApp, myFunc;

    beforeEach(function(){
      myFunc = function(){};
      MyApp = new Backbone.Marionette.Application();

      var mod = MyApp.module("MyModule", function(myapp){
        myapp.someFunc = myFunc;
      });

      mod.start();
    });

    it("should make that method publicly available on the module", function(){
      expect(MyApp.MyModule.someFunc).toBe(myFunc);
    });
  });

  describe("when specifying the same module, with a definition, more than once", function(){
    var MyApp, myModule;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      myModule = MyApp.module("MyModule", function(MyModule){
        MyModule.definition1 = true;
      });

      MyApp.module("MyModule", function(MyModule){
        MyModule.definition2 = true;
      });

      myModule.start();
    });

    it("should re-use the same module for all definitions", function(){
      expect(myModule).toBe(MyApp.MyModule);
    });

    it("should allow the first definition to modify the resulting module", function(){
      expect(MyApp.MyModule.definition1).toBe(true);
    });

    it("should allow the second definition to modify the resulting module", function(){
      expect(MyApp.MyModule.definition2).toBe(true);
    });

  });

  describe("when returning an object from the module definition", function(){
    var MyApp, MyModule;

    beforeEach(function(){
      MyModule = {};
      MyApp = new Backbone.Marionette.Application();

      MyModule = MyApp.module("CustomModule", function(myapp){
        return {};
      });

      MyModule.start();
    });

    it("should not do anything with the returned object", function(){
      expect(MyApp.CustomModule).toBe(MyModule);
    });
  });

  describe("when creating a sub-module with the . notation, the second parameter should be the object from which .module was called", function(){
    var MyApp, MyModule;

    beforeEach(function(){
      MyModule = {};
      MyApp = new Backbone.Marionette.Application();

      var subMod = MyApp.module("CustomModule.SubModule", function(CustomModule, MyApp){
        MyModule = MyApp;
      });

      subMod.start();
    });

    it("should use the returned object as the module", function(){
      expect(MyModule).toBe(MyApp);
    });
  });

  describe("when providing arguments after the function definition", function(){
    var MyApp, r1, r2, r3, p1, p2, p3;

    beforeEach(function(){
      p1 = {};
      p2 = {};
      p3 = {};
      MyApp = new Backbone.Marionette.Application();

      var mod = MyApp.module("FooModule", function(Foo, MyApp, Backbone, Marionette, $, _, P1Arg, P2Arg){
        r1 = P1Arg;
        r2 = P2Arg;
      }, p1, p2);

      MyApp.module("FooModule", function(Foo, MyApp, Backbone, Marionette, $, _, P3Arg){
        r3 = P3Arg;
      }, p3);

      mod.start();
    });

    it("should pass those arguments to the first definition", function(){
      expect(r1).toBe(p1);
      expect(r2).toBe(p2);
    });

    it("should pass those arguments to the second definition", function(){
      expect(r3).toBe(p3);
    });
  });

});