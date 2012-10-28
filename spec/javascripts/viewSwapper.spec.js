describe("view swapper", function(){
  "use strict";

  describe("when a view swapper has an initial view configured", function(){
    var ViewSwapper = Marionette.ViewSwapper.extend({
      initialView: "someView",
      
      swapOn: {}
    });

    describe("and rendering the swapper with that view available", function(){
      var swapper, view;

      beforeEach(function(){
        view = new Backbone.View();
        spyOn(view, "render");

        swapper = new ViewSwapper({
          views: {
            someView: view
          }
        });

        swapper.render();
      });

      it("should render the initial view", function(){
        expect(view.render).toHaveBeenCalled();
      });

      it("should show the initial view in the view swapper", function(){
        expect(swapper.$el).toHaveHtml(view.$el);
      });

    });

    describe("and rendering the swapper without that view available", function(){
      var swapper, view;

      beforeEach(function(){
        view = new Backbone.View();
        spyOn(view, "render");

        swapper = new ViewSwapper({
          views: { }
        });

      });

      it("should throw an error saying the view is not available", function(){
        function run(){ swapper.render(); }
        expect(run).toThrow("Cannot show view in ViewSwapper. View 'someView' not found.");
      });
      
    });

  });

  describe("when a view has already been rendered, and it triggers a configured event", function(){
    var ViewSwapper = Marionette.ViewSwapper.extend({
      initialView: "firstView",
      
      swapOn: {
        firstView: {
          "foo:bar": "secondView"
        }
      }
    });

    var swapper, v1, v2;

    beforeEach(function(){
      v1 = new Backbone.Marionette.View();
      v2 = new Backbone.View();

      spyOn(v1, "close").andCallThrough();
      spyOn(v2, "render").andCallThrough();

      swapper = new ViewSwapper({
        views: {
          firstView: v1,
          secondView: v2
        }
      });

      swapper.render();

      v1.trigger("foo:bar");
    });

    it("should render the view configured for that event", function(){
      expect(v2.render).toHaveBeenCalled();
    });

    it("should populate the swapper's el with the new view", function(){
      expect(swapper.$el[0].children[0]).toHaveHtml(v1.$el.html());
    });

    it("should hide the previous view", function(){
      expect(v1.$el).toBeHidden();
    });

    it("should not close the previous view", function(){
      expect(v1.close).not.toHaveBeenCalled();
    });
  });

  describe("when swapping to a view that does not exist", function(){
    var ViewSwapper = Marionette.ViewSwapper.extend({
      initialView: "firstView",
      
      swapOn: {
        firstView: {
          "switch:it": "doesn't exist"
        }
      }
    });

    var swapper, v1;

    beforeEach(function(){
      v1 = new Backbone.Marionette.View();

      swapper = new ViewSwapper({
        views: {
          firstView: v1,
        }
      });

      swapper.render();
    });


    it("should throw an error saying the view is not found", function(){
      function run(){ v1.trigger("switch:it"); }
      expect(run).toThrow("Cannot show view in ViewSwapper. View 'doesn't exist' not found.");
    });

  });

  describe("when switching to a view and then switching back to the previous view", function(){
    var ViewSwapper = Marionette.ViewSwapper.extend({
      initialView: "firstView",
      
      swapOn: {
        firstView: {
          "foo:bar": "secondView"
        },
        secondView: {
          "switch:back": "firstView"
        }
      }
    });

    var swapper, v1, v2;

    beforeEach(function(){
      v1 = new Backbone.Marionette.View();
      v2 = new Backbone.Marionette.View();

      spyOn(v1, "close").andCallThrough();
      spyOn(v1, "render").andCallThrough();
      spyOn(v2, "render").andCallThrough();
      spyOn(v2, "close").andCallThrough();

      swapper = new ViewSwapper({
        views: {
          firstView: v1,
          secondView: v2
        }
      });

      swapper.render();

      v1.trigger("foo:bar");
      v2.trigger("switch:back");
    });

    it("should not re-render the first view", function(){
      expect(v1.render.callCount).toBe(1);
    });

    it("should show the first view, again", function(){
      expect(swapper.$el[0].children[0]).toHaveHtml(v1.$el.html());
    });

    it("should hide the second view", function(){
      expect(v2.$el).toBeHidden();
    });

    it("should not close the second view", function(){
      expect(v2.close).not.toHaveBeenCalled();
    });

  });

  describe("when a view that is not the current view triggers a configured event", function(){

    var ViewSwapper = Marionette.ViewSwapper.extend({
      initialView: "firstView",
      
      swapOn: {
        firstView: {
          "foo:bar": "secondView"
        },
        secondView: {
          "switch:back": "thirdView"
        },
        thirdView: {
          "more:stuff": "secondView"
        }
      }
    });

    var swapper, v1, v2, v3, html;

    beforeEach(function(){
      v1 = new Backbone.Marionette.View();
      v2 = new Backbone.Marionette.View();
      v3 = new Backbone.Marionette.View();

      swapper = new ViewSwapper({
        views: {
          firstView: v1,
          secondView: v2,
          thirdView: v3
        }
      });

      swapper.render();
      html = swapper.$el.html();

      v3.trigger("more:stuff");
    });

    it("should not switch to the configured target view for that event", function(){
      expect(html).toEqual(swapper.$el.html());
    });

  });

  describe("when closing the swapper", function(){

    var ViewSwapper = Marionette.ViewSwapper.extend({
      initialView: "firstView",
      
      swapOn: {
        firstView: {
          "foo:bar": "secondView"
        },
        secondView: {
          "switch:back": "firstView"
        }
      }
    });

    var swapper, v1, v2;

    beforeEach(function(){
      v1 = new Backbone.Marionette.View();
      v2 = new Backbone.Marionette.View();

      swapper = new ViewSwapper({
        views: {
          firstView: v1,
          secondView: v2
        }
      });

      spyOn(swapper._currentViewBindings, "unbindAll").andCallThrough();
      spyOn(swapper._swapperBindings, "unbindAll").andCallThrough();

      spyOn(v1, "close").andCallThrough();
      spyOn(v2, "close").andCallThrough();

      swapper.render();
      swapper.close();
    });

    it("should close all of the views that are configured in the swapper", function(){
      expect(v1.close).toHaveBeenCalled();
      expect(v2.close).toHaveBeenCalled();
    });

    it("should unbind all view events", function(){
      expect(swapper._currentViewBindings.unbindAll).toHaveBeenCalled();
    });

    it("should unbind the swapper events", function(){
      expect(swapper._swapperBindings.unbindAll).toHaveBeenCalled();
    });

  });

  describe("and configuring 'swapper' in the 'swapOn' settings, to switch to other views", function(){

    var ViewSwapper = Marionette.ViewSwapper.extend({
      initialView: "firstView",
      
      swapOn: {
        swapper: {
          "some:event": "secondView"
        }
      }
    });

    var swapper, v1, v2;

    beforeEach(function(){
      v1 = new Marionette.View();
      v2 = new Marionette.View();

      swapper = new ViewSwapper({
        views: {
          firstView: v1,
          secondView: v2
        }
      });

      spyOn(swapper, "_swapView").andCallThrough();

      swapper.render();
      swapper.trigger("some:event");
    });

    it("should swap to the specified view when the swapper triggers an event", function(){
      expect(swapper._swapView).toHaveBeenCalledWith("secondView");
    });

  });

  describe("when setting 'swapper' as the 'initialView'", function(){

    var ViewSwapper = Marionette.ViewSwapper.extend({
      initialView: "swapper"
    });

    function run(){
      var swapper = new ViewSwapper();
      swapper.render();
    }

    it("should throw an error saying swapper can't be used as view", function(){
      expect(run).toThrow("Cannot display 'swapper' as a view.");
    });
  });

  describe("and setting 'swapper' as the target of a 'swapOn' event", function(){
    var ViewSwapper = Marionette.ViewSwapper.extend({
      initialView: "first",

      swapOn: {
        first: {
          "foo": "swapper"
        }
      }

    });

    function run(){
      var v1 = new Marionette.View();
      var swapper = new ViewSwapper({
        views: {
          first: v1
        }
      });

      swapper.render();
      v1.trigger("foo");
    }

    it("should throw an error saying swapper can't be used as a view", function(){
      expect(run).toThrow("Cannot display 'swapper' as a view.");
    });
  });

});
