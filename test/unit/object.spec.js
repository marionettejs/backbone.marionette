describe('marionette object', function() {

  describe('when creating an object', function() {
    let object;
    let options;

    beforeEach(function() {
      const Object = Marionette.Object.extend({
        initialize(opts) {
          this.bindEvents(opts.model, this.modelEvents);
        },

        modelEvents: {
          'bar': 'onBar'
        },

        onBar: this.sinon.stub()
      });

      this.sinon.spy(Object.prototype, '_initRadio');

      const model = new Backbone.Model();

      options = {
        model,
        channelName: 'foo',
        radioEvents: {},
        radioRequests: {}
      };

      object = new Object(options);
    });

    it('should merge the class options to the object', function() {
      expect(object.channelName).to.equal(options.channelName);
      expect(object.radioEvents).to.equal(options.radioEvents);
      expect(object.radioRequests).to.equal(options.radioRequests);
    });

    it('should maintain a reference to the options', function() {
      expect(object.options).to.deep.equal(options);
    });

    it('should have a cidPrefix', function() {
      expect(object.cidPrefix).to.equal('mno');
    });

    it('should have a cid', function() {
      expect(object.cid).to.contain('mno');
    });

    it('should init the RadioMixin', function() {
      expect(object._initRadio).to.have.been.called;
    });

    it('should support triggering events on itself', function() {
      const fooHandler = this.sinon.spy();
      object.on('foo', fooHandler);

      object.trigger('foo', options);

      expect(fooHandler).to.have.been.calledOnce.and.calledWith(options);
    });

    it('should support binding to evented objects', function() {
      options.model.trigger('bar', options);

      expect(object.onBar).to.have.been.calledOnce.and.calledWith(options);
    });

    it('should have `isDestroyed()` set to `false`', function() {
      expect(object.isDestroyed()).to.be.false;
    });
  });

  describe('when destroying a object', function() {
    let object;

    beforeEach(function() {
      const Object = Marionette.Object.extend({
        onDestroy: this.sinon.stub()
      });

      object = new Object();

      this.sinon.spy(object, 'destroy');
    });

    it('should trigger the before:destroy event', function() {
      const onBeforeDestroyHandler = this.sinon.spy();
      object.on('before:destroy', onBeforeDestroyHandler);

      object.destroy('foo');

      expect(onBeforeDestroyHandler).to.have.been.calledOnce.and.calledWith(object, 'foo');
    });

    it('should trigger the destroy events', function() {
      object.destroy('foo');

      expect(object.onDestroy).to.have.been.calledOnce.and.calledWith(object, 'foo');
    });

    it('should set `object.isDestroyed()` to `true`', function() {
      object.destroy();

      expect(object.isDestroyed()).to.be.true;
    });

    it('should return the object', function() {
      object.destroy();

      expect(object.destroy).to.have.returned(object);
    });

    it('should stop listening to events after the destroy event', function() {
      this.sinon.spy(object, 'stopListening');

      object.destroy();

      expect(object.stopListening).to.have.been.calledOnce.and.calledAfter(object.onDestroy);
    });

    describe('when already destroyed', function() {
      beforeEach(function() {
        object.destroy();
      });

      it('should return the object', function() {
        object.destroy();

        expect(object.destroy).to.have.returned(object);
      });

      it('should not trigger any events', function() {
        const onAllHandler = this.sinon.stub();
        object.on('all', onAllHandler);

        object.destroy();

        expect(onAllHandler).to.not.have.been.called;
      });
    });
  });

  // Testing internal use cases.
  describe('when extending an object', function() {
    let Object;

    beforeEach(function() {
      Object = Marionette.Object.extend({
        constructor(options) {
          this.options = {};
          this.cid = 'foo';
          Marionette.Object.apply(this, arguments);
        }
      });
    });

    it('should not re-set the options', function() {
      this.sinon.spy(Object.prototype, '_setOptions');

      const object = new Object();

      expect(object._setOptions).to.not.have.been.called;
    });

    it('should not re-set the cid', function() {
      const object = new Object();

      expect(object.cid).to.equal('foo');
    });
  });
});
