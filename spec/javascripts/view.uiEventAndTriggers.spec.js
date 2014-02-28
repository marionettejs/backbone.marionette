describe("view ui event trigger configuration", function(){
  "use strict";

  describe("@ui syntax within events and triggers", function() {
    var view, view2, fooHandler, attackHandler, tapHandler;

    var View = Backbone.Marionette.ItemView.extend({
      ui: {
        foo: '.foo',
        bar: '#tap'
      },

      triggers: {
        "click @ui.foo": "do:foo"
      },

      events: {
        "click @ui.bar": "attack",
        "click div:not(@ui.bar)": "tapper"
      },

      tapper: function() {
        tapHandler();
      },

      attack: function() {
        attackHandler();
      },

      render: function(){
        this.$el.html("<button class='foo'></button><div id='tap'></div><div class='lap'></div>");
      }
    });

    var View2 = View.extend({
      triggers: function() {
        return {
          "click @ui.foo": {
            event: "do:foo",
            preventDefault: true,
            stopPropagation: false
          }
        }
      },

      events: function() {
        return {
          "click @ui.bar": function() {
            return "attack"
          }
        }
      }
    });

    beforeEach(function(){
      view = new View({
        model: new Backbone.Model()
      });

      view2 = new View({
        model: new Backbone.Model()
      });

      view.render();
      view2.render();

      fooHandler = jasmine.createSpy("do:foo event handler");
      attackHandler = jasmine.createSpy("attack handler");
      tapHandler = jasmine.createSpy("tap handler");
      spyOn(view, "attack").andCallThrough();
      view.on("do:foo", fooHandler);
      view2.on("do:foo", fooHandler);
    });

    it("should correctly trigger an event", function(){
      view.$(".foo").trigger("click");
      expect(fooHandler).toHaveBeenCalled();
    });

    it("should correctly trigger a complex event", function(){
      view.$(".lap").trigger("click");
      expect(tapHandler).toHaveBeenCalled();
    });

    it("should correctly call an event", function(){
      view.$("#tap").trigger('click');
      expect(attackHandler).toHaveBeenCalled();
    });

    it("should correctly call an event with a functional events hash", function(){
      view2.$("#tap").trigger('click');
      expect(attackHandler).toHaveBeenCalled();
    });

    it("should correctly call an event with a functional triggers hash", function(){
      view2.$(".foo").trigger("click");
      expect(fooHandler).toHaveBeenCalled();
    });
  });
});
