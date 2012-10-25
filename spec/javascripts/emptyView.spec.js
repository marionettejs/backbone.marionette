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

  describe("when the emptyView has been rendered for an empty collection and then collection reset, recieving some values. Then adding an item to the collection", function () {
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

});

