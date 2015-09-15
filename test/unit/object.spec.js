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

    it('should have a cidPrefix', function() {
      expect(this.object.cidPrefix).to.equal('mno');
    });

    it('should have a cid', function() {
      expect(this.object.cid).to.exist;
    });

    it('should have `isDestroyed()` set to `false`', function() {
      expect(this.object._isDestroyed).to.be.false;
    });
  });

  describe('when destroying a object', function() {

    beforeEach(function() {
      this.object = new Marionette.Object();

      this.sinon.spy(this.object, 'destroy');
      this.beforeDestroyHandler = sinon.spy();
      this.object.on('before:destroy', this.beforeDestroyHandler);
      this.object.destroy();
    });

    it('should hear the before:destroy event', function() {
      expect(this.beforeDestroyHandler).to.have.been.calledOnce;
    });

    it('should set `object.isDestroyed()` to `true`', function() {
      expect(this.object._isDestroyed).to.be.true;
    });

    it('should return the object', function() {
      expect(this.object.destroy).to.have.returned(this.object);
    });
  });
});
