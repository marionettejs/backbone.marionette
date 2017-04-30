describe('view mixin', function() {
  'use strict';

  describe('when creating a view', function() {
    beforeEach(function() {
      this.initializeStub = sinon.stub();

      this.View = Marionette.View.extend({
        initialize: this.initializeStub
      });

      this.view = new this.View();
    });

    it('should call initialize', function() {
      expect(this.initializeStub).to.have.been.calledOnce;
    });

    it('should set _behaviors', function() {
      expect(this.view._behaviors).to.be.eql({});
    });
  });

  describe('when using listenTo for the "destroy" event on itself, and destroying the view', function() {
    beforeEach(function() {
      this.destroyStub = sinon.stub();
      this.view = new Marionette.View();
      this.view.listenTo(this.view, 'destroy', this.destroyStub);
      this.view.destroy();
    });

    it('should trigger the "destroy" event', function() {
      expect(this.destroyStub).to.have.been.called;
    });
  });

  describe('when destroying a view', function() {
    beforeEach(function() {
      this.argumentOne = 'foo';
      this.argumentTwo = 'bar';

      this.view = new Marionette.View();

      sinon.spy(this.view, 'removeEl');
      sinon.spy(this.view, 'destroy');

      this.onDestroyStub = sinon.stub();
      this.view.onDestroy = this.onDestroyStub;

      this.destroyStub = sinon.stub();
      this.view.on('destroy', this.destroyStub);

      this.view.destroy(this.argumentOne, this.argumentTwo);
    });

    it('should trigger the destroy event', function() {
      expect(this.destroyStub).to.have.been.calledOnce;
    });

    it('should call an onDestroy method with any arguments passed to destroy', function() {
      expect(this.onDestroyStub)
        .to.have.been.calledOnce
        .and.calledWith(this.view, this.argumentOne, this.argumentTwo);
    });

    it('should remove the view', function() {
      expect(this.view.removeEl).to.have.been.calledOnce;
    });

    it('should set the view _isDestroyed to true', function() {
      expect(this.view).to.be.have.property('_isDestroyed', true);
    });

    it('should return the View', function() {
      expect(this.view.destroy).to.have.returned(this.view);
    });

    describe('and it has already been destroyed', function() {
      beforeEach(function() {
        this.view.destroy();
      });

      it('should return the View', function() {
        expect(this.view.destroy).to.have.returned(this.view);
      });
    });

    describe('_isDestroyed property', function() {
      beforeEach(function() {
        this.view = new Marionette.View();
      });

      it('should be set to false before destroy', function() {
        expect(this.view).to.be.have.property('_isDestroyed', false);
      });

      it('should be set to true after destroying', function() {
        this.view.destroy();
        expect(this.view).to.be.have.property('_isDestroyed', true);
      });
    });
  });

  describe('when destroying a view and returning false from the onBeforeDestroy method', function() {
    beforeEach(function() {
      this.view = new Marionette.View();

      this.removeSpy = sinon.spy(this.view, 'removeEl');

      this.destroyStub = sinon.stub();
      this.view.on('destroy', this.destroyStub);

      this.onBeforeDestroyStub = sinon.stub().returns(false);
      this.view.onBeforeDestroy = this.onDestroyStub;

      this.view.destroy();
    });

    it('should not trigger the destroy event', function() {
      expect(this.destroyStub).to.have.been.calledOnce;
    });

    it('should not remove the view', function() {
      expect(this.removeSpy).to.have.been.calledOnce;
    });

    it('should not set the view _isDestroyed to true', function() {
      expect(this.view).to.be.have.property('_isDestroyed', true);
    });
  });

  describe('when destroying a view and returning undefined from the onBeforeDestroy method', function() {
    beforeEach(function() {
      this.argumentOne = 'foo';
      this.argumentTwo = 'bar';

      this.view = new Marionette.View();

      this.removeSpy = sinon.spy(this.view, 'removeEl');

      this.destroyStub = sinon.stub();
      this.view.on('destroy', this.destroyStub);

      this.onBeforeDestroyStub = sinon.stub().returns(false);
      this.view.onBeforeDestroy = this.onBeforeDestroyStub;
      sinon.spy(this.view, 'destroy');

      this.view.destroy(this.argumentOne, this.argumentTwo);
    });

    it('should trigger the destroy event', function() {
      expect(this.destroyStub).to.have.been.calledOnce.and.calledWith(this.view, this.argumentOne, this.argumentTwo);
    });

    it('should remove the view', function() {
      expect(this.removeSpy).to.have.been.calledOnce;
    });

    it('should set the view _isDestroyed to true', function() {
      expect(this.view).to.have.property('_isDestroyed', true);
    });

    it('should return the view', function() {
      expect(this.view.destroy).to.have.returned(this.view);
    });
  });

  describe('constructing a view with default options', function() {
    beforeEach(function() {
      this.presets = {foo: 'foo'};
      this.options = {foo: 'bar'};

      this.presetsStub = sinon.stub().returns(this.presets);

      this.View = Marionette.View.extend();
      this.ViewPresets = Marionette.View.extend({options: this.presets});
      this.ViewPresetsFn = Marionette.View.extend({options: this.presetsStub});
    });

    it('should take and store view options', function() {
      this.view = new this.View(this.options);
      expect(this.view.options).to.deep.equal(this.options);
    });

    it('should have an empty hash of options by default', function() {
      this.view = new this.View();
      expect(this.view.options).to.deep.equal({});
    });

    it('should retain options set on view class', function() {
      this.view = new this.ViewPresets();
      expect(this.view.options).to.deep.equal(this.presets);
    });

    it('should retain options set on view class as a function', function() {
      this.view = new this.ViewPresetsFn();
      expect(this.view.options).to.deep.equal(this.presets);
    });
  });

  // http://backbonejs.org/#View-constructor
  describe('when constructing a view with Backbone viewOptions', function() {
    it('should attach the viewOptions to the view if options are on the view', function() {
      this.MyView = Marionette.View.extend({
        options: {
          className: '.some-class'
        }
      });
      this.myView = new this.MyView();
      expect(this.myView.className).to.equal('.some-class');
    });

    it('should attach the viewOptions to the view if options are on the collectionview', function() {
      this.MyCollectionView = Marionette.CollectionView.extend({
        options: {
          className: '.some-class'
        }
      });
      this.myCollectionView = new this.MyCollectionView();
      expect(this.myCollectionView.className).to.equal('.some-class');
    });
  });

  describe('should expose its options in the constructor', function() {
    beforeEach(function() {
      this.options = {foo: 'bar'};
      this.view = new Marionette.View(this.options);
    });

    it('should be able to access instance options', function() {
      expect(this.view.options).to.deep.equal(this.options);
    });
  });

  describe('when destroying a view that is already destroyed', function() {
    beforeEach(function() {
      this.view = new Marionette.View();

      this.removeSpy = sinon.spy(this.view, 'removeEl');
      this.destroyStub = sinon.stub();
      this.view.on('destroy', this.destroyStub);

      this.view.destroy();
      this.view.destroy();
    });

    it('should not trigger the destroy event', function() {
      expect(this.destroyStub).to.have.been.calledOnce;
    });

    it('should not remove the view', function() {
      expect(this.removeSpy).to.have.been.calledOnce;
    });

    it('should leave _isDestroyed as true', function() {
      expect(this.view).to.be.have.property('_isDestroyed', true);
    });
  });

  describe('when serializing a model', function() {
    var modelData = {foo: 'bar'};
    var model;
    var view;

    beforeEach(function() {
      model = new Backbone.Model(modelData);
      view = new Marionette.View({
        model: model
      });
    });

    it('should return all attributes', function() {
      expect(view.serializeModel()).to.be.eql(modelData);
    });
  });

  describe('when proxying events to a parent layout', function() {

    beforeEach(function() {
      this.LayoutView = Marionette.View.extend({
        template: _.template('<div class="child"></div>'),

        regions: {
          'child': '.child',
        },

        childViewEvents: {
          'boom': 'onBoom'
        },

        childViewTriggers: {
          'whack': 'rattle'
        }
      });

      this.ChildView = Marionette.View.extend({
        template: _.noop
      });

      this.SuperView = Marionette.View.extend({
        template: _.template('<div class="layout"></div>'),

        regions: {
          'layout': '.layout',
        },

        childViewEvents: {
          rattle: 'onRattle'
        }
      });

      this.superView = new this.SuperView();
      this.layoutView = new this.LayoutView();
      this.childView = new this.ChildView();
      this.layoutView.render();
      this.superView.render();

      this.layoutEventHandler = sinon.spy();
      this.layoutView.on('childview:boom', this.layoutEventHandler);

      this.layoutEventOnHandler = sinon.spy();
      this.layoutView.onChildviewBoom = this.layoutEventOnHandler;

      this.layoutViewOnBoomHandler = sinon.spy();
      this.layoutView.onBoom = this.layoutViewOnBoomHandler;

      this.superViewOnRattleHandler = this.sinon.spy();
      this.superView.onRattle = this.superViewOnRattleHandler;

      this.childEventsFunction = _.bind(function() {
        return {
          'boom': this.layoutViewOnBoomHandler
        };
      }, this);
    });

    describe('when there is not a containing layout', function() {
      beforeEach(function() {
        this.childView.triggerMethod('boom', 'foo', 'bar');
      });

      it('does not emit the event on the layout', function() {
        expect(this.layoutEventHandler).not.to.have.been.called;
      });
    });

    describe('when there is a containing layout', function() {
      beforeEach(function() {
        this.layoutView.showChildView('child', this.childView);
        this.childView.triggerMethod('boom', 'foo', 'bar');
      });

      it('emits the event on the layout', function() {
        expect(this.layoutEventHandler)
          .to.have.been.calledWith('foo', 'bar')
          .and.to.have.been.calledOn(this.layoutView)
          .and.CalledOnce;
      });

      it('invokes the layout on handler', function() {
        expect(this.layoutEventOnHandler)
          .to.have.been.calledWith('foo', 'bar')
          .and.to.have.been.calledOn(this.layoutView)
          .and.CalledOnce;
      });

      it('invokes the layout childViewEvents handler', function() {
        expect(this.layoutViewOnBoomHandler)
          .to.have.been.calledWith('foo', 'bar')
          .and.to.have.been.calledOn(this.layoutView)
          .and.CalledOnce;
      });
    });

    describe('when childViewEvents was passed as a function', function() {
      beforeEach(function() {
        // use the function definition of childViewEvents instead of the hash
        this.layoutView.childViewEvents = this.childEventsFunction;
        this.layoutView.delegateEvents();
        this.layoutView.showChildView('child', this.childView);
        this.childView.triggerMethod('boom', 'foo', 'bar');
      });

      it('invokes the layout childViewEvents handler', function() {
        expect(this.layoutViewOnBoomHandler)
          .to.have.been.calledWith('foo', 'bar')
          .and.to.have.been.calledOn(this.layoutView)
          .and.CalledOnce;
      });
    });

    describe('using childViewTriggers', function() {
      beforeEach(function() {
        this.superView.showChildView('layout', this.layoutView);
        this.layoutView.showChildView('child', this.childView);
        this.childView.triggerMethod('whack', 'foo', 'bar');
      });

      it('invokes the super trigger handler', function() {
        expect(this.superViewOnRattleHandler)
          .to.have.been.calledWith('foo', 'bar')
          .to.have.been.calledOn(this.superView)
          .and.CalledOnce;
      });
    });

    describe('when childViewEventPrefix is false', function() {
      beforeEach(function() {
        this.layoutView.showChildView('child', this.childView);
        this.layoutView.childViewEventPrefix = false;
        this.childView.triggerMethod('boom', 'foo', 'bar');
      });

      it('should not emit the event on the layout', function() {
        expect(this.layoutEventHandler).not.to.have.been.called;
      });
    });

    describe('when childViewEventPrefix flag is false', function() {
      let myView;

      beforeEach(function() {
        Marionette.setEnabled('childViewEventPrefix', false);
        myView = new Marionette.View();
      });

      afterEach(function() {
        Marionette.setEnabled('childViewEventPrefix', true);
      });

      it('should set childViewEventPrefix to false', function() {
        expect(_.result(myView, 'childViewEventPrefix')).to.be.false;
      });
    });
  });
});
