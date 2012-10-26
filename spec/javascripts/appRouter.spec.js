describe("app router", function(){
  "use strict";

  afterEach(function(){
    window.location.hash = "";
  });

  describe("when a route is configured with a method that does not exist on the controller", function(){
    var Router = Backbone.Marionette.AppRouter.extend({
      appRoutes: {
        "m1": "doesNotExist"
      }
    });

    var controller = {}

    it("should throw an error saying the method does not exist", function(){
      var expectedMessage = "Method 'doesNotExist' was not found on the controller";
      expect(function(){
        new Router({controller: controller});
      }).toThrow(expectedMessage);
    });
  });

  describe("when a route fires", function(){
    var context;

    var Router = Backbone.Marionette.AppRouter.extend({
      appRoutes: {
        "m1": "method1"
      }
    });

    var controller = {
      method1: function(){
        context = this;
      },
    }

    beforeEach(function(){
      spyOn(controller, "method1").andCallThrough();

      var router = new Router({
        controller: controller
      });
      Backbone.history.start();

      router.navigate("m1", true);
    });

    afterEach(function(){
      Backbone.history.stop();
    });

    it("should call the configured method on the controller passed in the constructor", function(){
      expect(controller.method1).toHaveBeenCalled();
    });

    it("should execute the controller method with the context of the controller", function(){
      expect(context).toBe(controller);
    });
  });

  describe("when a second route fires from a controller instance", function(){
    var context, controller;

    var Router = Backbone.Marionette.AppRouter.extend({
      appRoutes: {
        "m1": "method1",
        "m2": "method2"
      }
    });

    var Controller = function(){
      return {
        method1: function(){},

        method2: function(){
          context = this;
        }
      };
    }

    beforeEach(function(){
      controller = new Controller();
      spyOn(controller, "method2").andCallThrough();

      var router = new Router({
        controller: controller
      });
      Backbone.history.start();

      router.navigate("m1", true);
      router.navigate("m2", true);
    });

    afterEach(function(){
      Backbone.history.stop();
    });

    it("should call the configured method on the controller passed in the constructor", function(){
      expect(controller.method2).toHaveBeenCalled();
    });

    it("should execute the controller method with the context of the controller", function(){
      expect(context).toBe(controller);
    });
  });

  describe("when a route fires with parameters", function(){
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
      Backbone.history.start();

      router.navigate("m2/1", true);
    });

    afterEach(function(){
      Backbone.history.stop();
    });

    it("should call the configured method with parameters", function(){
      expect(controller.withParam).toHaveBeenCalledWith("1");
    });
  });

  describe("when a standard route is defined and fired", function(){
    var Router = Backbone.Marionette.AppRouter.extend({
      routes: {
        "m3": "standardRoute"
      },

      standardRoute: function(){}
    });

    var router;

    beforeEach(function(){
      spyOn(Router.prototype, "standardRoute").andCallThrough();

      router = new Router();
      Backbone.history.start();

      router.navigate("m3", true);
    });

    afterEach(function(){
      Backbone.history.stop();
    });

    it("should fire the route callback", function(){
      expect(Router.prototype.standardRoute).toHaveBeenCalled();
    });
  });

});
