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

  describe("when given a template and data to render", function(){
    var templateSelector = "#renderer-with-data-template";
    var result;

    beforeEach(function(){
      loadFixtures("rendererWithDataTemplate.html");
      spyOn(Backbone.Marionette.TemplateCache, "get").andCallThrough();

      var data = {foo: "bar"}
      var promise = Backbone.Marionette.Renderer.render(templateSelector, data);

      promise.done(function(html){
        result = $(html);
      });
    });

    it("should retrieve the template from the cache", function(){
      expect(Backbone.Marionette.TemplateCache.get).toHaveBeenCalledWith(templateSelector);
    });

    it("should render the template", function(){
      expect(result).toHaveText(/renderer bar/);
    });
  });

  describe("when no template is provided", function(){
    var render;

    beforeEach(function(){
      render = _.bind(Backbone.Marionette.Renderer.render, Backbone.Marionette.Renderer);
    });

    it("should raise an error", function(){
      expect(render).toThrow("A template must be specified");
    });
  });

  describe("when overriding the `renderTemplate` method", function(){
    var oldRender, result;

    beforeEach(function(){
      oldRender = Backbone.Marionette.Renderer.renderTemplate;

      Backbone.Marionette.Renderer.renderTemplate = function(template, data){
        return "<foo>custom</foo>";
      };

      var promise = Backbone.Marionette.Renderer.render("", {});
      promise.done(function(html){
        result = $(html);
      });
    });

    afterEach(function(){
      Backbone.Marionette.Renderer.renderTemplate = oldRender;
    });

    it("should render the view with the overridden method", function(){
      expect(result).toHaveText("custom");
    });
  });

});
