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
    var view, region, regionManager, closeHandler;

    beforeEach(function(){
      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion("foo", "#foo");
      view = new Backbone.View();
      region.show(view);

      spyOn(regionManager, "triggerMethod").andCallThrough();
      spyOn(region, "triggerMethod").andCallThrough();
      spyOn(region, "close").andCallThrough();

      closeHandler = function(){
          expect(region.triggerMethod).not.toHaveBeenCalledWith("before:destroy", region);
      };
      region.on("close", closeHandler);

      regionManager.removeRegion("foo");
    });

    it("should close the region", function(){
      expect(region.close).toHaveBeenCalled();
    });

    it("should remove the region", function(){
      expect(regionManager.get("foo")).toBeUndefined();
    });

    it("should trigger a 'region:remove' event/method", function(){
      expect(regionManager.triggerMethod).toHaveBeenCalledWith("region:remove", "foo", region);
    });

    it("should trigger a 'close' event/method", function(){
      expect(region.triggerMethod).toHaveBeenCalledWith("close", view);
    });

    it("should trigger a 'before:destroy' event/method", function(){
      expect(region.triggerMethod).toHaveBeenCalledWith("before:destroy", region);
    });

    it("should adjust the length of the region manager by -1", function(){
      expect(regionManager.length).toBe(0);
    });
  });

  describe("when removing all regions", function(){
    var view, view2, region, r2, regionManager;
    var closeHandler, closeHandler2;

    beforeEach(function(){
      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion("foo", "#foo");
      r2 = regionManager.addRegion("bar", "#bar");

      spyOn(regionManager, "triggerMethod").andCallThrough();
      spyOn(region, "triggerMethod").andCallThrough();
      spyOn(r2, "triggerMethod").andCallThrough();
      spyOn(region, "close").andCallThrough();
      spyOn(r2, "close").andCallThrough();

      closeHandler = function(){
          expect(region.triggerMethod).not.toHaveBeenCalledWith("before:destroy", region);
      };
      region.on("close", closeHandler);

      close2Handler = function(){
          expect(r2.triggerMethod).not.toHaveBeenCalledWith("before:destroy", r2);
      };
      r2.on("close", close2Handler);

      view = Backbone.View();
      region.show(view);

      view2 = Backbone.View();
      r2.show(view2);

      regionManager.removeRegions();
    });

    it("should close the regions", function(){
      expect(region.close).toHaveBeenCalled();
      expect(r2.close).toHaveBeenCalled();
    });

    it("should remove the regions", function(){
      expect(regionManager.get("foo")).toBeUndefined();
      expect(regionManager.get("bar")).toBeUndefined();
    });

    it("should trigger a 'region:remove' event/method for each region", function(){
      expect(regionManager.triggerMethod).toHaveBeenCalledWith("region:remove", "foo", region);
      expect(regionManager.triggerMethod).toHaveBeenCalledWith("region:remove", "bar", r2);
    });

    it("should trigger a 'close' event/method for each region", function(){
      expect(region.triggerMethod).toHaveBeenCalledWith("close", view);
      expect(r2.triggerMethod).toHaveBeenCalledWith("close", view2);
    });

    it("should trigger a 'before:destroy' event/method for each region", function(){
      expect(region.triggerMethod).toHaveBeenCalledWith("before:destroy", region);
      expect(r2.triggerMethod).toHaveBeenCalledWith("before:destroy", r2);
    });
  });

  describe("when closing all regions", function(){
    var region, regionManager;

    beforeEach(function(){
      regionManager = new Marionette.RegionManager();
      region1 = regionManager.addRegion("foo", "#foo");
      region2 = regionManager.addRegion("bar", "#bar");
      view1 = new Backbone.View();
      view2 = new Backbone.View();

      spyOn(regionManager, "triggerMethod").andCallThrough();
      spyOn(region1, "triggerMethod").andCallThrough();
      spyOn(region2, "triggerMethod").andCallThrough();
      spyOn(region1, "close").andCallThrough();
      spyOn(region2, "close").andCallThrough();

      regionManager.closeRegions();
    });

    it("should close all regions", function(){
      expect(region1.close).toHaveBeenCalled();
      expect(region2.close).toHaveBeenCalled();
    });

    it("should not remove any regions", function(){
      expect(regionManager.get("foo")).toBe(region1);
      expect(regionManager.get("bar")).toBe(region2);
    });

    it("should not trigger a 'before:destroy' event/method on any region", function(){
      expect(region1.triggerMethod).not.toHaveBeenCalledWith("before:destroy", region1);
      expect(region2.triggerMethod).not.toHaveBeenCalledWith("before:destroy", region2);
    });
  });

  describe("when closing the region manager", function(){
    var regionManager;

    beforeEach(function(){
      regionManager = new Marionette.RegionManager();
      spyOn(regionManager, "removeRegions").andCallThrough();
      regionManager.close();
    });

    it("should call removeRegions()", function(){
      expect(regionManager.removeRegions).toHaveBeenCalled();
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
