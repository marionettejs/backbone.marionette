describe("region", function(){
  "use strict";

  describe("when creating a new region and no configuration has been provided", function(){
    it("should throw an exception saying an 'el' is required", function(){
      expect(
        Backbone.Marionette.Region.extend({})
      ).toThrow("An 'el' must be specified for a region.");
    });
  });

  describe("when creating a new region and the 'el' does not exist in DOM", function(){
    var MyRegion = Backbone.Marionette.Region.extend({
      el: "#not-existed-region",
    });

    var MyView = Backbone.Marionette.View.extend({
      render: function(){
        $(this.el).html("some content");
      }
    });

    var myRegion, view;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      myRegion = new MyRegion();
    });

    describe("when showing a view", function(){
      it("should throw an exception saying an 'el' doesn't exist in DOM", function(){
        var view = new MyView();
        expect(function() {
          myRegion.show(view);
        }).toThrow("An 'el' #not-existed-region must exist in DOM");
      });
    });
  });

  describe("when showing a view", function(){
    var MyRegion = Backbone.Marionette.Region.extend({
      el: "#region",

      onShow: function(){}
    });

    var MyView = Backbone.View.extend({
      render: function(){
        $(this.el).html("some content");
      },

      destroy: function(){
      },

      onShow: function(){
        $(this.el).addClass("onShowClass");
      }
    });

    var myRegion, view, showSpy, regionBeforeShowSpy, viewBeforeShowSpy, openSpy;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");
      showSpy = sinon.spy();
      regionBeforeShowSpy = sinon.spy();
      viewBeforeShowSpy = sinon.spy();

      view = new MyView();
      spyOn(view, "render").andCallThrough();

      myRegion = new MyRegion();
      spyOn(myRegion, "onShow");
      openSpy = sinon.spy(myRegion, "open");

      myRegion.on("show", showSpy);
      myRegion.on("before:show", regionBeforeShowSpy);

      view.on("before:show", viewBeforeShowSpy);

      myRegion.show(view);
    });

    it("should render the view", function(){
      expect(view.render).toHaveBeenCalled();
    });

    it("should append the rendered HTML to the manager's 'el'", function(){
      expect(myRegion.$el).toHaveHtml(view.el);
    });

    it("should call region open", function() {
      expect(openSpy).toHaveBeenCalled();
    });

    it("should call 'onShow' for the view, after the rendered HTML has been added to the DOM", function(){
      expect($(view.el)).toHaveClass("onShowClass");
    })

    it("should call 'onShow' for the region, after the rendered HTML has been added to the DOM", function(){
      expect(myRegion.onShow).toHaveBeenCalled();
    })

    it("should trigger a show event for the view", function(){
      expect(showSpy).toHaveBeenCalled();
    });

    it("should trigger a before show event for the region", function() {
      expect(regionBeforeShowSpy).toHaveBeenCalled();
    });

    it("should trigger a before show event for the view", function() {
      expect(viewBeforeShowSpy).toHaveBeenCalled();
    });

    it("should trigger a before show before open is called", function() {
      expect(regionBeforeShowSpy.calledBefore(openSpy)).toBe(true);
    });

    it("should pass the shown view as an argument for the show event", function(){
      expect(showSpy).toHaveBeenCalledWith(view);
    });

    it("should set 'this' to the manager, from the show event", function(){
      expect(showSpy).toHaveBeenCalledOn(myRegion);
    });

    describe("when passing 'preventDestroy' option", function(){

      var myRegion, view1, view2;

      beforeEach(function(){
        setFixtures("<div id='region'></div>");

        view1 = new MyView();
        view2 = new MyView();
        myRegion = new MyRegion();

        spyOn(view1, "destroy").andCallThrough();

        myRegion.show(view1);
      });

      describe("preventDestroy: true", function(){
        beforeEach(function(){
          myRegion.show(view2, { preventDestroy: true });
        });

        it("shouldn't 'destroy' the old view", function(){
          expect(view1.destroy.callCount).toEqual(0);
        });
      });

      describe("preventDestroy: false", function(){
        beforeEach(function(){
          myRegion.show(view2, { preventDestroy: false });
        });

        it("should 'close' the old view", function(){
          expect(view1.destroy).toHaveBeenCalled();
        });
      });
    });
  });

  describe("when showing nested views", function() {
    var MyRegion, Layout, SubView, SubView, region,
        openSpy, innerRegionBeforeShowSpy, innerRegionShowSpy;

    MyRegion = Backbone.Marionette.Region.extend({
      el: "#region"
    });

    Layout = Backbone.Marionette.Layout.extend({
      regions: {
        subRegion: '.sub-region'
      },

      render: function(){
        $(this.el).html("<div class='sub-region'></div><div>some content</div>");
      },

      onBeforeShow: function() {
        this.subRegion.show(new SubView());
      }
    });

    SubView = Backbone.Marionette.ItemView.extend({
      render: function(){
        $(this.el).html("some content");
      },

      initialize: function() {
        innerRegionBeforeShowSpy = sinon.spy();
        innerRegionShowSpy = sinon.spy();
        this.on("before:show", innerRegionBeforeShowSpy);
        this.on("show", innerRegionShowSpy);
      }
    });

    beforeEach(function() {
      setFixtures("<div id='region'></div>");
      region = new MyRegion();
      openSpy = sinon.spy(region, 'open');
      region.show(new Layout());
    });

    it("should call inner region before:show before region open", function() {
      expect(innerRegionBeforeShowSpy.calledBefore(openSpy)).toBe(true);
    });

    it("should call inner region show before region open", function() {
      expect(innerRegionShowSpy.calledBefore(openSpy)).toBe(true);
    });

    it("should call inner region before:show before inner region show", function() {
      expect(innerRegionBeforeShowSpy.calledBefore(innerRegionShowSpy)).toBe(true);
    });
  });

  describe("when a view is already shown and showing another", function(){
    var MyRegion = Backbone.Marionette.Region.extend({
      el: "#region"
    });

    var MyView = Backbone.View.extend({
      render: function(){
        $(this.el).html("some content");
      },

      destroy: function(){
      }
    });

    var myRegion, view1, view2;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      view1 = new MyView();
      view2 = new MyView();
      myRegion = new MyRegion();

      spyOn(view1, "destroy");

      myRegion.show(view1);
      myRegion.show(view2);
    });

    it("should call 'destroy' on the already open view", function(){
      expect(view1.destroy).toHaveBeenCalled();
    });

    it("should reference the new view as the current view", function(){
      expect(myRegion.currentView).toBe(view2);
    });
  });

  describe("when a view is already shown and showing the same one", function(){
    var MyRegion = Backbone.Marionette.Region.extend({
      el: "#region"
    });

    var MyView = Backbone.View.extend({
      render: function(){
        $(this.el).html("some content");
      },

      destroy: function(){
      },

      open: function(){
      }
    });

    var myRegion, view;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      view = new MyView();
      myRegion = new MyRegion();
      myRegion.show(view);

      spyOn(view, "destroy");
      spyOn(myRegion, "open");
      spyOn(view, "render");
      myRegion.show(view);
    });

    it("should not call 'destroy' on the view", function(){
      expect(view.destroy).not.toHaveBeenCalled();
    });

    it("should not call 'open' on the view", function(){
      expect(myRegion.open).not.toHaveBeenCalledWith(view);
    });

    it("should call 'render' on the view", function(){
      expect(view.render).toHaveBeenCalled();
    });
  });

  describe("when a view is already shown but destroyed externally", function(){
    var MyRegion = Backbone.Marionette.Region.extend({
      el: "#region"
    });

    var MyView = Backbone.Marionette.ItemView.extend({
      template: _.template('<div></div>'),
      open : function() {}
    });

    var myRegion, view;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      view = new MyView();
      myRegion = new MyRegion();
      myRegion.show(view);
      view.destroy();

      spyOn(view, "destroy");
      spyOn(myRegion, "open");
      spyOn(view, "render").andCallThrough();
    });

    it("should throw an error saying the view's been destroyed if a destroyed view is passed in", function(){
      expect(function () { myRegion.show(view); }).toThrow(new Error("Cannot use a view that's already been destroyed."));
    });
  });

  describe("when a view is already destroyed and showing another", function(){
    var MyRegion = Backbone.Marionette.Region.extend({
      el: "#region"
    });

    var MyView = Backbone.Marionette.View.extend({
      render: function(){
        $(this.el).html("some content");
      }
    });

    var myRegion, view1, view2;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      view1 = new MyView();
      view2 = new MyView();
      myRegion = new MyRegion();

      spyOn(view1, "destroy").andCallThrough();
    });

    it("shouldn't call 'destroy' on an already destroyed view", function(){
      myRegion.show(view1);
      view1.destroy();
      myRegion.show(view2);

      expect(view1.destroy.callCount).toEqual(1);
    });
  });

  describe("when destroying the current view", function(){
    var MyRegion = Backbone.Marionette.Region.extend({
      el: "#region"
    });

    var MyView = Backbone.View.extend({
      render: function(){
        $(this.el).html("some content");
      },

      destroy: function(){
      }
    });


    var myRegion, view, destroyedSpy, destroyed;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");
      destroyedSpy = sinon.spy();

      view = new MyView();

      spyOn(view, "destroy");
      spyOn(view, "remove");

      myRegion = new MyRegion();

      myRegion.on("destroy", destroyedSpy);
      myRegion.show(view);

      myRegion.destroy();
    });

    it("should trigger a destroy event", function(){
      expect(destroyedSpy).toHaveBeenCalled();
    });

    it("should trigger a destroy event with the view that's being destroyed", function(){
      expect(destroyedSpy).toHaveBeenCalledWith(view);
    });

    it("should set 'this' to the manager, from the destroy event", function(){
      expect(destroyedSpy).toHaveBeenCalledOn(myRegion);
    });

    it("should call 'destroy' on the already show view", function(){
      expect(view.destroy).toHaveBeenCalled();
    });

    it("should not call 'remove' directly, on the view", function(){
      expect(view.remove).not.toHaveBeenCalled();
    });

    it("should delete the current view reference", function(){
      expect(myRegion.currentView).toBeUndefined();
    });
  });

  describe("when destroying the current view and it does not have a 'destroy' method", function(){
    var MyRegion = Backbone.Marionette.Region.extend({
      el: "<div></div>"
    });

    var MyView = Backbone.View.extend({
      render: function(){
        $(this.el).html("some content");
      }
    });

    var myRegion, view;

    beforeEach(function(){
      view = new MyView();
      spyOn(view, "remove");
      myRegion = new MyRegion();
      myRegion.show(view);
      myRegion.destroy();
    });

    it("should call 'remove' on the view", function(){
      expect(view.remove).toHaveBeenCalled();
    });

  });

  describe("when initializing a region and passing an 'el' option", function(){
    var region, el;

    beforeEach(function(){
      el = "#foo";
      region = new Backbone.Marionette.Region({
        el: el
      });
    });

    it("should manage the specified el", function(){
      expect(region.el).toBe(el);
    });
  });

  describe("when initializing a region with an existing view", function(){
    var region, view, View;

    beforeEach(function(){
      View = Backbone.View.extend({
        onShow: function(){}
      });

      view = new View();

      spyOn(view, "render");
      spyOn(view, "onShow");

      region = new Backbone.Marionette.Region({
        el: "#foo",
        currentView: view
      });
    });

    it("should not render the view", function(){
      expect(view.render).not.toHaveBeenCalled();
    });

    it("should not `show` the view", function(){
      expect(view.onShow).not.toHaveBeenCalled();
    });
  });

  describe("when attaching an existing view to a region", function(){
    var region, view, View;

    beforeEach(function(){
      setFixtures("<div id='foo'>bar</div>");

      View = Backbone.View.extend({
        onShow: function(){}
      });

      view = new View();

      spyOn(view, "render");
      spyOn(view, "onShow");

      region = new Backbone.Marionette.Region({
        el: "#foo"
      });

      region.attachView(view);
    });

    it("should not render the view", function(){
      expect(view.render).not.toHaveBeenCalled();
    });

    it("should not `show` the view", function(){
      expect(view.onShow).not.toHaveBeenCalled();
    });

    it("should not replace the existing html", function(){
      expect($(region.el).text()).toBe("bar");
    })
  });

  describe("when creating a region instance with an initialize method", function(){
    var Region, actualOptions, expectedOptions;

    beforeEach(function(){
      expectedOptions = {foo: "bar"};
      Region = Backbone.Marionette.Region.extend({
        el: "#foo",
        initialize: function(options){ }
      });

      spyOn(Region.prototype, "initialize").andCallThrough();

      new Region({
        foo: "bar"
      });
    });

    it("should call the initialize method with the options from the constructor", function(){
      expect(Region.prototype.initialize).toHaveBeenCalledWith(expectedOptions);
    });
  });

  describe("when removing a region", function(){
    var MyApp, region;

    beforeEach(function(){
      setFixtures("<div id='region'></div><div id='region2'></div>");

      MyApp = new Backbone.Marionette.Application();
      MyApp.addRegions({
        MyRegion: "#region",
        anotherRegion: "#region2"
      });

      region = MyApp.MyRegion;
      spyOn(region, "destroy");

      MyApp.removeRegion('MyRegion')
    });

    it("should be removed from the app", function(){
      expect(MyApp.MyRegion).not.toBeDefined()
    })
    it("should call 'destroy' of the region", function(){
      expect(region.destroy).toHaveBeenCalled()
    })
  })

  describe("when getting a region", function () {
    beforeEach(function () {
      this.MyApp = new Backbone.Marionette.Application();
      this.MyApp.addRegions({
        MyRegion: "#region",
        anotherRegion: "#region2"
      });

      this.region = this.MyApp.MyRegion;
    });

    it("should return the region", function () {
      expect(this.MyApp.getRegion("MyRegion")).toBe(this.region);
    });
  });

  describe("when resetting a region", function(){
    var region;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      region = new Backbone.Marionette.Region({
        el: "#region"
      });

      spyOn(region, "destroy");

      region.ensureEl();

      region.reset();
    });

    it("should not hold on to the region's previous `el`", function(){
      expect(region.$el).not.toExist();
    });

    it("should destroy any existing view", function(){
      expect(region.destroy).toHaveBeenCalled();
    });

  });
});
