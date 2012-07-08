describe("application modules", function(){
  describe("when specifying a module on an application", function(){
    var MyApp, myModule;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();
      myModule = MyApp.module("MyModule");

      MyApp.start();
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

        MyApp.start();
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
        lastModule = MyApp.module("Parent.Child");

        MyApp.start();
      });

      it("should create the parent module on the application", function(){
        expect(MyApp.Parent).not.toBeUndefined;
      });

      it("should create the child module on the parent module", function(){
        expect(MyApp.Parent.Child).not.toBeUndefined;
      });

      it("should return the last sub-module in the list", function(){
        expect(lastModule).toBe(MyApp.Parent.Child);
      });
    });

    describe("and a module definition callback is provided", function(){
      var definition;
      
      beforeEach(function(){
        definition = jasmine.createSpy();

        MyApp = new Backbone.Marionette.Application();
        lastModule = MyApp.module("Parent.Child", definition);

        MyApp.start();
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

      MyApp.module("MyModule");
      MyModule = MyApp.MyModule;

      MyApp.module("MyModule");

      MyApp.start();
    });

    it("should only create the module one", function(){
      expect(MyApp.MyModule).toBe(MyModule);
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

  describe("when starting a module", function(){
    var MyApp, myModule, initializer;

    beforeEach(function(){
      initializer = jasmine.createSpy();

      MyApp = new Backbone.Marionette.Application();
      MyApp.module("MyModule", function(MyMod){
        MyMod.addInitializer(initializer);
      });

      MyApp.start();
    });

    it("should run the module initializers", function(){
      expect(initializer).toHaveBeenCalled();
    });
  });

  describe("when providing a module definition and not starting the module", function(){
    var MyApp, definitionFunction

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      definitionFunction = jasmine.createSpy();

      MyApp.module("MyModule", definitionFunction);
    });

    it("should not run the definition function", function(){
      expect(definitionFunction).not.toHaveBeenCalled();
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

  describe("when attaching a method to the module parameter in the module definition", function(){
    var MyApp, myFunc;

    beforeEach(function(){
      myFunc = function(){};
      MyApp = new Backbone.Marionette.Application();

      MyApp.module("MyModule", function(myapp){
        myapp.someFunc = myFunc;
      });

      MyApp.start();
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

      MyApp.start();
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
    var MyApp, MyModule, CustomModule;

    beforeEach(function(){
      MyModule = {};
      MyApp = new Backbone.Marionette.Application();

      CustomModule = MyApp.module("CustomModule", function(myapp){
        return MyModule;
      });

      MyApp.start();
    });

    it("should not do anything with the returned object", function(){
      expect(MyApp.CustomModule).toBe(CustomModule);
    });
  });

  describe("when creating a sub-module with the . notation, the second parameter should be the object from which .module was called", function(){
    var MyApp, MyModule;

    beforeEach(function(){
      MyModule = {};
      MyApp = new Backbone.Marionette.Application();

      MyApp.module("CustomModule.SubModule", function(CustomModule, MyApp){
        MyModule = MyApp;
      });

      MyApp.start();
    });

    it("should use the returned object as the module", function(){
      expect(MyModule).toBe(MyApp);
    });
  });

  describe("when providing arguments after the function definition", function(){
    var MyApp, r1, r2, p1, p2;

    beforeEach(function(){
      p1 = {};
      p2 = {};
      MyApp = new Backbone.Marionette.Application();

      MyApp.module("FooModule", function(Foo, MyApp, Backbone, Marionette, $, _, P1Arg, P2Arg){
        r1 = P1Arg;
        r2 = P2Arg;
      }, p1, p2);

      MyApp.start();
    });

    it("should pass those arguments to the function definition", function(){
      expect(r1).toBe(p1);
      expect(r2).toBe(p2);
    });
  });

});
