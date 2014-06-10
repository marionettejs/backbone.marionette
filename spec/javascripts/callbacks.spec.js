describe('callbacks', function() {
  'use strict';

  describe('when registering callbacks and running them', function() {
    beforeEach(function() {
      this.options = {};
      this.context = {};
      this.callbacks = new Backbone.Marionette.Callbacks();

      this.fooStub = this.sinon.stub();
      this.barStub = this.sinon.stub();

      this.callbacks.add(this.fooStub);
      this.callbacks.add(this.barStub);

      this.callbacks.run(this.options, this.context);
    });

    it('should execute the first callback', function() {
      expect(this.fooStub).to.have.been.called;
    });

    it('should execute the second callback', function() {
      expect(this.barStub).to.have.been.called;
    });

    it('should pass the options along', function() {
      expect(this.fooStub).to.have.been.calledWith(this.options);
    });

    it('should execute in the specified context', function() {
      expect(this.fooStub).to.have.been.calledOn(this.context);
    });
  });

  describe('when running with no callbacks, and then registering callbacks', function() {
    beforeEach(function() {
      this.callbacks = new Backbone.Marionette.Callbacks();

      this.fooStub = this.sinon.stub();
      this.barStub = this.sinon.stub();

      this.callbacks.run();
      this.callbacks.add(this.fooStub);
      this.callbacks.add(this.barStub);
    });

    it('should execute the first', function() {
      expect(this.fooStub).to.have.been.called;
    });

    it('should execute the second', function() {
      expect(this.barStub).to.have.been.called;
    });
  });

  describe('when registering a callback with a specific context, and running the callbacks', function() {
    beforeEach(function() {
      this.context = {};
      this.callbacks = new Backbone.Marionette.Callbacks();

      this.fooStub  = this.sinon.stub();

      this.callbacks.add(this.fooStub, this.context);
      this.callbacks.run();
    });

    it('should run the callback with the specified context', function() {
      expect(this.fooStub).to.have.been.calledOn(this.context);
    });
  });

  describe('when resetting callbacks and re-running them', function() {
    beforeEach(function() {
      this.callbacks = new Backbone.Marionette.Callbacks();

      this.fooStub = this.sinon.stub();

      this.callbacks.add(this.fooStub);
      this.callbacks.run();
      this.callbacks.reset();
      this.callbacks.run();
    });

    it('should run the callbacks again', function() {
      expect(this.fooStub).to.have.been.calledTwice;
    });

    it('should not duplicate the callbacks', function() {
      expect(this.callbacks._callbacks).to.have.lengthOf(1);
    });
  });

  describe("when Marionette.Deferred().promise is an object", function(){
    beforeEach(function(){
      this.sandbox = sinon.sandbox.create();

      this.sandbox.stub(Backbone.Marionette, "Deferred", function(){
        var deferred = Backbone.$.Deferred();
        deferred.promise = deferred.promise();
        return deferred;
      });

      var callbacks = new Backbone.Marionette.Callbacks();

      this.spy = sinon.spy();
      callbacks.add(this.spy);

      callbacks.run();
    });

    afterEach(function(){
      this.sandbox.restore();
    });

    it("should execute the callbacks", function(){
      expect(this.spy).to.have.been.called;
    });
  });
});
