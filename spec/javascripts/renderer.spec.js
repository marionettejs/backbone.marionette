describe("renderer", function(){

  describe("when given a template id to render", function(){
    var templateSelector;

    beforeEach(function(){
      spyOn(Backbone.Marionette.TemplateCache, "get");
    });

    it("should retrieve the template from the cache", function(){
      expect(Backbone.Marionette.TemplateCache.get).toHaveBeenCalledWith(templateSelector);
    });
  });

});
