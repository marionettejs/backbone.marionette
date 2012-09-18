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

});
