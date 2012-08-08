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

    it("should not run the definition function", function(){
      expect(definitionFunction).not.toHaveBeenCalled();
    });

  });

  describe("when splitting a module definition, one of them is set to not start with the app, and starting the app", function(){
    var MyApp, firstfunc, secondfunc;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      firstfunc = jasmine.createSpy();
      secondfunc = jasmine.createSpy();

      MyApp.module("MyModule", {
        startWithApp: false,
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

});

describe("module auto-start with the app.start", function(){

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
    var MyApp, myModule, options;

    beforeEach(function(){
      options = {};
      MyApp = new Backbone.Marionette.Application();
      MyApp.start(options);

      myModule = MyApp.module("MyModule", function(mod){
        mod.started = true;

        mod.addInitializer(function(options){
          mod.capturedOptions = options;
        });
      });
    });

    it("should start the module", function(){
      expect(myModule.started).toBe(true);
    });

    it("should pass the options along to the module initializer", function(){
      expect(myModule.capturedOptions).toBe(options);
    });

  });

  describe("when loading a module after the app has been started, and telling the module not to auto-start with the app", function(){
    var MyApp, myModule, options;

    beforeEach(function(){
      options = {};
      MyApp = new Backbone.Marionette.Application();
      MyApp.start(options);

      myModule = MyApp.module("MyModule", {
        startWithApp: false, 
        define: function(mod){
          mod.started = true;

          mod.addInitializer(function(options){
            mod.capturedOptions = options;
          });
        }
      });

    });

    it("should not start the module", function(){
      expect(myModule.started).toBeFalsy();
    });

    it("should not run the module initializer", function(){
      expect(myModule.capturedOptions).not.toBeDefined();
    });
  });

});
