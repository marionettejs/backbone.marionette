describe('view entity events', function() {
  'use strict';

  beforeEach(function() {
    this.model      = new Backbone.Model();
    this.collection = new Backbone.Collection();

    this.fooStub = this.sinon.stub();
    this.barStub = this.sinon.stub();

    this.modelEventsStub      = this.sinon.stub().returns({'foo': this.fooStub});
    this.collectionEventsStub = this.sinon.stub().returns({'bar': this.barStub});
  });

  describe('when a view has string-based model and collection event configuration', function() {
    beforeEach(function() {
      this.fooOneStub = this.sinon.stub();
      this.fooTwoStub = this.sinon.stub();
      this.barOneStub = this.sinon.stub();
      this.barTwoStub = this.sinon.stub();

      this.View = Marionette.View.extend({
        modelEvents      : {'foo': 'fooOne fooTwo'},
        collectionEvents : {'bar': 'barOne barTwo'},
        fooOne: this.fooOneStub,
        fooTwo: this.fooTwoStub,
        barOne: this.barOneStub,
        barTwo: this.barTwoStub
      });

      this.view = new this.View({
        model      : this.model,
        collection : this.collection
      });
    });

    it('should wire up model events', function() {
      this.model.trigger('foo');
      expect(this.fooOneStub).to.have.been.calledOnce;
      expect(this.fooTwoStub).to.have.been.calledOnce;
    });

    it('should wire up collection events', function() {
      this.collection.trigger('bar');
      expect(this.barOneStub).to.have.been.calledOnce;
      expect(this.barTwoStub).to.have.been.calledOnce;
    });
  });

  describe('when a view has function-based model and collection event configuration', function() {
    beforeEach(function() {
      this.View = Marionette.View.extend({
        modelEvents      : {'foo': this.fooStub},
        collectionEvents : {'bar': this.barStub}
      });

      this.view = new this.View({
        model      : this.model,
        collection : this.collection
      });
    });

    it('should wire up model events', function() {
      this.model.trigger('foo');
      expect(this.fooStub).to.have.been.calledOnce;
    });

    it('should wire up collection events', function() {
      this.collection.trigger('bar');
      expect(this.barStub).to.have.been.calledOnce;
    });
  });

  describe('when a view has model event config with a specified handler method that doesnt exist', function() {
    beforeEach(function() {
      var suite = this;

      this.View = Marionette.View.extend({
        modelEvents: {foo: 'doesNotExist'},
        model: this.model
      });

      this.getBadViewInstance = function() {
        return new suite.View();
      };
    });

    it('should error when method doesnt exist', function() {
      var errorMessage = 'Method "doesNotExist" was configured as an event handler, but does not exist.';
      expect(this.getBadViewInstance).to.throw(errorMessage);
    });
  });

  describe('when configuring entity events with a function', function() {
    beforeEach(function() {
      this.View = Marionette.View.extend({
        modelEvents      : this.modelEventsStub,
        collectionEvents : this.collectionEventsStub
      });

      this.view = new this.View({
        model      : this.model,
        collection : this.collection
      });
    });

    it('should trigger the model event', function() {
      this.view.model.trigger('foo');
      expect(this.fooStub).to.have.been.calledOnce;
    });

    it('should trigger the collection event', function() {
      this.view.collection.trigger('bar');
      expect(this.barStub).to.have.been.calledOnce;
    });
  });

  describe('when undelegating events on a view', function() {
    beforeEach(function() {
      this.View = Marionette.View.extend({
        modelEvents      : {'foo': 'foo'},
        collectionEvents : {'bar': 'bar'},
        foo: this.fooStub,
        bar: this.barStub
      });

      this.view = new this.View({
        model      : this.model,
        collection : this.collection
      });

      this.sinon.spy(this.view, 'undelegateEvents');
      this.view.undelegateEvents();

      this.model.trigger('foo');
      this.collection.trigger('bar');
    });

    it('should undelegate the model events', function() {
      expect(this.fooStub).not.to.have.been.calledOnce;
    });

    it('should undelegate the collection events', function() {
      expect(this.barStub).not.to.have.been.calledOnce;
    });

    it('should return the view', function() {
      expect(this.view.undelegateEvents).to.have.returned(this.view);
    });
  });

  describe('when undelegating events on a view, delegating them again, and then triggering a model event', function() {
    beforeEach(function() {
      this.View = Marionette.View.extend({
        modelEvents      : {'foo': 'foo'},
        collectionEvents : {'bar': 'bar'},
        foo: this.fooStub,
        bar: this.barStub
      });

      this.view = new this.View({
        model      : this.model,
        collection : this.collection
      });

      this.view.undelegateEvents();
      this.sinon.spy(this.view, 'delegateEvents');
      this.view.delegateEvents();
    });

    it('should fire the model event once', function() {
      this.model.trigger('foo');
      expect(this.fooStub).to.have.been.calledOnce;
    });

    it('should fire the collection event once', function() {
      this.collection.trigger('bar');
      expect(this.barStub).to.have.been.calledOnce;
    });

    it('should return the view from delegateEvents', function() {
      expect(this.view.delegateEvents).to.have.returned(this.view);
    });
  });

  describe('when LayoutView bound to modelEvent replaces region with new view', function() {
    beforeEach(function() {
      this.LayoutView = Marionette.LayoutView.extend({
        template: _.template('<div id="child"></div>'),
        regions: {child: '#child'},

        modelEvents: {'baz': 'foo'},
        foo: this.fooStub
      });

      this.ItemView = Marionette.ItemView.extend({
        template: _.template('bar'),
        modelEvents: {'baz': 'bar'},
        bar: this.barStub
      });

      this.layoutView = new this.LayoutView({model: this.model});
      this.itemViewOne = new this.ItemView({model: this.model});
      this.itemViewTwo = new this.ItemView({model: this.model});

      this.layoutView.render();
      this.layoutView.child.show(this.itemViewOne);
      this.layoutView.child.show(this.itemViewTwo);

      this.model.trigger('baz');
    });

    it('should leave the layoutView\'s modelEvent binded', function() {
      expect(this.fooStub).to.have.been.calledOnce;
    });

    it('should unbind the previous child view\'s modelEvents', function() {
      expect(this.barStub).to.have.been.calledOnce;
    });
  });
});
