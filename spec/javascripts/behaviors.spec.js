describe('Behaviors', function() {
  'use strict';
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('behavior lookup', function() {
    it('should throw if behavior lookup is not defined', function() {
      expect(Marionette.Behaviors.behaviorsLookup).to.throw;
    });
  });

  describe('behavior parsing with a functional behavior lookup', function() {
    beforeEach(function() {
      var suite = this;

      this.Tooltip = this.sinon.spy();
      this.Obj = {
        Tooltip: this.Tooltip
      };

      Marionette.Behaviors.behaviorsLookup = function() {
        return suite.Obj;
      };
    });

    describe('when one behavior', function() {
      beforeEach(function() {
        this.View = Marionette.ItemView.extend({
          behaviors: {
            Tooltip: {
              position: 'top'
            }
          }
        });

        this.view = new this.View();
      });

      it('should instantiate the tooltip behavior', function() {
        expect(this.Obj.Tooltip).to.have.been.called;
      });
    });
  });

  describe('behavior parsing', function() {
    beforeEach(function() {
      this.Tooltip = this.sinon.spy();
      this.Obj = {
        Tooltip: this.Tooltip
      };
      Marionette.Behaviors.behaviorsLookup = this.Obj;
    });

    describe('when one behavior', function() {
      beforeEach(function() {
        this.View = Marionette.ItemView.extend({
          behaviors: {
            Tooltip: {
              position: 'top'
            }
          }
        });

        this.view = new this.View();
      });

      it('should instantiate the tooltip behavior', function() {
        expect(this.Obj.Tooltip).to.have.been.called;
      });
    });

    describe('when multiple behaviors', function() {
      beforeEach(function() {
        this.View = Marionette.ItemView.extend({
          behaviors: {
            Tooltip: {
              position: 'top'
            }
          }
        });

        this.view = new this.View();
      });

      it('should instantiate the tooltip behavior', function() {
        expect(this.Obj.Tooltip).to.have.been.called;
      });
    });

    describe('when functional behavior', function() {
      beforeEach(function() {
        var suite = this;

        this.View = Marionette.ItemView.extend({
          behaviors: function() {
            suite.context = this;
            return {
              Tooltip: {
                behaviorClass: this.Tooltip,
                position: 'top'
              }
            };
          }
        });

        this.view = new this.View();
      });

      it('should instantiate the tooltip behavior', function() {
        expect(this.Obj.Tooltip).to.have.been.called;
      });

      it('should call the behaviors method with the view context', function() {
        expect(this.context).to.equal(this.view);
      });
    });

    describe('when behavior class is provided', function() {
      beforeEach(function() {
        this.View = Marionette.ItemView.extend({
          behaviors: {
            Tooltip: {
              behaviorClass: this.Tooltip,
              position: 'top'
            }
          }
        });

        this.view = new this.View();
      });

      it('should instantiate the tooltip behavior', function() {
        expect(this.Obj.Tooltip).to.have.been.called;
      });
    });
  });

  describe('behavior initialize', function() {
    beforeEach(function() {
      var suite = this;

      this.Behavior = Marionette.Behavior.extend({
        initialize: this.sinon.spy()
      });

      this.Obj = {
        Tooltip: Marionette.Behavior.extend({
          initialize: function(options, view) {
            suite.behaviorOptions = options;
            suite.viewOptions = view.options;
          }
        })
      };

      this.View = Marionette.ItemView.extend({
        template: _.template(''),
        behaviors: {
          Tooltip: {
            position: 'left'
          }
        }
      });

      Marionette.Behaviors.behaviorsLookup = this.Obj;
    });

    it('should call initialize when a behavior is created', function() {
      var b = new this.Behavior({}, {});
      expect(b.initialize).to.have.been.called;
    });

    it('should call initialize when a behavior is created', function() {
      var view = new this.View({
        words: 'big'
      });

      expect(this.viewOptions).to.equal(view.options);
      expect(this.behaviorOptions).to.equal(this.View.prototype.behaviors.Tooltip);
    });
  });

  describe('behavior events', function() {
    beforeEach(function() {
      this.spy = this.sinon.spy();
      this.spy2 = this.sinon.spy();
      this.spy3 = this.sinon.spy();
      this.viewSpy = this.sinon.spy();

      this.Obj = {
        Tooltip: Marionette.Behavior.extend({
          events: {
            'click': this.spy
          }
        }),
        DropDown: Marionette.Behavior.extend({
          events: {
            'click': this.spy2
          }
        }),
        Hover: Marionette.Behavior.extend({
          events: {
            'click': 'onClick'
          },

          onClick: this.spy3
        })
      };

      this.View = Marionette.ItemView.extend({
        template: _.template(''),
        events: {
          'click': this.viewSpy
        },
        behaviors: {
          Tooltip: {},
          DropDown: {},
          Hover: {}
        }
      });

      Marionette.Behaviors.behaviorsLookup = this.Obj;
      this.view = new this.View();
      this.view.render();
      this.view.$el.click();
    });

    it('should call first behaviors event', function() {
      expect(this.spy).to.have.been.calledOnce;
      expect(this.spy).to.have.been.calledOn(sinon.match.instanceOf(Marionette.Behavior));
    });

    it('should call second behaviors event', function() {
      expect(this.spy2).to.have.been.calledOn(sinon.match.instanceOf(Marionette.Behavior));
      expect(this.spy2).to.have.been.calledOnce;
    });

    it('should call third behaviors event', function() {
      expect(this.spy3).to.have.been.calledOnce;
      expect(this.spy3).to.have.been.calledOn(sinon.match.instanceOf(Marionette.Behavior));
    });

    it('should call the view click handler', function() {
      expect(this.viewSpy).to.have.been.calledOnce;
      expect(this.viewSpy).to.have.been.calledOn(sinon.match.instanceOf(Marionette.View));
    });
  });

  describe('behavior $el', function() {
    beforeEach(function() {
      var suite = this;

      this.hold = {};
      this.hold.test = Marionette.Behavior.extend({
        initialize: function() {
          suite.behavior = this;
        }
      });

      this.View = Marionette.ItemView.extend({
        template: _.template(''),
        behaviors: {
          test: {}
        }
      });

      Marionette.Behaviors.behaviorsLookup = this.hold;

      this.view = new this.View();
      this.view.setElement(document.createElement('doge'));
    });

    it('should proxy the views $el', function() {
      expect(this.behavior.$el).to.equal(this.view.$el);
    });
  });

  describe('behavior UI', function() {
    beforeEach(function() {
      var suite = this;
      this.hold = {};
      this.spy = this.sinon.spy();
      this.onShowSpy = this.sinon.spy();
      this.onDestroySpy = this.sinon.spy();
      this.onDogeClickSpy = this.sinon.spy();
      this.onCoinsClickSpy = this.sinon.spy();

      this.hold.test = Marionette.Behavior.extend({
        ui: {
          doge: '.doge'
        },
        initialize: function() {
          suite.testBehavior = this;
        },
        events: {
          'click @ui.doge': 'onDogeClick',
          'click @ui.coins': 'onCoinsClick'
        },
        onRender: function() {
          suite.spy(this.ui.doge.length);
        },
        onShow: this.onShowSpy,
        onDestroy: this.onDestroySpy,
        onDogeClick: this.onDogeClickSpy,
        onCoinsClick: this.onCoinsClickSpy
      });

      Marionette.Behaviors.behaviorsLookup = this.hold;

      this.View = Marionette.ItemView.extend({
        template: _.template('<div class="doge"></div><div class="coins"></div>'),
        ui: {
          coins: '.coins'
        },
        behaviors: {
          test: {}
        }
      });

      this.LayoutView = Marionette.LayoutView.extend({
        template: _.template('<div class="top"></div>'),
        regions: {
          topRegion: '.top'
        },
        onRender: function() {
          this.topRegion.show(new suite.View());
        }
      });
    });

    it('should not clobber the event prototype', function() {
      expect(this.hold.test.prototype.events['click @ui.doge']).to.equal('onDogeClick');
    });

    it('should set the behavior UI element', function() {
      this.view = new this.View();
      this.view.render();
      expect(this.spy).to.have.been.calledOnce;
    });

    it('should handle behavior ui click event', function() {
      this.view = new this.View();
      this.view.render();
      this.view.$el.find('.doge').click();

      expect(this.onDogeClickSpy).to.have.been.calledOn(this.testBehavior);
    });

    it('should handle view ui click event', function() {
      this.view = new this.View();
      this.view.render();
      this.view.$el.find('.coins').click();

      expect(this.onCoinsClickSpy).to.have.been.calledOn(this.testBehavior);
    });

    it('should call onShow', function() {
      this.layoutView = new this.LayoutView();
      this.layoutView.render();
      expect(this.onShowSpy).to.have.been.called;
    });

    describe('should call onShow when inside a CollectionView', function() {
      var CollectionView, collectionView, collection;

      beforeEach(function() {
        CollectionView = Marionette.CollectionView.extend({
          childView: this.View
        });

        collection     = new Backbone.Collection([{}]);
        collectionView = new CollectionView({collection: collection});

        collectionView.render();
        collectionView.triggerMethod('show');
      });

      it('should call onShow when inside a CollectionView', function() {
        expect(this.onShowSpy).to.have.been.called;
      });

      it('should call onShow when already shown and reset', function() {
        collection.reset([{id:1}, {id: 2}]);

        expect(this.onShowSpy.callCount).to.equal(3);
      });

      it('should call onShow when a single model is added and the collectionView is already shown', function() {
        collection.add({id: 3});

        expect(this.onShowSpy.callCount).to.equal(2);
      });
    });

    it('should call onDestroy', function() {
      this.layoutView = new this.LayoutView();
      this.layoutView.render();
      this.layoutView.destroy();
      expect(this.onDestroySpy).to.have.been.called;
    });
  });

  describe('showing a view in a layout', function() {
    var behavior, onShowSpy, onDestroySpy, hold;
    beforeEach(function() {
      hold = {};

      onShowSpy = sinon.spy();
      onDestroySpy = sinon.spy();

      hold.test = Marionette.Behavior.extend({
        initialize: function() {
          behavior = this;
        },

        onShow: onShowSpy,

        onDestroy: onDestroySpy
      });

      var View = Marionette.ItemView.extend({
        template: _.template('<div>hi</div>'),
        behaviors: {
          test: {}
        }
      });
      Marionette.Behaviors.behaviorsLookup = hold;

      this.setFixtures('<div id="region"></div>');
      var region = new Backbone.Marionette.Region({el: $('#region')[0]});
      var view = new View({
        model: new Backbone.Model()
      });

      region.show(view);
      region.destroy();
    });

    it('behavior onShow is called once', function() {
      expect(onShowSpy).to.have.been.calledOnce;
    });

    it('behavior onClose is called once', function() {
      expect(onDestroySpy).to.have.been.calledOnce;
    });
  });

  describe('behavior instance events', function() {
    var model, v, listenToSpy, onSpy;

    beforeEach(function() {
      listenToSpy = this.sinon.spy();
      onSpy       = this.sinon.spy();
      model       = new Backbone.Model();

      v = new (Marionette.View.extend({
        behaviors: {
          cat: {
            behaviorClass: (Marionette.Behavior.extend({
              initialize: function() {
                this.listenTo(model, 'change', listenToSpy);
                this.on('wow', onSpy);
              }
            }))
          }
        }
      }))();

      v.destroy();
    });

    it('shoud unbind listenTo on close', function() {
      model.set('klingon', 'dominion');
      expect(listenToSpy).not.to.have.been.calledOnce;
    });

    it('shoud still be bound to "on" on close', function() {
      v.triggerMethod('wow');
      expect(onSpy).to.have.been.calledOnce;
    });
  });

  describe('behavior instance events', function() {
    beforeEach(function() {
      var suite = this;
      this.listenToSpy = this.sinon.spy();
      this.onSpy       = this.sinon.spy();
      this.model       = new Backbone.Model();

      this.v = new (Marionette.View.extend({
        behaviors: {
          cat: {
            behaviorClass: (Marionette.Behavior.extend({
              initialize: function() {
                this.listenTo(suite.model, 'change', suite.listenToSpy);
                this.on('wow', suite.onSpy);
              }
            }))
          }
        }
      }))();

      this.v.destroy();
    });

    it('should unbind listenTo on destroy', function() {
      this.model.set('klingon', 'dominion');
      expect(this.listenToSpy).not.to.have.been.called;
    });

    it('should still be bound to "on" on destroy', function() {
      this.v.triggerMethod('wow');
      expect(this.onSpy).to.have.been.called;
    });
  });

  describe('behavior model events', function() {
    beforeEach(function() {
      var suite = this;
      this.modelSpy = this.sinon.spy();
      this.collectionSpy = this.sinon.spy();
      this.fooChangedSpy = this.sinon.spy();

      this.hold = {};

      this.hold.test = Marionette.Behavior.extend({
        initialize: function() {
          suite.testBehavior = this;
        },
        modelEvents: {
          change: this.modelSpy,
          'change:foo': 'fooChanged'
        },
        collectionEvents: {
          reset: this.collectionSpy
        },
        fooChanged: this.fooChangedSpy
      });

      this.CollectionView = Marionette.CollectionView.extend({
        behaviors: {
          test: {}
        }
      });

      this.View = Marionette.ItemView.extend({
        behaviors: {
          test: {}
        }
      });

      this.model = new Backbone.Model({
        name: 'tom'
      });

      this.collection = new Backbone.Collection([]);

      Marionette.Behaviors.behaviorsLookup = this.hold;
    });

    it('should proxy model events', function() {
      this.view = new this.View({
        model: this.model
      });

      this.model.set('name', 'doge');
      expect(this.modelSpy).to.have.been.calledOn(this.testBehavior);
    });

    it('should proxy model events w/ string cbk', function() {
      this.view = new this.View({
        model: this.model
      });

      this.model.set('foo', 'doge');
      expect(this.fooChangedSpy).to.have.been.calledOn(this.testBehavior);
    });

    it('should proxy collection events', function() {
      this.view = new this.CollectionView({
        collection: this.collection
      });

      this.collection.reset();
      expect(this.collectionSpy).to.have.been.calledOn(this.testBehavior);
    });

    it('should unbind model events on view undelegate', function() {
      this.view = new this.View({
        model: this.model
      });

      this.view.undelegateEvents();
      this.model.set('foo', 'doge');
      expect(this.fooChangedSpy).not.to.have.been.called;
    });

    it('should unbind collection events on view undelegate', function() {
      this.view = new this.CollectionView({
        collection: this.collection
      });

      this.view.undelegateEvents();
      this.collection.reset();
      expect(this.collectionSpy).not.to.have.been.called;
    });
  });

  describe('behavior trigger calls', function() {
    beforeEach(function() {
      this.onRenderSpy = this.sinon.spy();
      this.hold = {};
      this.hold.testB = Marionette.Behavior.extend({
        onRender: this.onRenderSpy
      });

      this.View = Marionette.View.extend({
        behaviors: {
          testB: {}
        }
      });

      Marionette.Behaviors.behaviorsLookup = this.hold;
    });

    it('should call onRender when a view is rendered', function() {
      var view = new this.View();
      view.triggerMethod('render');
      expect(this.onRenderSpy).to.have.been.called;
    });
  });

  describe('behavior is evented', function() {
    beforeEach(function() {
      this.spy = this.sinon.spy();
      this.behavior = new Marionette.Behavior({}, {});
      this.model = new Backbone.Model();

      Marionette.bindEntityEvents(this.behavior, this.model, {
        'change': this.spy
      });

      this.behavior.listenTo(this.model, 'bump', this.spy);
    });

    it('should listenTo events', function() {
      this.model.trigger('bump');
      expect(this.spy).to.have.been.called;
    });

    it('should support bindEntityEvents', function() {
      this.model.set('name', 'doge');
      expect(this.spy).to.have.been.called;
    });

    it('should execute in the specified context', function() {
      this.model.trigger('bump');
      expect(this.spy).to.have.been.calledOn(this.behavior);
    });
  });

  describe('behavior with behavior', function() {
    beforeEach(function() {
      var suite = this;
      this.initSpy = this.sinon.spy();
      this.renderSpy = this.sinon.spy();
      this.childRenderSpy = this.sinon.spy();
      this.entityEventSpy = this.sinon.spy();
      this.childEventSpy = this.sinon.spy();
      this.parentEventSpy = this.sinon.spy();
      this.viewEventSpy = this.sinon.spy();

      this.hold = {};
      this.hold.parentB = Marionette.Behavior.extend({
        initialize: function() {
          suite.parentBehavior = this;
        },
        ui: {
          parent: '.parent'
        },
        events: {
          'click @ui.parent': this.parentEventSpy
        },
        behaviors: {
          childB: {}
        }
      });

      this.hold.childB = Marionette.Behavior.extend({
        initialize: function() {
          suite.initSpy();
          suite.groupedBehavior = this;
        },
        onRender: this.childRenderSpy,
        ui: {
          child: '.child'
        },
        modelEvents: {
          'change': this.entityEventSpy
        },
        collectionEvents: {
          'sync': this.entityEventSpy
        },
        events: {
          'click @ui.child': this.childEventSpy
        },
      });

      Marionette.Behaviors.behaviorsLookup = this.hold;

      this.View = Marionette.CompositeView.extend({
        template: _.template('<div class="view"></div><div class="parent"></div><div class="child"></div>'),
        ui: {
          view: '.view'
        },
        events: {
          'click @ui.view': this.viewEventSpy,
        },
        onRender: this.renderSpy,
        behaviors: {
          parentB: {}
        }
      });

      this.m = new Backbone.Model();
      this.c = new Backbone.Collection();
      this.v = new this.View({model: this.m, collection: this.c});

      this.sinon.spy(this.v, 'undelegateEvents');
    });

    it('should call initialize on grouped behaviors', function() {
      expect(this.initSpy).to.have.been.called;
    });

    it('should call onRender on grouped behaviors', function() {
      this.v.triggerMethod('render');
      expect(this.childRenderSpy).to.have.been.calledOn(this.groupedBehavior);
    });

    it('should call onRender on the view', function() {
      this.v.triggerMethod('render');
      expect(this.renderSpy).to.have.been.calledOn(this.v);
      expect(this.renderSpy).to.have.been.calledOnce;
    });

    it('should call undelegateEvents once', function() {
      this.v.undelegateEvents();
      expect(this.v.undelegateEvents.callCount).to.equal(1);
    });

    it('should proxy modelEvents to grouped behaviors', function() {
      this.m.trigger('change');
      expect(this.entityEventSpy).to.have.been.calledOn(this.groupedBehavior);
    });

    it('should proxy collectionEvents to grouped behaviors', function() {
      this.c.trigger('sync');
      expect(this.entityEventSpy).to.have.been.calledOn(this.groupedBehavior);
    });

    it('should proxy child behavior UI events to grouped behaviors', function() {
      this.v.render();
      this.v.$('.child').trigger('click');
      expect(this.childEventSpy).to.have.been.calledOn(this.groupedBehavior);
    });

    it('should proxy base behavior UI events to base behavior', function() {
      this.v.render();
      this.v.$('.parent').trigger('click');
      expect(this.parentEventSpy).to.have.been.calledOn(this.parentBehavior);
    });

    it('should proxy view UI events to view', function() {
      this.v.render();
      this.v.$('.view').trigger('click');
      expect(this.viewEventSpy).to.have.been.calledOn(this.v);
    });
  });
});
