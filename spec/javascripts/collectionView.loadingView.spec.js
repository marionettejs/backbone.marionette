describe("collectionview - loadingView", function(){
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
    
  var LoadingView = Backbone.Marionette.ItemView.extend({
    tagName: "span",
    className: "isloading",
    render: function(){}
  })

  var EmptyCollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: ItemView,
    emptyView: EmptyView,
    loadingView: LoadingView
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

    it("should append the html for the loadingView", function(){
      expect($(collectionView.$el)).toHaveHtml("<span class=\"isloading\"></span>");
    });

    it("should reference each of the rendered view items", function(){
      expect(_.size(collectionView.children)).toBe(1);
    });
  });

  describe("when rendering a collection view with an empty collection", function(){
    var collectionView;

    beforeEach(function(){
      var collection = new Backbone.Collection();
      collectionView = new EmptyCollectionView({
        collection: collection
      });

      collectionView.render();
      collection.trigger("sync")
    });

    it("should append the html for the emptyView after a `fetch` has finished with no items", function(){
      expect($(collectionView.$el)).toHaveHtml("<span class=\"isempty\"></span>");
    });

    it("should reference each of the rendered view items", function(){
      expect(_.size(collectionView.children)).toBe(1);
    });
  });

  describe("when rendering a collection view with an item", function(){
    var collectionView;

    beforeEach(function(){
      var collection = new Backbone.Collection();
      collectionView = new EmptyCollectionView({
        collection: collection
      });

      collectionView.render();
    
      collection.add(new Backbone.Model({"foo":"bar"}));
    });

    it("should append the html for the model after an item has been added", function(){
      expect($(collectionView.$el)).toHaveHtml("<span>bar</span>");
    });

    it("should reference each of the rendered view items", function(){
      expect(_.size(collectionView.children)).toBe(1);
    });
  });

  describe("when rendering a collection view with an empty collection, adding, then removing, should show the empty collection again", function(){
    var collectionView;
    var collection;
      
    var models = [
      new Backbone.Model({"foo":"bar"}),
      new Backbone.Model({"foo":"bar2"})
    ];

    beforeEach(function(){
      collection = new Backbone.Collection();
      collectionView = new EmptyCollectionView({
        collection: collection
      });

      collectionView.render();
      
      collection.add(models[0]);
      collection.add(models[1]);
    });

    it("should append the html for the itemViews", function(){
      expect($(collectionView.$el)).toHaveHtml("<span>bar</span><span>bar2</span>");
    });

    it("should reference each of the rendered view items", function(){
      expect(_.size(collectionView.children)).toBe(2);
    });
    
    describe("when models are removed", function() {
      beforeEach( function() {
        collection.remove(models[0]);
        collection.remove(models[1]);
      });
      
      it("should revert to empty when the models are removed", function(){
        expect($(collectionView.$el)).toHaveHtml("<span class=\"isempty\"></span>");
      });
    
      it("should reference only the emptyView", function(){
        expect(_.size(collectionView.children)).toBe(1);
      });
    });
  });
    
});