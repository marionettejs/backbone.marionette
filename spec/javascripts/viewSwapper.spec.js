describe("view swapper", function(){

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
    it("should swap to view configured for that event", function(){
      throw "not yet implemented";
    });
  });

});
