describe('marionette controller', function() {
  'use strict';

  beforeEach(function() {
    this.initializeOptions = {foo: 'bar'};

    this.initializeStub           = this.sinon.stub();
    this.onDestroyStub            = this.sinon.stub();
    this.onBeforeDestroyStub      = this.sinon.stub();
    this.destroyHandlerStub       = this.sinon.stub();
    this.beforeDestroyHandlerStub = this.sinon.stub();
    this.listenToHandlerStub      = this.sinon.stub();

    this.Controller = Marionette.Controller.extend({
      initialize      : this.initializeStub,
      onDestroy       : this.onDestroyStub,
      onBeforeDestroy : this.onBeforeDestroyStub
    });
  });

  describe('when creating an controller', function() {
    beforeEach(function() {
      this.triggerOptions = {bar: 'foo'};
      this.controller = new this.Controller(this.initializeOptions);

      this.fooHandler = this.sinon.stub();

      this.controller.on('foo', this.fooHandler);
      this.controller.trigger('foo', this.triggerOptions);
    });

    it('should support triggering events', function() {
      expect(this.fooHandler).to.have.been.calledOnce.and.calledWith(this.triggerOptions);
    });

    it('should have an event aggregator built in to it', function() {
      expect(this.controller.listenTo).to.be.a('function');
    });

    it('should support an initialize function', function() {
      expect(this.initializeStub).to.have.been.calledOnce.and.calledWith(this.initializeOptions);
    });

    it('should maintain a reference to the options', function() {
      expect(this.controller).to.have.property('options', this.initializeOptions);
    });
  });

  describe('when no options argument is supplied to the constructor', function() {
    beforeEach(function() {
      this.controller = new this.Controller();
    });

    it('should provide an empty object as the options', function() {
      expect(this.controller.options).to.be.an('object');
    });

    it('should provide the empty object as the options to initialize', function() {
      expect(this.initializeStub).to.have.been.calledOnce.and.calledWith(this.controller.options);
    });
  });

  describe('when destroying a controller', function() {
    beforeEach(function() {
      this.argumentOne = 'foo';
      this.argumentTwo = 'bar';

      this.controller = new this.Controller();

      this.sinon.spy(this.controller, 'stopListening');
      this.sinon.spy(this.controller, 'off');

      this.controller.on('destroy', this.destroyHandlerStub);
      this.controller.on('before:destroy', this.beforeDestroyHandlerStub);
      this.controller.listenTo(this.controller, 'destroy', this.listenToHandlerStub);

      this.sinon.spy(this.controller, 'destroy');
      this.controller.destroy(this.argumentOne, this.argumentTwo);
    });

    it('should stopListening events', function() {
      expect(this.controller.stopListening).to.have.been.calledOnce;
    });

    it('should turn off all events', function() {
      expect(this.controller.off).to.have.been.called;
    });

    it('should stopListening after calling destroy', function() {
      expect(this.listenToHandlerStub).to.have.been.calledOnce;
    });

    it('should trigger a before:destroy event with any arguments passed to destroy', function() {
      expect(this.beforeDestroyHandlerStub).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should call an onBeforeDestroy method with any arguments passed to destroy', function() {
      expect(this.controller.onBeforeDestroy).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should trigger a destroy event with any arguments passed to destroy', function() {
      expect(this.destroyHandlerStub).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should call an onDestroy method with any arguments passed to destroy', function() {
      expect(this.controller.onDestroy).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should return the controller', function() {
      expect(this.controller.destroy).to.have.returned(this.controller);
    });
  });
});
