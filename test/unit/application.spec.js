'use strict';

import _ from 'underscore';
import Application from '../../src/application';
import View from '../../src/view';

describe('Marionette Application', function() {

  describe('#initialize', () => {
    describe('when instantiating an app with specified options', function() {
      let app;
      let appOptions;
      let initializeStub;

      beforeEach(function() {
        appOptions = {fooOption: 'foo'};
        initializeStub = this.sinon.stub(Application.prototype, 'initialize');
        this.sinon.spy(Application.prototype, '_initRadio');
      });

      it('should pass all arguments to the initialize method', function() {
        app = new Application(appOptions, 'fooArg');

        expect(initializeStub).to.have.been.calledOn(app).and.calledWith(appOptions, 'fooArg');
      });

      it('should have a cidPrefix', function() {
        app = new Application(appOptions);

        expect(app.cidPrefix).to.equal('mna');
      });

      it('should have a cid', function() {
        app = new Application(appOptions);

        expect(app.cid).to.exist;
      });

      it('should init the RadioMixin', function() {
        app = new Application(appOptions);

        expect(app._initRadio).to.have.been.called;
      });
    });
  });

  describe('#start', function() {
    let app;
    let fooOptions;

    beforeEach(function() {
      fooOptions = {foo: 'bar'};
      app = new Application();
    });

    it('should return current application context', function() {
      const result = app.start(fooOptions);

      expect(result).to.have.been.equal(app);
    });
  });

  describe('#onBeforeStart', function() {
    let fooApp;
    let fooOptions;
    let beforeStartStub;
    let onBeforeStartStub;

    beforeEach(function() {
      fooOptions = {foo: 'bar'};
      beforeStartStub = this.sinon.stub();
      onBeforeStartStub = this.sinon.stub();

      const FooApp = Application.extend({
        onBeforeStart: onBeforeStartStub
      });

      fooApp = new FooApp();
      fooApp.on('before:start', beforeStartStub);
    });

    it('should run the onBeforeStart callback', function() {
      fooApp.start(fooOptions);

      expect(beforeStartStub).to.have.been.called;
      expect(onBeforeStartStub).to.have.been.called;
    });

    it('should pass the startup option to the onBeforeStart callback', function() {
      fooApp.start(fooOptions);

      expect(beforeStartStub).to.have.been.calledOnce.and.calledWith(fooApp, fooOptions);
      expect(onBeforeStartStub).to.have.been.calledOnce.and.calledWith(fooApp, fooOptions);
    });
  });

  describe('#onStart', function() {
    let fooApp;
    let fooOptions;
    let startStub;
    let onStartStub;

    beforeEach(function() {
      fooOptions = {foo: 'bar'};
      startStub = this.sinon.stub();
      onStartStub = this.sinon.stub();

      const FooApp = Application.extend({
        onStart: onStartStub
      });

      fooApp = new FooApp();
      fooApp.on('start', startStub);
    });

    it('should run the onStart callback', function() {
      fooApp.start(fooOptions);

      expect(startStub).to.have.been.called;
      expect(onStartStub).to.have.been.called;
    });

    it('should pass the startup option to the callback', function() {
      fooApp.start(fooOptions);

      expect(startStub).to.have.been.calledOnce.and.calledWith(fooApp, fooOptions);
      expect(onStartStub).to.have.been.calledOnce.and.calledWith(fooApp, fooOptions);
    });
  });

  describe('#getRegion', function() {
    let app;
    let fooOptions;

    beforeEach(function() {
      fooOptions = {
        region: '#fixtures'
      };
      app = new Application(fooOptions);
    });

    it('should get the region selector with getRegion', function() {
      expect(app.getRegion().$el).to.have.length(1);
    });
  });

  describe('#showView', function() {
    let app;
    let view;
    let appRegion;
    let fooOptions;
    let showViewInRegionSpy;

    beforeEach(function() {
      fooOptions = {
        region: '#fixtures'
      };
      view = new View({
        template: _.template('ohai')
      });
      app = new Application(fooOptions);

      appRegion = app.getRegion();

      showViewInRegionSpy = this.sinon.spy(appRegion, 'show');
    });

    describe('when additional arguments was passed', function() {
      let fooArgs;

      beforeEach(function() {
        fooArgs = {foo: 'bar'};
      });

      it('should call show method in region with additional arguments', function() {
        app.showView(view, fooArgs);

        expect(showViewInRegionSpy).to.have.been.calledWith(view, fooArgs);
      });
    });

    describe('when just view as argument was passed', function() {
      it('should call show method in region', function() {
        app.showView(view);

        expect(showViewInRegionSpy).to.have.been.called;
      });
    });
  });

  describe('#getView', function() {
    let app;
    let view;
    let fooOptions;

    beforeEach(function() {
      fooOptions = {
        region: '#fixtures'
      };
      view = new View({
        template: _.template('ohai')
      });
      app = new Application(fooOptions);
    });

    it('should return View which was shown', function() {
      app.showView(view);

      expect(app.getView()).to.have.deep.equal(view);
    });
  });

  describe('#destroy', function() {
    let app;

    beforeEach(function() {
      const App = Application.extend({
        onDestroy: this.sinon.stub()
      });

      app = new App();

      this.sinon.spy(app, 'destroy');
    });

    it('should trigger the before:destroy event', function() {
      const onBeforeDestroyHandler = this.sinon.spy();
      app.on('before:destroy', onBeforeDestroyHandler);

      app.destroy('foo');

      expect(onBeforeDestroyHandler).to.have.been.calledOnce.and.calledWith(app, 'foo');
    });

    it('should trigger the destroy events', function() {
      app.destroy('foo');

      expect(app.onDestroy).to.have.been.calledOnce.and.calledWith(app, 'foo');
    });

    it('should set `app.isDestroyed()` to `true`', function() {
      app.destroy();

      expect(app.isDestroyed()).to.be.true;
    });

    it('should return the app', function() {
      app.destroy();

      expect(app.destroy).to.have.returned(app);
    });

    it('should stop listening to events after the destroy event', function() {
      this.sinon.spy(app, 'stopListening');

      app.destroy();

      expect(app.stopListening).to.have.been.calledOnce.and.calledAfter(app.onDestroy);
    });

    describe('when already destroyed', function() {
      beforeEach(function() {
        app.destroy();
      });

      it('should return the app', function() {
        app.destroy();

        expect(app.destroy).to.have.returned(app);
      });

      it('should not trigger any events', function() {
        const onAllHandler = this.sinon.stub();
        app.on('all', onAllHandler);

        app.destroy();

        expect(onAllHandler).to.not.have.been.called;
      });
    });
  });
});
