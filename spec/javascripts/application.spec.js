describe('marionette application', function() {
  'use strict';

  describe('when registering an initializer and starting the application', function() {
    beforeEach(function() {
      this.fooOptions = { foo: 'bar' };
      this.app = new Marionette.Application();

      this.triggerSpy = this.sinon.spy(this.app, 'trigger');
      this.initializerStub = this.sinon.stub();
      this.app.addInitializer(this.initializerStub);

      this.app.start(this.fooOptions);
    });

    it('should notify me before the starts', function() {
      expect(this.triggerSpy).to.have.been.calledWith('before:start', this.fooOptions);
    });

    it('should notify me after the app has started', function() {
      expect(this.triggerSpy).to.have.been.calledWith('start', this.fooOptions);
    });

    it('should call the initializer', function() {
      expect(this.initializerStub).to.have.been.called;
    });

    it('should pass the options through to the initializer', function() {
      expect(this.initializerStub).to.have.been.calledOnce.and.calledWith(this.fooOptions);
    });

    it('should run the initializer with the context of the app object', function() {
      expect(this.initializerStub).to.have.been.calledOn(this.app);
    });
  });

  describe('when an app has been started, and registering another initializer', function() {
    beforeEach(function() {
      this.app = new Marionette.Application();
      this.app.start();

      this.initializerStub = this.sinon.stub();
      this.app.addInitializer(this.initializerStub);
    });

    it('should run the initializer immediately', function() {
      expect(this.initializerStub).to.have.been.called;
    });
  });

  describe('when instantiating an app with options specified', function() {
    beforeEach(function() {
      this.fooOption = 'bar';
      this.app = new Marionette.Application({ fooOption: this.fooOption });
    });

    it('should merge those options into the app', function() {
      expect(this.app.fooOption).to.equal(this.fooOption);
    });
  });

  describe('when specifying an on start callback, and starting the app', function() {
    beforeEach(function() {
      this.fooOptions = { foo: 'bar' };
      this.app = new Marionette.Application();

      this.startStub = this.sinon.stub();
      this.app.on('start', this.startStub);

      this.app.start(this.fooOptions);
    });

    it('should run the onStart callback', function() {
      expect(this.startStub).to.have.been.called;
    });

    it('should pass the startup option to the callback', function() {
      expect(this.startStub).to.have.been.calledOnce.and.calledWith(this.fooOptions);
    });
  });
});
