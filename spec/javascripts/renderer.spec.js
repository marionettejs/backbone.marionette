describe("renderer", function(){

  describe("when given a template id to render", function(){
    var templateSelector = "#renderer-template";
    var result;

    beforeEach(function(){
      loadFixtures("rendererTemplate.html");
      spyOn(Backbone.Marionette.TemplateCache, "get").andCallThrough();
      var html = Backbone.Marionette.Renderer.render(templateSelector);
      result = $(html);
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
      var html = Backbone.Marionette.Renderer.render(templateSelector, data);
      result = $(html);
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
      expect(render).toThrow("Could not find template: 'undefined'");
    });
  });

  describe("when overriding the `render` method", function(){
    var oldRender, result;

    beforeEach(function(){
      oldRender = Backbone.Marionette.Renderer.render;

      Backbone.Marionette.Renderer.render = function(template, data){
        return "<foo>custom</foo>";
      };

      result = Backbone.Marionette.Renderer.render("", {});
      result = $(result);
    });

    afterEach(function(){
      Backbone.Marionette.Renderer.render = oldRender;
    });

    it("should render the view with the overridden method", function(){
      expect(result).toHaveText("custom");
    });
  });

  describe("when providing a precompiled template", function(){
    it("should use the provided template function", function(){
      var templateFunction = _.template('<%= foo %>');
      var result = Backbone.Marionette.Renderer.render(templateFunction,{foo : 'bar'});
      expect(result).toEqual("bar");
    });
  });

});
