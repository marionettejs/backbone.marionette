describe("pre-compiled template rendering", function(){

  describe("when rendering views with pre-compiled template functions", function(){
    var templateFunc = _.template("<div>pre-compiled</div>");

    var View = Backbone.Marionette.ItemView.extend({
      template: templateFunc,
    });

    var view;
    var renderResult;
    var deferredDone;

    beforeEach(function(){

      // store and then replace the render method used by Marionette
      this.render = Backbone.Marionette.Renderer.render;
      Backbone.Marionette.Renderer.render = function(template, data){
        return template(data);
      };

      view = new View();
      view.render();
    });

    afterEach(function(){
      // restore the render method used by Marionette
      Backbone.Marionette.Renderer.render = this.render;
    });

    it("should render the pre-compiled template", function(){
      expect(view.$el).toHaveText("pre-compiled");
    });

  });

});
