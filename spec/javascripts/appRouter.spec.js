describe("app router", function(){
  // work around for not being able to stop history
  new (Backbone.Router.extend({ routes: {"noOp": "noOp"}, noOp: function(){} }))();
  Backbone.history.start();

  describe("when a route fires", function(){
    var Router = Backbone.Marionette.AppRouter.extend({
      appRoutes: {
        "m1": "method1"
      }
    });

    var controller = {
      method1: function(){},
    }

    beforeEach(function(){
      spyOn(controller, "method1");

      var router = new Router({
        controller: controller
      });

      router.navigate("m1", true);
    });

    it("should call the configured method on the specified controller", function(){
      expect(controller.method1).toHaveBeenCalled();
    });
  });

  describe("when a route fires", function(){
    var Router = Backbone.Marionette.AppRouter.extend({
      appRoutes: {
        "m2/:id": "withParam"
      }
    });

    var controller = {
      withParam: function(id){}
    }

    beforeEach(function(){
      spyOn(controller, "withParam");

      var router = new Router({
        controller: controller
      });

      router.navigate("m2/1", true);
    });

    it("should call the configured method with parameters", function(){
      expect(controller.withParam).toHaveBeenCalledWith("1");
    });
  });

});
