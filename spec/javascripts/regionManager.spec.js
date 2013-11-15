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

    it("should increment the length", function(){
      expect(regionManager.length).toBe(1);
    });
  });

  describe("when adding a region with a name and a region instance", function(){
    var region, builtRegion, regionManager, addHandler;

    beforeEach(function(){
      addHandler = jasmine.createSpy("region:add handler");

      regionManager = new Marionette.RegionManager();
      regionManager.on("region:add", addHandler);

      region = new Marionette.Region({el: "#foo"});
      builtRegion = regionManager.addRegion("foo", region);
    });

    it("should use the supplied region", function(){
      expect(builtRegion).toBe(region);
    });

    it("should store the region by name", function(){
      expect(regionManager.get("foo")).toBe(region);
    });

    it("should trigger a 'region:add' event/method", function(){
      expect(addHandler).toHaveBeenCalledWith("foo", region);
    });

    it("should increment the length", function(){
      expect(regionManager.length).toBe(1);
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

  describe("when adding a region and supplying a parent element as a function", function(){
    var region, regionManager, addHandler, context, parentElHandler, view;

    beforeEach(function(){
      context = $("<div><div id='foo'></div><div id='bar'></div></div>");
      parentElHandler = jasmine.createSpy("parent el handler").andReturn(context);
      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion("foo", {
        selector: "#foo",
        parentEl: parentElHandler
      });

      view = new Backbone.View();
      region.show(view);
    });

    it("should set the region's selector within the supplied jQuery selector object", function(){
      expect(region.$el.parent()).toBe(context);
    });
  });

  describe("when adding multiple regions", function(){
    var regions, regionManager;

    beforeEach(function(){
      regionManager = new Marionette.RegionManager();

      regions = regionManager.addRegions({
        foo: "#bar",
        baz: "#quux"
      });
    });

    it("should add all specified regions", function(){
      expect(regionManager.get("foo")).not.toBeUndefined();
      expect(regionManager.get("baz")).not.toBeUndefined();
    });

    it("should return an object literal containing all named region instances", function(){
      expect(regions.foo).toBe(regionManager.get("foo"));
      expect(regions.baz).toBe(regionManager.get("baz"));
    });
  });

  describe("when adding multiple regions with region instances supplied", function(){
    var fooRegion, regions, regionManager;

    beforeEach(function(){
      fooRegion = new Marionette.Region({el: "#foo"});
      regionManager = new Marionette.RegionManager();

      regions = regionManager.addRegions({
        foo: fooRegion
      });
    });

    it("should add all specified regions", function(){
      expect(regionManager.get("foo")).toBe(fooRegion);
    });

    it("should return an object literal containing all named region instances", function(){
      expect(regions.foo).toBe(fooRegion);
    });
  });

  describe("when adding multiple regions with a defaults set", function(){
    var regions, regionManager, parent;

    beforeEach(function(){
      regionManager = new Marionette.RegionManager();

      parent = $("<div></div>")

      var defaults = {
        parentEl: parent
      };

      regions = regionManager.addRegions({
        foo: "#bar",
        baz: "#quux"
      }, defaults);
    });

    it("should add all specified regions with the specified defaults", function(){
      expect(regionManager.get("foo")).not.toBeUndefined();
      expect(regionManager.get("baz")).not.toBeUndefined();
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

      regionManager.removeRegion("foo");
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

    it("should adjust the length of the region manager by -1", function(){
      expect(regionManager.length).toBe(0);
    });
  });

  describe("when removing all regions", function(){
    var region, r2, regionManager, closeHandler, closeHandler2, removeHandler;

    beforeEach(function(){
      closeHandler = jasmine.createSpy("close handler");
      closeHandler2 = jasmine.createSpy("close handler");
      removeHandler = jasmine.createSpy("remove handler");

      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion("foo", "#foo");
      r2 = regionManager.addRegion("bar", "#bar");

      region.show(new Backbone.View());
      r2.show(new Backbone.View());

      region.on("close", closeHandler);
      r2.on("close", closeHandler2);

      regionManager.on("region:remove", removeHandler);

      regionManager.removeRegions();
    });

    it("should close the regions", function(){
      expect(closeHandler).toHaveBeenCalled();
      expect(closeHandler2).toHaveBeenCalled();
    });

    it("should remove the regions", function(){
      expect(regionManager.get("foo")).toBeUndefined();
      expect(regionManager.get("bar")).toBeUndefined();
    });

    it("should trigger a 'region:remove' event/method for each region", function(){
      expect(removeHandler).toHaveBeenCalledWith("foo", region);
      expect(removeHandler).toHaveBeenCalledWith("bar", r2);
    });
  });

  describe("when closing all regions", function(){
    var region, regionManager, closeHandler;

    beforeEach(function(){
      closeHandler = jasmine.createSpy("close region handler");
      closeManagerHandler = jasmine.createSpy("close manager handler");

      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion("foo", "#foo");
      region.show(new Backbone.View());

      region.on("close", closeHandler);

      regionManager.closeRegions();
    });

    it("should close all regions", function(){
      expect(closeHandler).toHaveBeenCalled();
    });

    it("should not remove all regions", function(){
      expect(regionManager.get("foo")).toBe(region);
    });
  });

  describe("when closing the region manager", function(){
    var region, regionManager, closeManagerHandler;

    beforeEach(function(){
      closeHandler = jasmine.createSpy("close region handler");
      closeManagerHandler = jasmine.createSpy("close manager handler");

      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion("foo", "#foo");
      region.show(new Backbone.View());

      region.on("close", closeHandler);
      regionManager.on("close", closeManagerHandler);

      regionManager.close();
    });

    it("should close all regions", function(){
      expect(closeHandler).toHaveBeenCalled();
    });

    it("should remove all regions", function(){
      expect(regionManager.get("foo")).toBeUndefined();
    });

    it("should trigger a 'close' event/method", function(){
      expect(closeManagerHandler).toHaveBeenCalled();
    });
  });

  describe("when iterating the region manager", function(){
    var cb, r1, r2, r3;

    beforeEach(function(){
      cb = jasmine.createSpy("iterator callback");

      var rm = new Marionette.RegionManager();

      r1 = rm.addRegion("foo", "#foo");
      r2 = rm.addRegion("bar", "#bar");
      r3 = rm.addRegion("baz", "#baz");

      rm.each(cb);
    });

    it("should provide access to each region", function(){
      expect(cb.calls[0].args[0]).toBe(r1);
      expect(cb.calls[1].args[0]).toBe(r2);
      expect(cb.calls[2].args[0]).toBe(r3);
    });
  });

});
