describe("module start", function(){
  "use strict";

  describe("when a top level module specifies it should load with the parent app", function(){

    describe("and a sub-module is set to load with the parent module", function(){
      var moduleStart, subModuleStart;

      beforeEach(function(){
        moduleStart = jasmine.createSpy("module start");
        subModuleStart = jasmine.createSpy("submodule start");

        var App = new Marionette.Application();

        App.module("Parent", {
          startWithParent: true,
          define: function(Parent){
            Parent.addInitializer(moduleStart);
          }
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

        App.module("Parent", {
          startWithParent: true,
          define: function(mod){
            mod.addInitializer(moduleStart);
          }
        });

        App.module("Parent.Child", {
          startWithParent: false,
          define: function(Child){
            Child.addInitializer(subModuleStart);
          }
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

});
