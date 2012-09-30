describe("region", function(){

  describe("when creating a new region manager and no configuration has been provided", function(){
    it("should throw an exception saying an 'el' is required", function(){
      expect(
        Backbone.Marionette.Region.extend({})
      ).toThrow("An 'el' must be specified");
    });
  });

  describe("when adding region objects to an app", function(){
    var MyApp = new Backbone.Marionette.Application();

    var myRegion = Backbone.Marionette.Region.extend({
      el: "#region"
    });

    var myRegion2 = Backbone.Marionette.Region.extend({
      el: "#region2"
    });

    beforeEach(function(){
      setFixtures("<div id='region'></div>");
      setFixtures("<div id='region2'></div>");

      MyApp.addRegions({MyRegion: myRegion, anotherRegion: myRegion2});
    });
    
    it("should initialize the regions, immediately", function(){
      expect(MyApp.MyRegion).not.toBeUndefined();
      expect(MyApp.anotherRegion).not.toBeUndefined();
    });
  });

  describe("when adding region selectors to an app, and starting the app", function(){
    var MyApp = new Backbone.Marionette.Application();

    beforeEach(function(){
      setFixtures("<div id='region'></div>");
      setFixtures("<div id='region2'></div>");

      MyApp.addRegions({MyRegion: "#region", anotherRegion: "region2"});

      MyApp.start();
    });
    
    it("should initialize the regions", function(){
      expect(MyApp.MyRegion).not.toBeUndefined();
      expect(MyApp.anotherRegion).not.toBeUndefined();
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

    var myRegion, view, showEvent, showContext;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      view = new MyView();
      spyOn(view, "render").andCallThrough();

      myRegion = new MyRegion();
      spyOn(myRegion, "onShow");

      myRegion.on("view:show", function(){
        showEvent = true;
        showContext = this;
      });

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
      expect(showEvent).toBeTruthy();
    });

    it("should set 'this' to the manager, from the show event", function(){
      expect(showContext).toBe(myRegion);
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

    var myRegion, view;

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

  describe("when a view is already closed and showing another", function(){
    var MyRegion = Backbone.Marionette.Region.extend({
      el: "#region"
    });

    var MyView = Backbone.Marionette.View.extend({
      render: function(){
        $(this.el).html("some content");
      }
    });

    var myRegion, view;

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

    var myRegion, view, closed, closedContext;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      view = new MyView();
      spyOn(view, "close");
      myRegion = new MyRegion();
      myRegion.on("view:closed", function(){
        closed = true;
        closedContext = this;
      });
      myRegion.show(view);

      myRegion.close();
    });

    it("should trigger a close event", function(){
      expect(closed).toBeTruthy();
    });

    it("should set 'this' to the manager, from the close event", function(){
      expect(closedContext).toBe(myRegion);
    });

    it("should call 'close' on the already show view", function(){
      expect(view.close).toHaveBeenCalled();
    });

    it("should delete the current view reference", function(){
      expect(myRegion.currentView).toBeUndefined();
    });
  });

  describe("when initializing a region manager and passing an 'el' option", function(){
    var manager, el;

    beforeEach(function(){
      el = "#foo";
      manager = new Backbone.Marionette.Region({
        el: el
      });
    });

    it("should manage the specified el", function(){
      expect(manager.el).toBe(el);
    });
  });

  describe("when initializing a region manager with an existing view", function(){
    var manager, view;

    beforeEach(function(){
      view = new (Backbone.View.extend({ onShow: function(){} }))();

      spyOn(view, "render");
      spyOn(view, "onShow");

      manager = new Backbone.Marionette.Region({
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

  describe("when attaching an existing view to a region manager", function(){
    var manager, view;

    beforeEach(function(){
      setFixtures("<div id='foo'>bar</div>");
      view = new (Backbone.View.extend({onShow: function(){}}))();

      spyOn(view, "render");
      spyOn(view, "onShow");

      manager = new Backbone.Marionette.Region({
        el: "#foo"
      });

      manager.attachView(view);
    });

    it("should not render the view", function(){
      expect(view.render).not.toHaveBeenCalled();
    });

    it("should not `show` the view", function(){
      expect(view.onShow).not.toHaveBeenCalled();
    });

    it("should not replace the existing html", function(){
      expect($(manager.el).text()).toBe("bar");
    })
  });

  describe("when creating a region instance with an initialize method", function(){
    var Manager, actualOptions, expectedOptions;

    beforeEach(function(){
      expectedOptions = {foo: "bar"};
      Manager = Backbone.Marionette.Region.extend({
        el: "#foo",
        initialize: function(options){ }
      });

      spyOn(Manager.prototype, "initialize").andCallThrough();

      new Manager({
        foo: "bar"
      });
    });

    it("should call the initialize method with the options from the constructor", function(){
      expect(Manager.prototype.initialize).toHaveBeenCalledWith(expectedOptions);
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
