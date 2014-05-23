describe('Behaviors', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('behavior lookup', function() {
    it('should throw if behavior lookup is not defined', function() {
      expect(Marionette.Behaviors.behaviorsLookup).to.throw;
    });
  });

  describe('behavior parsing with a functional behavior lookup', function() {
    var Obj, Tooltip;

    beforeEach(function() {
      Tooltip = this.sinon.spy();
      Obj = {
        Tooltip: Tooltip
      };

      Marionette.Behaviors.behaviorsLookup = function() {
        return Obj;
      };
    });

    describe('when one behavior', function() {
      var View, view;

      beforeEach(function() {
        View = Marionette.ItemView.extend({
          behaviors: {
            Tooltip: {
              position: 'top'
            }
          }
        });

        view = new View();
      });

      it('should instantiate the tooltip behavior', function() {
        expect(Obj.Tooltip).to.have.been.called;
      });
    });
  });

  describe('behavior parsing', function() {
    var Obj, Tooltip;

    beforeEach(function() {
      Tooltip = this.sinon.spy();
      Obj = {
        Tooltip: Tooltip
      };
      Marionette.Behaviors.behaviorsLookup = Obj;
    });

    describe('when one behavior', function() {
      var View, view;

      beforeEach(function() {
        View = Marionette.ItemView.extend({
          behaviors: {
            Tooltip: {
              position: 'top'
            }
          }
        });

        view = new View();
      });

      it('should instantiate the tooltip behavior', function() {
        expect(Obj.Tooltip).to.have.been.called;
      });
    });

    describe('when multiple behaviors', function() {
      var View, view;

      beforeEach(function() {
        View = Marionette.ItemView.extend({
          behaviors: {
            Tooltip: {
              position: 'top'
            }
          }
        });

        view = new View();
      });

      it('should instantiate the tooltip behavior', function() {
        expect(Obj.Tooltip).to.have.been.called;
      });
    });

    describe('when functional behavior', function() {
      var _this, View, view;

      beforeEach(function() {
        View = Marionette.ItemView.extend({
          behaviors: function() {
            _this = this;
            return {
              Tooltip: {
                behaviorClass: Tooltip,
                position: 'top'
              }
            };
          }
        });

        view = new View();
      });

      it('should instantiate the tooltip behavior', function() {
        expect(Obj.Tooltip).to.have.been.called;
      });

      it('should call the behaviors method with the view context', function() {
        expect(_this).to.equal(view);
      });
    });

    describe('when behavior class is provided', function() {
      var View, view;

      beforeEach(function() {
        View = Marionette.ItemView.extend({
          behaviors: {
            Tooltip: {
              behaviorClass: Tooltip,
              position: 'top'
            }
          }
        });

        view = new View();
      });

      it('should instantiate the tooltip behavior', function() {
        expect(Obj.Tooltip).to.have.been.called;
      });
    });
  });

  describe('behavior initialize', function() {
    var View, Behavior, Obj, behaviorOptions, viewOptions;

    beforeEach(function() {
      Behavior = Marionette.Behavior.extend({
        initialize: this.sinon.spy()
      });

      Obj = {
        Tooltip: Marionette.Behavior.extend({
          initialize: function(options, view) {
            behaviorOptions = options;
            viewOptions = view.options;
          }
        })
      };

      View = Marionette.ItemView.extend({
        template: _.template(''),
        behaviors: {
          Tooltip: {
            position: 'left'
          }
        }
      });

      Marionette.Behaviors.behaviorsLookup = Obj;
    });

    it('should call initialize when a behavior is created', function() {
      var b = new Behavior({}, {});
      expect(b.initialize).to.have.been.called;
    });

    it('should call initialize when a behavior is created', function() {
      var view = new View({
        words: 'big'
      });

      expect(viewOptions).to.equal(view.options);
      expect(behaviorOptions).to.equal(View.prototype.behaviors.Tooltip);
    });
  });

  describe('behavior events', function() {
    var View, view, Obj, spy, spy2, spy3, viewSpy;

    beforeEach(function() {
      spy = this.sinon.spy();
      spy2 = this.sinon.spy();
      spy3 = this.sinon.spy();
      viewSpy = this.sinon.spy();

      Obj = {
        Tooltip: Marionette.Behavior.extend({
          events: {
            'click': spy
          }
        }),
        DropDown: Marionette.Behavior.extend({
          events: {
            'click': spy2
          }
        }),
        Hover: Marionette.Behavior.extend({
          events: {
            'click': 'onClick'
          },

          onClick: spy3
        })
      };

      View = Marionette.ItemView.extend({
        template: _.template(''),
        events: {
          'click': viewSpy
        },
        behaviors: {
          Tooltip: {},
          DropDown: {},
          Hover: {}
        }
      });

      Marionette.Behaviors.behaviorsLookup = Obj;
      view = new View();
      view.render();
      view.$el.click();
    });

    it('should call first behaviors event', function() {
      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledOn(sinon.match.instanceOf(Marionette.Behavior));
    });

    it('should call second behaviors event', function() {
      expect(spy2).to.have.been.calledOn(sinon.match.instanceOf(Marionette.Behavior));
      expect(spy2).to.have.been.calledOnce;
    });

    it('should call third behaviors event', function() {
      expect(spy3).to.have.been.calledOnce;
      expect(spy3).to.have.been.calledOn(sinon.match.instanceOf(Marionette.Behavior));
    });

    it('should call the view click handler', function() {
      expect(viewSpy).to.have.been.calledOnce;
      expect(viewSpy).to.have.been.calledOn(sinon.match.instanceOf(Marionette.View));
    });
  });

  describe('behavior $el', function() {
    var View, view, hold, behavior;

    beforeEach(function() {
      hold = {};
      hold.test = Marionette.Behavior.extend({
        initialize: function() {
          behavior = this;
        }
      });

      View = Marionette.ItemView.extend({
        template: _.template(''),
        behaviors: {
          test: {}
        }
      });

      Marionette.Behaviors.behaviorsLookup = hold;

      view = new View();
      view.setElement(document.createElement('doge'));
    });

    it('should proxy the views $el', function() {
      expect(behavior.$el).to.equal(view.$el);
    });
  });

  describe('behavior UI', function() {
    var View, view, hold, spy, onShowSpy, onDestroySpy, onDogeClickSpy, onCoinsClickSpy, LayoutView, layoutView, testBehavior;

    beforeEach(function() {
      hold = {};
      spy = this.sinon.spy();
      onShowSpy = this.sinon.spy();
      onDestroySpy = this.sinon.spy();
      onDogeClickSpy = this.sinon.spy();
      onCoinsClickSpy = this.sinon.spy();

      hold.test = Marionette.Behavior.extend({
        ui: {
          doge: '.doge'
        },
        initialize: function() {
          testBehavior = this;
        },
        events: {
          'click @ui.doge': 'onDogeClick',
          'click @ui.coins': 'onCoinsClick'
        },
        onRender: function() {
          spy(this.ui.doge.length);
        },
        onShow: onShowSpy,
        onDestroy: onDestroySpy,
        onDogeClick: onDogeClickSpy,
        onCoinsClick: onCoinsClickSpy
      });

      Marionette.Behaviors.behaviorsLookup = hold;

      View = Marionette.ItemView.extend({
        template: _.template('<div class="doge"></div><div class="coins"></div>'),
        ui: {
          coins: '.coins'
        },
        behaviors: {
          test: {}
        }
      });

      LayoutView = Marionette.LayoutView.extend({
        template: _.template('<div class="top"></div>'),
        regions: {
          topRegion: '.top'
        },
        onRender: function() {
          this.topRegion.show(new View());
        }
      });
    });

    it('should not clobber the event prototype', function() {
      expect(hold.test.prototype.events['click @ui.doge']).to.equal('onDogeClick');
    });

    it('should set the behavior UI element', function() {
      view = new View();
      view.render();
      expect(spy).to.have.been.calledOnce;
    });

    it('should handle behavior ui click event', function() {
      view = new View();
      view.render();
      view.$el.find('.doge').click();

      expect(onDogeClickSpy).to.have.been.calledOn(testBehavior);
    });

    it('should handle view ui click event', function() {
      view = new View();
      view.render();
      view.$el.find('.coins').click();

      expect(onCoinsClickSpy).to.have.been.calledOn(testBehavior);
    });

    it('should call onShow', function() {
      layoutView = new LayoutView();
      layoutView.render();
      expect(onShowSpy).to.have.been.called;
    });

    describe('should call onShow when inside a CollectionView', function() {
      var CollectionView, collectionView, collection;

      beforeEach(function() {
        CollectionView = Marionette.CollectionView.extend({
          childView: View
        });

        collection     = new Backbone.Collection([{}]);
        collectionView = new CollectionView({collection: collection});

        collectionView.render();
        collectionView.triggerMethod('show');
      });

      it('should call onShow when inside a CollectionView', function() {
        expect(onShowSpy).to.have.been.called;
      });

      it('should call onShow when already shown and reset', function() {
        collection.reset([{id:1}, {id: 2}]);

        expect(onShowSpy.callCount).to.equal(3);
      });

      it('should call onShow when a single model is added and the collectionView is already shown', function() {
        collection.add({id: 3});

        expect(onShowSpy.callCount).to.equal(2);
      });
    });

    it('should call onDestroy', function() {
      layoutView = new LayoutView();
      layoutView.render();
      layoutView.destroy();
      expect(onDestroySpy).to.have.been.called;
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
    var model, v, listenToSpy, onSpy;

    beforeEach(function() {
      listenToSpy = new sinon.spy();
      onSpy       = new sinon.spy();
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

    it('should unbind listenTo on destroy', function() {
      model.set('klingon', 'dominion');
      expect(listenToSpy).not.to.have.been.called;
    });

    it('should still be bound to "on" on destroy', function() {
      v.triggerMethod('wow');
      expect(onSpy).to.have.been.called;
    });
  });

  describe('behavior model events', function() {
    var modelSpy, collectionSpy, fooChangedSpy, View, view, CollectionView, hold, model, testBehavior, collection;

    beforeEach(function() {
      modelSpy = this.sinon.spy();
      collectionSpy = this.sinon.spy();
      fooChangedSpy = this.sinon.spy();

      hold = {};

      hold.test = Marionette.Behavior.extend({
        initialize: function() {
          testBehavior = this;
        },
        modelEvents: {
          change: modelSpy,
          'change:foo': 'fooChanged'
        },
        collectionEvents: {
          reset: collectionSpy
        },
        fooChanged: fooChangedSpy
      });

      CollectionView = Marionette.CollectionView.extend({
        behaviors: {
          test: {}
        }
      });

      View = Marionette.ItemView.extend({
        behaviors: {
          test: {}
        }
      });

      model = new Backbone.Model({
        name: 'tom'
      });

      collection = new Backbone.Collection([]);

      Marionette.Behaviors.behaviorsLookup = hold;
    });

    it('should proxy model events', function() {
      view = new View({
        model: model
      });

      model.set('name', 'doge');
      expect(modelSpy).to.have.been.calledOn(testBehavior);
    });

    it('should proxy model events w/ string cbk', function() {
      view = new View({
        model: model
      });

      model.set('foo', 'doge');
      expect(fooChangedSpy).to.have.been.calledOn(testBehavior);
    });

    it('should proxy collection events', function() {
      view = new CollectionView({
        collection: collection
      });

      collection.reset();
      expect(collectionSpy).to.have.been.calledOn(testBehavior);
    });

    it('should unbind model events on view undelegate', function() {
      view = new View({
        model: model
      });

      view.undelegateEvents();
      model.set('foo', 'doge');
      expect(fooChangedSpy).not.to.have.been.called;
    });

    it('should unbind collection events on view undelegate', function() {
      view = new CollectionView({
        collection: collection
      });

      view.undelegateEvents();
      collection.reset();
      expect(collectionSpy).not.to.have.been.called;
    });
  });

  describe('behavior trigger calls', function() {
    var onRenderSpy, View, hold;

    beforeEach(function() {
      onRenderSpy = this.sinon.spy();
      hold = {};
      hold.testB = Marionette.Behavior.extend({
        onRender: onRenderSpy
      });

      View = Marionette.View.extend({
        behaviors: {
          testB: {}
        }
      });

      Marionette.Behaviors.behaviorsLookup = hold;
    });

    it('should call onRender when a view is rendered', function() {
      var view = new View();
      view.triggerMethod('render');
      expect(onRenderSpy).to.have.been.called;
    });
  });

  describe('behavior is evented', function() {
    var spy, behavior, model;

    beforeEach(function() {
      spy = this.sinon.spy();
      behavior = new Marionette.Behavior({}, {});
      model = new Backbone.Model();

      Marionette.bindEntityEvents(behavior, model, {
        'change': spy
      });

      behavior.listenTo(model, 'bump', spy);
    });

    it('should listenTo events', function() {
      model.trigger('bump');
      expect(spy).to.have.been.called;
    });

    it('should support bindEntityEvents', function() {
      model.set('name', 'doge');
      expect(spy).to.have.been.called;
    });

    it('should execute in the specified context', function() {
      model.trigger('bump');
      expect(spy).to.have.been.calledOn(behavior);
    });
  });

  describe('behavior with behavior', function() {
    var initSpy, renderSpy, childRenderSpy, entityEventSpy, viewEventSpy, childEventSpy, parentEventSpy, View, v, m, c, hold, parentBehavior, groupedBehavior;

    beforeEach(function() {
      initSpy = this.sinon.spy();
      renderSpy = this.sinon.spy();
      childRenderSpy = this.sinon.spy();
      entityEventSpy = this.sinon.spy();
      childEventSpy = this.sinon.spy();
      parentEventSpy = this.sinon.spy();
      viewEventSpy = this.sinon.spy();

      hold = {};
      hold.parentB = Marionette.Behavior.extend({
        initialize: function() {
          parentBehavior = this;
        },
        ui: {
          parent: '.parent'
        },
        events: {
          'click @ui.parent': parentEventSpy
        },
        behaviors: {
          childB: {}
        }
      });

      hold.childB = Marionette.Behavior.extend({
        initialize: function() {
          initSpy();
          groupedBehavior = this;
        },
        onRender: childRenderSpy,
        ui: {
          child: '.child'
        },
        modelEvents: {
          'change': entityEventSpy
        },
        collectionEvents: {
          'sync': entityEventSpy
        },
        events: {
          'click @ui.child': childEventSpy
        },
      });

      Marionette.Behaviors.behaviorsLookup = hold;

      View = Marionette.CompositeView.extend({
        template: _.template('<div class="view"></div><div class="parent"></div><div class="child"></div>'),
        ui: {
          view: '.view'
        },
        events: {
          'click @ui.view': viewEventSpy,
        },
        onRender: renderSpy,
        behaviors: {
          parentB: {}
        }
      });

      m = new Backbone.Model();
      c = new Backbone.Collection();
      v = new View({model: m, collection: c});

      this.sinon.spy(v, 'undelegateEvents');
    });

    it('should call initialize on grouped behaviors', function() {
      expect(initSpy).to.have.been.called;
    });

    it('should call onRender on grouped behaviors', function() {
      v.triggerMethod('render');
      expect(childRenderSpy).to.have.been.calledOn(groupedBehavior);
    });

    it('should call onRender on the view', function() {
      v.triggerMethod('render');
      expect(renderSpy).to.have.been.calledOn(v);
      expect(renderSpy).to.have.been.calledOnce;
    });

    it('should call undelegateEvents once', function() {
      v.undelegateEvents();
      expect(v.undelegateEvents.callCount).to.equal(1);
    });

    it('should proxy modelEvents to grouped behaviors', function() {
      m.trigger('change');
      expect(entityEventSpy).to.have.been.calledOn(groupedBehavior);
    });

    it('should proxy collectionEvents to grouped behaviors', function() {
      c.trigger('sync');
      expect(entityEventSpy).to.have.been.calledOn(groupedBehavior);
    });

    it('should proxy child behavior UI events to grouped behaviors', function() {
      v.render();
      v.$('.child').trigger('click');
      expect(childEventSpy).to.have.been.calledOn(groupedBehavior);
    });

    it('should proxy base behavior UI events to base behavior', function() {
      v.render();
      v.$('.parent').trigger('click');
      expect(parentEventSpy).to.have.been.calledOn(parentBehavior);
    });

    it('should proxy view UI events to view', function() {
      v.render();
      v.$('.view').trigger('click');
      expect(viewEventSpy).to.have.been.calledOn(v);
    });
  });
});
