import _ from 'underscore';
import CollectionView from '../../../src/collection-view';
import View from '../../../src/view';


describe('trigger event and method name', function() {
  'use strict';

  let returnValue;
  let argumentOne;
  let argumentTwo;
  let eventHandler;
  let methodHandler;

  beforeEach(function() {
    returnValue = 'foo';
    argumentOne = 'bar';
    argumentTwo = 'baz';

    eventHandler = this.sinon.stub();
    methodHandler = this.sinon.stub().returns(returnValue);
  });

  describe('triggering an event when passed options', function() {
    let view;

    beforeEach(function() {
      view = new View({
        onFoo: methodHandler
      });
      view.triggerMethod('foo');
    });

    it('should trigger the event', function() {
      expect(methodHandler).to.have.been.calledOnce;
    });
  });

  describe('when triggering an event', function() {
    let view;
    let triggerMethodSpy;

    beforeEach(function() {
      view = new View();
      triggerMethodSpy = this.sinon.spy(view, 'triggerMethod');

      view.onFoo = methodHandler;
      view.on('foo', eventHandler);
      view.triggerMethod('foo');
    });

    it('should trigger the event', function() {
      expect(eventHandler).to.have.been.calledOnce;
    });

    it('should call a method named on{Event}', function() {
      expect(methodHandler).to.have.been.calledOnce;
    });

    it('returns the value returned by the on{Event} method', function() {
      expect(triggerMethodSpy).to.have.been.calledOnce.and.returned(returnValue);
    });

    describe('when trigger does not exist', function() {
      let triggerNonExistantEvent;

      beforeEach(function() {
        triggerNonExistantEvent = _.partial(view.triggerMethod, 'does:not:exist');
      });

      it('should do nothing', function() {
        expect(triggerNonExistantEvent).not.to.throw;
      });
    });
  });

  describe('when triggering an event with arguments', function() {
    let view;

    beforeEach(function() {
      view = new View();
      view.onFoo = methodHandler;
      view.on('foo', eventHandler);
      view.triggerMethod('foo', argumentOne, argumentTwo);
    });

    it('should trigger the event with the args', function() {
      expect(eventHandler).to.have.been.calledOnce.and.calledWith(argumentOne, argumentTwo);
    });

    it('should call a method named on{Event} with the args', function() {
      expect(methodHandler).to.have.been.calledOnce.and.calledWith(argumentOne, argumentTwo);
    });
  });

  describe('when triggering an event with : separated name', function() {
    let view;

    beforeEach(function() {
      view = new View();
      view.onFooBar = methodHandler;
      view.on('foo:bar', eventHandler);
      view.triggerMethod('foo:bar', argumentOne, argumentTwo);
    });

    it('should trigger the event with the args', function() {
      expect(eventHandler).to.have.been.calledOnce.and.calledWith(argumentOne, argumentTwo);
    });

    it('should call a method named with each segment of the event name capitalized', function() {
      expect(methodHandler).to.have.been.calledOnce.and.calledWith(argumentOne, argumentTwo);
    });
  });

  describe('when triggering an event and no handler method exists', function() {
    let view;

    beforeEach(function() {
      view = new View();
      view.on('foo:bar', eventHandler);
      view.triggerMethod('foo:bar', argumentOne, argumentTwo);
    });

    it('should trigger the event with the args', function() {
      expect(eventHandler).to.have.been.calledOnce.and.calledWith(argumentOne, argumentTwo);
    });

    it('should not call a method named with each segment of the event name capitalized', function() {
      expect(methodHandler).not.to.have.been.calledOnce;
    });
  });

  describe('when triggering an event and the attribute for that event is not a function', function() {
    let view;

    beforeEach(function() {
      view = new View();
      view.onFooBar = 'baz';
      view.on('foo:bar', eventHandler);
      view.triggerMethod('foo:bar', argumentOne, argumentTwo);
    });

    it('should trigger the event with the args', function() {
      expect(eventHandler).to.have.been.calledOnce.and.calledWith(argumentOne, argumentTwo);
    });

    it('should not call a method named with each segment of the event name capitalized', function() {
      expect(methodHandler).not.to.have.been.calledOnce;
    });
  });

  describe('triggering events through a child view', function() {
    let onChildviewFooClickStub;
    let MyView;
    let MyCollectionView;
    let collection;
    let collectionView;
    let childView;

    beforeEach(function() {
      onChildviewFooClickStub = this.sinon.stub();

      MyView = View.extend({
        template: _.template('foo'),
        triggers: {'click': 'foo:click'}
      });

      MyCollectionView = CollectionView.extend({
        childView: MyView,
        childViewEventPrefix: 'childview',
        onChildviewFooClick: onChildviewFooClickStub
      });

      collection = new Backbone.Collection([{foo: 'bar'}]);
      collectionView = new MyCollectionView({
        collection: collection
      });

      collectionView.render();
      childView = collectionView.children.findByModel(collection.at(0));
      childView.$el.click();
    });

    it('should fire the event method once', function() {
      expect(onChildviewFooClickStub).to.have.been.calledOnce;
    });
  });
});
