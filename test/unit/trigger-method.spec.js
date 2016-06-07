describe('trigger event and method name', function() {
  'use strict';

  beforeEach(function() {
    this.returnValue = 'foo';
    this.secondReturnValue = 'qux';
    this.argumentOne = 'bar';
    this.argumentTwo = 'baz';

    this.view = new Marionette.View();

    this.eventHandler = this.sinon.stub();
    this.secondEventHandler = this.sinon.stub();
    this.methodHandler = this.sinon.stub().returns(this.returnValue);
    this.secondMethodHandler = this.sinon.stub().returns(this.secondReturnValue);
    this.triggerMethodSpy = this.sinon.spy(this.view, 'triggerMethod');
  });

  describe('triggering an event when passed options', function() {
    beforeEach(function() {
      this.view.options.onFoo = this.methodHandler;
      this.view.triggerMethod('foo');
    });

    it('should trigger the event', function() {
      expect(this.methodHandler).to.have.been.calledOnce;
    });
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

  describe('when triggering a space-delimited list of events', function() {
    beforeEach(function() {
      this.view.onFoo = this.methodHandler;
      this.view.onQux = this.secondMethodHandler;
      this.view.on('foo', this.eventHandler);
      this.view.on('qux', this.secondEventHandler);
      this.view.triggerMethod('foo qux');
    });

    it('should trigger all the events', function() {
      expect(this.eventHandler).to.have.been.calledOnce;
      expect(this.secondEventHandler).to.have.been.calledOnce;
    });

    it('should call all the methods named as on{Event}', function() {
      expect(this.methodHandler).to.have.been.calledOnce;
      expect(this.secondMethodHandler).to.have.been.calledOnce;
    });

    it('returns an array of the values returned by the on{Event} methods', function() {
      expect(this.triggerMethodSpy).to.have.been.calledOnce.and.returned([this.returnValue, this.secondReturnValue]);
    });
  });

  describe('triggering events through a child view', function() {
    beforeEach(function() {
      this.onChildviewFooClickStub = this.sinon.stub();

      this.View = Marionette.View.extend({
        template: _.template('foo'),
        triggers: {'click': 'foo:click'}
      });

      this.CollectionView = Marionette.CollectionView.extend({
        childView: this.View,
        onChildviewFooClick: this.onChildviewFooClickStub
      });

      this.collection = new Backbone.Collection([{foo: 'bar'}]);
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

  describe('triggering a space-delimited list of events through a child view (childview:*)', function() {
    beforeEach(function() {
      this.onChildviewFooStub = this.sinon.stub();
      this.onChildviewBarStub = this.sinon.stub();

      this.View = Marionette.View.extend({
        template: _.template('foo')
      });

      this.CollectionView = Marionette.CollectionView.extend({
        childView: this.View,
        onChildviewFoo: this.onChildviewFooStub,
        onChildviewBar: this.onChildviewBarStub
      });

      this.collection = new Backbone.Collection([{foo: 'bar'}]);
      this.collectionView = new this.CollectionView({
        collection: this.collection
      });

      this.collectionView.render();
      this.childView = this.collectionView.children.findByModel(this.collection.at(0));
      this.childView.trigger('foo bar');
    });

    it('should fire all event methods once', function() {
      expect(this.onChildviewFooStub).to.have.been.calledOnce;
      expect(this.onChildviewBarStub).to.have.been.calledOnce;
    });
  });

  describe('triggering a space-delimited list of events through a child view (childViewEvents)', function() {
    beforeEach(function() {
      this.childViewEventsFooStub = this.sinon.stub();
      this.childViewEventsBarStub = this.sinon.stub();

      this.View = Marionette.View.extend({
        template: _.template('foo')
      });

      this.CollectionView = Marionette.CollectionView.extend({
        childView: this.View,
        childViewEvents: {
          'foo': this.childViewEventsFooStub,
          'bar': this.childViewEventsBarStub
        }
      });

      this.collection = new Backbone.Collection([{foo: 'bar'}]);
      this.collectionView = new this.CollectionView({
        collection: this.collection
      });

      this.collectionView.render();
      this.childView = this.collectionView.children.findByModel(this.collection.at(0));
      this.childView.trigger('foo bar');
    });

    it('should fire all event methods once', function() {
      expect(this.childViewEventsFooStub).to.have.been.calledOnce;
      expect(this.childViewEventsBarStub).to.have.been.calledOnce;
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
        this.obj = _.extend({}, Backbone.Events);
        this.obj.onFoo = this.methodHandler;
        this.obj.on('foo', this.eventHandler);
        Marionette.triggerMethodOn(this.obj, 'foo');
      });

      it('should trigger the event', function() {
        expect(this.eventHandler).to.have.been.calledOnce;
      });

      it('should call a method named on{Event}', function() {
        expect(this.methodHandler).to.have.been.calledOnce;
      });
    });
  });
});
