describe("layout", function(){
  var LayoutManager = Backbone.Marionette.Layout.extend({
    template: "#layout-manager-template",
    regions: {
      regionOne: "#regionOne",
      regionTwo: "#regionTwo"
    },
    initialize: function() {
      if (this.model) {
        this.bindTo(this.model, 'change', this.render);
      }
    }
  });

  var CustomRegion1 = function() { 
  };

  var CustomRegion2 = function() {
  };
  
  var LayoutManagerCustomRegion = LayoutManager.extend({
    regionType: CustomRegion1,
    regions: {
      regionOne: {
        selector: '#regionOne',
        regionType: CustomRegion1
      },
      regionTwo: {
        selector: '#regionTwo',
        regionType: CustomRegion2
      },
      regionThree: {
        selector: '#regionThree'
      },
      regionFour: '#regionFour'
    }
  });
  
  var LayoutManagerNoDefaultRegion = LayoutManager.extend({
    regions: {
      regionOne: {
        selector: '#regionOne',
        regionType: CustomRegion1
      },
      regionTwo: '#regionTwo'
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

  describe("on instantiation with custom region managers", function() {
    var layoutManager;

    beforeEach(function() {
      layoutManager = new LayoutManagerCustomRegion 
    });
  
    it("should instantiate the default regionManager if specified", function() {
      var layoutManagerCustomRegion = new LayoutManagerCustomRegion();
      expect(layoutManagerCustomRegion).toHaveOwnProperty("regionThree");
      expect(layoutManagerCustomRegion.regionThree).toBeInstanceOf(CustomRegion1);
      expect(layoutManagerCustomRegion).toHaveOwnProperty("regionThree");
      expect(layoutManagerCustomRegion.regionThree).toBeInstanceOf(CustomRegion1);
    });

    it("should instantiate specific regions with custom regions if speficied", function() {
      var layoutManagerCustomRegion = new LayoutManagerCustomRegion(); 
      expect(layoutManagerCustomRegion).toHaveOwnProperty("regionOne");
      expect(layoutManagerCustomRegion.regionOne).toBeInstanceOf(CustomRegion1);
      expect(layoutManagerCustomRegion).toHaveOwnProperty("regionTwo");
      expect(layoutManagerCustomRegion.regionTwo).toBeInstanceOf(CustomRegion2);
    });

    it("should instantiate marionette regions is no regionType is specified", function() {
      var layoutManagerNoDefault = new LayoutManagerNoDefaultRegion();
      expect(layoutManagerNoDefault).toHaveOwnProperty("regionTwo");
      expect(layoutManagerNoDefault.regionTwo).toBeInstanceOf(Backbone.Marionette.Region);
    });
  });

  describe("on rendering", function(){
    var layoutManager;
    var deferredResolved;

    beforeEach(function(){
      loadFixtures("layoutManagerTemplate.html");
      layoutManager = new LayoutManager();
      layoutManager.render();
    });

    it("should find the region scoped within the rendered template", function(){
      layoutManager.regionOne.ensureEl();
      var el = layoutManager.$("#regionOne");
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

      layout = new LayoutManager({
        model: new Backbone.Model()
      });
      layout.render();
      region = layout.regionOne;

      view = new Backbone.View();
      view.close = function(){};
      layout.regionOne.show(view);

      spyOn(region, "reset").andCallThrough();
      spyOn(view, "close").andCallThrough();

      layout.render();
      layout.regionOne.show(view);
    });

    it("should reset the regions", function(){
      expect(region.reset.callCount).toBe(1);
    });

    it("should close the regions", function(){
      expect(view.close.callCount).toBe(1);
    });

    it("should re-bind the regions to the newly rendered elements", function(){
      var regionEl = layout.$("#regionOne");
      expect(region.$el[0]).toBe(regionEl[0]);
    });

    it("should re-bind the regions correctly when the view's `render` function is bound to an event in the `initialize` function", function(){
      layout.onRender = function() {
        this.regionOne.show(view);
      };

      layout.model.trigger('change');
      expect(layout.$("#regionOne")).not.toBeEmpty();
    });
  });

  describe("when re-rendering a closed layout", function(){
    var region, layout, view;

    beforeEach(function(){
      loadFixtures("layoutManagerTemplate.html");

      layout = new LayoutManager();
      layout.render();
      region = layout.regionOne;

      view = new Backbone.View();
      view.close = function(){};
      layout.regionOne.show(view);
      layout.close();

      spyOn(region, "close").andCallThrough();
      spyOn(view, "close").andCallThrough();

      layout.render();
    });

    it("should re-initialize the regions to the newly rendered elements", function(){
      expect(layout).toHaveOwnProperty("regionOne");
      expect(layout).toHaveOwnProperty("regionTwo");
    });
  });

});
