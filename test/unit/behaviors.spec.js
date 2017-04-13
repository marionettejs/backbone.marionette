'use strict';

import Error from '../../src/error';
import Behavior from '../../src/behavior';
import Region from '../../src/region';
import View from '../../src/view';
import CollectionView from '../../src/collection-view';
import behaviorsLookup from '../../src/config/behaviors-lookup';

describe('Behaviors', function() {

  describe('behavior lookup', function() {
    it('should throw if behavior lookup is not defined', function() {
      expect(
        function() { behaviorsLookup(); }
      ).to.throw(
        Error,
        new Error({
          message: 'You must define where your behaviors are stored.',
          url: 'marionette.behaviors.md#behaviorslookup'
        })
      );
    });
  });

  describe('behavior parsing with a functional behavior lookup', function() {
    let FooBehavior;

    beforeEach(function() {
      FooBehavior = this.sinon.spy(Behavior);
    });

    describe('when one behavior', function() {
      beforeEach(function() {
        const FooView = View.extend({
          behaviors: [FooBehavior]
        });

        /* eslint-disable no-unused-vars */
        const fooView = new FooView();
      });

      it('should instantiate the behavior', function() {
        expect(FooBehavior).to.have.been.calledOnce;
      });
    });
  });

  describe('behavior parsing', function() {
    let behaviors;
    let FooView;

    beforeEach(function() {
      const Bar = Behavior.extend({});
      const Baz = Behavior.extend({});

      behaviors = {
        foo: this.sinon.spy(Marionette, 'Behavior'),
        bar: this.sinon.spy(Bar),
        baz: this.sinon.spy(Baz)
      };

      this.sinon.stub(Marionette.Behaviors, 'behaviorsLookup', function() {
        return behaviors;
      });
    });

    describe('when one behavior', function() {
      beforeEach(function() {
        FooView = View.extend({
          behaviors: {foo: {}}
        });
      });

      it('should instantiate the behavior', function() {
        /* eslint-disable no-unused-vars */
        const fooView = new FooView();

        expect(behaviors.foo).to.have.been.calledOnce;
      });
    });

    describe('when multiple behaviors', function() {
      beforeEach(function() {
        FooView = View.extend({
          behaviors: {foo: {}}
        });
      });

      it('should instantiate the behavior', function() {
        /* eslint-disable no-unused-vars */
        const fooView = new FooView();

        expect(behaviors.foo).to.have.been.calledOnce;
      });
    });

    describe('when functional behavior', function() {
      let behaviorsStub;

      beforeEach(function() {
        behaviorsStub = this.sinon.stub().returns({
          foo: {behaviorClass: behaviors.foo}
        });

        FooView = View.extend({
          behaviors: behaviorsStub
        });
      });

      it('should instantiate the behavior', function() {
        /* eslint-disable no-unused-vars */
        const fooView = new FooView();

        expect(behaviors.foo).to.have.been.calledOnce;
      });

      it('should call the behaviors method with the view context', function() {
        const fooView = new FooView();

        expect(behaviorsStub).to.have.been.calledOnce.and.calledOn(fooView);
      });
    });

    describe('when behavior class is provided', function() {
      beforeEach(function() {
        FooView = View.extend({
          behaviors: {foo: {behaviorClass: behaviors.foo}}
        });
      });

      it('should instantiate the behavior', function() {
        /* eslint-disable no-unused-vars */
        const fooView = new FooView();

        expect(behaviors.foo).to.have.been.calledOnce;
      });
    });

    describe('when behaviors are specified as an array', function() {
      beforeEach(function() {
        FooView = View.extend({
          behaviors: [behaviors.foo, behaviors.bar, {
            behaviorClass: behaviors.baz
          }]
        });
      });

      it('should instantiate behaviors passed directly as a class', function() {
        /* eslint-disable no-unused-vars */
        const fooView = new FooView();

        expect(behaviors.foo).to.have.been.calledOnce;
        expect(behaviors.bar).to.have.been.calledOnce;
      });

      it('should instantiate behaviors passed with behaviorClass', function() {
        /* eslint-disable no-unused-vars */
        const fooView = new FooView();

        expect(behaviors.baz).to.have.been.calledOnce;
      });
    });
  });

  describe('behavior initialize', function() {
    let behaviors;
    let behaviorOptions;
    let initializeStub;
    let FooView;

    beforeEach(function() {
      behaviorOptions = {foo: 'bar'};
      initializeStub = this.sinon.stub();

      behaviors = {
        foo: Behavior.extend({
          initialize: initializeStub,
          defaults: {baz: true}
        })
      };

      this.sinon.stub(Marionette.Behaviors, 'behaviorsLookup', function() {
        return behaviors;
      });

      FooView = View.extend({
        behaviors: {foo: behaviorOptions}
      });
    });

    it('should have a cidPrefix', function() {
      /* eslint-disable no-unused-vars */
      const fooView = new FooView();
      const fooBehavior = new behaviors.foo();

      expect(fooBehavior.cidPrefix).to.equal('mnb');
    });

    it('should set defaults on the options', function() {
      /* eslint-disable no-unused-vars */
      const fooView = new FooView();
      const fooBehavior = new behaviors.foo();

      expect(fooBehavior.getOption('baz')).to.be.true;
    });

    describe('when DEV_MODE is on', function() {
      beforeEach(function() {
        Marionette.DEV_MODE = true;
        this.sinon.spy(Marionette.deprecate, '_warn');
        this.sinon.stub(Marionette.deprecate, '_console', {
          warn: this.sinon.stub()
        });
        Marionette.deprecate._cache = {};
      });

      it('should call Marionette.deprecate', function() {
        /* eslint-disable no-unused-vars */
        const fooView = new FooView();
        const fooBehavior = new behaviors.foo();

        expect(Marionette.deprecate._warn).to.be.calledWith('Deprecation warning: Behavior defaults are deprecated. For similar functionality set options on the Behavior class.');
      });

      afterEach(function() {
        Marionette.DEV_MODE = false;
      });
    });

    it('should have a cid', function() {
      /* eslint-disable no-unused-vars */
      const fooView = new FooView();
      const fooBehavior = new behaviors.foo();

      expect(fooBehavior.cid).to.exist;
    });

    it('should call initialize when a behavior is created', function() {
      const fooView = new FooView();

      expect(initializeStub).to.have.been.calledOnce.and.calledWith(behaviorOptions, fooView);
    });
  });

  describe('behavior initialize from constructor args', function() {
    let fooStub;
    let barStub;
    let FooView;

    beforeEach(function() {
      fooStub = this.sinon.stub();
      barStub = this.sinon.stub();

      const behaviorOptions = {foo: 'bar'};
      const behaviors = {
        foo: Behavior.extend({initialize: fooStub}),
        bar: Behavior.extend({initialize: barStub})
      };

      this.sinon.stub(Marionette.Behaviors, 'behaviorsLookup', function() {
        return behaviors;
      });

      FooView = Marionette.View.extend({
        behaviors: {foo: behaviorOptions}
      });
    });

    it('should call initialize when a behavior is created', function() {
      /* eslint-disable no-unused-vars */
      const fooView = new FooView({behaviors: {bar: {}}});

      expect(barStub).to.have.been.calledOnce;
      expect(fooStub).not.to.have.been.called;
    });
  });

  describe('behavior events', function() {
    let fooClickStub;
    let barClickStub;
    let bazClickStub;
    let viewClickStub;
    let behaviors;
    let FooView;
    let fooView;

    beforeEach(function() {
      fooClickStub = this.sinon.stub();
      barClickStub = this.sinon.stub();
      bazClickStub = this.sinon.stub();
      viewClickStub = this.sinon.stub();

      behaviors = {
        foo: Marionette.Behavior.extend({
          events: {
            'click': fooClickStub
          }
        }),
        bar: Marionette.Behavior.extend({
          events: {
            'click': barClickStub
          }
        }),
        baz: Marionette.Behavior.extend({
          events: {
            'click': 'handleClick'
          },
          handleClick: bazClickStub
        })
      };

      FooView = Marionette.View.extend({
        events: {
          'click': viewClickStub
        },
        behaviors: {
          foo: {},
          bar: {},
          baz: {}
        }
      });

      this.sinon.stub(Marionette.Behaviors, 'behaviorsLookup', function() {
        return behaviors;
      });

      fooView = new FooView();
    });

    it('should call first behaviors event', function() {
      fooView.$el.click();

      expect(fooClickStub).to.have.been.calledOnce.and.calledOn(this.sinon.match.instanceOf(behaviors.foo));
    });

    it('should call second behaviors event', function() {
      fooView.$el.click();

      expect(barClickStub).to.have.been.calledOnce.and.calledOn(this.sinon.match.instanceOf(behaviors.bar));
    });

    it('should call third behaviors event', function() {
      fooView.$el.click();

      expect(bazClickStub).to.have.been.calledOnce.and.calledOn(this.sinon.match.instanceOf(behaviors.baz));
    });

    it('should call the view click handler', function() {
      fooView.$el.click();

      expect(viewClickStub).to.have.been.calledOnce.and.calledOn(fooView);
    });
  });

  describe('behavior triggers', function() {
    let onClickFooStub;
    let triggerMethodSpy;
    let behaviors;
    let fooView;

    beforeEach(function() {
      onClickFooStub = this.sinon.stub();

      behaviors = {
        foo: Behavior.extend({
          triggers: {'click': 'click:foo'},
          onClickFoo: onClickFooStub
        })
      };

      const FooView = Marionette.View.extend({
        behaviors: {foo: {}}
      });

      this.sinon.stub(Marionette.Behaviors, 'behaviorsLookup', function() {
        return behaviors;
      });

      const fooModel = new Backbone.Model();
      const fooCollection = new Backbone.Collection();

      fooView = new FooView({
        model: fooModel,
        collection: fooCollection
      });

      triggerMethodSpy = this.sinon.spy();

      fooView.on('click:foo', triggerMethodSpy);
    });

    it('should call `triggerMethod` with the triggered event', function() {
      fooView.$el.click();

      expect(triggerMethodSpy)
        .to.have.been.calledOnce
        .and.calledOn(fooView);
    });

    it('should call the triggered method', function() {
      fooView.$el.click();

      expect(onClickFooStub)
        .to.have.been.calledOnce
        .and.have.been.calledOn(this.sinon.match.instanceOf(behaviors.foo));
    });
  });

  describe('behavior $el', function() {
    let fooBehavior;
    let fooView;

    beforeEach(function() {
      const behaviors = {
        foo: Marionette.Behavior.extend({
          initialize: function() {
            fooBehavior = this;
          }
        })
      };

      this.sinon.stub(Marionette.Behaviors, 'behaviorsLookup', function() {
        return behaviors;
      });

      const FooView = Marionette.View.extend({
        behaviors: {foo: {}}
      });

      fooView = new FooView();
    });

    it('should proxy the views $el', function() {
      fooView.setElement(document.createElement('bar'));

      expect(fooBehavior.$el).to.equal(fooView.$el);
    });

    it('should proxy the views el', function() {
      fooView.setElement(document.createElement('bar'));

      expect(fooBehavior.el).to.equal(fooView.el);
    });
  });

  describe('behavior UI', function() {
    let fooBehavior;
    let onRenderStub;
    let onBeforeAttachStub;
    let onAttachStub;
    let onDestroyStub;
    let onFooClickStub;
    let onBarClickStub;
    let behaviors;
    let FooView;

    beforeEach(function() {
      onRenderStub = this.sinon.stub();
      onBeforeAttachStub = this.sinon.stub();
      onAttachStub = this.sinon.stub();
      onDestroyStub = this.sinon.stub();
      onFooClickStub = this.sinon.stub();
      onBarClickStub = this.sinon.stub();

      behaviors = {
        foo: Behavior.extend({
          ui: {foo: '.foo'},
          initialize: function() {fooBehavior = this;},
          events: {
            'click @ui.foo': 'onFooClick',
            'click @ui.bar': 'onBarClick'
          },

          testViewUI: function() { this.ui.bar.trigger('test'); },
          testBehaviorUI: function() { this.ui.foo.trigger('test'); },
          onRender: onRenderStub,
          onBeforeAttach: onBeforeAttachStub,
          onAttach: onAttachStub,
          onDestroy: onDestroyStub,
          onFooClick: onFooClickStub,
          onBarClick: onBarClickStub
        })
      };
      this.sinon.stub(Marionette.Behaviors, 'behaviorsLookup', function() {
        return behaviors;
      });

      FooView = View.extend({
        template: _.template('<div class="foo"></div><div class="bar"></div>'),
        ui: {bar: '.bar'},
        behaviors: {foo: {}}
      });
    });

    describe('should call onAttach when inside a CollectionView', function() {
      let region;
      let fooCollection;
      let fooCollectionView;

      beforeEach(function() {
        const FooCollectionView = CollectionView.extend({
          childView: FooView
        });

        fooCollection = new Backbone.Collection([{}]);
        fooCollectionView = new FooCollectionView({collection: fooCollection});

        this.setFixtures('<div id="region"></div>');

        region = new Region({
          el: '#region'
        });
      });

      it('should call onAttach when inside a CollectionView', function() {
        region.show(fooCollectionView);

        expect(onAttachStub).to.have.been.called;
      });

      it('should call onAttach when already shown and reset', function() {
        region.show(fooCollectionView);
        fooCollection.reset([{id: 1}, {id: 2}]);

        expect(onAttachStub.callCount).to.equal(3);
      });

      it('should call onAttach when a single model is added and the collectionView is already shown', function() {
        region.show(fooCollectionView);
        fooCollection.add({id: 3});

        expect(onAttachStub.callCount).to.equal(2);
      });
    });

    describe('view should be able to override predefined behavior ui', function() {
      let barView;

      beforeEach(function() {
        const BarView = View.extend({
          template: _.template('<div class="zip"></div><div class="bar"></div>'),
          ui: {
            bar: '.bar',
            foo: '.zip'  // override foo selector behavior
          },
          behaviors: {
            foo: {}
          }
        });

        barView = new BarView();
        barView.render();
      });

      it('should handle behavior ui click event', function() {
        barView.$el.find('.zip').click();

        expect(onFooClickStub).to.have.been.calledOnce.and.calledOn(fooBehavior);
      });

      it('should handle view ui click event', function() {
        barView.$el.find('.bar').click();

        expect(onBarClickStub).to.have.been.calledOnce.and.calledOn(fooBehavior);
      });
    });

    describe('within a view', function() {
      let fooView;

      it('should not clobber the event prototype', function() {
        fooView = new FooView();

        expect(behaviors.foo.prototype.events).to.have.property('click @ui.bar', 'onBarClick');
      });

      it('should handle click events after calling delegateEvents', function() {
        fooView = new FooView();
        fooView.render();
        fooView.delegateEvents();

        expect(fooBehavior.ui.foo.click.bind(fooView.ui.bar)).to.not.throw(Error);
        expect(fooView.ui.bar.click.bind(fooView.ui.bar)).to.not.throw(Error);
      });

      it('should set the behavior UI element', function() {
        fooView = new FooView();
        fooView.render();

        expect(onRenderStub).to.have.been.calledOnce;
      });

      it('should make the view\'s ui hash available to callbacks', function() {
        fooView = new FooView();

        expect(fooBehavior.testViewUI.bind(fooBehavior)).to.not.throw(Error);
      });

      it('should make the behavior\'s ui hash available to callbacks', function() {
        fooView = new FooView();

        expect(fooBehavior.testBehaviorUI.bind(fooBehavior)).to.not.throw(Error);
      });

      describe('the $el', function() {
        beforeEach(function() {
          fooView = new FooView();
          fooView.render();
        });

        it('should handle behavior ui click event', function() {
          fooView.$el.find('.foo').click();

          expect(onFooClickStub).to.have.been.calledOnce.and.calledOn(fooBehavior);
        });

        it('should handle view ui click event', function() {
          fooView.$el.find('.bar').click();

          expect(onBarClickStub).to.have.been.calledOnce.and.calledOn(fooBehavior);
        });

        it('has a getUI method which returns the selector', function() {
          expect(fooBehavior.getUI('foo')).to.have.length(1);
        });
      });

      describe('the el', function() {
        beforeEach(function() {
          fooView = new FooView();
          fooView.render();
        });

        it('should handle behavior ui click event', function() {
          $(fooView.el).find('.foo').click();

          expect(onFooClickStub).to.have.been.calledOnce.and.calledOn(fooBehavior);
        });

        it('should handle view ui click event', function() {
          $(fooView.el).find('.bar').click();

          expect(onBarClickStub).to.have.been.calledOnce.and.calledOn(fooBehavior);
        });
      });
    });

    describe('within a layout', function() {
      let barView;

      beforeEach(function() {
        this.setFixtures('<div id="layout"></div>');

        const BarView = View.extend({
          el: '#layout',
          template: _.template('<div class="baz"></div>'),
          regions: {bazRegion: '.baz'}
        });

        barView = new BarView();
        barView.render();
      });

      it('should call onBeforeAttach', function() {
        barView.getRegion('bazRegion').show(new FooView());

        expect(onBeforeAttachStub).to.have.been.calledOnce;
      });

      it('should call onAttach', function() {
        barView.getRegion('bazRegion').show(new FooView());

        expect(onAttachStub).to.have.been.calledOnce;
      });

      it('should call onDestroy', function() {
        barView.getRegion('bazRegion').show(new FooView());
        barView.destroy();

        expect(onDestroyStub).to.have.been.calledOnce;
      });
    });
  });

  describe('showing a view in a layout', function() {
    let onAttachStub;
    let onDestroyStub;
    let fooView;
    let region;

    beforeEach(function() {
      onAttachStub = this.sinon.stub();
      onDestroyStub = this.sinon.stub();

      const behaviors = {
        foo: Behavior.extend({
          onAttach: onAttachStub,
          onDestroy: onDestroyStub
        })
      };

      this.sinon.stub(Marionette.Behaviors, 'behaviorsLookup', function() {
        return behaviors;
      });

      let FooView = View.extend({
        template: _.template('foo'),
        behaviors: {foo: {}}
      });

      this.setFixtures('<div id="region"></div>');

      region = new Region({el: '#region'});
      fooView = new FooView();
    });

    it('behavior onAttach is called once', function() {
      region.show(fooView);

      expect(onAttachStub).to.have.been.calledOnce;
    });

    it('behavior onClose is called once', function() {
      region.show(fooView);
      region.empty();

      expect(onDestroyStub).to.have.been.calledOnce;
    });
  });

  describe('behavior instance events', function() {
    let listenToChangeStub;
    let onFooStub;
    let fooModel;
    let fooView;

    beforeEach(function() {
      fooModel = new Backbone.Model();

      listenToChangeStub = this.sinon.stub();
      onFooStub = this.sinon.stub();

      const FooBehavior = Behavior.extend({
        initialize: function() {
          this.listenTo(fooModel, 'change', listenToChangeStub);
          this.on('foo', onFooStub);
        }
      });

      const FooView = View.extend({
        behaviors: {
          foo: {
            behaviorClass: FooBehavior
          }
        }
      });

      fooView = new FooView();
      fooView.destroy();
    });

    it('should unbind listenTo on destroy', function() {
      fooModel.set('bar', 'baz');

      expect(listenToChangeStub).not.to.have.been.calledOnce;
    });

    it('should still be bound to "on" on destroy', function() {
      fooView.triggerMethod('foo');

      expect(onFooStub).to.have.been.calledOnce;
    });
  });

  describe('behavior model events', function() {
    let handleModelChangeStub;
    let handleCollectionResetStub;
    let handleModelFooChangeStub;
    let fooBehavior;
    let FooView;
    let FooCollectionView;
    let fooModel;
    let fooCollection;

    beforeEach(function() {
      handleModelChangeStub = this.sinon.stub();
      handleCollectionResetStub = this.sinon.stub();
      handleModelFooChangeStub = this.sinon.stub();

      const behaviors = {
        foo: Marionette.Behavior.extend({
          initialize: function() {
            fooBehavior = this;
          },
          modelEvents: {
            'change': handleModelChangeStub,
            'change:foo': 'handleModelFooChange'
          },
          collectionEvents: {
            'reset': handleCollectionResetStub
          },
          handleModelFooChange: handleModelFooChangeStub
        })
      };

      this.sinon.stub(Marionette.Behaviors, 'behaviorsLookup', function() {
        return behaviors;
      });

      FooCollectionView = CollectionView.extend({
        behaviors: {foo: {}}
      });
      FooView = View.extend({
        behaviors: {foo: {}}
      });

      fooModel = new Backbone.Model({foo: 'bar'});
      fooCollection = new Backbone.Collection([]);
    });

    it('should proxy model events', function() {
      /* eslint-disable no-unused-vars */
      const fooView = new FooView({model: fooModel});
      fooModel.set('foo', 'baz');

      expect(handleModelChangeStub).to.have.been.calledOnce.and.calledOn(fooBehavior);
    });

    it('should proxy model events w/ string cbk', function() {
      /* eslint-disable no-unused-vars */
      const fooView = new FooView({model: fooModel});
      fooModel.set('foo', 'baz');

      expect(handleModelFooChangeStub).to.have.been.calledOnce.and.calledOn(fooBehavior);
    });

    it('should proxy collection events', function() {
      /* eslint-disable no-unused-vars */
      const fooCollectionView = new FooCollectionView({collection: fooCollection});
      fooCollection.reset();

      expect(handleCollectionResetStub).to.have.been.calledOnce.and.calledOn(fooBehavior);
    });

    it('should unbind model events on view undelegateEntityEvents', function() {
      const fooView = new FooView({model: fooModel});
      fooView.undelegateEntityEvents();
      fooModel.set('foo', 'doge');

      expect(handleModelFooChangeStub).not.to.have.been.called;
    });

    it('should unbind collection events on view undelegateEntityEvents', function() {
      const fooCollectionView = new FooCollectionView({collection: fooCollection});
      fooCollectionView.undelegateEntityEvents();
      fooCollection.reset();

      expect(handleCollectionResetStub).not.to.have.been.called;
    });
  });

  describe('behavior trigger calls', function() {
    let onRenderStub;
    let fooView;

    beforeEach(function() {
      onRenderStub = this.sinon.stub();

      const behaviors = {
        foo: Marionette.Behavior.extend({
          onRender: onRenderStub
        })
      };

      this.sinon.stub(Marionette.Behaviors, 'behaviorsLookup', function() {
        return behaviors;
      });

      const FooView = View.extend({
        behaviors: {foo: {}}
      });

      fooView = new FooView();
    });

    it('should call onRender when a view is rendered', function() {
      fooView.triggerMethod('render');

      expect(onRenderStub).to.have.been.calledOnce;
    });
  });

  describe('behavior triggerMethod calls', function() {
    let fooView;

    beforeEach(function() {
      const behaviors = {
        foo: Marionette.Behavior.extend({
          onFoo: function() {
            return 'behavior foo';
          }
        })
      };

      this.sinon.stub(Marionette.Behaviors, 'behaviorsLookup', function() {
        return behaviors;
      });

      const FooView = View.extend({
        behaviors: {foo: {}},

        onFoo: function() {
          return 'view foo';
        }
      });

      fooView = new FooView();
    });

    it('onFoo should return "foo"', function() {
      expect(fooView.triggerMethod('foo')).to.equal('view foo');
    });
  });

  describe('behavior is evented', function() {
    let listenToStub;
    let changeStub;
    let behavior;
    let fooModel;

    beforeEach(function() {
      listenToStub = this.sinon.stub();
      changeStub = this.sinon.stub();

      behavior = new Marionette.Behavior({}, {});
      fooModel = new Backbone.Model();

      Marionette.bindEvents(behavior, fooModel, {
        'change': changeStub
      });

      behavior.listenTo(fooModel, 'foo', listenToStub);
    });

    it('should listenTo events', function() {
      fooModel.trigger('foo');

      expect(listenToStub).to.have.been.calledOnce;
    });

    it('should support bindEntityEvents', function() {
      fooModel.set('foo', 'bar');

      expect(changeStub).to.have.been.calledOnce;
    });

    it('should execute in the specified context', function() {
      fooModel.trigger('foo');

      expect(listenToStub).to.have.been.calledOnce.and.calledOn(behavior);
    });
  });

  describe('behavior with behavior', function() {
    let initializeStub;
    let fooClickStub;
    let barOnRenderStub;
    let barClickStub;
    let barModelChangeStub;
    let barCollectionSyncStub;
    let viewOnRenderStub;
    let bazClickStub;
    let fooBehavior;
    let barBehavior;
    let FooView;
    let fooView;
    let fooModel;
    let fooCollection;

    beforeEach(function() {
      initializeStub = this.sinon.stub();
      viewOnRenderStub = this.sinon.stub();
      fooClickStub = this.sinon.stub();
      barOnRenderStub = this.sinon.stub();
      barClickStub = this.sinon.stub();
      barModelChangeStub = this.sinon.stub();
      barCollectionSyncStub = this.sinon.stub();
      bazClickStub = this.sinon.stub();

      const behaviors = {
        foo: Marionette.Behavior.extend({
          initialize: function() {
            fooBehavior = this;
          },
          behaviors: {
            bar: {}
          },
          ui: {
            foo: '.foo'
          },
          events: {
            'click @ui.foo': fooClickStub
          }
        }),
        bar: Marionette.Behavior.extend({
          initialize: function() {
            initializeStub();
            barBehavior = this;
          },
          onRender: barOnRenderStub,
          ui: {
            bar: '.bar'
          },
          events: {
            'click @ui.bar': barClickStub
          },
          modelEvents: {
            'change': barModelChangeStub
          },
          collectionEvents: {
            'sync': barCollectionSyncStub
          }
        })
      };

      this.sinon.stub(Marionette.Behaviors, 'behaviorsLookup', function() {
        return behaviors;
      });

      FooView = View.extend({
        template: _.template('<div class="baz"></div><div class="foo"></div><div class="bar"></div>'),
        behaviors: {foo: {}},
        onRender: viewOnRenderStub,
        ui: {baz: '.baz'},
        events: {
          'click @ui.baz': bazClickStub,
        }
      });

      fooModel = new Backbone.Model();
      fooCollection = new Backbone.Collection();

      fooView = new FooView({
        model: fooModel,
        collection: fooCollection
      });

      this.sinon.spy(fooView, 'undelegateEvents');
      this.sinon.spy(fooView, 'undelegateEntityEvents');
    });

    it('should call initialize on grouped behaviors', function() {
      expect(initializeStub).to.have.been.calledOnce;
    });

    it('should call onRender on grouped behaviors', function() {
      fooView.triggerMethod('render');

      expect(barOnRenderStub).to.have.been.calledOnce.and.calledOn(barBehavior);
    });

    it('should call onRender on the view', function() {
      fooView.triggerMethod('render');

      expect(viewOnRenderStub).to.have.been.calledOnce.and.calledOn(fooView);
    });

    it('should call undelegateEvents once', function() {
      fooView.undelegateEvents();

      expect(fooView.undelegateEvents).to.have.been.calledOnce;
    });

    it('should call undelegateEntityEvents once', function() {
      fooView.undelegateEntityEvents();

      expect(fooView.undelegateEntityEvents).to.have.been.calledOnce;
    });

    it('should proxy modelEvents to grouped behaviors', function() {
      fooModel.trigger('change');

      expect(barModelChangeStub).to.have.been.calledOnce.and.calledOn(barBehavior);
    });

    it('should proxy collectionEvents to grouped behaviors', function() {
      fooCollection.trigger('sync');

      expect(barCollectionSyncStub).to.have.been.calledOnce.and.calledOn(barBehavior);
    });

    it('should proxy child behavior UI events to grouped behaviors', function() {
      fooView.render();
      barBehavior.ui.bar.click();

      expect(barClickStub).to.have.been.calledOnce.and.calledOn(barBehavior);
    });

    it('should proxy base behavior UI events to base behavior', function() {
      fooView.render();
      fooBehavior.ui.foo.click();

      expect(fooClickStub).to.have.been.calledOnce.and.calledOn(fooBehavior);
    });

    it('should proxy view UI events to view', function() {
      fooView.render();
      fooView.ui.baz.click();

      expect(bazClickStub).to.have.been.calledOnce.and.calledOn(fooView);
    });
  });

  describe('return values of wrapped methods', function() {
    let fooView;

    beforeEach(function() {
      const behaviors = {foo: Behavior};

      this.sinon.stub(Marionette.Behaviors, 'behaviorsLookup', function() {
        return behaviors;
      });

      const FooView = View.extend({
        behaviors: {foo: {}}
      });

      fooView = new FooView();
    });

    it('destroy should return the view', function() {
      this.sinon.spy(fooView, 'destroy');
      fooView.destroy();

      expect(fooView.destroy).to.have.returned(fooView);
    });

    it('setElement should return the view', function() {
      this.sinon.spy(fooView, 'setElement');
      fooView.setElement(fooView.$el);

      expect(fooView.setElement).to.have.returned(fooView);
    });

    it('delegateEvents should return the view', function() {
      this.sinon.spy(fooView, 'delegateEvents');
      fooView.delegateEvents();

      expect(fooView.delegateEvents).to.have.returned(fooView);
    });

    it('undelegateEvents should return the view', function() {
      this.sinon.spy(fooView, 'undelegateEvents');
      fooView.undelegateEvents({});

      expect(fooView.undelegateEvents).to.have.returned(fooView);
    });

    it('delegateEntityEvents should return the view', function() {
      this.sinon.spy(fooView, 'delegateEntityEvents');
      fooView.delegateEntityEvents();

      expect(fooView.delegateEntityEvents).to.have.returned(fooView);
    });

    it('undelegateEntityEvents should return the view', function() {
      this.sinon.spy(fooView, 'undelegateEntityEvents');
      fooView.undelegateEntityEvents({});

      expect(fooView.undelegateEntityEvents).to.have.returned(fooView);
    });
  });

  describe('.destroy', function() {
    let behavior;

    beforeEach(function() {
      behavior = new Behavior({}, new View());
      this.sinon.spy(behavior, 'destroy');
    });

    it('should return the behavior', function() {
      behavior.destroy();

      expect(behavior.destroy).to.have.returned(behavior);
    });
  });
});
