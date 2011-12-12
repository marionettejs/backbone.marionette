describe("region manager", function(){

  describe("when creating a new region manager and no configuration has been provided", function(){
    it("should throw an exception saying an 'el' is required", function(){
      expect(
        Backbone.Marionette.RegionManager.extend({})
      ).toThrow("An 'el' must be specified");
    });
  });

  describe("when showing a view", function(){
    var MyRegion = Backbone.Marionette.RegionManager.extend({
      el: "#region"
    });

    var MyView = Backbone.View.extend({
      render: function(){
        $(this.el).html("some content");
      }
    });

    var myRegion, view;

    beforeEach(function(){
      setFixtures("<div id='region'></div>");

      view = new MyView();
      spyOn(view, "render").andCallThrough();

      myRegion = new MyRegion();
      myRegion.show(view);
    });

    it("should render the view", function(){
      expect(view.render).toHaveBeenCalled();
    });

    it("should append the rendered HTML to the manager's 'el'", function(){
      expect(myRegion.el).toHaveHtml(view.el);
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
  });

});
