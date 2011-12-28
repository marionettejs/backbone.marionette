describe("collection view", function(){
  var Model = Backbone.Model.extend({});

  var Collection = Backbone.Collection.extend({
    model: Model
  });

  var ItemView = Backbone.Marionette.ItemView.extend({
    render: function(){
      this.el = "<span>" + this.model.get("foo") + "</span>";
    }
  });

  var CollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: ItemView
  });
  
  describe("when rendering a collection view", function(){
    var collection = new Collection([{foo: "bar"}, {foo: "baz"}]);
    var collectionView;

    beforeEach(function(){
      collectionView = new CollectionView({
        collection: collection
      });

      spyOn(collectionView, "renderItem").andCallThrough();

      collectionView.render();
    });

    it("should render the specified itemView for each item", function(){
      expect(collectionView.renderItem.callCount).toBe(2);
    });

    it("should append the html for each itemView", function(){
      expect($(collectionView.el)).toHaveHtml("<span>bar</span><span>baz</span>");
    });
  });

});
