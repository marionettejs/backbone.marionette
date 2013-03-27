describe("app router", function(){
  "use strict";

  afterEach(function(){
    window.location.hash = "";
  });

  describe("when a route is configured with a method that does not exist on the controller", function(){
    var expectedMessage = "Method 'doesNotExist' was not found on the controller";

    var Router = Backbone.Marionette.AppRouter.extend({
      appRoutes: {
        "m1": "doesNotExist"
      }
    });

    var controller = {};

    function run(){
      new Router({controller: controller});
    }

    it("should throw an error saying the method does not exist", function(){
      expect(run).toThrow(expectedMessage);
    });
  });

  describe("when a controller is passed through the constructor and a route fires", function(){
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

  describe("when a controller is provided in the router definition and a route fires", function(){
    var context;

    var controller = {
      method1: function(){
        context = this;
      },
    }

    var Router = Backbone.Marionette.AppRouter.extend({
      appRoutes: {
        "m1": "method1"
      },

      controller: controller
    });

    beforeEach(function(){
      spyOn(controller, "method1").andCallThrough();

      var router = new Router();
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

  describe("when router configured with ambiguous routes", function() {
    var controller, router;

    beforeEach(function() {
      var PostsRouter = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
          "posts/top": "showPostsTop",
          "posts/:id": "showPost"
        }
      });

      controller = {
        showPostsTop: jasmine.createSpy("showPostsTop"),
        showPost: jasmine.createSpy("showPost")
      };

      Backbone.history.start();

      router = new PostsRouter({ controller: controller });
      router.navigate('posts/top', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it("should take routes order into account", function() {
      expect(controller.showPostsTop).toHaveBeenCalled();
      expect(controller.showPost).not.toHaveBeenCalled();
    });
  });

  describe("when routes are in the wrong order", function() {
    var controller, router;

    beforeEach(function() {
      var PostsRouter = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
          "posts/:id": "showPost",
          "posts/top": "showPostsTop"
        }
      });

      controller = {
        showPostsTop: jasmine.createSpy("showPostsTop"),
        showPost: jasmine.createSpy("showPost")
      };

      Backbone.history.start();

      router = new PostsRouter({ controller: controller });
      router.navigate('posts/top', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it("should fire the wrong route", function() {
      expect(controller.showPost).toHaveBeenCalled();
      expect(controller.showPostsTop).not.toHaveBeenCalled();
    });
  });

});
