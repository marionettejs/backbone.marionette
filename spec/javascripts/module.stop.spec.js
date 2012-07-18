describe("module stop", function(){
  var App;

  beforeEach(function(){
    App = new Backbone.Marionette.Application();
  });

  describe("when stopping a module that has been started", function(){
    var mod1, mod2, mod3;

    beforeEach(function(){
      var mod1 = App.module("Mod1", function(Mod){
        mod.addFinalizer(function(){
          mod1.isDead = true;
        });
      });

      mod2 = App.module("Mod1.Mod2");
      mod3 = App.module("Mod1.Mod3");

      spyOn(mod2, "stop");
      spyOn(mod3, "stop");

      mod1.stop();
    });

    it("should run all finalizers for the module", function(){
      expect(mod1.isDead).toBe(true);
    });

    it("should stop all sub-modules", function(){
      expect(mod2.stop).toHaveBeenCalled();
      expect(mod3.stop).toHaveBeenCalled();
    });

    it("should not remove the module from it's parent module or application", function(){
      expect(App.module("Mod1")).toBe(mod1);
    });

  });

  describe("when stopping a module that has not been started", function(){
    it("should not run any finalizers", function(){
      throw "not yet implemented";
    });

    it("should not stop sub-modules", function(){
      throw "not yet implemented";
    });
  });

  describe("when telling a module to remove when it has stopped, and stopping the module", function(){
    it("should remove the module from the parent module or application", function(){
      throw "not yet implemented";
    });
  });

  describe("when stopping a sub-module from the parent module, by name", function(){
    it("should stop the specified sub-module", function(){
      throw "not yet implemented";
    });

    it("should not stop the parent module", function(){
      throw "not yet implemented";
    });
  });

});
