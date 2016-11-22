'use strict';

import Application from '../../src/application';
import View from '../../src/view';

describe('Marionette Application', function() {

  describe('#_initialize', () => {
    describe('when instantiating an app with options specified', function() {
      let app;
      let fooOption;
      let appOptions;
      let initializeStub;

      beforeEach(function() {
        fooOption = 'bar';
        appOptions = {fooOption: fooOption};
        initializeStub = this.sinon.stub(Application.prototype, 'initialize');
      });

      it('should pass all arguments to the initialize method', function() {
        app = new Application(appOptions, 'fooArg');

        expect(initializeStub).to.have.been.calledOn(app).and.calledWith(appOptions, 'fooArg');
      });
    });
  });

  describe('#_start', function() {
    let app;
    let fooOptions;
    let triggerMethodSpy;

    beforeEach(function() {
      fooOptions = {foo: 'bar'};
      app = new Application();
      triggerMethodSpy = this.sinon.stub(app, 'triggerMethod');
    });

    it('should trigger before:start event', function() {
      app.start(fooOptions);

      expect(triggerMethodSpy).to.have.been.calledWith('before:start', app, fooOptions);
    });

    it('should trigger start event', function() {
      app.start(fooOptions);

      expect(triggerMethodSpy).to.have.been.calledWith('start', app, fooOptions);
    });

    it('should return current application context', function() {
      const result = app.start(fooOptions);

      expect(result).to.have.been.deep.equal(app);
    });
  });

  describe('#_onBeforeStart', function() {
    let app;
    let fooOptions;
    let beforeStartStub;

    beforeEach(function() {
      beforeStartStub = this.sinon.stub();
      fooOptions = {foo: 'bar'};
      app = new Application();

      app.on('before:start', beforeStartStub);
    });

    it('should run the onBeforeStart callback', function() {
      app.start(fooOptions);

      expect(beforeStartStub).to.have.been.called;
    });

    it('should pass the startup option to the onBeforeStart callback', function() {
      app.start(fooOptions);

      expect(beforeStartStub).to.have.been.calledOnce.and.calledWith(app, fooOptions);
    });
  });

  describe('#_onStart', function() {
    let app;
    let fooOptions;
    let startStub;

    beforeEach(function() {
      startStub = this.sinon.stub();
      fooOptions = {foo: 'bar'};
      app = new Application();

      app.on('start', startStub);
    });

    it('should run the onStart callback', function() {
      app.start(fooOptions);

      expect(startStub).to.have.been.called;
    });

    it('should pass the startup option to the callback', function() {
      app.start(fooOptions);

      expect(startStub).to.have.been.calledOnce.and.calledWith(app, fooOptions);
    });

    it('should have a cidPrefix', function() {
      app.start(fooOptions);

      expect(app.cidPrefix).to.equal('mna');
    });

    it('should have a cid', function() {
      app.start(fooOptions);

      expect(app.cid).to.exist;
    });
  });

  describe('#_getRegion', function() {
    let app;
    let fooOptions;

    beforeEach(function() {
      fooOptions = {
        region: '#fixtures'
      };
      app = new Application(fooOptions);
    });

    it('should be able to define region selectors as strings', function() {
      expect(app.getRegion().$el).to.have.length(1);
    });

    it('should get the region selector with getRegion', function() {
      expect(app.getRegion().$el).to.have.length(1);
    });
  });

  describe('#_showView', function() {
    let app;
    let view;
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

      const appRegion = app.getRegion();

      showViewInRegionSpy = this.sinon.spy(appRegion, 'show');
    });

    describe('when additional arguments was passed', function() {
      let fooArgs;

      beforeEach(function() {
        fooArgs = ['foo', 'bar'];
      });

      it('should call show method in region with additional arguments', function() {
        app.showView(view, fooArgs);

        expect(showViewInRegionSpy).to.have.been.called;
      });

      it('should show a view in its region', function() {
        app.showView(view, fooArgs);

        expect(app.getRegion().el.innerHTML).to.contain('ohai');
      });
    });

    describe('when just view as argument was passed', function() {
      it('should show a view in its region', function() {
        app.showView(view);

        expect(app.getRegion().el.innerHTML).to.contain('ohai');
      });

      it('should call show method in region', function() {
        app.showView(view);

        expect(showViewInRegionSpy).to.have.been.called;
      });
    });
  });

  describe('#_getView', function() {
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

      expect(app.getView()).to.have.been.deep.equal(view);
    });
  });
});
