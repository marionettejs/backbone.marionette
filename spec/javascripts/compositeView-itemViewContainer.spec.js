describe("composite view - itemViewContainer", function(){
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
  
  describe("when adding a model to a collection of a composite view with an `itemViewContainer` specified before it has been rendered", function(){
    var CompositeView = Backbone.Marionette.CompositeView.extend({
      itemView: ItemView,
      itemViewContainer: "ul",
      template: "#composite-child-container-template"
    });

    var compositeView;
    
    beforeEach(function(){
      order = [];
      loadFixtures("compositeChildContainerTemplate.html");

      var m1 = new Model({foo: "bar"});
      var collection = new Collection();

      compositeView = new CompositeView({
        collection: collection
      });
      
      spyOn(compositeView.itemView.prototype, "render").andCallThrough();
      
      collection.add(m1);
    });

    it("should not render the item view as the itemViewContainer may not yet be available", function(){
      expect(compositeView.itemView.prototype.render).not.toHaveBeenCalled();
    });
  });

});
