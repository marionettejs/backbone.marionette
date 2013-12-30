describe("collectionview - emptyView", function(){
  "use strict";

  var ItemView = Backbone.Marionette.ItemView.extend({
    tagName: "span",
    render: function(){
      this.$el.html(this.model.get("foo"));
    },
    onRender: function(){}
  });

  var EmptyView = Backbone.Marionette.ItemView.extend({
    tagName: "span",
    className: "isempty",
    render: function(){}
  });

  var EmptyCollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: ItemView,
    emptyView: EmptyView
  });

  describe("when rendering a collection view with an empty collection", function(){

    var collectionView;

    beforeEach(function(){
      var collection = new Backbone.Collection();
      collectionView = new EmptyCollectionView({
        collection: collection
      });

      collectionView.render();
    });

    it("should append the html for the emptyView", function(){
      expect($(collectionView.$el)).toHaveHtml("<span class=\"isempty\"></span>");
    });

    it("should reference each of the rendered view items", function(){
      expect(_.size(collectionView.children)).toBe(1);
    });
  });

  describe("when the emptyView has been rendered for an empty collection, then adding an item to the collection", function(){
    var collectionView, closeSpy;

    beforeEach(function(){
      var collection = new Backbone.Collection();
      collectionView = new EmptyCollectionView({
        collection: collection
      });

      collectionView.render();

      closeSpy = spyOn(EmptyView.prototype, "close");

      collection.add({foo: "wut"});
    });

    it("should close the emptyView", function(){
      expect(closeSpy).toHaveBeenCalled();
    });

    it("should show the new item", function(){
      expect(collectionView.$el).toHaveText(/wut/);
    });
  });

  describe("when the emptyView has been rendered for an empty collection and then collection reset, receiving some values. Then adding an item to the collection", function () {
    var collectionView, closeSpy;

    beforeEach(function () {
      var collection = new Backbone.Collection();
      collectionView = new EmptyCollectionView({
        collection: collection
      });

      collectionView.render();

      closeSpy = spyOn(EmptyView.prototype, "close");
      closeSpy.andCallThrough();

      collection.reset([{ foo: "bar" }, { foo: "baz"}]);

      collection.add({ foo: "wut" });
    });

    it("should close the emptyView", function () {
      expect(closeSpy).toHaveBeenCalled();
    });

    it("should show all three items without empty view", function () {
      expect($(collectionView.$el)).toHaveHtml("<span>bar</span><span>baz</span><span>wut</span>");
    });
  });

  describe("when the last item is removed from a collection", function(){
    var collectionView, closeSpy;

    beforeEach(function(){
      var collection = new Backbone.Collection([{foo: "wut"}]);

      collectionView = new EmptyCollectionView({
        collection: collection
      });

      collectionView.render();

      collection.remove(collection.at(0));
    });

    it("should append the html for the emptyView", function(){
      expect($(collectionView.$el)).toHaveHtml("<span class=\"isempty\"></span>");
    });

    it("should reference each of the rendered view items", function(){
      expect(_.size(collectionView.children)).toBe(1);
    });
  });


  describe("when the collection is reset multiple times", function () {
    var collectionView, collection, population = [{foo:1},{foo:2},{foo:3}];

    beforeEach(function () {
      collection = new Backbone.Collection();
      collectionView = new EmptyCollectionView({
        collection: collection
      });
    });

    it("should remove all EmptyView", function () {
      collectionView.render();        // 1st showEmptyView
      collection.reset(population);   // 1st closeEmptyView
      collection.reset();             // 2nd showEmptyView
      collection.reset(population);   // 2nd closeEmptyView
      expect(collectionView.$el).not.toContain('span.isempty')
    });

    it("should have only one emptyView open", function () {
      collectionView.render();        // 1st showEmptyView
      collection.reset(population);   // 1st closeEmptyView
      collection.reset();             // 2nd closeEmptyView, showEmptyView
      collection.reset();             // 3nd closeEmptyView, showEmptyView
      expect(collectionView.$('span.isempty').length).toEqual(1);
    });

  });

  describe("when a collection is reset with empty data after the view is loaded", function(){
    var collection;
    var collectionView;
    var data;

    var ItemView = Backbone.Marionette.ItemView.extend({
      tagName: "span",
      render: function(){
        this.$el.html(this.model.get("foo"));
        this.trigger('render');
      },
      onRender: function(){}
    });

    var CollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView,
    });

    var EmptyView = Backbone.Marionette.ItemView.extend({
      tagName: "span",
      render: function(){
        this.$el.text("0 items");
        this.trigger("render");
      },
      onRender: function(){}
    });

    beforeEach(function(){
      data = [{foo: "bar"}, {foo: "baz"}];

      collection = new Backbone.Collection(data);

      collectionView = new CollectionView({
        collection: collection,
        emptyView: EmptyView
      });

      collectionView.render();

      collection.reset([]);
    });

    it("should have 1 child view (empty view)", function(){
      expect(collectionView.children.length).toBe(1);
    });

    it("should append the html for the emptyView", function(){
      expect($(collectionView.$el)).toHaveHtml("<span>0 items</span>");
    });

    it("should not have the empty child view after resetting with data", function(){
      collection.reset(data);

      expect($(collectionView.$el)).toHaveHtml("<span>bar</span><span>baz</span>");
    });
  });

  describe("checkEmpty", function(){
    var collectionView, closeSpy;

    beforeEach(function(){
      var collection = new Backbone.Collection();

      collectionView = new EmptyCollectionView({
        collection: collection
      });

      collectionView.render();
    });

    it("should return true when the collection is empty", function(){
      expect(collectionView.checkEmpty()).toEqual(true);
    });

    it("should return false when the collection is not empty", function(){
      collectionView.collection.add({ foo: "wut" });
      expect(collectionView.checkEmpty()).toEqual(false);
    });
  });

  describe("overriding checkEmpty with a populated collection", function(){
    var collectionView, closeSpy;

    beforeEach(function(){
      var collection = new Backbone.Collection([{foo: "wut"}, {foo: "wat"}]);

      var OverriddenCheckEmptyCollectionView = EmptyCollectionView.extend({
        checkEmpty: function () {
          return true;
        }
      });
      collectionView = new OverriddenCheckEmptyCollectionView({
        collection: collection
      });

      collectionView.render();
    });

    it("should append the html for the emptyView", function(){
      expect($(collectionView.$el)).toHaveHtml("<span class=\"isempty\"></span>");
    });

    it("should reference each of the rendered view items", function(){
      expect(_.size(collectionView.children)).toBe(1);
    });
  });

  describe("when emptyView is specified with getEmptyView option", function(){
    var OtherEmptyView = Backbone.Marionette.ItemView.extend({
      render: function(){}
    });
    var CollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView,
      getEmptyView: function() { return OtherEmptyView }
    })

    describe("when rendering a collection view with an empty collection", function(){

      var collectionView;

      beforeEach(function(){
        var collection = new Backbone.Collection();
        collectionView = new CollectionView({
          collection: collection
        });

        collectionView.render();
      });

      it("renders other empty view instance", function() {
        expect(collectionView.children.first()).toBeInstanceOf(OtherEmptyView);
      });
    });
  });
});

