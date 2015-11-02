describe('marionette object', function() {

  describe('when creating an object', function() {

    beforeEach(function() {
      var Object = Marionette.Object.extend({
        modelEvents: {
          'bar': 'onBar'
        },

        initialize: function(options) {
          this.bindEntityEvents(options.model, this.modelEvents);
        },

        onBar: function() {}
      });

      var model = new Backbone.Model();
      this.options = {
        model: model
      };

      this.object = new Object(this.options);

      this.fooHandler = sinon.spy();
      this.object.on('foo', this.fooHandler);

      this.barHandler = sinon.spy();
      model.on('bar', this.barHandler);

      this.object.trigger('foo', this.options);
      model.trigger('bar', this.options);
    });

    it('should support triggering events on itself', function() {
      expect(this.fooHandler).to.have.been.calledWith(this.options);
    });

    it('should support binding to evented objects', function() {
      expect(this.barHandler).to.have.been.calledWith(this.options);
    });

    it('should maintain a reference to the options', function() {
      expect(this.object.options).to.deep.equal(this.options);
    });
  });

  describe('when destroying a object', function() {

    beforeEach(function() {
      this.object = new Marionette.Object();

      this.sinon.spy(this.object, 'destroy');
      this.beforeDestroyHandler = sinon.spy();
      this.onDestroyHandler = sinon.spy();
      this.object.on('before:destroy', this.beforeDestroyHandler);
      this.object.on('destroy', this.onDestroyHandler);
      this.object.destroy();
    });

    it('should hear the before:destroy event', function() {
      expect(this.beforeDestroyHandler).to.have.been.calledOnce;
    });

    it('should return the object', function() {
      expect(this.object.destroy).to.have.returned(this.object);
    });

    it('should pass an empty object options down to the onBeforeDestroy method', function() {
      expect(this.beforeDestroyHandler).to.have.been.calledWith({});
    });

    it('should pass an empty object options down to the onDestroy method', function() {
      expect(this.onDestroyHandler).to.have.been.calledWith({});
    });
  });

  describe('when destroying a object with arguments', function() {

    var destroyArgs = {
      foo: 'bar'
    };

    beforeEach(function() {
      this.object = new Marionette.Object();

      this.sinon.spy(this.object, 'destroy');
      this.beforeDestroyHandler = sinon.spy();
      this.onDestroyHandler = sinon.spy();
      this.object.on('before:destroy', this.beforeDestroyHandler);
      this.object.on('destroy', this.onDestroyHandler);
      this.object.destroy(destroyArgs);
    });

    it('should pass the arguments down to the onBeforeDestroy method', function() {
      expect(this.beforeDestroyHandler).to.have.been.calledWithExactly(destroyArgs);
    });

    it('should pass the arguments down to the onDestroy method', function() {
      expect(this.onDestroyHandler).to.have.been.calledWithExactly(destroyArgs);
    });
  });
});
