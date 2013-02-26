describe("region manager", function(){

  describe("when adding a region with a name and selector", function(){
    var region, regionManager, addHandler;

    beforeEach(function(){
      addHandler = jasmine.createSpy("region:add handler");

      regionManager = new Marionette.RegionManager();
      regionManager.on("region:add", addHandler);

      region = regionManager.addRegion("foo", "#foo");
    });

    it("should create the region", function(){
      expect(region).not.toBeUndefined();
    });

    it("should store the region by name", function(){
      expect(regionManager.get("foo")).toBe(region);
    });

    it("should trigger a 'region:add' event/method", function(){
      expect(addHandler).toHaveBeenCalled();
    });
  });

  xdescribe("when removing a region by name", function(){
    it("should close the region", function(){
      throw new Error("not yet implemented");
    });

    it("should remove the region", function(){
      throw new Error("not yet implemented");
    });

    it("should trigger a 'region:remove' event/method", function(){
      throw new Error("not yet implemented");
    });
  });

  xdescribe("when closing the region manager", function(){
    it("should close all region managers", function(){
      throw new Error("not yet implemented");
    });

    it("should remove all region managers", function(){
      throw new Error("not yet implemented");
    });

    it("should trigger a 'close' event/method", function(){
      throw new Error("not yet implemented");
    });
  });

});
