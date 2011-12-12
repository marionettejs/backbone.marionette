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
      console.log(myRegion.el);
      myRegion.show(view);
    });

    it("should render the view", function(){
      expect(view.render).toHaveBeenCalled();
    });

    it("should append the rendered HTML to the manager's 'el'", function(){
      expect(myRegion.el).toHaveHtml(view.el);
    });
  });

});
