describe('trigger event and method name', function() {
  'use strict';

  beforeEach(function() {
    this.returnValue = 'foo';
    this.argumentOne = 'bar';
    this.argumentTwo = 'baz';

    this.view = new Marionette.View();

    this.eventHandler = this.sinon.stub();
    this.methodHandler = this.sinon.stub().returns(this.returnValue);
    this.triggerMethodSpy = this.sinon.spy(this.view, 'triggerMethod');
  });

  describe('when triggering an event', function() {
    beforeEach(function() {
      this.view.onFoo = this.methodHandler;
      this.view.on('foo', this.eventHandler);
      this.view.triggerMethod('foo');
    });

    it('should trigger the event', function() {
      expect(this.eventHandler).to.have.been.calledOnce;
    });

    it('should call a method named on{Event}', function() {
      expect(this.methodHandler).to.have.been.calledOnce;
    });

    it('returns the value returned by the on{Event} method', function() {
      expect(this.triggerMethodSpy).to.have.been.calledOnce.and.returned(this.returnValue);
    });

    describe('when trigger does not exist', function() {
      beforeEach(function() {
        this.triggerNonExistantEvent = _.partial(this.view.triggerMethod, 'does:not:exist');
      });

      it('should do nothing', function() {
        expect(this.triggerNonExistantEvent).not.to.throw;
      });
    });
  });

  describe('when triggering an event with arguments', function() {
    beforeEach(function() {
      this.view.onFoo = this.methodHandler;
      this.view.on('foo', this.eventHandler);
      this.view.triggerMethod('foo', this.argumentOne, this.argumentTwo);
    });

    it('should trigger the event with the args', function() {
      expect(this.eventHandler).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should call a method named on{Event} with the args', function() {
      expect(this.methodHandler).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });
  });

  describe('when triggering an event with : separated name', function() {
    beforeEach(function() {
      this.view.onFooBar = this.methodHandler;
      this.view.on('foo:bar', this.eventHandler);
      this.view.triggerMethod('foo:bar', this.argumentOne, this.argumentTwo);
    });

    it('should trigger the event with the args', function() {
      expect(this.eventHandler).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should call a method named with each segment of the event name capitalized', function() {
      expect(this.methodHandler).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });
  });

  describe('when triggering an event and no handler method exists', function() {
    beforeEach(function() {
      this.view.on('foo:bar', this.eventHandler);
      this.view.triggerMethod('foo:bar', this.argumentOne, this.argumentTwo);
    });

    it('should trigger the event with the args', function() {
      expect(this.eventHandler).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should not call a method named with each segment of the event name capitalized', function() {
      expect(this.methodHandler).not.to.have.been.calledOnce;
    });
  });

  describe('when triggering an event and the attribute for that event is not a function', function() {
    beforeEach(function() {
      this.view.onFooBar = 'baz';
      this.view.on('foo:bar', this.eventHandler);
      this.view.triggerMethod('foo:bar', this.argumentOne, this.argumentTwo);
    });

    it('should trigger the event with the args', function() {
      expect(this.eventHandler).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should not call a method named with each segment of the event name capitalized', function() {
      expect(this.methodHandler).not.to.have.been.calledOnce;
    });
  });

  describe('triggering events through a child view', function() {
    beforeEach(function() {
      this.onChildviewFooClickStub = this.sinon.stub();

      this.ItemView = Marionette.ItemView.extend({
        template: _.template('foo'),
        triggers: { 'click' : 'foo:click' }
      });

      this.CollectionView = Marionette.CollectionView.extend({
        childView: this.ItemView,
        onChildviewFooClick: this.onChildviewFooClickStub
      });

      this.collection = new Backbone.Collection([{ foo: 'bar' }]);
      this.collectionView = new this.CollectionView({
        collection: this.collection
      });

      this.collectionView.render();
      this.childView = this.collectionView.children.findByModel(this.collection.at(0));
      this.childView.$el.click();
    });

    it('should fire the event method once', function() {
      expect(this.onChildviewFooClickStub).to.have.been.calledOnce;
    });
  });

  describe('when triggering an event on another context', function() {
    describe('when the context has triggerMethod defined', function() {
      beforeEach(function() {
        this.view.onFoo = this.methodHandler;
        this.view.on('foo', this.eventHandler);
        Marionette.triggerMethodOn(this.view, 'foo');
      });

      it('should trigger the event', function() {
        expect(this.eventHandler).to.have.been.calledOnce;
      });

      it('should call a method named on{Event}', function() {
        expect(this.methodHandler).to.have.been.calledOnce;
      });

      it('should return the value returned by the on{Event} method', function() {
        expect(this.triggerMethodSpy)
          .to.have.been.calledOnce
          .and.returned(this.returnValue);
      });
    });

    describe('when the context does not have triggerMethod defined', function() {
      beforeEach(function() {
        this.view = new Backbone.View();
        this.view.onFoo = this.methodHandler;
        this.view.on('foo', this.eventHandler);
        this.triggerMethodSpy = this.sinon.spy(Marionette, 'triggerMethod');

        Marionette.triggerMethodOn(this.view, 'foo');
      });

      it('should trigger the event', function() {
        expect(this.eventHandler).to.have.been.calledOnce;
      });

      it('should call a method named on{Event}', function() {
        expect(this.methodHandler).to.have.been.calledOnce;
      });

      it('should return the value returned by the on{Event} method', function() {
        expect(this.triggerMethodSpy)
          .to.have.been.calledOnce
          .and.returned(this.returnValue);
      });
    });
  });
});
