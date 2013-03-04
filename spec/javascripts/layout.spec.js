describe("layout", function(){
  "use strict";

  var Layout = Backbone.Marionette.Layout.extend({
    template: "#layout-manager-template",
    regions: {
      regionOne: "#regionOne",
      regionTwo: "#regionTwo"
    },
    initialize: function() {
      if (this.model) {
        this.listenTo(this.model, 'change', this.render);
      }
    }
  });

  var CustomRegion1 = function() { 
  };

  var CustomRegion2 = function() {
  };
  
  var LayoutNoDefaultRegion = Layout.extend({
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
      layoutManager = new Layout();
    });

    it("should instantiate the specified region managers", function(){
      expect(layoutManager).toHaveOwnProperty("regionOne");
      expect(layoutManager).toHaveOwnProperty("regionTwo");
    });

  });

  describe("on instantiation with no regions defined", function(){
    var NoRegions = Marionette.Layout.extend({});
    var layoutManager;

    function init(){
      layoutManager = new NoRegions();
    };

    it("should instantiate the specified region managers", function(){
      expect(init).not.toThrow();
    });

  });

  describe("on instantiation with custom region managers", function() {
    var LayoutCustomRegion = Layout.extend({
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
  
    var layoutManager;

    beforeEach(function() {
      layoutManager = new LayoutCustomRegion 
    });
  
    it("should instantiate the default regionManager if specified", function() {
      expect(layoutManager).toHaveOwnProperty("regionThree");
      expect(layoutManager.regionThree).toBeInstanceOf(Marionette.Region);
      expect(layoutManager).toHaveOwnProperty("regionThree");
      expect(layoutManager.regionThree).toBeInstanceOf(Marionette.Region);
    });

    it("should instantiate specific regions with custom regions if speficied", function() {
      expect(layoutManager).toHaveOwnProperty("regionOne");
      expect(layoutManager.regionOne).toBeInstanceOf(CustomRegion1);
      expect(layoutManager).toHaveOwnProperty("regionTwo");
      expect(layoutManager.regionTwo).toBeInstanceOf(CustomRegion2);
    });

    it("should instantiate marionette regions is no regionType is specified", function() {
      var layoutManagerNoDefault = new LayoutNoDefaultRegion();
      expect(layoutManagerNoDefault).toHaveOwnProperty("regionTwo");
      expect(layoutManagerNoDefault.regionTwo).toBeInstanceOf(Backbone.Marionette.Region);
    });
  });

  describe("when regions are defined as a function", function(){
    var options, layout;

    var Layout = Marionette.Layout.extend({
      template: "#foo",
      regions: function(opts){
        options = opts;
        return {
          "foo": "#bar"
        };
      }
    });

    beforeEach(function(){
      setFixtures("<div id='foo'><div id='bar'></div></div>");
      layout = new Layout();
      layout.render();
    });

    it("should supply the layout.options to the function when calling it", function(){
      expect(options).toBe(layout.options);
    });

    it("should build the regions from the returns object literal", function(){
      expect(layout).toHaveOwnProperty("foo");
      expect(layout.foo).toBeInstanceOf(Backbone.Marionette.Region);
    });
  });

  describe("on rendering", function(){
    var layoutManager;
    var deferredResolved;

    beforeEach(function(){
      loadFixtures("layoutManagerTemplate.html");
      layoutManager = new Layout();
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
      layoutManager = new Layout();
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

  describe("when showing a layout via a region", function(){
    var region, layout, regionOne;

    beforeEach(function(){
      setFixtures("<div id='mgr'></div>");
      loadFixtures("layoutManagerTemplate.html");

      layout = new Layout();
      layout.onRender = function(){
        regionOne = layout.regionOne;
        regionOne.ensureEl();
      };

      region = new Backbone.Marionette.Region({
        el: "#mgr"
      });
      region.show(layout);
    });

    it("should make the regions available in `onRender`", function(){
      expect(regionOne).not.toBeUndefined();
    });

    it("the regions should find their elements in `onRender`", function(){
      expect(regionOne.$el.length).toBe(1);
    });
  });

  describe("when re-rendering an already rendered layout", function(){
    var region, layout, view, closeRegionsSpy;

    beforeEach(function(){
      loadFixtures("layoutManagerTemplate.html");

      layout = new Layout({
        model: new Backbone.Model()
      });
      layout.render();

      view = new Backbone.View();
      view.close = function(){};
      layout.regionOne.show(view);

      closeRegionsSpy = spyOn(layout.regionManager, "closeRegions").andCallThrough();

      layout.render();
      layout.regionOne.show(view);
      region = layout.regionOne;
    });

    it("should close the regions", function(){
      expect(closeRegionsSpy.callCount).toBe(1);
    });

    it("should re-bind the regions to the newly rendered elements", function(){
      expect(layout.regionOne.$el.parent()).toBe(layout.$el);
    });

    describe("and the view's `render` function is bound to an event in the `initialize` function", function(){
      beforeEach(function(){
        layout.onRender = function() {
          this.regionOne.show(view);
        };

        layout.model.trigger('change');
      });

      it("should re-bind the regions correctly", function(){
        expect(layout.$("#regionOne")).not.toBeEmpty();
      });
    });

  });

  describe("when re-rendering a closed layout", function(){
    var region, layout, view;

    beforeEach(function(){
      loadFixtures("layoutManagerTemplate.html");

      layout = new Layout();
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
