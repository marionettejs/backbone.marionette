describe('marionette application', function() {
  'use strict';

  describe('when registering an initializer and starting the application', function() {
    beforeEach(function() {
      this.fooOptions = { foo: 'bar' };
      this.appOptions = { baz: 'tah' };
      this.initializeStub = this.sinon.stub(Marionette.Application.prototype, 'initialize');
      this.app = new Marionette.Application(this.appOptions);

      this.triggerSpy = this.sinon.spy(this.app, 'trigger');
      this.initializerStub = this.sinon.stub();
      this.app.addInitializer(this.initializerStub);

      this.app.start(this.fooOptions);
    });

    it('should call initialize', function() {
      expect(this.initializeStub).to.have.been.calledOn(this.app).and.calledWith(this.appOptions);
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

  describe('application proxies to wreqr', function() {
    beforeEach(function() {
      this.app = new Marionette.Application();

      this.executeSpy = this.sinon.spy(this.app.commands, 'execute');
      this.requestSpy = this.sinon.spy(this.app.reqres, 'request');
    });

    it('should proxy execute', function() {
      this.app.execute('test');

      expect(this.executeSpy)
      .to.have.been.calledOnce
      .and.calledWith('test');
    });

    it('should proxy request', function() {
      this.app.request('test');

      expect(this.requestSpy)
      .to.have.been.calledOnce
      .and.calledWith('test');
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

  describe('radio channels', function() {
    describe('when channelName is specified', function() {
      beforeEach(function() {
        this.channelName = 'foo';
        this.App = Marionette.Application.extend({ channelName: 'foo' });
        this.app = new this.App();
        this.channel = Backbone.Wreqr.radio.channel(this.channelName);
      });

      it('should create a Wreqr channel on this.channel', function() {
        expect(this.app.channel).to.deep.equal(this.channel);
      });

      it('should set the app EventAggregator to the channel vent', function() {
        expect(this.app.vent).to.deep.equal(this.channel.vent);
      });

      it('should set the app Commands to the channel commands', function() {
        expect(this.app.commands).to.deep.equal(this.channel.commands);
      });

      it('should set the app RequestResponse to the channel reqres', function() {
        expect(this.app.reqres).to.deep.equal(this.channel.reqres);
      });
    });

    describe('when channelName is set as function', function() {
      beforeEach(function() {
        this.channelName = 'foo';
        this.channelNameStub = this.sinon.stub().returns(this.channelName);
        this.App = Marionette.Application.extend({ channelName: this.channelNameStub });
        this.app = new this.App();
      });

      it('should set the app channelName to the result of channelName', function() {
        expect(this.app.channelName).to.equal(this.channelName);
      });
    });

    describe('when no channelName is specified', function() {
      beforeEach(function() {
        this.channelName = 'global';
        this.app = new Marionette.Application();
      });

      it('should set the app channelName to "global"', function() {
        expect(this.app.channelName).to.equal(this.channelName);
      });
    });
  });
});
