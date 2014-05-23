describe('marionette controller', function() {
  'use strict';
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when creating an controller', function() {
    beforeEach(function() {
      this.options = {};

      this.Controller = Marionette.Controller.extend({
        initialize: this.sinon.stub()
      });

      this.controller = new this.Controller(this.options);

      this.handler = this.sinon.stub();
      this.controller.on('foo', this.handler);

      this.controller.trigger('foo', this.options);
    });

    it('should support triggering events', function() {
      expect(this.handler).to.have.been.calledWith(this.options);
    });

    it('should have an event aggregator built in to it', function() {
      expect(typeof this.controller.listenTo).to.equal('function');
    });

    it('should support an initialize function', function() {
      expect(this.controller.initialize).to.have.been.called;
    });

    it('should pass constructor options to the initialize function', function() {
      expect(this.controller.initialize.lastCall.args[0]).to.equal(this.options);
    });

    it('should maintain a reference to the options', function() {
      expect(this.controller.options).to.equal(this.options);
    });
  });

  describe('when no options argument is supplied to the constructor', function() {
    beforeEach(function() {
      this.Controller = Marionette.Controller.extend({
        initialize: this.sinon.stub()
      });
      this.controller = new this.Controller();
    });

    it('should provide an empty object as the options', function() {
      expect(_.isObject(this.controller.options)).to.be.true;
    });

    it('should provide the empty object as the options to initialize', function() {
      expect(this.controller.initialize.lastCall.args[0]).to.equal(this.controller.options);
    });
  });

  describe('when destroying a controller', function() {
    beforeEach(function() {
      this.Controller = Marionette.Controller.extend({
        onDestroy: this.sinon.stub()
      });
      this.controller = new this.Controller();

      this.destroyHandler = this.sinon.stub();
      this.controller.on('destroy', this.destroyHandler);

      this.listenToHandler = this.sinon.stub();
      this.controller.listenTo(this.controller, 'destroy', this.listenToHandler);

      this.sinon.spy(this.controller, 'stopListening');
      this.sinon.spy(this.controller, 'off');

      this.controller.destroy(123, 'second param');
    });

    it('should stopListening events', function() {
      expect(this.controller.stopListening).to.have.been.called;
    });

    it('should turn off all events', function() {
      expect(this.controller.off).to.have.been.called;
    });

    it('should stopListening after calling destroy', function() {
      expect(this.listenToHandler).to.have.been.called;
    });

    it('should trigger a destroy event with any arguments passed to destroy', function() {
      expect(this.destroyHandler).to.have.been.calledWith(123, 'second param');
    });

    it('should call an onDestroy method with any arguments passed to destroy', function() {
      expect(this.controller.onDestroy).to.have.been.calledWith(123, 'second param');
    });
  });
});
