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

    var CompositeViewWithoutItemViewContainer = Backbone.Marionette.CompositeView.extend({
      itemView: ItemView,
      template: "#composite-child-container-template"
    });

    var compositeView;
    var order;
    var deferredResolved;
    var collection;

    beforeEach(function() {
      order = [];
      loadFixtures("compositeChildContainerTemplate.html");

      var m1 = new Model({foo: "bar"});
      var m2 = new Model({foo: "baz"});
      collection = new Collection([m1, m2]);
    });

    specCase('in the view definition', function() {
      return new CompositeView({
        collection: collection
      });
    });

    specCase('in the view creation', function() {
      return new CompositeViewWithoutItemViewContainer({
        itemViewContainer: "ul",
        collection: collection
      });
    });

    function specCase(desc, viewCreation) {
      describe(desc, function() {
        beforeEach(function(){
          compositeView = viewCreation();

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
    }
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

  describe("when a collection is loaded / reset after the view is created and before it is rendered", function(){
    var ItemView = Marionette.ItemView.extend({
      template: _.template("test")
    });

    var ListView = Marionette.CompositeView.extend({
      template: _.template('<table><tbody></tbody></table>'),
      itemViewContainer: 'tbody',
      itemView: ItemView
    });

    var view;

    beforeEach(function(){
      var collection = new Backbone.Collection();

      view = new ListView({
        collection: collection
      });

      collection.reset([{id:1}]);
    });

    it("should not render the items", function(){
      expect(view.children.length).toBe(0);
    });
  });


  describe("when a composite view is not yet rendered", function(){
    var CompositeView = Backbone.Marionette.CompositeView.extend({
      itemView: ItemView,
      itemViewContainer: "ul",
      template: "#composite-child-container-template"
    });

    var compositeView, collection, model1, model2;

    var addModel = function() {
      collection.add([model2]);
    };

    var removeModel = function() {
      collection.remove([model1]);
    };

    var resetCollection = function() {
      collection.reset([model1, model2]);
    };

    beforeEach(function() {
      loadFixtures("compositeChildContainerTemplate.html");
      model1 = new Model({foo: "bar"});
      model2 = new Model({foo: "baz"});
      collection = new Collection([model1]);
      compositeView = new CompositeView({
        collection: collection
      });
      spyOn(compositeView, "addChildView").andCallThrough();
    });

    it('should not raise any errors when item is added to collection', function() {
      expect(addModel).not.toThrow();
    });

    it('should not call addChildView when item is added to collection', function() {
      addModel();
      expect(compositeView.addChildView).not.toHaveBeenCalled();
    });

    it('should not raise any errors when item is removed from collection', function() {
      expect(removeModel).not.toThrow();
    });

    it('should not raise any errors when collection is reset', function() {
      expect(resetCollection).not.toThrow();
    });

  });

  describe("when a composite view has the `itemViewContainer` specified as a function", function() {
    var compositeView;

    var CompositeView = Backbone.Marionette.CompositeView.extend({
      itemView: ItemView,
      template: "#composite-child-container-template"
    });

    beforeEach(function() {
      compositeView = new CompositeView();
      compositeView.itemViewContainer = sinon.stub().returns('ul');
      compositeView.render();
    });

    it("calls the `itemViewContainer` in the context of the composite view", function() {
      expect(compositeView.itemViewContainer).toHaveBeenCalledOn(compositeView);
    });

  });

});
