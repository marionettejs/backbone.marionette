describe('marionette controller', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when creating an controller', function() {
    var Controller, controller, options, handler;

    beforeEach(function() {
      options = {};

      Controller = Marionette.Controller.extend({
        initialize: this.sinon.stub()
      });

      controller = new Controller(options);

      handler = this.sinon.stub();
      controller.on('foo', handler);

      controller.trigger('foo', options);
    });

    it('should support triggering events', function() {
      expect(handler).to.have.been.calledWith(options);
    });

    it('should have an event aggregator built in to it', function() {
      expect(typeof controller.listenTo).to.equal('function');
    });

    it('should support an initialize function', function() {
      expect(controller.initialize).to.have.been.called;
    });

    it('should pass constructor options to the initialize function', function() {
      expect(controller.initialize.lastCall.args[0]).to.equal(options);
    });

    it('should maintain a reference to the options', function() {
      expect(controller.options).to.equal(options);
    });
  });

  describe('when no options argument is supplied to the constructor', function() {
    var Controller, controller;

    beforeEach(function() {
      Controller = Marionette.Controller.extend({
        initialize: this.sinon.stub()
      });
      controller = new Controller();
    });

    it('should provide an empty object as the options', function() {
      expect(_.isObject(controller.options)).to.be.true;
    });

    it('should provide the empty object as the options to initialize', function() {
      expect(controller.initialize.lastCall.args[0]).to.equal(controller.options);
    });
  });

  describe('when destroying a controller', function() {
    var Controller, controller, destroyHandler, listenToHandler;

    beforeEach(function() {
      Controller = Marionette.Controller.extend({
        onDestroy: this.sinon.stub()
      });
      controller = new Controller();

      destroyHandler = this.sinon.stub();
      controller.on('destroy', destroyHandler);

      listenToHandler = this.sinon.stub();
      controller.listenTo(controller, 'destroy', listenToHandler);

      this.sinon.spy(controller, 'stopListening');
      this.sinon.spy(controller, 'off');

      controller.destroy(123, 'second param');
    });

    it('should stopListening events', function() {
      expect(controller.stopListening).to.have.been.called;
    });

    it('should turn off all events', function() {
      expect(controller.off).to.have.been.called;
    });

    it('should stopListening after calling destroy', function() {
      expect(listenToHandler).to.have.been.called;
    });

    it('should trigger a destroy event with any arguments passed to destroy', function() {
      expect(destroyHandler).to.have.been.calledWith(123, 'second param');
    });

    it('should call an onDestroy method with any arguments passed to destroy', function() {
      expect(controller.onDestroy).to.have.been.calledWith(123, 'second param');
    });
  });
});
