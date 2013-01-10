describe("module start", function(){
  "use strict";

  describe("when a top level module specifies it should load with the parent app", function(){

    describe("and a sub-module is set to load with the parent module", function(){
      var moduleStart, subModuleStart;

      beforeEach(function(){
        moduleStart = jasmine.createSpy("module start");
        subModuleStart = jasmine.createSpy("submodule start");

        var App = new Marionette.Application();

        App.module("Parent", function(Parent){
          this.startWithParent = true;
          Parent.addInitializer(moduleStart);
        });

        App.module("Parent.Child", function(Child){
          Child.addInitializer(subModuleStart);
        });

        App.start();
      });

      it("should start the parent module with the app", function(){
        expect(moduleStart).toHaveBeenCalled();
      });

      it("should start with the sub-module with the parent", function(){
        expect(subModuleStart).toHaveBeenCalled();
      });
    });

    describe("and a sub-module is set to NOT load with the parent module", function(){
      var moduleStart, subModuleStart;

      beforeEach(function(){
        moduleStart = jasmine.createSpy("top module start");
        subModuleStart = jasmine.createSpy("sub module start");

        var App = new Marionette.Application();

        App.module("Parent", function(mod){
          this.startWithParent = true;
          mod.addInitializer(moduleStart);
        });

        App.module("Parent.Child", function(Child){
          this.startWithParent = false;
          Child.addInitializer(subModuleStart);
        });

        App.start();
      });

      it("should start the parent module with the app", function(){
        expect(moduleStart).toHaveBeenCalled();
      });

      it("should NOT start with the sub-module with the parent", function(){
        expect(subModuleStart).not.toHaveBeenCalled();
      });
    });

  });

  describe("when defining a parent and child module together, adding an initializer to the parent, and starting the app", function(){
    var init;

    beforeEach(function(){
      init = jasmine.createSpy("initializer");

      var App = new Marionette.Application();
      App.module("Parent.Child");
      App.module("Parent").addInitializer(init);

      App.start();
    });

    it("should start the parent module", function(){
      expect(init).toHaveBeenCalled();
    });

  });

  describe("when defining a parent and child module together, and starting the app", function(){
    var App;

    beforeEach(function(){
      App = new Marionette.Application();
      App.module("Parent.Child");

      App.start();
    });

    it("should start the parent module", function(){
      expect(App.Parent._isInitialized).toBe(true);
    });

  });

  describe("when defining a parent and child module, the parent is set not to start with the app, and starting the parent", function(){
    var App;

    beforeEach(function(){
      App = new Marionette.Application();

      App.module("Parent", {startWithParent: false});
      App.module("Parent.Child");

      App.module("Parent").start();
    });

    it("should start the child module", function(){
      expect(App.Parent.Child._isInitialized).toBe(true);
    });

  });

});
