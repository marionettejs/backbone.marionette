describe("region", function(){
  "use strict";

  describe("when creating a new region and no configuration has been provided", function(){
    it("should throw an exception saying an 'el' is required", function(){
      expect(
        Backbone.Marionette.Region.extend({})
      ).toThrow("An 'el' must be specified for a region.");
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

      onShow: function(){
        $(this.el).addClass("onShowClass");
      }
    });

    var myRegion, view, showSpy;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");
      showSpy = sinon.spy();

      view = new MyView();
      spyOn(view, "render").andCallThrough();

      myRegion = new MyRegion();
      spyOn(myRegion, "onShow");

      myRegion.on("show", showSpy);

      myRegion.show(view);
    });

    it("should render the view", function(){
      expect(view.render).toHaveBeenCalled();
    });

    it("should append the rendered HTML to the manager's 'el'", function(){
      expect(myRegion.$el).toHaveHtml(view.el);
    });

    it("shoudl call 'onShow' for the view, after the rendered HTML has been added to the DOM", function(){
      expect($(view.el)).toHaveClass("onShowClass");
    })

    it("shoudl call 'onShow' for the region, after the rendered HTML has been added to the DOM", function(){
      expect(myRegion.onShow).toHaveBeenCalled();
    })

    it("should trigger a show event for the view", function(){
      expect(showSpy).toHaveBeenCalled();
    });

    it("should pass the shown view as an argument for the show event", function(){
      expect(showSpy).toHaveBeenCalledWith(view);
    });

    it("should set 'this' to the manager, from the show event", function(){
      expect(showSpy).toHaveBeenCalledOn(myRegion);
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

      close: function(){
      }
    });

    var myRegion, view1, view2;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      view1 = new MyView();
      view2 = new MyView();
      myRegion = new MyRegion();

      spyOn(view1, "close");

      myRegion.show(view1);
      myRegion.show(view2);
    });

    it("should call 'close' on the already open view", function(){
      expect(view1.close).toHaveBeenCalled();
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

      close: function(){
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

      spyOn(view, "close");
      spyOn(myRegion, "open");
      spyOn(view, "render");
      myRegion.show(view);
    });

    it("should not call 'close' on the view", function(){
      expect(view.close).not.toHaveBeenCalled();
    });

    it("should not call 'open' on the view", function(){
      expect(myRegion.open).not.toHaveBeenCalledWith(view);
    });

    it("should call 'render' on the view", function(){
      expect(view.render).toHaveBeenCalled();
    });
  });

  describe("when a view is already shown, close, and showing the same one", function(){
    var MyRegion = Backbone.Marionette.Region.extend({
      el: "#region"
    });

    var MyView = Backbone.Marionette.ItemView.extend({
      render: function(){
        $(this.el).html("some content");
      },
      open : function() {}
    });

    var myRegion, view;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      view = new MyView();
      myRegion = new MyRegion();
      myRegion.show(view);
      view.close();

      spyOn(view, "close");
      spyOn(myRegion, "open");
      spyOn(view, "render")
      myRegion.show(view);
    });

    it("should not call 'close' on the view", function(){
      expect(view.close).not.toHaveBeenCalled();
    });

    it("should call 'open' on the view", function(){
      expect(myRegion.open).toHaveBeenCalledWith(view);
    });

    it("should call 'render' on the view", function(){
      expect(view.render).toHaveBeenCalled();
    });
  });

  describe("when a view is already closed and showing another", function(){
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

      spyOn(view1, "close").andCallThrough();

      myRegion.show(view1);
      view1.close();
      myRegion.show(view2);
    });

    it("shouldn't call 'close' on an already closed view", function(){
      expect(view1.close.callCount).toEqual(1);
    });
  });

  describe("when closing the current view", function(){
    var MyRegion = Backbone.Marionette.Region.extend({
      el: "#region"
    });

    var MyView = Backbone.View.extend({
      render: function(){
        $(this.el).html("some content");
      },

      close: function(){
      }
    });

    var myRegion, view, closedSpy;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");
      closedSpy = sinon.spy();

      view = new MyView();

      spyOn(view, "close");
      spyOn(view, "remove");

      myRegion = new MyRegion();
      myRegion.on("close", closedSpy);
      myRegion.show(view);

      myRegion.close();
    });

    it("should trigger a close event", function(){
      expect(closedSpy).toHaveBeenCalled();
    });

    it("should trigger a close event with the view that's being closed", function(){
      expect(closedSpy).toHaveBeenCalledWith(view);
    });

    it("should set 'this' to the manager, from the close event", function(){
      expect(closedSpy).toHaveBeenCalledOn(myRegion);
    });

    it("should call 'close' on the already show view", function(){
      expect(view.close).toHaveBeenCalled();
    });

    it("should not call 'remove' directly, on the view", function(){
      expect(view.remove).not.toHaveBeenCalled();
    });

    it("should delete the current view reference", function(){
      expect(myRegion.currentView).toBeUndefined();
    });
  });

  describe("when closing the current view and it does not have a 'close' method", function(){
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
      myRegion.close();
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
      spyOn(region, "close");

      MyApp.removeRegion('MyRegion')
    });

    it("should be removed from the app", function(){
      expect(MyApp.MyRegion).not.toBeDefined()
    })
    it("should call 'close' of the region", function(){
      expect(region.close).toHaveBeenCalled()
    })
  })

  describe("when resetting a region", function(){
    var region;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      region = new Backbone.Marionette.Region({
        el: "#region"
      });

      spyOn(region, "close");

      region.ensureEl();

      region.reset();
    });

    it("should not hold on to the region's previous `el`", function(){
      expect(region.$el).not.toExist();
    });

    it("should close any existing view", function(){
      expect(region.close).toHaveBeenCalled();
    });

  });
});
