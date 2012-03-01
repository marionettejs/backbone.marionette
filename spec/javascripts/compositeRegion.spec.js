describe("composite region", function(){
  var CompositeRegion = Backbone.Marionette.CompositeRegion.extend({
    template: "#composite-region-template",
    regions: {
      regionOne: "#region-one",
      regionTwo: "#region-two"
    }
  });

  describe("after rendering", function(){
    var compositeRegion;

    beforeEach(function(){
      loadFixtures("compositeRegionTemplate.html");
      compositeRegion = new CompositeRegion();
      compositeRegion.render();
    });

    it("should instantiate the specified region managers", function(){
      expect(compositeRegion.regionOne).not.toBeUndefined();
      expect(compositeRegion.regionTwo).not.toBeUndefined();
    });
  });

  describe("when closing", function(){
    var compositeRegion, regionOne, regionTwo;

    beforeEach(function(){
      loadFixtures("compositeRegionTemplate.html");
      compositeRegion = new CompositeRegion();
      compositeRegion.render();

      regionOne = compositeRegion.regionOne;
      regionTwo = compositeRegion.regionTwo;

      spyOn(regionOne, "close").andCallThrough();
      spyOn(regionTwo, "close").andCallThrough();

      compositeRegion.close();
    });

    it("should close the region managers", function(){
      expect(regionOne.close).toHaveBeenCalled();
      expect(regionTwo.close).toHaveBeenCalled();
    });

    it("should delete the region managers", function(){
      expect(compositeRegion.regionOne).toBeUndefined();
      expect(compositeRegion.regionTwo).toBeUndefined();
    });
  });

});
