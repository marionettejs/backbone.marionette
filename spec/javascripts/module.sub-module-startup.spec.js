describe("module start", function(){

  describe("given a parent module is set to not start with the app", function(){

    describe("when a sub-module does not specify a startup option", function(){
      var subModuleStart;

      beforeEach(function(){
        subModuleStart = jasmine.createSpy("submodule start");
        var App = new Marionette.Application();

        App.module("Parent", {
          startWithApp: false
        });

        App.module("Parent.Child", function(Child){
          Child.addInitializer(subModuleStart);
        });

        App.start();
      });

      it("should default to the parent module's option", function(){
        expect(subModuleStart).not.toHaveBeenCalled();
      });
    });

    describe("when a sub-module overrides the parent auto-start", function(){
      var subModuleStart;

      beforeEach(function(){
        subModuleStart = jasmine.createSpy("submodule start");
        var App = new Marionette.Application();

        App.module("Parent", {
          startWithApp: false
        });

        App.module("Parent.Child", {
          startWithApp: true,
          define: function(Child){
            Child.addInitializer(subModuleStart);
          }
        });

        App.start();
      });

      it("should start the sub-module", function(){
        expect(subModuleStart).toHaveBeenCalled();
      });
    });

  });

});
