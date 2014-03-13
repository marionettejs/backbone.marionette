describe("region", function(){
  "use strict";

  describe("when creating a new region manager and no configuration has been provided", function(){
    it("should throw an exception saying an 'el' is required", function(){
      expect(
        Backbone.Marionette.Region.extend({})
      ).toThrow("An 'el' must be specified for a region.");
    });
  });


  describe("when swapping a view", function(){
    var MyRegion = Backbone.Marionette.Region.extend({
      el: "#region",

      onSwap: function(){}
    });

    var MyView = Backbone.Marionette.View.extend({
      render: function(){
        $(this.el).html("some content");
      },

      onSwappedIn: function(){
        $(this.el).addClass("onSwapInClass");
      }
    });

    var myRegion, view, swapEvent, swapContext, swapViewPassed;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      view = new MyView();
      spyOn(view, "render").andCallThrough();

      myRegion = new MyRegion();
      spyOn(myRegion, "onSwap");

      myRegion.on("swap", function(v){
        swapViewPassed = v === view;
        swapEvent = true;
        swapContext = this;
      });

      myRegion.swap(view);
    });

    it("should render the view", function(){
      expect(view.render).toHaveBeenCalled();
    });

    it("should append the rendered HTML to the manager's 'el'", function(){
      expect(myRegion.$el).toHaveHtml(view.el);
    });

    it("should call 'onSwapIn' for the view, after the rendered HTML has been added to the DOM", function(){
      expect($(view.el)).toHaveClass("onSwapInClass");
    });

    it("should call 'onSwap' for the region, after the rendered HTML has been added to the DOM", function(){
      expect(myRegion.onSwap).toHaveBeenCalled();
    });

    it("should trigger a swap event for the view", function(){
      expect(swapEvent).toBeTruthy();
    });

    it("should pass the swapped-in view as an argument for the swap event", function(){
      expect(swapViewPassed).toBeTruthy();
    });

    it("should set 'this' to the manager, from the swap event", function(){
      expect(swapContext).toBe(myRegion);
    });
  });

  describe("when a view is already swapped-in and swapping another", function(){
    var MyRegion = Backbone.Marionette.Region.extend({
      el: "#region"
    });

    var MyView = Backbone.Marionette.View.extend({
      render: function(){
        $(this.el).html("some content");
      },

      onSwappedOut: function(){
        $(this.el).addClass("onSwapOutClass");
      },

      destroy: function(){
      }
    });

    var myRegion, view1, view2, swapped1, swapped2;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      view1 = new MyView();
      view2 = new MyView();
      myRegion = new MyRegion();

      spyOn(view1, "destroy");

      swapped1 = myRegion.swap(view1);
      swapped2 = myRegion.swap(view2);
    });

    it("should never call 'destroy' on the already open view", function(){
      expect(view1.destroy).not.toHaveBeenCalled();
    });

    it("should return undefined view as a result of the swap operation if no view has been registered", function(){
      expect(swapped1).toBeUndefined();
    });

    it("should return the old view as a result of the swap operation", function(){
      expect(swapped2).toEqual(view1);
    });

    it("should reference the new view as the current view", function(){
      expect(myRegion.currentView).toBe(view2);
    });
    
    it("should call 'onSwapOut' for the old view, after the new view has been added to the DOM", function(){
      expect($(view1.el)).toHaveClass("onSwapOutClass");
    });

  });

  describe("when a view is already swapped-in and swapping the same one", function(){
    var MyRegion = Backbone.Marionette.Region.extend({
      el: "#region"
    });

    var MyView = Backbone.Marionette.View.extend({
      render: function(){
        $(this.el).html("some content");
      },

      destroy: function(){
      },

      open: function(){
      }
    });

    var myRegion, view, swapped;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      view = new MyView();
      myRegion = new MyRegion();
      myRegion.swap(view);

      spyOn(view, "destroy");
      spyOn(myRegion, "open");
      spyOn(view, "render");
      swapped = myRegion.swap(view);
    });

    it("should not call 'render' on the view", function(){
      expect(view.render).not.toHaveBeenCalled();
    });

    it("should return the same view that was passed in as a result of the operation", function(){
      expect(swapped).toEqual(view);
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

    var myRegion, view, showEvent, showContext, showViewPassed;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      view = new MyView();
      spyOn(view, "render").andCallThrough();

      myRegion = new MyRegion();
      spyOn(myRegion, "onShow");

      myRegion.on("show", function(v){
        showViewPassed = v === view;
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

    it("should pass the shown view as an argument for the show event", function(){
      expect(showViewPassed).toBeTruthy();
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
      view.destroy();

      spyOn(view, "destroy");
      spyOn(myRegion, "open");
      spyOn(view, "render")
    });

    it("should throw an error saying the view's been destroyed if a destroyed view is passed in", function(){
      expect(function () { myRegion.show(view); }).toThrow(new Error("Cannot use a view that's already been destroyed."));
    });

    it("should not call 'render' on the view", function(){
      try { myRegion.show(view); } catch(ex) {}
      expect(view.render).not.toHaveBeenCalled();
    });

    it("should not call 'destroy' on the view", function(){
      try { myRegion.show(view); } catch(ex) {}
      expect(view.destroy).not.toHaveBeenCalled();
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

    var myRegion, view, destroyed, destroyedContext;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      view = new MyView();

      spyOn(view, "destroy");
      spyOn(view, "remove");

      myRegion = new MyRegion();
      myRegion.on("destroy", function(){
        destroyed = true;
        destroyedContext = this;
      });
      myRegion.show(view);

      myRegion.destroy();
    });

    it("should trigger a destroy event", function(){
      expect(destroyed).toBeTruthy();
    });

    it("should set 'this' to the manager, from the destroy event", function(){
      expect(destroyedContext).toBe(myRegion);
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
