describe("module auto-start with the app.start", function(){
  "use strict";

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

  describe("when a module is set not to start with the app, and starting the app", function(){
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
        startWithParent: false, 
        define: function(mod){
          mod.defined = true;

          mod.addInitializer(function(options){
            mod.capturedOptions = options;
          });

        }
      });

    });

    it("should define the module", function(){
      expect(myModule.defined).toBe(true);
    });

    it("should not run the module initializer", function(){
      expect(myModule.capturedOptions).not.toBeDefined();
    });
  });

  describe("given a module is configured to not start with app", function(){

    describe("when defining the module twice, and retrieving the module by name (without a new definition)", function(){
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

        MyApp.module("MyModule", function(){});

        MyModule = MyApp.module("MyModule");

        MyApp.start();
      });

      it("should not start the module when the app starts", function(){
        expect(moduleStart).not.toHaveBeenCalled();
      });
    });

  });

});
