describe('trigger event and method name', function() {
  'use strict';

  beforeEach(function() {
    this.returnValue1 = 'foo';
    this.returnValue2 = 'bar';
    this.argumentOne = 'baz';
    this.argumentTwo = 'bax';

    this.eventHandler1 = this.sinon.stub();
    this.eventHandler2 = this.sinon.stub();
    this.methodHandler1 = this.sinon.stub().returns(this.returnValue1);
    this.methodHandler2 = this.sinon.stub().returns(this.returnValue2);
  });

  describe('triggering an event when passed options', function() {
    beforeEach(function() {
      this.view = new Marionette.View({onFoo: this.methodHandler1});
      this.view.triggerMethod('foo');
    });

    it('should trigger the event', function() {
      expect(this.methodHandler1).to.have.been.calledOnce;
    });
  });

  describe('triggering events when passed options', function() {
    beforeEach(function() {
      this.view = new Marionette.View({onFoo: this.methodHandler1, onBar: this.methodHandler2});
      this.view.triggerMethod('foo bar');
    });

    it('should trigger the events', function() {
      expect(this.methodHandler1).to.have.been.calledOnce;
      expect(this.methodHandler2).to.have.been.calledOnce;
    });
  });

  describe('when triggering an event', function() {
    beforeEach(function() {
      this.view = new Marionette.View();
      this.triggerMethodSpy = this.sinon.spy(this.view, 'triggerMethod');

      this.view.onFoo = this.methodHandler1;
      this.view.on('foo', this.eventHandler1);
      this.view.triggerMethod('foo');
    });

    it('should trigger the event', function() {
      expect(this.eventHandler1).to.have.been.calledOnce;
    });

    it('should call a method named on{Event}', function() {
      expect(this.methodHandler1).to.have.been.calledOnce;
    });

    it('returns the value returned by the on{Event} method', function() {
      expect(this.triggerMethodSpy).to.have.been.calledOnce.and.returned(this.returnValue1);
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

  describe('when triggering events', function() {
    beforeEach(function() {
      this.view = new Marionette.View();
      this.triggerMethodSpy = this.sinon.spy(this.view, 'triggerMethod');

      this.view.onFoo = this.methodHandler1;
      this.view.on('foo', this.eventHandler1);
      this.view.onBar = this.methodHandler2;
      this.view.on('bar', this.eventHandler2);
      this.view.triggerMethod('foo bar');
    });

    it('should trigger the event', function() {
      expect(this.eventHandler1).to.have.been.calledOnce;
      expect(this.eventHandler2).to.have.been.calledOnce;
    });

    it('should call a method named on{Event}', function() {
      expect(this.methodHandler1).to.have.been.calledOnce;
      expect(this.methodHandler2).to.have.been.calledOnce;
    });

    it('returns the value returned by the on{Event} method', function() {
      expect(this.triggerMethodSpy).to.have.been.calledOnce.and.returned([this.returnValue1, this.returnValue2]);
    });

    describe('when trigger does not exist', function() {
      beforeEach(function() {
        this.triggerNonExistantEvent = _.partial(this.view.triggerMethod, 'does:not:exist1 does:not:exist2');
      });

      it('should do nothing', function() {
        expect(this.triggerNonExistantEvent).not.to.throw;
      });
    });
  });

  describe('when triggering an event with arguments', function() {
    beforeEach(function() {
      this.view = new Marionette.View();
      this.view.onFoo = this.methodHandler1;
      this.view.on('foo', this.eventHandler1);
      this.view.triggerMethod('foo', this.argumentOne, this.argumentTwo);
    });

    it('should trigger the event with the args', function() {
      expect(this.eventHandler1).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should call a method named on{Event} with the args', function() {
      expect(this.methodHandler1).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });
  });

  describe('when triggering events with arguments', function() {
    beforeEach(function() {
      this.view = new Marionette.View();
      this.view.onFoo = this.methodHandler1;
      this.view.onBar = this.methodHandler2;
      this.view.on('foo', this.eventHandler1);
      this.view.on('bar', this.eventHandler2);
      this.view.triggerMethod('foo bar', this.argumentOne, this.argumentTwo);
    });

    it('should trigger the events with the args', function() {
      expect(this.eventHandler1).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
      expect(this.eventHandler2).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should call methods named on{Event} with the args', function() {
      expect(this.methodHandler1).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
      expect(this.methodHandler2).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });
  });

  describe('when triggering an event with : separated name', function() {
    beforeEach(function() {
      this.view = new Marionette.View();
      this.view.onFooBar = this.methodHandler1;
      this.view.on('foo:bar', this.eventHandler1);
      this.view.triggerMethod('foo:bar', this.argumentOne, this.argumentTwo);
    });

    it('should trigger the event with the args', function() {
      expect(this.eventHandler1).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should call a method named with each segment of the event name capitalized', function() {
      expect(this.methodHandler1).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });
  });

  describe('when triggering events with : separated name', function() {
    beforeEach(function() {
      this.view = new Marionette.View();
      this.view.onFooBar = this.methodHandler1;
      this.view.onBarFoo = this.methodHandler2;
      this.view.on('foo:bar', this.eventHandler1);
      this.view.on('bar:foo', this.eventHandler2);
      this.view.triggerMethod('foo:bar bar:foo', this.argumentOne, this.argumentTwo);
    });

    it('should trigger the events with the args', function() {
      expect(this.eventHandler1).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
      expect(this.eventHandler2).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should call methods named with each segment of the event name capitalized', function() {
      expect(this.methodHandler1).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
      expect(this.methodHandler2).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });
  });

  describe('when triggering an event and no handler method exists', function() {
    beforeEach(function() {
      this.view = new Marionette.View();
      this.view.on('foo:bar', this.eventHandler1);
      this.view.triggerMethod('foo:bar', this.argumentOne, this.argumentTwo);
    });

    it('should trigger the event with the args', function() {
      expect(this.eventHandler1).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should not call a method named with each segment of the event name capitalized', function() {
      expect(this.methodHandler1).not.to.have.been.calledOnce;
    });
  });

  describe('when triggering events and no handler method exists', function() {
    beforeEach(function() {
      this.view = new Marionette.View();
      this.view.on('foo:bar', this.eventHandler1);
      this.view.on('bar:foo', this.eventHandler2);
      this.view.triggerMethod('foo:bar bar:foo', this.argumentOne, this.argumentTwo);
    });

    it('should trigger the events with the args', function() {
      expect(this.eventHandler1).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
      expect(this.eventHandler2).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should not call methods named with each segment of the event name capitalized', function() {
      expect(this.methodHandler1).not.to.have.been.calledOnce;
      expect(this.methodHandler2).not.to.have.been.calledOnce;
    });
  });

  describe('when triggering an event and the attribute for that event is not a function', function() {
    beforeEach(function() {
      this.view = new Marionette.View();
      this.view.onFooBar = 'baz';
      this.view.onBarFoo = 'bax';
      this.view.on('foo:bar', this.eventHandler1);
      this.view.on('bar:foo', this.eventHandler2);
      this.view.triggerMethod('foo:bar bar:foo', this.argumentOne, this.argumentTwo);
    });

    it('should trigger the events with the args', function() {
      expect(this.eventHandler1).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
      expect(this.eventHandler2).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should not call methods named with each segment of the event name capitalized', function() {
      expect(this.methodHandler1).not.to.have.been.calledOnce;
      expect(this.methodHandler2).not.to.have.been.calledOnce;
    });
  });

  describe('triggering events through a child view', function() {
    beforeEach(function() {
      this.onChildviewFooClickStub = this.sinon.stub();
      this.onChildviewBarClickStub = this.sinon.stub();

      this.View = Marionette.View.extend({
        template: _.template('foo'),
        triggers: {
          'click': 'foo:click bar:click'
        }
      });

      this.CollectionView = Marionette.CollectionView.extend({
        childView: this.View,
        onChildviewFooClick: this.onChildviewFooClickStub,
        onChildviewBarClick: this.onChildviewBarClickStub
      });

      this.collection = new Backbone.Collection([
        {
          foo: 'bar'
        }
      ]);
      this.collectionView = new this.CollectionView({collection: this.collection});

      this.collectionView.render();
      this.childView = this.collectionView.children.findByModel(this.collection.at(0));
      this.childView.$el.click();
    });

    it('should fire the event method once', function() {
      expect(this.onChildviewFooClickStub).to.have.been.calledOnce;
      expect(this.onChildviewBarClickStub).to.have.been.calledOnce;
    });
  });
});
