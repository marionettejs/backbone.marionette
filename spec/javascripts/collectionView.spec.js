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
    itemView: ItemView,

    onRender: function(){}
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
    var renderResult;

    beforeEach(function(){
      collectionView = new CollectionView({
        collection: collection
      });

      spyOn(collectionView, "renderItem").andCallThrough();
      spyOn(collectionView, "onRender").andCallThrough();

      renderResult = collectionView.render();
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

    it("should call 'onRender' after rendering", function(){
      expect(collectionView.onRender).toHaveBeenCalled();
    });

    it("should return the view after rendering", function(){
      expect(renderResult).toBe(collectionView);
    });
  });

  describe("when a model is added to the collection", function(){
    var collectionView;
    var collection;
    var model;

    beforeEach(function(){
      collection = new Collection();
      collectionView = new CollectionView({
        itemView: ItemView,
        collection: collection
      });
      collectionView.render();

      model = new Model({foo: "bar"});
      collection.add(model);
    });

    it("should add the model to the list", function(){
      expect(_.size(collectionView.children)).toBe(1);
    });

    it("should render the model in to the DOM", function(){
      expect($(collectionView.el)).toHaveText("bar");
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

      collectionView = new CollectionView({
        itemView: ItemView,
        collection: collection
      });
      collectionView.render();

      childView = collectionView.children[model.cid];
      spyOn(childView, "close").andCallThrough();

      collection.remove(model);
    });

    it("should close the model's view", function(){
      expect(childView.close).toHaveBeenCalled();
    });

    it("should remove the model-view's HTML", function(){
      expect($(collectionView.el).children().length).toBe(0);
    });
  });

  describe("when closing a collection view", function(){
    var collectionView;
    var collection;
    var childView;
    var childModel;

    beforeEach(function(){
      spyOn(EventedView.prototype, "removeChildView").andCallThrough();

      collection = new Collection([{foo: "bar"}, {foo: "baz"}]);
      collectionView = new EventedView({
        template: "#itemTemplate",
        collection: collection
      });
      collectionView.render();


      childModel = collection.at(0);
      childView = collectionView.children[childModel.cid];

      collectionView.bindTo(collection, "foo", collectionView.someCallback);

      spyOn(childView, "close");
      spyOn(collectionView, "unbind").andCallThrough();
      spyOn(collectionView, "unbindAll").andCallThrough();
      spyOn(collectionView, "remove").andCallThrough();
      spyOn(collectionView, "someCallback").andCallThrough();
      spyOn(collectionView, "close").andCallThrough();
      spyOn(collectionView, "onClose").andCallThrough();

      collectionView.close();

      collection.trigger("foo");
      collection.remove(childModel);
    });

    it("should close all of the child views", function(){
      expect(childView.close).toHaveBeenCalled();
    });

    it("should unbind all the bindTo events", function(){
      expect(collectionView.unbindAll).toHaveBeenCalled();
    });

    it("should unbind all collection events for the view", function(){
      expect(collectionView.someCallback).not.toHaveBeenCalled();
      expect(collectionView.removeChildView).not.toHaveBeenCalled();
    });

    it("should unbind any listener to custom view events", function(){
      expect(collectionView.unbind).toHaveBeenCalled();
    });

    it("should remove the view's EL from the DOM", function(){
      expect(collectionView.remove).toHaveBeenCalled();
    });

    it("should call `onClose` if provided", function(){
      expect(collectionView.onClose).toHaveBeenCalled();
    });
  });
});
