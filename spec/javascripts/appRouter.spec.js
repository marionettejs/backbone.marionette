describe('app router', function() {
  'use strict';
  beforeEach(global.setup);
  afterEach(global.teardown);

  afterEach(function() {
    window.location.hash = '';
  });

  describe('when a route is configured with a method that does not exist on the controller', function() {
    beforeEach(function () {
      var suite = this;

      this.Router = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
          'm1': 'doesNotExist'
        }
      });

      this.controller = {};

      this.run = function() {
        suite.router = new suite.Router({controller: suite.controller});
      };
    });

    it('should throw an error saying the method does not exist', function() {
      expect(this.run).to.throw('Method "doesNotExist" was not found on the controller');
    });
  });

  describe('when a controller is passed through the constructor and a route fires', function() {
    beforeEach(function() {
      this.Router = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
          'm1': 'method1'
        }
      });

      this.controller = {
        method1: this.sinon.stub()
      };

      this.router = new this.Router({
        controller: this.controller
      });
      Backbone.history.start();

      this.router.navigate('m1', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should call the configured method on the controller passed in the constructor', function() {
      expect(this.controller.method1).to.have.been.called;
    });

    it('should execute the controller method with the context of the controller', function() {
      expect(this.controller.method1).to.have.been.calledOn(this.controller);
    });
  });

  describe('when a controller is provided in the router definition and a route fires', function() {
    beforeEach(function() {
      this.controller = {
        method1: this.sinon.stub()
      };

      this.Router = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
          'm1': 'method1'
        },

        controller: this.controller
      });

      this.router = new this.Router();
      Backbone.history.start();

      this.router.navigate('m1', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should call the configured method on the controller passed in the constructor', function() {
      expect(this.controller.method1).to.have.been.called;
    });

    it('should execute the controller method with the context of the controller', function() {
      expect(this.controller.method1).to.have.been.calledOn(this.controller);
    });
  });

  describe('when a second route fires from a controller instance', function() {
    beforeEach(function() {
      var suite = this;

      this.Router = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
          'm1': 'method1',
          'm2': 'method2'
        }
      });

      this.Controller = function() {
        return {
          method1: function() {},
          method2: suite.sinon.stub()
        };
      };

      this.controller = new this.Controller();

      this.router = new this.Router({
        controller: this.controller
      });
      Backbone.history.start();

      this.router.navigate('m1', true);
      this.router.navigate('m2', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should call the configured method on the controller passed in the constructor', function() {
      expect(this.controller.method2).to.have.been.called;
    });

    it('should execute the controller method with the context of the controller', function() {
      expect(this.controller.method2).to.have.been.calledOn(this.controller);
    });
  });

  describe('when a route fires with parameters', function() {
    beforeEach(function() {
      this.controller = {
        withParam: function() {}
      };

      this.Router = Backbone.Marionette.AppRouter.extend({
        onRoute: this.sinon.stub(),
        appRoutes: {
          'm2/:id': 'withParam'
        }
      });
      this.spy = this.sinon.spy(this.controller, 'withParam');

      this.router = new this.Router({
        controller: this.controller
      });
      Backbone.history.start();

      this.router.navigate('m2/1', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should call the configured method with parameters', function() {
      expect(this.spy).to.have.always.been.calledWith('1');
    });

    it('should call the onShow method for the route, passing the name of the route, the matched route, and the params', function() {
      expect(this.router.onRoute).to.have.been.calledOnce;
      expect(this.router.onRoute).to.have.been.calledWith('withParam', 'm2/:id', ['1', null]);
    });
  });

  describe('when a standard route is defined and fired', function() {
    beforeEach(function() {
      this.Router = Backbone.Marionette.AppRouter.extend({
        routes: {
          'm3': 'standardRoute'
        },
        standardRoute: function() {}
      });

      this.sinon.spy(this.Router.prototype, 'standardRoute');

      this.router = new this.Router();
      Backbone.history.start();

      this.router.navigate('m3', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should fire the route callback', function() {
      expect(this.Router.prototype.standardRoute).to.have.been.called;
    });
  });

  describe('when router configured with ambiguous routes', function() {
    beforeEach(function() {
      this.PostsRouter = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
          'posts/top': 'showPostsTop',
          'posts/:id': 'showPost'
        }
      });

      this.controller = {
        showPostsTop: this.sinon.stub(),
        showPost: this.sinon.stub()
      };

      Backbone.history.start();

      this.router = new this.PostsRouter({controller: this.controller});
      this.router.navigate('posts/top', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should take routes order into account', function() {
      expect(this.controller.showPostsTop).to.have.been.called;
      expect(this.controller.showPost).not.to.have.been.called;
    });
  });

  describe('when routes are in the wrong order', function() {
    beforeEach(function() {
      this.PostsRouter = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
          'posts/:id': 'showPost',
          'posts/top': 'showPostsTop'
        }
      });

      this.controller = {
        showPostsTop: this.sinon.stub(),
        showPost: this.sinon.stub()
      };

      Backbone.history.start();

      this.router = new this.PostsRouter({controller: this.controller});
      this.router.navigate('posts/top', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should fire the wrong route', function() {
      expect(this.controller.showPost).to.have.been.called;
      expect(this.controller.showPostsTop).not.to.have.been.called;
    });
  });

  describe('when an app route is added manually', function() {
    beforeEach(function() {
      this.Router = Backbone.Marionette.AppRouter.extend({});

      this.controller = {
        showPost: this.sinon.stub()
      };

      Backbone.history.start();

      this.router = new this.Router({controller: this.controller});
      this.router.appRoute('posts/:id', 'showPost');

      this.router.navigate('posts/10', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should fire the route', function() {
      expect(this.controller.showPost).to.have.been.called;
    });
  });

  describe('when app routes are provided in the constructor', function() {
    beforeEach(function() {
      this.AppRouter = Marionette.AppRouter.extend({
        appRoutes: {
          'r1': 'originalFunc'
        }
      });

      this.controller = {
        originalFunc: this.sinon.stub(),
        overrideFunc: this.sinon.stub()
      };

      this.appRouter = new this.AppRouter({
        controller: this.controller,
        appRoutes: {
          'r-const-override': 'overrideFunc'
        }
      });

      Backbone.history.start();
      this.appRouter.navigate('r-const-override', true);
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should override the configured routes and use the constructor param', function() {
      expect(this.controller.overrideFunc).to.have.been.called;
      expect(this.controller.originalFunc).not.to.have.been.called;
    });
  });
});
