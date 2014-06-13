describe('callbacks', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when registering callbacks and running them', function() {
    var specifiedOptions, specifiedContext, spyOne, spyTwo, callbacks;

    beforeEach(function() {
      spyOne = this.sinon.spy();
      spyTwo = this.sinon.spy();
      callbacks = new Backbone.Marionette.Callbacks();

      specifiedOptions = {};
      specifiedContext = {};

      callbacks.add(spyOne);
      callbacks.add(spyTwo);

      callbacks.run(specifiedOptions, specifiedContext);
    });

    it('should execute the first callback', function() {
      expect(spyOne).to.have.been.called;
    });

    it('should execute the second callback', function() {
      expect(spyTwo).to.have.been.called;
    });

    it('should pass the options along', function() {
      expect(spyOne).to.have.been.calledWith(specifiedOptions);
    });

    it('should execute in the specified context', function() {
      expect(spyOne).to.have.been.calledOn(specifiedContext);
    });
  });

  describe('when running with no callbacks, and then registering callbacks', function() {
    var spyOne, spyTwo, callbacks;

    beforeEach(function() {
      spyOne = this.sinon.spy();
      spyTwo = this.sinon.spy();
      callbacks = new Backbone.Marionette.Callbacks();
      callbacks.run();

      callbacks.add(spyOne);
      callbacks.add(spyTwo);
    });

    it('should execute the first', function() {
      expect(spyOne).to.have.been.called;
    });

    it('should execute the second', function() {
      expect(spyTwo).to.have.been.called;
    });
  });

  describe('when registering a callback with a specific context, and running the callbacks', function() {
    var spyOne, context, callbacks;

    beforeEach(function() {
      spyOne  = this.sinon.spy();
      context = {};

      callbacks = new Backbone.Marionette.Callbacks();
      callbacks.add(spyOne, context);

      callbacks.run();
    });

    it('should run the callback with the specified context', function() {
      expect(spyOne).to.have.been.calledOn(context);
    });
  });

  describe('when resetting callbacks and re-running them', function() {
    var spy, numCallbacks, callbacks;

    beforeEach(function() {
      callbacks = new Backbone.Marionette.Callbacks();

      spy = this.sinon.spy();
      callbacks.add(spy);

      callbacks.run();
      callbacks.reset();

      callbacks.run();

      numCallbacks = callbacks._callbacks.length;
    });

    it('should run the callbacks again', function() {
      expect(spy).to.have.been.calledTwice;
    });

    it('should not duplicate the callbacks', function() {
      expect(numCallbacks).to.equal(1);
    });
  });
});
