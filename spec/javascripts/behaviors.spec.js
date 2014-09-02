describe('Behaviors', function() {
  'use strict';

  describe('behavior lookup', function() {
    it('should throw if behavior lookup is not defined', function() {
      expect(function() {
        Marionette.Behaviors.behaviorsLookup();
      }).to.throw(Marionette.Error, new Marionette.Error({
        message: 'You must define where your behaviors are stored.',
        url: 'marionette.behaviors.md#behaviorslookup'
      }));
    });
  });

  describe('behavior parsing with a functional behavior lookup', function() {
    beforeEach(function() {
      this.behaviors = {
        foo: this.sinon.spy(Marionette, "Behavior")
      };
      Marionette.Behaviors.behaviorsLookup = _.constant(this.behaviors);
    });

    describe('when one behavior', function() {
      beforeEach(function() {
        this.View = Marionette.ItemView.extend({
          behaviors: { foo: {} }
        });

        this.view = new this.View();
      });

      it('should instantiate the behavior', function() {
        expect(this.behaviors.foo).to.have.been.calledOnce;
      });
    });
  });

  describe('behavior parsing', function() {
    beforeEach(function() {
      this.behaviors = {
        foo: this.sinon.spy(Marionette, "Behavior")
      };

      Marionette.Behaviors.behaviorsLookup = this.behaviors;
    });

    describe('when one behavior', function() {
      beforeEach(function() {
        this.View = Marionette.ItemView.extend({
          behaviors: { foo: {} }
        });

        this.view = new this.View();
      });

      it('should instantiate the behavior', function() {
        expect(this.behaviors.foo).to.have.been.calledOnce;
      });
    });

    describe('when multiple behaviors', function() {
      beforeEach(function() {
        this.View = Marionette.ItemView.extend({
          behaviors: { foo: {} }
        });

        this.view = new this.View();
      });

      it('should instantiate the behavior', function() {
        expect(this.behaviors.foo).to.have.been.calledOnce;
      });
    });

    describe('when functional behavior', function() {
      beforeEach(function() {
        this.behaviorsStub = this.sinon.stub().returns({
          foo: { behaviorClass: this.behaviors.foo }
        });
        this.View = Marionette.ItemView.extend({
          behaviors: this.behaviorsStub
        });

        this.view = new this.View();
      });

      it('should instantiate the behavior', function() {
        expect(this.behaviors.foo).to.have.been.calledOnce;
      });

      it('should call the behaviors method with the view context', function() {
        expect(this.behaviorsStub).to.have.been.calledOnce.and.calledOn(this.view);
      });
    });

    describe('when behavior class is provided', function() {
      beforeEach(function() {
        this.View = Marionette.ItemView.extend({
          behaviors: { foo: { behaviorClass: this.behaviors.foo } }
        });

        this.view = new this.View();
      });

      it('should instantiate the behavior', function() {
        expect(this.behaviors.foo).to.have.been.calledOnce;
      });
    });
  });

  describe('behavior initialize', function() {
    beforeEach(function() {
      this.behaviorOptions = { foo: 'bar' };
      this.initializeStub = this.sinon.stub();

      this.behaviors = {
        foo: Marionette.Behavior.extend({ initialize: this.initializeStub })
      };
      Marionette.Behaviors.behaviorsLookup = this.behaviors;

      this.View = Marionette.ItemView.extend({
        behaviors: { foo: this.behaviorOptions }
      });
      this.view = new this.View();
    });

    it('should call initialize when a behavior is created', function() {
      expect(this.initializeStub).to.have.been.calledOnce;
    });

    it('should call initialize when a behavior is created', function() {
      expect(this.initializeStub).to.have.been.calledOnce.and.calledWith(this.behaviorOptions, this.view);
    });

    it('should set _behaviors', function() {
      expect(this.view._behaviors.length).to.be.equal(1);
    });
  });

  describe('behavior events', function() {
    beforeEach(function() {
      this.fooClickStub  = this.sinon.stub();
      this.barClickStub  = this.sinon.stub();
      this.bazClickStub  = this.sinon.stub();
      this.viewClickStub = this.sinon.stub();

      this.behaviors = {
        foo: Marionette.Behavior.extend({
          events: { 'click': this.fooClickStub }
        }),
        bar: Marionette.Behavior.extend({
          events: { 'click': this.barClickStub }
        }),
        baz: Marionette.Behavior.extend({
          events: { 'click': 'handleClick' },
          handleClick: this.bazClickStub
        })
      };

      this.View = Marionette.ItemView.extend({
        events: { 'click': this.viewClickStub },
        behaviors: { foo: {}, bar: {}, baz: {} }
      });

      Marionette.Behaviors.behaviorsLookup = this.behaviors;
      this.view = new this.View();
      this.view.$el.click();
    });

    it('should call first behaviors event', function() {
      expect(this.fooClickStub).to.have.been.calledOnce.and.calledOn(sinon.match.instanceOf(this.behaviors.foo));
    });

    it('should call second behaviors event', function() {
      expect(this.barClickStub).to.have.been.calledOnce.and.calledOn(sinon.match.instanceOf(this.behaviors.bar));
    });

    it('should call third behaviors event', function() {
      expect(this.bazClickStub).to.have.been.calledOnce.and.calledOn(sinon.match.instanceOf(this.behaviors.baz));
    });

    it('should call the view click handler', function() {
      expect(this.viewClickStub).to.have.been.calledOnce.and.calledOn(this.view);
    });
  });

  describe('behavior triggers', function() {
    beforeEach(function() {
      this.onClickFooStub = this.sinon.stub();

      this.behaviors = {
        foo: Marionette.Behavior.extend({
          triggers: { 'click': 'click:foo' },
          onClickFoo: this.onClickFooStub
        })
      };

      this.model      = new Backbone.Model();
      this.collection = new Backbone.Collection();

      this.View = Marionette.ItemView.extend({
        behaviors: { foo: {} }
      });

      Marionette.Behaviors.behaviorsLookup = this.behaviors;

      this.view = new this.View({
        model: this.model,
        collection: this.collection
      });

      this.triggerMethodSpy = this.sinon.spy();

      this.view.on('click:foo', this.triggerMethodSpy);

      this.view.$el.click();
    });

    it('calls `triggerMethod` with the triggered event', function() {
      expect(this.triggerMethodSpy)
        .to.have.been.calledOnce
        .and.calledOn(this.view);
    });

    it('calls the triggered method', function() {
      expect(this.onClickFooStub)
        .to.have.been.calledOnce
        .and.have.been.calledOn(sinon.match.instanceOf(this.behaviors.foo));
    });
  });

  describe('behavior $el', function() {
    beforeEach(function() {
      var suite = this;
      this.behaviors = {
        foo: Marionette.Behavior.extend({
          initialize: function () { suite.fooBehavior = this; }
        })
      };
      Marionette.Behaviors.behaviorsLookup = this.behaviors;

      this.View = Marionette.ItemView.extend({
        behaviors: { foo: {} }
      });

      this.view = new this.View();
      this.view.setElement(document.createElement('bar'));
    });

    it('should proxy the views $el', function() {
      expect(this.fooBehavior.$el).to.equal(this.view.$el);
    });

    it('should proxy the views el', function() {
      expect(this.fooBehavior.el).to.equal(this.view.el);
    });
  });

  describe('behavior UI', function() {
    beforeEach(function() {
      var suite = this;
      this.onRenderStub     = this.sinon.stub();
      this.onBeforeShowStub = this.sinon.stub();
      this.onShowStub       = this.sinon.stub();
      this.onDestroyStub    = this.sinon.stub();
      this.onFooClickStub   = this.sinon.stub();
      this.onBarClickStub   = this.sinon.stub();

      this.behaviors = {
        foo: Marionette.Behavior.extend({
          ui: { foo: '.foo' },
          initialize: function() { suite.fooBehavior = this; },
          events: {
            'click @ui.foo': 'onFooClick',
            'click @ui.bar': 'onBarClick'
          },
          onRender     : this.onRenderStub,
          onBeforeShow : this.onBeforeShowStub,
          onShow       : this.onShowStub,
          onDestroy    : this.onDestroyStub,
          onFooClick   : this.onFooClickStub,
          onBarClick   : this.onBarClickStub
        })
      };
      Marionette.Behaviors.behaviorsLookup = this.behaviors;

      this.View = Marionette.ItemView.extend({
        template: _.template('<div class="foo"></div><div class="bar"></div>'),
        ui: { bar: '.bar' },
        behaviors: { foo: {} }
      });
    });

    describe('should call onShow when inside a CollectionView', function() {

      beforeEach(function() {
        this.CollectionView = Marionette.CollectionView.extend({
          childView: this.View
        });

        this.collection     = new Backbone.Collection([{}]);
        this.collectionView = new this.CollectionView({collection: this.collection});

        this.collectionView.render();
        this.collectionView.triggerMethod('show');
      });

      it('should call onShow when inside a CollectionView', function() {
        expect(this.onShowStub).to.have.been.called;
      });

      it('should call onShow when already shown and reset', function() {
        this.collection.reset([{id:1}, {id: 2}]);

        expect(this.onShowStub.callCount).to.equal(3);
      });

      it('should call onShow when a single model is added and the collectionView is already shown', function() {
        this.collection.add({id: 3});

        expect(this.onShowStub.callCount).to.equal(2);
      });
    });

    describe('within a view', function() {
      beforeEach(function() {
        this.view = new this.View();
        this.view.render();
      });

      it('should not clobber the event prototype', function() {
        expect(this.behaviors.foo.prototype.events).to.have.property('click @ui.bar', 'onBarClick');
      });

      it('should set the behavior UI element', function() {
        expect(this.onRenderStub).to.have.been.calledOnce;
      });

      describe("the $el", function() {
        beforeEach(function() {
          this.view.$el.find('.foo').click();
          this.view.$el.find('.bar').click();
        });

        it('should handle behavior ui click event', function() {
          expect(this.onFooClickStub).to.have.been.calledOnce.and.calledOn(this.fooBehavior);
        });

        it('should handle view ui click event', function() {
          expect(this.onBarClickStub).to.have.been.calledOnce.and.calledOn(this.fooBehavior);
        });
      });

      describe("the el", function() {
        beforeEach(function() {
          $(this.view.el).find('.foo').click();
          $(this.view.el).find('.bar').click();
        });

        it('should handle behavior ui click event', function() {
          expect(this.onFooClickStub).to.have.been.calledOnce.and.calledOn(this.fooBehavior);
        });

        it('should handle view ui click event', function() {
          expect(this.onBarClickStub).to.have.been.calledOnce.and.calledOn(this.fooBehavior);
        });
      });
    });

    describe('within a layout', function() {
      beforeEach(function() {
        this.LayoutView = Marionette.LayoutView.extend({
          template: _.template('<div class="baz"></div>'),
          regions: { bazRegion: '.baz' }
        });

        this.layoutView = new this.LayoutView();
        this.layoutView.render();
        this.layoutView.bazRegion.show(new this.View());
        this.layoutView.destroy();
      });

      it('should call onBeforeShow', function() {
        expect(this.onBeforeShowStub).to.have.been.calledOnce;
      });

      it('should call onShow', function() {
        expect(this.onShowStub).to.have.been.calledOnce;
      });

      it('should call onDestroy', function() {
        expect(this.onDestroyStub).to.have.been.calledOnce;
      });
    });
  });

  describe('showing a view in a layout', function() {
    beforeEach(function() {
      this.onShowStub = this.sinon.stub();
      this.onDestroyStub = this.sinon.stub();

      this.behaviors = {
        foo: Marionette.Behavior.extend({
          onShow    : this.onShowStub,
          onDestroy : this.onDestroyStub
        })
      };
      Marionette.Behaviors.behaviorsLookup = this.behaviors;

      this.View = Marionette.ItemView.extend({
        template: _.template('foo'),
        behaviors: { foo: {} }
      });

      this.region = new Backbone.Marionette.Region({ el: $('<div>') });
      this.view = new this.View();

      this.region.show(this.view);
      this.region.empty();
    });

    it('behavior onShow is called once', function() {
      expect(this.onShowStub).to.have.been.calledOnce;
    });

    it('behavior onClose is called once', function() {
      expect(this.onDestroyStub).to.have.been.calledOnce;
    });
  });

  describe('behavior instance events', function() {
    beforeEach(function() {
      var suite = this;
      this.listenToChangeStub = this.sinon.stub();
      this.onFooStub = this.sinon.stub();
      this.model = new Backbone.Model();

      this.FooBehavior = Marionette.Behavior.extend({
        initialize: function() {
          this.listenTo(suite.model, 'change', suite.listenToChangeStub);
          this.on('foo', suite.onFooStub);
        }
      });

      this.View = Marionette.View.extend({
        behaviors: { foo: { behaviorClass: this.FooBehavior } }
      });

      this.view = new this.View();
      this.view.destroy();
      this.model.set('bar', 'baz');
      this.view.triggerMethod('foo');
    });

    it('should unbind listenTo on destroy', function() {
      expect(this.listenToChangeStub).not.to.have.been.calledOnce;
    });

    it('should still be bound to "on" on destroy', function() {
      expect(this.onFooStub).to.have.been.calledOnce;
    });
  });

  describe('behavior model events', function() {
    beforeEach(function() {
      var suite = this;
      this.handleModelChangeStub     = this.sinon.stub();
      this.handleCollectionResetStub = this.sinon.stub();
      this.handleModelFooChangeStub  = this.sinon.stub();

      this.behaviors = {
        foo: Marionette.Behavior.extend({
          initialize: function() { suite.fooBehavior = this; },
          modelEvents: {
            'change': this.handleModelChangeStub,
            'change:foo': 'handleModelFooChange'
          },
          collectionEvents: {
            'reset': this.handleCollectionResetStub
          },
          handleModelFooChange: this.handleModelFooChangeStub
        })
      };
      Marionette.Behaviors.behaviorsLookup = this.behaviors;

      this.CollectionView = Marionette.CollectionView.extend({
        behaviors: { foo: {} }
      });
      this.ItemView = Marionette.ItemView.extend({
        behaviors: { foo: {} }
      });

      this.model = new Backbone.Model({ foo: 'bar' });
      this.collection = new Backbone.Collection([]);
    });

    it('should proxy model events', function() {
      this.view = new this.ItemView({ model: this.model });
      this.model.set('foo', 'baz');
      expect(this.handleModelChangeStub).to.have.been.calledOnce.and.calledOn(this.fooBehavior);
    });

    it('should proxy model events w/ string cbk', function() {
      this.view = new this.ItemView({ model: this.model });
      this.model.set('foo', 'baz');
      expect(this.handleModelFooChangeStub).to.have.been.calledOnce.and.calledOn(this.fooBehavior);
    });

    it('should proxy collection events', function() {
      this.view = new this.CollectionView({ collection: this.collection });
      this.collection.reset();
      expect(this.handleCollectionResetStub).to.have.been.calledOnce.and.calledOn(this.fooBehavior);
    });

    it('should unbind model events on view undelegate', function() {
      this.view = new this.ItemView({ model: this.model });
      this.view.undelegateEvents();
      this.model.set('foo', 'doge');
      expect(this.handleModelFooChangeStub).not.to.have.been.called;
    });

    it('should unbind collection events on view undelegate', function() {
      this.view = new this.CollectionView({ collection: this.collection });
      this.view.undelegateEvents();
      this.collection.reset();
      expect(this.handleCollectionResetStub).not.to.have.been.called;
    });
  });

  describe('behavior trigger calls', function() {
    beforeEach(function() {
      this.onRenderStub = this.sinon.stub();

      this.behaviors = {
        foo: Marionette.Behavior.extend({
          onRender: this.onRenderStub
        })
      };
      Marionette.Behaviors.behaviorsLookup = this.behaviors;

      this.View = Marionette.View.extend({
        behaviors: { foo: {} }
      });

      this.view = new this.View();
      this.view.triggerMethod('render');
    });

    it('should call onRender when a view is rendered', function() {
      expect(this.onRenderStub).to.have.been.calledOnce;
    });
  });

  describe('behavior triggerMethod calls', function() {
    beforeEach(function() {
      this.behaviors = {
        foo: Marionette.Behavior.extend({
          onFoo: function() {
            return "behavior foo";
          }
        })
      };
      Marionette.Behaviors.behaviorsLookup = this.behaviors;

      this.View = Marionette.View.extend({
        behaviors: { foo: {} },

        onFoo: function() {
          return "view foo";
        }
      });

      this.view = new this.View();
    });

    it('onFoo should return "foo"', function() {
      expect(this.view.triggerMethod('foo')).to.equal('view foo');
    });
  });

  describe('behavior is evented', function() {
    beforeEach(function() {
      this.listenToStub = this.sinon.stub();
      this.changeStub = this.sinon.stub();
      this.behavior = new Marionette.Behavior({}, {});
      this.model = new Backbone.Model();

      Marionette.bindEntityEvents(this.behavior, this.model, {
        'change': this.changeStub
      });

      this.behavior.listenTo(this.model, 'foo', this.listenToStub);
      this.model.trigger('foo');
      this.model.set('foo', 'bar');
    });

    it('should listenTo events', function() {
      expect(this.listenToStub).to.have.been.calledOnce;
    });

    it('should support bindEntityEvents', function() {
      expect(this.changeStub).to.have.been.calledOnce;
    });

    it('should execute in the specified context', function() {
      expect(this.listenToStub).to.have.been.calledOnce.and.calledOn(this.behavior);
    });
  });

  describe('behavior with behavior', function() {
    beforeEach(function() {
      var suite = this;

      this.initializeStub        = this.sinon.stub();
      this.viewOnRenderStub      = this.sinon.stub();
      this.fooClickStub          = this.sinon.stub();
      this.barOnRenderStub       = this.sinon.stub();
      this.barClickStub          = this.sinon.stub();
      this.barModelChangeStub    = this.sinon.stub();
      this.barCollectionSyncStub = this.sinon.stub();
      this.viewOnRenderStub      = this.sinon.stub();
      this.bazClickStub          = this.sinon.stub();

      this.behaviors = {
        foo: Marionette.Behavior.extend({
          initialize: function() { suite.fooBehavior = this; },
          behaviors: { bar: {} },
          ui: { foo: '.foo' },
          events: {
            'click @ui.foo': this.fooClickStub
          }
        }),
        bar: Marionette.Behavior.extend({
          initialize: function() {
            suite.initializeStub();
            suite.barBehavior = this;
          },
          onRender: this.barOnRenderStub,
          ui: { bar: '.bar' },
          events: {
            'click @ui.bar': this.barClickStub
          },
          modelEvents: {
            'change': this.barModelChangeStub
          },
          collectionEvents: {
            'sync': this.barCollectionSyncStub
          }
        })
      };

      Marionette.Behaviors.behaviorsLookup = this.behaviors;

      this.View = Marionette.CompositeView.extend({
        template: _.template('<div class="baz"></div><div class="foo"></div><div class="bar"></div>'),
        behaviors: { foo: {} },
        onRender: this.viewOnRenderStub,
        ui: { baz: '.baz' },
        events: {
          'click @ui.baz': this.bazClickStub,
        }
      });

      this.model      = new Backbone.Model();
      this.collection = new Backbone.Collection();

      this.view = new this.View({
        model      : this.model,
        collection : this.collection
      });

      this.sinon.spy(this.view, 'undelegateEvents');
    });

    it('should call initialize on grouped behaviors', function() {
      expect(this.initializeStub).to.have.been.calledOnce;
    });

    it('should set _behaviors', function() {
      expect(this.view._behaviors.length).to.be.equal(2);
    });

    it('should call onRender on grouped behaviors', function() {
      this.view.triggerMethod('render');
      expect(this.barOnRenderStub).to.have.been.calledOnce.and.calledOn(this.barBehavior);
    });

    it('should call onRender on the view', function() {
      this.view.triggerMethod('render');
      expect(this.viewOnRenderStub).to.have.been.calledOnce.and.calledOn(this.view);
    });

    it('should call undelegateEvents once', function() {
      this.view.undelegateEvents();
      expect(this.view.undelegateEvents).to.have.been.calledOnce;
    });

    it('should proxy modelEvents to grouped behaviors', function() {
      this.model.trigger('change');
      expect(this.barModelChangeStub).to.have.been.calledOnce.and.calledOn(this.barBehavior);
    });

    it('should proxy collectionEvents to grouped behaviors', function() {
      this.collection.trigger('sync');
      expect(this.barCollectionSyncStub).to.have.been.calledOnce.and.calledOn(this.barBehavior);
    });

    it('should proxy child behavior UI events to grouped behaviors', function() {
      this.view.render();
      this.barBehavior.ui.bar.click();
      expect(this.barClickStub).to.have.been.calledOnce.and.calledOn(this.barBehavior);
    });

    it('should proxy base behavior UI events to base behavior', function() {
      this.view.render();
      this.fooBehavior.ui.foo.click();
      expect(this.fooClickStub).to.have.been.calledOnce.and.calledOn(this.fooBehavior);
    });

    it('should proxy view UI events to view', function() {
      this.view.render();
      this.view.ui.baz.click();
      expect(this.bazClickStub).to.have.been.calledOnce.and.calledOn(this.view);
    });
  });

  describe('return values of wrapped methods', function() {
    beforeEach(function() {
      this.behaviors = { foo: Marionette.Behavior };
      Marionette.Behaviors.behaviorsLookup = this.behaviors;

      this.View = Marionette.View.extend({
        behaviors: { foo: {} }
      });

      this.view = new this.View();
    });

    it('destroy should return the view', function() {
      this.sinon.spy(this.view, 'destroy');
      this.view.destroy();
      expect(this.view.destroy).to.have.returned(this.view);
    });

    it('setElement should return the view', function() {
      this.sinon.spy(this.view, 'setElement');
      this.view.setElement(this.view.$el);
      expect(this.view.setElement).to.have.returned(this.view);
    });

    it('delegateEvents should return the view', function() {
      this.sinon.spy(this.view, 'delegateEvents');
      this.view.delegateEvents();
      expect(this.view.delegateEvents).to.have.returned(this.view);
    });

    it('undelegateEvents should return the view', function() {
      this.sinon.spy(this.view, 'undelegateEvents');
      this.view.undelegateEvents({});
      expect(this.view.undelegateEvents).to.have.returned(this.view);
    });
  });

  describe('.destroy', function() {
    beforeEach(function() {
      this.behavior = new Marionette.Behavior();
      this.sinon.spy(this.behavior, 'destroy');
      this.behavior.destroy();
    });

    it('should return the behavior', function() {
    });
  });
});
