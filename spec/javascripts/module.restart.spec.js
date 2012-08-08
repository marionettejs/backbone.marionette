describe("module restart", function(){

  describe("when starting and stopping a module twice", function(){
    var MyApp, myModule, initializer, finalizer;

    beforeEach(function(){
      initializer = jasmine.createSpy();
      finalizer = jasmine.createSpy();

      MyApp = new Backbone.Marionette.Application();
      myModule = MyApp.module("MyModule", function(MyMod){
        MyMod.addInitializer(initializer);
        MyMod.addFinalizer(finalizer);
      });

      myModule.start();
      myModule.stop();
      myModule.start();
      myModule.stop();
    });

    it("should run the module initializers twice", function(){
      expect(initializer.callCount).toBe(2);
    });

    it("should run the module finalizers twice", function(){
      expect(finalizer.callCount).toBe(2);
    });

  });

  describe("when defining the module multiple times, starting twice, and stopping once", function(){
    var MyApp, mod, initializer, finalizer;
    
    beforeEach(function(){
      initializer = jasmine.createSpy();
      finalizer = jasmine.createSpy();

      MyApp = new Backbone.Marionette.Application();
      myModule = MyApp.module("MyModule", function(MyMod){
        MyMod.addInitializer(initializer);
        MyMod.addFinalizer(finalizer);
      });

      MyApp.module("MyModule");
      MyApp.module("MyModule");

      myModule.start();
      myModule.start();
      myModule.stop();
    });

    it("should stop the module once", function(){
      expect(finalizer.callCount).toBe(1);
    });

  });

  describe("when a module has a finalizer, starting and stopping the module, then re-starting it", function(){
    var MyApp, initializer, finalizer;
    
    beforeEach(function(){
      initializer = jasmine.createSpy();
      finalizer = jasmine.createSpy();

      MyApp = new Backbone.Marionette.Application();
      MyApp.module("MyModule", function(MyMod){
        MyMod.addInitializer(initializer);
        MyMod.addFinalizer(finalizer);
      });

      var m1 = MyApp.module("MyModule");
      m1.start();
      m1.stop();

      var m2 = MyApp.module("MyModule");
      m2.start();
    });

    it("should start the module twice", function(){
      expect(initializer.callCount).toBe(2);
    });

    it("should stop the module once", function(){
      expect(finalizer.callCount).toBe(1);
    });

  });

});
