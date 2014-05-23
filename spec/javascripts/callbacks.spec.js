describe('callbacks', function() {
  'use strict';
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when registering callbacks and running them', function() {
    beforeEach(function() {
      this.spyOne = this.sinon.spy();
      this.spyTwo = this.sinon.spy();
      this.callbacks = new Backbone.Marionette.Callbacks();

      this.specifiedOptions = {};
      this.specifiedContext = {};

      this.callbacks.add(this.spyOne);
      this.callbacks.add(this.spyTwo);

      this.callbacks.run(this.specifiedOptions, this.specifiedContext);
    });

    it('should execute the first callback', function() {
      expect(this.spyOne).to.have.been.called;
    });

    it('should execute the second callback', function() {
      expect(this.spyTwo).to.have.been.called;
    });

    it('should pass the options along', function() {
      expect(this.spyOne).to.have.been.calledWith(this.specifiedOptions);
    });

    it('should execute in the specified context', function() {
      expect(this.spyOne).to.have.been.calledOn(this.specifiedContext);
    });
  });

  describe('when running with no callbacks, and then registering callbacks', function() {
    beforeEach(function() {
      this.spyOne = this.sinon.spy();
      this.spyTwo = this.sinon.spy();
      this.callbacks = new Backbone.Marionette.Callbacks();
      this.callbacks.run();

      this.callbacks.add(this.spyOne);
      this.callbacks.add(this.spyTwo);
    });

    it('should execute the first', function() {
      expect(this.spyOne).to.have.been.called;
    });

    it('should execute the second', function() {
      expect(this.spyTwo).to.have.been.called;
    });
  });

  describe('when registering a callback with a specific context, and running the callbacks', function() {
    beforeEach(function() {
      this.spyOne  = this.sinon.spy();
      this.context = {};

      this.callbacks = new Backbone.Marionette.Callbacks();
      this.callbacks.add(this.spyOne, this.context);

      this.callbacks.run();
    });

    it('should run the callback with the specified context', function() {
      expect(this.spyOne).to.have.been.calledOn(this.context);
    });
  });

  describe('when resetting callbacks and re-running them', function() {
    beforeEach(function() {
      this.callbacks = new Backbone.Marionette.Callbacks();

      this.spy = this.sinon.spy();
      this.callbacks.add(this.spy);

      this.callbacks.run();
      this.callbacks.reset();

      this.callbacks.run();

      this.numCallbacks = this.callbacks._callbacks.length;
    });

    it('should run the callbacks again', function() {
      expect(this.spy).to.have.been.calledTwice;
    });

    it('should not duplicate the callbacks', function() {
      expect(this.numCallbacks).to.equal(1);
    });
  });
});
