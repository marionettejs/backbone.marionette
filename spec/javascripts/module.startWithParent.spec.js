describe("module startWithParent", function(){

  describe("when a module is set not to start with the app, using an object literal, and starting the app", function(){
    var MyApp, MyModule, moduleStart;

    beforeEach(function(){
      moduleStart = jasmine.createSpy("module start");
      MyApp = new Backbone.Marionette.Application();

      MyApp.module("MyModule", {
        startWithParent: false,
        define: function(Mod){
          Mod.addInitializer(moduleStart);
        }
      });

      MyApp.start();
    });

    it("should not start the module when the app starts", function(){
      expect(moduleStart).not.toHaveBeenCalled();
    });
  });

  describe("when a module is set not to start with the app, and starting the app", function(){
    var MyApp, MyModule, moduleStart;

    beforeEach(function(){
      moduleStart = jasmine.createSpy("module start");
      MyApp = new Backbone.Marionette.Application();

      MyApp.module("MyModule", function(){
        this.startWithParent = false;
        this.addInitializer(moduleStart);
      });

      MyApp.start();
    });

    it("should not start the module when the app starts", function(){
      expect(moduleStart).not.toHaveBeenCalled();
    });
  });

  describe("given a module is configured to not start with app, once", function(){

    describe("when defining the module a second time, then retrieving the module by name (without a new definition)", function(){
      var MyApp, MyModule, moduleStart;

      beforeEach(function(){
        moduleStart = jasmine.createSpy("module start");
        MyApp = new Backbone.Marionette.Application();

        MyApp.module("MyModule", function(Mod){
          this.startWithParent = false;
          Mod.addInitializer(moduleStart);
        });

        MyApp.module("MyModule", function(){});

        MyModule = MyApp.module("MyModule");

        MyApp.start();
      });

      it("should not start the module when the app starts", function(){
        expect(moduleStart).not.toHaveBeenCalled();
      });
    });

  });

  describe("when loading a module after the app has been started, and telling the module not to auto-start with the app", function(){
    var MyApp, myModule, options;

    beforeEach(function(){
      options = {};
      MyApp = new Backbone.Marionette.Application();
      MyApp.start(options);

      myModule = MyApp.module("MyModule", function(mod){
        this.startWithParent = false;
        mod.defined = true;

        mod.addInitializer(function(options){
          mod.capturedOptions = options;
        });
      });
    });

    it("should define the module", function(){
      expect(myModule.defined).toBe(true);
    });

    it("should not run the module initializer", function(){
      expect(myModule.capturedOptions).not.toBeDefined();
    });
  });

  describe("when setting up a hierarchy of modules in reverse order and a child module is set not to start with parent and module initializer outside of the module definition function and starting the app", function(){
    var moduleAInitializer, moduleBInitializer;

    beforeEach(function(){
      var MyApp = new Marionette.Application(),
          ModuleA, ModuleB;

      ModuleB = MyApp.module("ModuleA.ModuleB", function(){
        this.startWithParent = false;
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

  describe("when splitting a module definition, one of them is set to not start with the app, and starting the app", function(){
    var MyApp, firstfunc, secondfunc;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      firstfunc = jasmine.createSpy("first initializer");
      secondfunc = jasmine.createSpy("second initializer");

      MyApp.module("MyModule", function(mod){
        mod.addInitializer(secondfunc);
      });

      MyApp.module("MyModule", function(mod){
        this.startWithParent = false;
        mod.addInitializer(firstfunc);
      });

      MyApp.start();
    });

    it("should not run the first definition function", function(){
      expect(firstfunc).not.toHaveBeenCalled();
    });

    it("should not run the second definition function", function(){
      expect(secondfunc).not.toHaveBeenCalled();
    });

  });

  describe("when configuring a parent module with the object-literal 'startWithParent' to false, adding a child module, and starting the app", function(){
    var parentInit, childInit;

    beforeEach(function(){
      parentInit = jasmine.createSpy("parent initializer");
      childInit = jasmine.createSpy("child initializer");

      var app = new Backbone.Marionette.Application();

      app.module('Parent', {
        startWithParent: false,
        define: function() {
          this.addInitializer(parentInit);
        }
      });
      app.module('Parent.Child', function() {
        this.addInitializer(childInit);
      });

      // Expected: nothing is initialized
      // What happens: Parent.Child, but not Parent is initialized
      app.start();
      // Expected: both Parent and Parent.Child are initialized
      //app.Parent.start();

    });

    it("should not start the parent", function(){
      expect(parentInit).not.toHaveBeenCalled();
    });

    it("should not start the child", function(){
      expect(childInit).not.toHaveBeenCalled();
    });

  });

  describe("when configuring a parent module with the object-literal 'startWithParent' to false, adding a child module, starting the app, then starting the parent", function(){
    var parentInit, childInit;

    beforeEach(function(){
      parentInit = jasmine.createSpy("parent initializer");
      childInit = jasmine.createSpy("child initializer");

      var app = new Backbone.Marionette.Application();

      app.module('Parent', {
        startWithParent: false,
        define: function() {
          this.addInitializer(parentInit);
        }
      });

      app.module('Parent.Child', function() {
        this.addInitializer(childInit);
      });

      app.start();
      app.Parent.start();
    });

    it("should start the parent once", function(){
      expect(parentInit.callCount).toBe(1);
    });

    it("should start the child once", function(){
      expect(childInit.callCount).toBe(1);
    });

  });

});
