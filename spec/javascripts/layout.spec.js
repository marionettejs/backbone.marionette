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

  var CustomRegion2 = Backbone.Marionette.Region.extend();

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
          regionType: CustomRegion2,
          specialOption: true
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

    it("should instantiate specific regions with custom regions if speficied", function() {
      expect(layoutManager).toHaveOwnProperty("regionOne");
      expect(layoutManager.regionOne).toBeInstanceOf(CustomRegion1);
      expect(layoutManager).toHaveOwnProperty("regionTwo");
      expect(layoutManager.regionTwo).toBeInstanceOf(CustomRegion2);
    });

    it("should instantiate the default regionManager if specified", function() {
      expect(layoutManager).toHaveOwnProperty("regionThree");
      expect(layoutManager.regionThree).toBeInstanceOf(CustomRegion1);
      expect(layoutManager).toHaveOwnProperty("regionFour");
      expect(layoutManager.regionThree).toBeInstanceOf(CustomRegion1);
    });

    it("should instantiate marionette regions is no regionType is specified", function() {
      var layoutManagerNoDefault = new LayoutNoDefaultRegion();
      expect(layoutManagerNoDefault).toHaveOwnProperty("regionTwo");
      expect(layoutManagerNoDefault.regionTwo).toBeInstanceOf(Backbone.Marionette.Region);
    });

    it("should pass extra options to the custom regionType", function() {
      expect(layoutManager.regionTwo).toHaveOwnProperty("options");
      expect(layoutManager.regionTwo.options).toHaveOwnProperty("specialOption");
      expect(layoutManager.regionTwo.options.specialOption).toBeTruthy();
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
      expect(options).toEqual(layout.options);
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

  describe("when destroying", function(){
    var layoutManager, regionOne, regionTwo;

    beforeEach(function(){
      loadFixtures("layoutManagerTemplate.html");
      layoutManager = new Layout();
      layoutManager.render();

      regionOne = layoutManager.regionOne;
      regionTwo = layoutManager.regionTwo;

      spyOn(regionOne, "destroy").andCallThrough();
      spyOn(regionTwo, "destroy").andCallThrough();

      layoutManager.destroy();
    });

    it("should destroy the region managers", function(){
      expect(regionOne.destroy).toHaveBeenCalled();
      expect(regionTwo.destroy).toHaveBeenCalled();
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
      appendLoadFixtures("layoutManagerTemplate.html");

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
    var region, layout, view, destroyRegionsSpy;

    beforeEach(function(){
      loadFixtures("layoutManagerTemplate.html");

      layout = new Layout({
        model: new Backbone.Model()
      });
      layout.render();

      view = new Backbone.View();
      view.destroy = function(){};
      layout.regionOne.show(view);

      destroyRegionsSpy = spyOn(layout.regionManager, "destroyRegions").andCallThrough();

      layout.render();
      layout.regionOne.show(view);
      region = layout.regionOne;
    });

    it("should destroy the regions", function(){
      expect(destroyRegionsSpy.callCount).toBe(1);
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

  describe("when re-rendering a destroyed layout", function(){
    var region, layout, view;

    beforeEach(function(){
      loadFixtures("layoutManagerTemplate.html");

      layout = new Layout();
      layout.render();
      region = layout.regionOne;

      view = new Backbone.View();
      view.destroy = function(){};
      layout.regionOne.show(view);
      layout.destroy();

      spyOn(region, "destroy").andCallThrough();
      spyOn(view, "destroy").andCallThrough();

      layout.onBeforeRender = jasmine.createSpy("before render");
      layout.onRender = jasmine.createSpy("on render");
    });

    it("should throw an error", function(){
      expect(layout.render).toThrow("Cannot use a view that's already been destroyed.");
    });
  });

  describe("has a valid inheritance chain back to Marionette.View", function(){
    var constructor;

    beforeEach(function(){
      constructor = spyOn(Marionette.View.prototype, "constructor");
      new Marionette.Layout();
    });

    it("calls the parent Marionette.View's constructor function on instantiation", function(){
      expect(constructor).toHaveBeenCalled();
    });
  });

  describe("when getting a region", function () {
    beforeEach(function () {
      this.layout = new Layout();
      this.region = this.layout.regionOne;
    });

    it("should return the region", function () {
      expect(this.layout.getRegion("regionOne")).toBe(this.region);
    });
  });

});
