import _ from 'underscore';
import Backbone from 'backbone';
import View from '../../src/view';

describe('view entity events', function() {
  'use strict';

  let model;
  let collection;
  let fooStub;
  let barStub;
  let modelEventsStub
  let collectionEventsStub;

  beforeEach(function() {
    model = new Backbone.Model();
    collection = new Backbone.Collection();

    fooStub = this.sinon.stub();
    barStub = this.sinon.stub();

    modelEventsStub = this.sinon.stub().returns({'foo': fooStub});
    collectionEventsStub = this.sinon.stub().returns({'bar': barStub});
  });

  describe('when a view has string-based model and collection event configuration', function() {
    let fooOneStub;
    let fooTwoStub;
    let barOneStub;
    let barTwoStub;
    let TestView;

    beforeEach(function() {
      fooOneStub = this.sinon.stub();
      fooTwoStub = this.sinon.stub();
      barOneStub = this.sinon.stub();
      barTwoStub = this.sinon.stub();

      TestView = View.extend({
        modelEvents: {'foo': 'fooOne fooTwo'},
        collectionEvents: {'bar': 'barOne barTwo'},
        fooOne: fooOneStub,
        fooTwo: fooTwoStub,
        barOne: barOneStub,
        barTwo: barTwoStub
      });

      new TestView({
        model: model,
        collection: collection
      });
    });

    it('should wire up model events', function() {
      model.trigger('foo');
      expect(fooOneStub).to.have.been.calledOnce;
      expect(fooTwoStub).to.have.been.calledOnce;
    });

    it('should wire up collection events', function() {
      collection.trigger('bar');
      expect(barOneStub).to.have.been.calledOnce;
      expect(barTwoStub).to.have.been.calledOnce;
    });
  });

  describe('when a view has function-based model and collection event configuration', function() {
    let TestView;

    beforeEach(function() {
      TestView = View.extend({
        modelEvents: {'foo': fooStub},
        collectionEvents: {'bar': barStub}
      });

      new TestView({
        model: model,
        collection: collection
      });
    });

    it('should wire up model events', function() {
      model.trigger('foo');
      expect(fooStub).to.have.been.calledOnce;
    });

    it('should wire up collection events', function() {
      collection.trigger('bar');
      expect(barStub).to.have.been.calledOnce;
    });
  });

  describe('when a view has model event config with a specified handler method that doesnt exist', function() {
    let MyView;
    let getBadViewInstance;

    beforeEach(function() {
      MyView = View.extend({
        modelEvents: {foo: 'doesNotExist'},
        model: model
      });

      getBadViewInstance = function() {
        return new MyView();
      };
    });

    it('should error when method doesnt exist', function() {
      const errorMessage = 'Method "doesNotExist" was configured as an event handler, but does not exist.';
      expect(getBadViewInstance).to.throw(errorMessage);
    });
  });

  describe('when configuring entity events with a function', function() {
    let TestView;
    let view;

    beforeEach(function() {
      TestView = View.extend({
        modelEvents: modelEventsStub,
        collectionEvents: collectionEventsStub
      });

      view = new TestView({
        model: model,
        collection: collection
      });
    });

    it('should trigger the model event', function() {
      view.model.trigger('foo');
      expect(fooStub).to.have.been.calledOnce;
    });

    it('should trigger the collection event', function() {
      view.collection.trigger('bar');
      expect(barStub).to.have.been.calledOnce;
    });
  });

  describe('when undelegating entity events on a view', function() {
    let TestView;
    let view;

    beforeEach(function() {
      TestView = View.extend({
        modelEvents: {'foo': 'foo'},
        collectionEvents: {'bar': 'bar'},
        foo: fooStub,
        bar: barStub
      });

      view = new TestView({
        model: model,
        collection: collection
      });

      this.sinon.spy(view, 'undelegateEntityEvents');
      view.undelegateEntityEvents();

      model.trigger('foo');
      collection.trigger('bar');
    });

    it('should undelegate the model events', function() {
      expect(fooStub).not.to.have.been.calledOnce;
    });

    it('should undelegate the collection events', function() {
      expect(barStub).not.to.have.been.calledOnce;
    });

    it('should return the view', function() {
      expect(view.undelegateEntityEvents).to.have.returned(view);
    });
  });

  describe('when undelegating events on a view, delegating them again, and then triggering a model event', function() {
    let TestView;
    let view;

    beforeEach(function() {
      TestView = View.extend({
        modelEvents: {'foo': 'foo'},
        collectionEvents: {'bar': 'bar'},
        foo: fooStub,
        bar: barStub
      });

      view = new TestView({
        model: model,
        collection: collection
      });

      view.undelegateEntityEvents();
      this.sinon.spy(view, 'delegateEntityEvents');
      view.delegateEntityEvents();
    });

    it('should fire the model event once', function() {
      model.trigger('foo');
      expect(fooStub).to.have.been.calledOnce;
    });

    it('should fire the collection event once', function() {
      collection.trigger('bar');
      expect(barStub).to.have.been.calledOnce;
    });

    it('should return the view from delegateEntityEvents', function() {
      expect(view.delegateEntityEvents).to.have.returned(view);
    });
  });

  describe('when View bound to modelEvent replaces region with new view', function() {
    let Layout;
    let TestView;
    let layoutView;
    let itemViewOne;
    let itemViewTwo;

    beforeEach(function() {
      Layout = View.extend({
        template: _.template('<div id="child"></div>'),
        regions: {child: '#child'},
        modelEvents: {'baz': 'foo'},
        foo: fooStub
      });

      TestView = View.extend({
        template: _.template('bar'),
        modelEvents: {'baz': 'bar'},
        bar: barStub
      });

      layoutView = new Layout({model: model});
      itemViewOne = new TestView({model: model});
      itemViewTwo = new TestView({model: model});

      layoutView.render();
      layoutView.getRegion('child').show(itemViewOne);
      layoutView.getRegion('child').show(itemViewTwo);

      model.trigger('baz');
    });

    it('should leave the layoutView\'s modelEvent binded', function() {
      expect(fooStub).to.have.been.calledOnce;
    });

    it('should unbind the previous child view\'s modelEvents', function() {
      expect(barStub).to.have.been.calledOnce;
    });
  });

  // Fixes https://github.com/marionettejs/backbone.marionette/issues/3527
  describe('when entity events are added in initialize', function() {
    let view;

    it('should not undelegate them', function() {
      let TestView = View.extend({
        template: false,
        initialize() {
          this.listenTo(model, 'foo', this.onFoo);
        },
        onFoo: this.sinon.stub()
      });

      model = new Backbone.Model();

      view = new TestView({ model });

      model.trigger('foo');

      expect(view.onFoo).to.have.been.calledOnce;
    });
  });
});
