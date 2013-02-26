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
      expect(addHandler).toHaveBeenCalledWith("foo", region);
    });
  });

  describe("when adding a region and supplying a parent element", function(){
    var region, regionManager, addHandler, context;

    beforeEach(function(){
      context = $("<div><div id='foo'></div><div id='bar'></div></div>");
      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion("foo", {
        selector: "#foo",
        parentEl: context
      });

      region.show(new Backbone.View());
    });

    it("should set the region's selector within the supplied jQuery selector object", function(){
      expect(region.$el.parent()).toBe(context);
    });
  });

  describe("when removing a region by name", function(){
    var region, regionManager, closeHandler, removeHandler;

    beforeEach(function(){
      closeHandler = jasmine.createSpy("close handler");
      removeHandler = jasmine.createSpy("remove handler");

      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion("foo", "#foo");
      region.show(new Backbone.View());

      region.on("close", closeHandler);
      regionManager.on("region:remove", removeHandler);

      regionManager.remove("foo");
    });

    it("should close the region", function(){
      expect(closeHandler).toHaveBeenCalled();
    });

    it("should remove the region", function(){
      expect(regionManager.get("foo")).toBeUndefined();
    });

    it("should trigger a 'region:remove' event/method", function(){
      expect(removeHandler).toHaveBeenCalledWith("foo", region);
    });
  });

  xdescribe("when closing the region manager", function(){
    var region, regionManager, closeHandler, removeHandler;

    beforeEach(function(){
      closeHandler = jasmine.createSpy("close handler");
      removeHandler = jasmine.createSpy("remove handler");

      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion("foo", "#foo");
      region.show(new Backbone.View());

      region.on("close", closeHandler);
      regionManager.on("region:remove", removeHandler);

      regionManager.remove("foo");
    });

    it("should close all regions", function(){
      throw new Error("not yet implemented");
    });

    it("should remove all regions", function(){
      throw new Error("not yet implemented");
    });

    it("should trigger a 'close' event/method", function(){
      throw new Error("not yet implemented");
    });
  });

});
