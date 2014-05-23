describe('app router', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  afterEach(function() {
    window.location.hash = '';
  });

  describe('when a route is configured with a method that does not exist on the controller', function() {
    var Router, controller, router, run;

    beforeEach(function () {
      Router = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
          'm1': 'doesNotExist'
        }
      });

      controller = {};

      run = function() {
        router = new Router({controller: controller});
      };
    });

    it('should throw an error saying the method does not exist', function() {
      expect(run).to.throw('Method "doesNotExist" was not found on the controller');
    });
  });

  describe('when a controller is passed through the constructor and a route fires', function() {
    var Router, controller, router;

    beforeEach(function() {
      Router = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
          'm1': 'method1'
        }
      });

      controller = {
        method1: this.sinon.stub()
      };

      router = new Router({
        controller: controller
      });
      Backbone.history.start();

      router.navigate('m1', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should call the configured method on the controller passed in the constructor', function() {
      expect(controller.method1).to.have.been.called;
    });

    it('should execute the controller method with the context of the controller', function() {
      expect(controller.method1).to.have.been.calledOn(controller);
    });
  });

  describe('when a controller is provided in the router definition and a route fires', function() {
    var controller, Router, router;

    beforeEach(function() {
      controller = {
        method1: this.sinon.stub()
      };

      Router = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
          'm1': 'method1'
        },

        controller: controller
      });

      router = new Router();
      Backbone.history.start();

      router.navigate('m1', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should call the configured method on the controller passed in the constructor', function() {
      expect(controller.method1).to.have.been.called;
    });

    it('should execute the controller method with the context of the controller', function() {
      expect(controller.method1).to.have.been.calledOn(controller);
    });
  });

  describe('when a second route fires from a controller instance', function() {
    var Router, router, Controller, controller;

    beforeEach(function() {
      var self = this;

      Router = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
          'm1': 'method1',
          'm2': 'method2'
        }
      });

      Controller = function() {
        return {
          method1: function() {},
          method2: self.sinon.stub()
        };
      };

      controller = new Controller();

      router = new Router({
        controller: controller
      });
      Backbone.history.start();

      router.navigate('m1', true);
      router.navigate('m2', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should call the configured method on the controller passed in the constructor', function() {
      expect(controller.method2).to.have.been.called;
    });

    it('should execute the controller method with the context of the controller', function() {
      expect(controller.method2).to.have.been.calledOn(controller);
    });
  });

  describe('when a route fires with parameters', function() {
    var spy, router, Router, controller;

    beforeEach(function() {
      controller = {
        withParam: function() {}
      };

      Router = Backbone.Marionette.AppRouter.extend({
        onRoute: this.sinon.stub(),
        appRoutes: {
          'm2/:id': 'withParam'
        }
      });
      spy = this.sinon.spy(controller, 'withParam');

      router = new Router({
        controller: controller
      });
      Backbone.history.start();

      router.navigate('m2/1', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should call the configured method with parameters', function() {
      expect(spy).to.have.always.been.calledWith('1');
    });

    it('should call the onShow method for the route, passing the name of the route, the matched route, and the params', function() {
      expect(router.onRoute).to.have.been.calledOnce;
      expect(router.onRoute).to.have.been.calledWith('withParam', 'm2/:id', ['1', null]);
    });
  });

  describe('when a standard route is defined and fired', function() {
    var Router, router;

    beforeEach(function() {
      Router = Backbone.Marionette.AppRouter.extend({
        routes: {
          'm3': 'standardRoute'
        },
        standardRoute: function() {}
      });

      this.sinon.spy(Router.prototype, 'standardRoute');

      router = new Router();
      Backbone.history.start();

      router.navigate('m3', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should fire the route callback', function() {
      expect(Router.prototype.standardRoute).to.have.been.called;
    });
  });

  describe('when router configured with ambiguous routes', function() {
    var PostsRouter, controller, router;

    beforeEach(function() {
      PostsRouter = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
          'posts/top': 'showPostsTop',
          'posts/:id': 'showPost'
        }
      });

      controller = {
        showPostsTop: this.sinon.stub(),
        showPost: this.sinon.stub()
      };

      Backbone.history.start();

      router = new PostsRouter({controller: controller});
      router.navigate('posts/top', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should take routes order into account', function() {
      expect(controller.showPostsTop).to.have.been.called;
      expect(controller.showPost).not.to.have.been.called;
    });
  });

  describe('when routes are in the wrong order', function() {
    var PostsRouter, controller, router;

    beforeEach(function() {
      PostsRouter = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
          'posts/:id': 'showPost',
          'posts/top': 'showPostsTop'
        }
      });

      controller = {
        showPostsTop: this.sinon.stub(),
        showPost: this.sinon.stub()
      };

      Backbone.history.start();

      router = new PostsRouter({controller: controller});
      router.navigate('posts/top', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should fire the wrong route', function() {
      expect(controller.showPost).to.have.been.called;
      expect(controller.showPostsTop).not.to.have.been.called;
    });
  });

  describe('when an app route is added manually', function() {
    var Router, controller, router;

    beforeEach(function() {
      Router = Backbone.Marionette.AppRouter.extend({});

      controller = {
        showPost: this.sinon.stub()
      };

      Backbone.history.start();

      router = new Router({controller: controller});
      router.appRoute('posts/:id', 'showPost');

      router.navigate('posts/10', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should fire the route', function() {
      expect(controller.showPost).to.have.been.called;
    });
  });

  describe('when app routes are provided in the constructor', function() {
    var AppRouter, controller, appRouter;

    beforeEach(function() {
      AppRouter = Marionette.AppRouter.extend({
        appRoutes: {
          'r1': 'originalFunc'
        }
      });

      controller = {
        originalFunc: this.sinon.stub(),
        overrideFunc: this.sinon.stub()
      };

      appRouter = new AppRouter({
        controller: controller,
        appRoutes: {
          'r-const-override': 'overrideFunc'
        }
      });

      Backbone.history.start();
      appRouter.navigate('r-const-override', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should override the configured routes and use the constructor param', function() {
      expect(controller.overrideFunc).to.have.been.called;
      expect(controller.originalFunc).not.to.have.been.called;
    });
  });
});
