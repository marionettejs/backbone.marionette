describe('app router', function() {
  'use strict';

  afterEach(function() {
    window.location.hash = '';
  });

  describe('when a route is configured with a method that does not exist on the controller', function() {
    beforeEach(function () {
      var suite = this;

      this.controller = {};
      this.Router = Marionette.AppRouter.extend({
        appRoutes: { 'foo-route': 'doesNotExist' }
      });

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
      this.controller = { foo: this.sinon.stub() };
      this.Router = Marionette.AppRouter.extend({
        appRoutes: { 'foo-route': 'foo' }
      });

      this.router = new this.Router({ controller: this.controller });
      Backbone.history.start();

      this.router.navigate('foo-route', true);
    });

    it('should call the configured method on the controller passed in the constructor', function() {
      expect(this.controller.foo).to.have.been.calledOnce;
    });

    it('should execute the controller method with the context of the controller', function() {
      expect(this.controller.foo).to.have.been.calledOnce.and.calledOn(this.controller);
    });
  });

  describe('when a controller is provided in the router definition and a route fires', function() {
    beforeEach(function() {
      this.controller = { foo: this.sinon.stub() };
      this.Router = Marionette.AppRouter.extend({
        appRoutes: { 'foo-route': 'foo' },
        controller: this.controller
      });

      this.router = new this.Router();
      Backbone.history.start();

      this.router.navigate('foo-route', true);
    });

    it('should execute the controller method with the context of the controller', function() {
      expect(this.controller.foo).to.have.been.calledOnce.and.calledOn(this.controller);
    });
  });

  describe('when a second route fires from a controller instance', function() {
    beforeEach(function() {
      this.controller = {
        foo: this.sinon.stub(),
        bar: this.sinon.stub()
      };

      this.Router = Marionette.AppRouter.extend({
        appRoutes: {
          'foo-route': 'foo',
          'bar-route': 'bar'
        }
      });

      this.router = new this.Router({ controller: this.controller });
      Backbone.history.start();

      this.router.navigate('foo-route', true);
      this.router.navigate('bar-route', true);
    });

    it('should execute the controller method with the context of the controller', function() {
      expect(this.controller.bar).to.have.been.calledOnce.and.calledOn(this.controller);
    });
  });

  describe('when a route fires with parameters', function() {
    beforeEach(function() {
      this.fooParam = 'bar';
      this.controller = { foo: this.sinon.stub() };
      this.Router = Marionette.AppRouter.extend({
        onRoute: this.sinon.stub(),
        appRoutes: { 'foo-route/:id': 'foo' }
      });

      this.router = new this.Router({ controller: this.controller });
      Backbone.history.start();

      this.router.navigate('foo-route/' + this.fooParam, true);
    });

    it('should call the configured method with parameters', function() {
      expect(this.controller.foo).to.have.always.been.calledWith(this.fooParam);
    });

    it('should call the onShow method for the route, passing the name of the route, the matched route, and the params', function() {
      expect(this.router.onRoute).to.have.been.calledOnce;
      expect(this.router.onRoute).to.have.been.calledWith('foo', 'foo-route/:id', [this.fooParam, null]);
    });
  });

  describe('when a standard route is defined and fired', function() {
    beforeEach(function() {
      this.fooStub = this.sinon.stub();
      this.Router = Marionette.AppRouter.extend({
        routes: { 'foo-route': 'foo' },
        foo: this.fooStub
      });

      this.router = new this.Router();
      Backbone.history.start();

      this.router.navigate('foo-route', true);
    });

    it('should fire the route callback', function() {
      expect(this.fooStub).to.have.been.calledOnce;
    });
  });

  describe('when router configured with ambiguous routes', function() {
    beforeEach(function() {
      this.controller = {
        fooBar: this.sinon.stub(),
        fooId: this.sinon.stub()
      };
      this.Router = Marionette.AppRouter.extend({
        appRoutes: {
          'foo/bar': 'fooBar',
          'foo/:id': 'fooId'
        }
      });

      Backbone.history.start();

      this.router = new this.Router({ controller: this.controller });
      this.router.navigate('foo/bar', true);
    });

    it('should take routes order into account', function() {
      expect(this.controller.fooBar).to.have.been.calledOnce;
      expect(this.controller.fooId).not.to.have.been.calledOnce;
    });
  });

  describe('when routes are in the wrong order', function() {
    beforeEach(function() {
      this.controller = {
        fooBar: this.sinon.stub(),
        fooId: this.sinon.stub()
      };
      this.Router = Marionette.AppRouter.extend({
        appRoutes: {
          'foo/:id': 'fooId',
          'foo/bar': 'fooBar'
        }
      });

      Backbone.history.start();

      this.router = new this.Router({ controller: this.controller });
      this.router.navigate('foo/bar', true);
    });

    it('should fire the wrong route', function() {
      expect(this.controller.fooBar).not.to.have.been.calledOnce;
      expect(this.controller.fooId).to.have.been.calledOnce;
    });
  });

  describe('when an app route is added manually', function() {
    beforeEach(function() {
      this.controller = { foo: this.sinon.stub() };
      this.Router = Marionette.AppRouter.extend();
      this.router = new this.Router({ controller: this.controller });

      Backbone.history.start();

      this.router.appRoute('foo-route', 'foo');
      this.router.navigate('foo-route', true);
    });

    it('should fire the route', function() {
      expect(this.controller.foo).to.have.been.calledOnce;
    });
  });

  describe('when app routes are provided in the constructor', function() {
    beforeEach(function() {
      this.underscoreSpy = this.sinon.spy(_, 'invert');
      this.controller = {
        foo: this.sinon.stub(),
        bar: this.sinon.stub()
      };
      this.extendRoutes = { 'foo-route': 'foo' };
      this.AppRouter = Marionette.AppRouter.extend({
        appRoutes: this.extendRoutes
      });
      this.constructorRoutes = { 'bar-route': 'bar' };
      this.appRouter = new this.AppRouter({
        controller: this.controller,
        appRoutes: this.constructorRoutes
      });
      Backbone.history.start();
      this.appRouter.navigate('foo-route', true);
      this.appRouter.navigate('bar-route', true);
    });

    afterEach(function () {
      this.underscoreSpy.restore();
    });

    it('should override the configured routes and use the constructor param', function() {
      expect(this.controller.foo).not.to.have.been.calledOnce;
      expect(this.controller.bar).to.have.been.calledOnce;
    });

    it('should call _.invert() with constructor provided app routes as the first argument', function() {
      expect(_.invert).to.have.been.calledOnce;
      expect(_.invert).to.have.been.calledWithExactly(this.constructorRoutes);
    });

    it('should not call _.invert() with initial extend provided app routes as the first argument', function() {
      expect(_.invert).to.have.been.calledOnce;
      expect(_.invert).to.have.not.been.calledWithExactly(this.extendRoutes);
    });
  });

  describe('when app routes are provided exclusively in the constructor', function() {
    beforeEach(function () {
      this.underscoreSpy = this.sinon.spy(_, 'invert');
      this.constructorRoutes = { 'foo-route': 'foo' };
      this.controller = {
        foo: function() {}
      };
      this.appRouter = new Marionette.AppRouter({
        controller: this.controller,
        appRoutes: this.constructorRoutes
      });
      Backbone.history.start();
      this.appRouter.navigate('foo-route', true);
    });

    afterEach(function () {
      this.underscoreSpy.restore();
    });

    it('should call _.invert() with constructor provided app routes as the first argument', function() {
      expect(_.invert).to.have.been.calledOnce;
      expect(_.invert).to.have.been.calledWithExactly(this.constructorRoutes);
    });

    it('should not call _.invert() with undefined as the first argument', function() {
      expect(_.invert).to.have.been.calledOnce;
      expect(_.invert).to.have.not.been.calledWithExactly(undefined);
    });
  });
});
