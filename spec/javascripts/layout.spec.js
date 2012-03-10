describe("layout", function(){
  var LayoutManager = Backbone.Marionette.Layout.extend({
    template: "#layout-manager-template",
    regions: {
      regionOne: "#region-one",
      regionTwo: "#region-two"
    }
  });

  describe("on rendering", function(){
    var layoutManager;

    beforeEach(function(){
      loadFixtures("layoutManagerTemplate.html");
      layoutManager = new LayoutManager();
      layoutManager.render();
    });

    it("should instantiate the specified region managers", function(){
      expect(layoutManager.regionOne).not.toBeUndefined();
      expect(layoutManager.regionTwo).not.toBeUndefined();
    });

    it("should find the region scoped within the rendered template", function(){
      layoutManager.regionOne.ensureEl();
      var el = layoutManager.$("#region-one");
      expect(layoutManager.regionOne.$el[0]).toEqual(el[0]);
    });
  });

  describe("when closing", function(){
    var layoutManager, regionOne, regionTwo;

    beforeEach(function(){
      loadFixtures("layoutManagerTemplate.html");
      layoutManager = new LayoutManager();
      layoutManager.render();

      regionOne = layoutManager.regionOne;
      regionTwo = layoutManager.regionTwo;

      spyOn(regionOne, "close").andCallThrough();
      spyOn(regionTwo, "close").andCallThrough();

      layoutManager.close();
    });

    it("should close the region managers", function(){
      expect(regionOne.close).toHaveBeenCalled();
      expect(regionTwo.close).toHaveBeenCalled();
    });

    it("should delete the region managers", function(){
      expect(layoutManager.regionOne).toBeUndefined();
      expect(layoutManager.regionTwo).toBeUndefined();
    });
  });

  describe("when showing via a region manager", function(){
    it("should make the regions available in `onRender`", function(){
      throw "not yet implemented";
    });

    it("the regions should find their elements in `onRender`", function(){
      throw "not yet implemented";
    });
  });

});
