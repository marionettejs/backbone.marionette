'use strict';

import Application from '../../src/application';
import View from '../../src/view';

describe('Marionette Application', function() {

  describe('when instantiating an app with options specified', function() {
    let app;
    let fooOption;
    let appOptions;
    let initializeStub;

    beforeEach(function() {
      fooOption = 'bar';
      appOptions = {fooOption: fooOption};
      initializeStub = this.sinon.stub(Application.prototype, 'initialize');

      app = new Application(appOptions, 'fooArg');
    });

    it('should pass all arguments to the initialize method', function() {
      expect(initializeStub).to.have.been.calledOn(app).and.calledWith(appOptions, 'fooArg');
    });
  });

  describe('when specifying an on start callback, and starting the app', function() {
    let app;
    let fooOptions;
    let beforeStartStub;
    let startStub;

    beforeEach(function() {
      beforeStartStub = this.sinon.stub();
      startStub = this.sinon.stub();
      fooOptions = {foo: 'bar'};
      app = new Application();

      app.on('before:start', beforeStartStub);
      app.on('start', startStub);

      app.start(fooOptions);
    });

    it('should run the onBeforeStart callback', function() {
      expect(beforeStartStub).to.have.been.called;
    });

    it('should pass the startup option to the onBeforeStart callback', function() {
      expect(beforeStartStub).to.have.been.calledOnce.and.calledWith(app, fooOptions);
    });

    it('should run the onStart callback', function() {
      expect(startStub).to.have.been.called;
    });

    it('should pass the startup option to the callback', function() {
      expect(startStub).to.have.been.calledOnce.and.calledWith(app, fooOptions);
    });

    it('should have a cidPrefix', function() {
      expect(app.cidPrefix).to.equal('mna');
    });

    it('should have a cid', function() {
      expect(app.cid).to.exist;
    });
  });

  describe('when initializing with regions', function() {
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
      app.showView(view);
    });

    it('should be able to define region selectors as strings', function() {
      expect(app.getRegion().$el).to.have.length(1);
    });

    it('should get the region selector with getRegion', function() {
      expect(app.getRegion().$el).to.have.length(1);
    });

    it('can show a view in its region', function() {
      expect(app.getRegion().el.innerHTML).to.contain('ohai');
    });

    it('can use the getView function', function() {
      expect(app.getView()).to.equal(view);
    });

  });
});
