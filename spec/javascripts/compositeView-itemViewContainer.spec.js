describe("composite view - itemViewContainer", function(){
  "use strict";

  var Model = Backbone.Model.extend({});

  var Collection = Backbone.Collection.extend({
    model: Model
  });

  var ItemView = Backbone.Marionette.ItemView.extend({
    tagName: "li",
    render: function(){
      this.$el.html(this.model.get("foo"));
    }
  });

  describe("when rendering a collection in a composite view with an `itemViewContainer` specified", function(){
    var CompositeView = Backbone.Marionette.CompositeView.extend({
      itemView: ItemView,
      itemViewContainer: "ul",
      template: "#composite-child-container-template"
    });

    var compositeView;
    var order;
    var deferredResolved;

    beforeEach(function(){
      order = [];
      loadFixtures("compositeChildContainerTemplate.html");

      var m1 = new Model({foo: "bar"});
      var m2 = new Model({foo: "baz"});
      var collection = new Collection([m1, m2]);

      compositeView = new CompositeView({
        collection: collection
      });

      spyOn(compositeView, "resetItemViewContainer").andCallThrough();

      compositeView.render();
    });

    it("should reset any existing itemViewContainer", function(){
      expect(compositeView.resetItemViewContainer).toHaveBeenCalled();
    });

    it("should render the items in to the specified container", function(){
      expect(compositeView.$("ul")).toHaveText(/bar/);
      expect(compositeView.$("ul")).toHaveText(/baz/);
    });
  });

  describe("when rendering a collection in a composite view with a missing `itemViewContainer` specified", function(){
    var CompositeView = Backbone.Marionette.CompositeView.extend({
      itemView: ItemView,
      itemViewContainer: '#missing-container',
      template: "#composite-child-container-template"
    });

    var compositeView;
    var order;
    var deferredResolved;

    beforeEach(function(){
      order = [];
      loadFixtures("compositeChildContainerTemplate.html");

      var m1 = new Model({foo: "bar"});
      var m2 = new Model({foo: "baz"});
      var collection = new Collection([m1, m2]);

      compositeView = new CompositeView({
        collection: collection
      });

      spyOn(compositeView, "resetItemViewContainer").andCallThrough();

    });

    it("should throw an error", function(){
      expect(function(){compositeView.render()}).toThrow("The specified `itemViewContainer` was not found: #missing-container");
    });
  });


  describe("when rendering a collection in a composite view without an `itemViewContainer` specified", function(){
    var CompositeView = Backbone.Marionette.CompositeView.extend({
      itemView: ItemView,
      template: "#composite-child-container-template"
    });

    var compositeView;
    var order;
    var deferredResolved;

    beforeEach(function(){
      order = [];
      loadFixtures("compositeChildContainerTemplate.html");

      var m1 = new Model({foo: "bar"});
      var m2 = new Model({foo: "baz"});
      var collection = new Collection([m1, m2]);

      compositeView = new CompositeView({
        collection: collection
      });

      compositeView.render();
    });

    it("should render the items in to the composite view directly", function(){
      expect(compositeView.$el).toContainHtml("<ul></ul>");
    });
  });

});
