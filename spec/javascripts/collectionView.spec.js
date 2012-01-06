describe("collection view", function(){
  var Model = Backbone.Model.extend({});

  var Collection = Backbone.Collection.extend({
    model: Model
  });

  var ItemView = Backbone.Marionette.ItemView.extend({
    tagName: "span",
    render: function(){
      this.el.html(this.model.get("foo"));
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
      expect(_.size(collectionView.children)).toBe(2);
    });
  });

  describe("when a model is added to the collection", function(){
    var collectionView;
    var collection;
    var childView;
    var model;

    beforeEach(function(){
      collection = new Collection();
      view = new CollectionView({
        itemView: ItemView,
        collection: collection
      });
      view.render();

      model = new Model({foo: "bar"});
      collection.add(model);
    });

    it("should add the model to the list", function(){
      expect(_.size(view.children)).toBe(1);
    });

    it("should render the model in to the DOM", function(){
      expect($(view.el)).toHaveText("bar");
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

  describe("when a model is removed from the collection", function(){
    var collectionView;
    var collection;
    var childView;
    var model;

    beforeEach(function(){
      model = new Model({foo: "bar"});
      collection = new Collection();
      collection.add(model);

      view = new CollectionView({
        itemView: ItemView,
        collection: collection
      });
      view.render();

      childView = view.children[model.cid];
      spyOn(childView, "close").andCallThrough();

      collection.remove(model);
    });

    it("should close the model's view", function(){
      expect(childView.close).toHaveBeenCalled();
    });

    it("should remove the model-view's HTML", function(){
      expect($(view.el).children().length).toBe(0);
    });
  });

  describe("when closing a collection view", function(){
    var collectionView;
    var collection;
    var childView;
    var childModel;

    beforeEach(function(){
      collection = new Collection([{foo: "bar"}, {foo: "baz"}]);
      view = new EventedView({
        template: "#itemTemplate",
        collection: collection
      });
      view.render();


      childModel = collection.at(0);
      childView = view.children[childModel.cid];

      view.bindTo(collection, "foo", view.collectionChange);

      spyOn(childView, "close");
      spyOn(view, "unbind").andCallThrough();
      spyOn(view, "unbindAll").andCallThrough();
      spyOn(view, "remove").andCallThrough();
      spyOn(view, "someCallback").andCallThrough();
      spyOn(view, "close").andCallThrough();
      spyOn(view, "onClose").andCallThrough();

      view.close();
    });

    it("should close all of the child views", function(){
      expect(childView.close).toHaveBeenCalled();
    });

    it("should unbind all the bindTo events", function(){
      expect(view.unbindAll).toHaveBeenCalled();
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
