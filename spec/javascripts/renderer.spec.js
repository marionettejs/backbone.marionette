describe("renderer", function(){

  describe("when given a template id to render", function(){
    var templateSelector = "#renderer-template";
    var result;

    beforeEach(function(){
      loadFixtures("rendererTemplate.html");
      spyOn(Backbone.Marionette.TemplateCache, "get").andCallThrough();
      var promise = Backbone.Marionette.Renderer.render(templateSelector);
      promise.done(function(html){
        result = $(html);
      });
    });

    it("should retrieve the template from the cache", function(){
      expect(Backbone.Marionette.TemplateCache.get).toHaveBeenCalledWith(templateSelector);
    });

    it("should render the template", function(){
      expect(result).toHaveText(/renderer/);
    });
  });

});
