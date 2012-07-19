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

});
