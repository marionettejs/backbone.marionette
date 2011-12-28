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
  
  var EventedView = Backbone.Marionette.CollectionView.extend({
    itemView: ItemView,

    someCallback: function(){
    },

    onClose: function(){
    }
  });
  
  var PrependHtmlView = Backbone.Marionette.CollectionView.extend({
    itemView: ItemView,

    appendHtml: function(el, html){
      el.prepend(html);
    }
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

    it("should reference each of the rendered view items", function(){
      expect(collectionView.children.length).toBe(2);
    });
  });

  describe("when override appendHtml", function(){
    var collection = new Collection([{foo: "bar"}, {foo: "baz"}]);
    var collectionView;

    beforeEach(function(){
      collectionView = new PrependHtmlView({
        collection: collection
      });

      spyOn(collectionView, "renderItem").andCallThrough();

      collectionView.render();
    });

    it("should append via the overridden method", function(){
      expect($(collectionView.el)).toHaveHtml("<span>baz</span><span>bar</span>");
    });
  });

  describe("when closing a collection view", function(){
    var collectionView;
    var collection;
    var childView;

    beforeEach(function(){
      collection = new Collection([{foo: "bar"}, {foo: "baz"}]);
      view = new EventedView({
        template: "#itemTemplate",
        collection: collection
      });
      view.render();

      childView = view.children[0];

      view.bindTo(collection, "foo", view.collectionChange);

      spyOn(childView, "close");
      spyOn(view, "unbind").andCallThrough();
      spyOn(view, "remove").andCallThrough();
      spyOn(view, "someCallback").andCallThrough();
      spyOn(view, "close").andCallThrough();
      spyOn(view, "onClose").andCallThrough();

      view.close();
    });

    it("should close all of the child views", function(){
      expect(childView.close).toHaveBeenCalled();
    });

    it("should unbind all collection events for the view", function(){
      expect(view.someCallback).not.toHaveBeenCalled();
    });

    it("should unbind any listener to custom view events", function(){
      expect(view.unbind).toHaveBeenCalled();
    });

    it("should remove the view's EL from the DOM", function(){
      expect(view.remove).toHaveBeenCalled();
    });

    it("should call `onClose` if provided", function(){
      expect(view.onClose).toHaveBeenCalled();
    });
  });
});
