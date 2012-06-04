describe("layout", function(){
  var LayoutManager = Backbone.Marionette.Layout.extend({
    template: "#layout-manager-template",
    regions: {
      regionOne: "#regionOne",
      regionTwo: "#regionTwo"
    }
  });

  describe("on instantiation", function(){
    var layoutManager;

    beforeEach(function(){
      layoutManager = new LayoutManager();
    });

    it("should instantiate the specified region managers", function(){
      expect(layoutManager).toHaveOwnProperty("regionOne");
      expect(layoutManager).toHaveOwnProperty("regionTwo");
    });

  });

  describe("on rendering", function(){
    var layoutManager;
    var deferredResolved;

    beforeEach(function(){
      loadFixtures("layoutManagerTemplate.html");
      layoutManager = new LayoutManager();
      var deferred = layoutManager.render();

      deferred.done(function(){deferredResolved = true;});
    });

    it("should find the region scoped within the rendered template", function(){
      layoutManager.regionOne.ensureEl();
      var el = layoutManager.$("#regionOne");
      expect(layoutManager.regionOne.$el[0]).toEqual(el[0]);
    });

    it("should resolve the render's deferred", function(){
      expect(deferredResolved).toBeTruthy();
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
    var region, layout, regionOne, r1el;

    beforeEach(function(){
      setFixtures("<div id='mgr'></div>");
      loadFixtures("layoutManagerTemplate.html");

      region = new Backbone.Marionette.Region({
        el: "#mgr"
      });

      layout = new LayoutManager();
      layout.onRender = function(){
        regionOne = this.regionOne;
        regionOne.ensureEl();
        r1el = regionOne.$el;
      };

      region.show(layout);
    });

    it("should make the regions available in `onRender`", function(){
      expect(regionOne).not.toBeUndefined();
    });

    it("the regions should find their elements in `onRender`", function(){
      expect(r1el.length).toBe(1);
    });
  });

  describe("when re-rendering an already rendered layout", function(){
    var region, layout, view;

    beforeEach(function(){
      loadFixtures("layoutManagerTemplate.html");

      view = new Backbone.View();
      layout = new LayoutManager();
      layout.render();

      layout.regionOne.show(view);

      region = layout.regionOne;
      spyOn(region, "close").andCallThrough();

      layout.render();
      layout.regionOne.show(view);
    });

    it("should close the regions and associated views", function(){
      expect(region.close.callCount).toBe(2);
    });

    it("should re-bind the regions to the newly rendered elements", function(){
      var regionEl = layout.$("#regionOne");
      expect(region.$el[0]).toBe(regionEl[0]);
    });
  });

});
