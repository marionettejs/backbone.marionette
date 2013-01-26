describe("collection view - reset", function(){

  var ItemView = Backbone.Marionette.ItemView.extend({
    tagName: "span",
    render: function(){
      this.$el.html(this.model.get("foo"));
      this.trigger('render');
    },
    onRender: function(){}
  });

  var EmptyView = Backbone.Marionette.ItemView.extend({
    tagName: "span",
    render: function(){
      this.$el.text("0 items");
      this.trigger("render");
    },
    onRender: function(){}
  });

  var CollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: ItemView,

    onBeforeRender: function(){},

    onRender: function(){},

    onBeforeItemAdded: function(view){},
    onAfterItemAdded: function(view){}
  });

  describe("when a collection is reset after the view is loaded", function(){
    var collection;
    var collectionView;

    beforeEach(function(){
      collection = new Backbone.Collection();

      collectionView = new CollectionView({
        collection: collection
      });

      spyOn(collectionView, "onRender").andCallThrough();
      spyOn(collectionView, "closeChildren").andCallThrough();

      collectionView.render();

      collection.reset([{foo: "bar"}, {foo: "baz"}]);
    });

    it("should close all open child views", function(){
      expect(collectionView.closeChildren).toHaveBeenCalled();
    });

    it("should append the html for each itemView", function(){
      expect($(collectionView.$el)).toHaveHtml("<span>bar</span><span>baz</span>");
    });

    it("should reference each of the rendered view items", function(){
      expect(collectionView.children.length).toBe(2);
    });

    it("should call 'onRender' after rendering", function(){
      expect(collectionView.onRender).toHaveBeenCalled();
    });

    it("should remove the event handlers for the original children", function(){
      expect(_.size(collectionView._listeners)).toBe(4);
    });
  });

  describe("when a collection is reset with empty data after the view is loaded", function(){
    var collection;
    var collectionView;
    var data;

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

});
