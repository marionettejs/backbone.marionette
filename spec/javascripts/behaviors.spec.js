describe("Behaviors", function(){
  describe("behavior lookup", function() {
    it("should throw if behavior lookup is not defined", function() {
      expect(Marionette.Behaviors.behaviorsLookup).toThrow();
    });
  });

  describe("behavior parsing with a functional behavior lookup", function() {
    var Obj, View, Tooltip;

    beforeEach(function() {
      ToolTip = sinon.spy();
      Obj = {
        ToolTip: ToolTip
      };

      Marionette.Behaviors.behaviorsLookup = function(){
        return Obj;
      };
    });

    describe("when one behavior", function() {
      beforeEach(function() {
        View = Marionette.ItemView.extend({
          behaviors: {
            ToolTip: {
              position: "top"
            }
          }
        });

        new View;
      });

      it("should instantiate the tooltip behavior", function() {
        expect(Obj.ToolTip).toHaveBeenCalled();
      });
    });
  });

  describe("behavior parsing", function() {
    var Obj, View, Tooltip;

    beforeEach(function() {
      ToolTip = sinon.spy();
      Obj = {
        ToolTip: ToolTip
      };
      Marionette.Behaviors.behaviorsLookup = Obj;
    });

    describe("when one behavior", function() {
      beforeEach(function() {
        View = Marionette.ItemView.extend({
          behaviors: {
            ToolTip: {
              position: "top"
            }
          }
        });

        new View;
      });

      it("should instantiate the tooltip behavior", function() {
        expect(Obj.ToolTip).toHaveBeenCalled();
      });
    });

    describe("when multiple behaviors", function() {
      beforeEach(function() {
        View = Marionette.ItemView.extend({
          behaviors:
            {
              ToolTip: {
                position: "top"
              }

            }
        });

        new View;
      });

      it("should instantiate the tooltip behavior", function() {
        expect(Obj.ToolTip).toHaveBeenCalled();
      });
    });

    describe("when functional behavior", function() {
      var _this, v;
      beforeEach(function() {
        View = Marionette.ItemView.extend({
          behaviors: function() {
            _this = this;
            return {
              ToolTip: {
                behaviorClass: ToolTip,
                position: "top"
              }
            }
          }
        });

        v = new View;
      });

      it("should instantiate the tooltip behavior", function() {
        expect(Obj.ToolTip).toHaveBeenCalled();
      });

      it("should call the behaviors method with the view context", function() {
        expect(_this).toEqual(v);
      });
    });

    describe("when behavior class is provided", function() {
      beforeEach(function() {
        View = Marionette.ItemView.extend({
          behaviors: {
            ToolTip: {
              behaviorClass: ToolTip,
              position: "top"
            }
          }
        });

        new View;
      });

      it("should instantiate the tooltip behavior", function() {
        expect(Obj.ToolTip).toHaveBeenCalled();
      });
    });
  });

  describe("behavior initialize", function() {
    var Behavior = Marionette.Behavior.extend({
      initialize: sinon.spy()
    });

    it("should call initialize when a behavior is created", function() {
      var b = new Behavior({}, {});

      expect(b.initialize).toHaveBeenCalled();
    });
  });

  describe("behavior events", function() {
    var V, Obj, spy, spy2, viewSpy;

    beforeEach(function() {
      spy = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      viewSpy = sinon.spy();

      Obj = {
        ToolTip: Marionette.Behavior.extend({
          events: {
            "click": spy
          }
        }),
        DropDown: Marionette.Behavior.extend({
          events: {
            "click": spy2
          }
        }),
        Hover: Marionette.Behavior.extend({
          events: {
            "click": "onClick"
          },

          onClick: spy3
        })
      };

      V = Marionette.ItemView.extend({
        template: _.template(""),
        events: {
          "click": viewSpy
        },
        behaviors: {
          ToolTip: {},
          DropDown: {},
          Hover: {}
        }
      });

      Marionette.Behaviors.behaviorsLookup = Obj;
      v = new V();
      v.render();
      v.$el.click();
    });

    it("should call first behaviors event", function() {
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledOn(sinon.match.instanceOf(Marionette.Behavior))
    });

    it("should call second behaviors event", function() {
      expect(spy2).toHaveBeenCalledOn(sinon.match.instanceOf(Marionette.Behavior))
      expect(spy2).toHaveBeenCalledOnce();
    });

    it("should call third behaviors event", function() {
      expect(spy3).toHaveBeenCalledOnce();
      expect(spy3).toHaveBeenCalledOn(sinon.match.instanceOf(Marionette.Behavior))
    });

    it("should call the view click handler", function() {
      expect(viewSpy).toHaveBeenCalledOnce();
      expect(viewSpy).toHaveBeenCalledOn(sinon.match.instanceOf(Marionette.View))
    });
  });

  describe("behavior $el", function() {
    var View, view, hold, behavior;

    beforeEach(function() {
      hold = {}
      hold.test = Marionette.Behavior.extend({
        initialize: function() {
          behavior = this;
        }
      });

      View = Marionette.ItemView.extend({
        template: _.template(""),
        behaviors: {
          test: {}
        }
      });

      Marionette.Behaviors.behaviorsLookup = hold;

      view = new View;
      view.setElement(document.createElement("doge"));
    });

    it("should proxy the views $el", function() {
      expect(behavior.$el).toEqual(view.$el);
    });
  });

  describe("behavior UI", function() {
    var V, hold, spy, onShowSpy, onCloseSpy, Layout, testBehavior;

    beforeEach(function() {
      hold = {};
      spy = new sinon.spy();
      onShowSpy = new sinon.spy();
      onCloseSpy = new sinon.spy();
      onDogeClickSpy = new sinon.spy();
      onCoinsClickSpy = new sinon.spy();

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

        onClose: onCloseSpy,

        onDogeClick: onDogeClickSpy,

        onCoinsClick: onCoinsClickSpy

      });

      Marionette.Behaviors.behaviorsLookup = hold;

      V = Marionette.ItemView.extend({
        template: _.template('<div class="doge"></div><div class="coins"></div>'),
        ui: {
          coins: '.coins'
        },
        behaviors: {
          test: {}
        }
      });

      Layout = Marionette.Layout.extend({
        template: _.template('<div class="top"></div>'),
        regions: {
          topRegion: '.top'
        },
        onRender: function() {
          this.topRegion.show(new V)
        }
      });
    });

    it("should set the behavior UI element", function() {
      v = new V;
      v.render();
      expect(spy).toHaveBeenCalled(1);
    });

    it("should handle behavior ui click event", function() {
      v = new V;
      v.render();
      v.$el.find('.doge').click();

      expect(onDogeClickSpy).toHaveBeenCalledOn(testBehavior);
    });

    it("should handle view ui click event", function() {
      v = new V;
      v.render();
      v.$el.find('.coins').click();

      expect(onCoinsClickSpy).toHaveBeenCalledOn(testBehavior);
    });

    it("should call onShow", function() {
      layout = new Layout();
      layout.render();
      expect(onShowSpy).toHaveBeenCalled();
    });


    it("should call onClose", function() {
      layout = new Layout();
      layout.render();
      layout.close();
      expect(onCloseSpy).toHaveBeenCalled();
    });
  });

  describe("behavior model events", function() {
    var spy, V, hold, m;
    beforeEach(function() {
      spy = sinon.spy();
      hold = {}
      hold.test = Marionette.Behavior.extend({
        modelEvents: {
          change: spy
        },
        collectionEvents: {
          reset: spy
        }
      });

      CV = Marionette.CollectionView.extend({
        behaviors: {
          test: {}
        }
      });

      V = Marionette.ItemView.extend({
        behaviors: {
          test: {}
        }
      });

      m = new Backbone.Model({
        name: "tom"
      });

      c = new Backbone.Collection([])

      Marionette.Behaviors.behaviorsLookup = hold;
    });

    it ("should proxy model events", function() {
      v = new V({
        model: m
      });

      v.delegateEvents();

      m.set("name", "doge");

      expect(spy).toHaveBeenCalled();
    });

    it ("should proxy collection events", function() {
      v = new CV({
        collection: c
      });

      v.delegateEvents();

      c.reset();

      expect(spy).toHaveBeenCalled();
    });

  });

  describe("behavior trigger calls", function() {
    var spy, V, hold;
    beforeEach(function() {
      spy = sinon.spy();
      hold = {}
      hold.testB = Marionette.Behavior.extend({
        onRender: function(){
          spy();
        }
      });

      V = Marionette.View.extend({
        behaviors: {
          testB: {}
        }
      });

      Marionette.Behaviors.behaviorsLookup = hold;
    })

    it ("should call onRender when a view is rendered", function() {
      var v = new V;
      v.triggerMethod("render");
      expect(spy).toHaveBeenCalled();
    });
  });
});
