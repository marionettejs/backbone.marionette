describe('marionette application', function() {
  'use strict';

  describe('when instantiating an app with options specified', function() {
    beforeEach(function() {
      this.fooOption = 'bar';
      this.appOptions = {fooOption: this.fooOption};
      this.initializeStub = this.sinon.stub(Marionette.Application.prototype, 'initialize');
      this.app = new Marionette.Application(this.appOptions, 'fooArg');
    });

    it('should pass all arguments to the initialize method', function() {
      expect(this.initializeStub).to.have.been.calledOn(this.app).and.calledWith(this.appOptions, 'fooArg');
    });
  });

  describe('when specifying an on start callback, and starting the app', function() {
    beforeEach(function() {
      this.fooOptions = {foo: 'bar'};
      this.app = new Marionette.Application();

      this.beforeStartStub = this.sinon.stub();
      this.app.on('before:start', this.beforeStartStub);
      this.renderStub = this.sinon.stub();
      this.app.on('render', this.renderStub);
      this.startStub = this.sinon.stub();
      this.app.on('start', this.startStub);

      this.app.start(this.fooOptions);
    });

    it('should run the onBeforeStart callback', function() {
      expect(this.beforeStartStub).to.have.been.called;
    });

    it('should run the onRender callback', function() {
      expect(this.renderStub).to.have.been.called;
    });

    it('should run the onStart callback', function() {
      expect(this.startStub).to.have.been.called;
    });

    it('should pass the startup option to the callback', function() {
      expect(this.startStub).to.have.been.calledOnce.and.calledWith(this.fooOptions);
    });

    it('should have a cidPrefix', function() {
      expect(this.app.cidPrefix).to.equal('mna');
    });

    it('should have a cid', function() {
      expect(this.app.cid).to.exist;
    });
  });
});
