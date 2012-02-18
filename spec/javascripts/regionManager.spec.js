describe("region manager", function(){

  describe("when creating a new region manager and no configuration has been provided", function(){
    it("should throw an exception saying an 'el' is required", function(){
      expect(
        Backbone.Marionette.RegionManager.extend({})
      ).toThrow("An 'el' must be specified");
    });
  });

  describe("when adding region objects to an app", function(){
    var MyApp = new Backbone.Marionette.Application();

    var myRegion = Backbone.Marionette.RegionManager.extend({
      el: "#region"
    });

    var myRegion2 = Backbone.Marionette.RegionManager.extend({
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
    var MyRegion = Backbone.Marionette.RegionManager.extend({
      el: "#region"
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

    it("shoudl call 'onShow' after the rendered HTML has been added to the DOM", function(){
      expect($(view.el)).toHaveClass("onShowClass");
    })

    it("should trigger an show event", function(){
      expect(showEvent).toBeTruthy();
    });

    it("should set 'this' to the manager, from the show event", function(){
      expect(showContext).toBe(myRegion);
    });
  });

  describe("when a view is already shown and showing another", function(){
    var MyRegion = Backbone.Marionette.RegionManager.extend({
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

  describe("when closing the current view", function(){
    var MyRegion = Backbone.Marionette.RegionManager.extend({
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
      manager = new Backbone.Marionette.RegionManager({
        el: el
      });
    });

    it("should manage the specified el", function(){
      expect(manager.el).toBe(el);
    });
  });

});
