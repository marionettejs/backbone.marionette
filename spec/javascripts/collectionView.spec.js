describe("collection view", function(){
  var Model = Backbone.Model.extend({});

  var Collection = Backbone.Collection.extend({
    model: Model
  });

  var ItemView = Backbone.Marionette.ItemView.extend({
    tagName: "span",
    render: function(){
      this.$el.html(this.model.get("foo"));
    }
  });

  var EmptyView = Backbone.Marionette.ItemView.extend({
    tagName: "span",
    className: "isempty",
    render: function(){}
  });

  var CollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: ItemView,

    beforeRender: function(){},

    onRender: function(){}
  });
  
  var EventedView = Backbone.Marionette.CollectionView.extend({
    itemView: ItemView,

    someCallback: function(){ },

    beforeClose: function(){},

    onClose: function(){ }
  });
  
  var PrependHtmlView = Backbone.Marionette.CollectionView.extend({
    itemView: ItemView,

    appendHtml: function(collectionView, itemView){
      collectionView.$el.prepend(itemView.el);
    }
  });

  var EmptyCollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: ItemView,
    emptyView: EmptyView
  });

  var NoItemView = Backbone.Marionette.CollectionView.extend({
  });

  describe("when rendering a collection view with no `itemView` specified", function(){
    var collectionView;

    beforeEach(function(){
      var collection = new Collection([{foo: "bar"}, {foo: "baz"}]);
      collectionView = new NoItemView({
        collection: collection
      });
    });

    it("should throw an error saying there's not item view", function(){
      expect(function(){collectionView.render()}).toThrow("An `itemView` must be specified");
    });
  });
  
  describe("when rendering a collection view", function(){
    var collection = new Collection([{foo: "bar"}, {foo: "baz"}]);
    var collectionView;
    var deferredResolved;

    beforeEach(function(){
      collectionView = new CollectionView({
        collection: collection
      });

      spyOn(collectionView, "onRender").andCallThrough();
      spyOn(collectionView, "beforeRender").andCallThrough();
      spyOn(collectionView, "trigger").andCallThrough();

      collectionView.render();
    });

    it("should append the html for each itemView", function(){
      expect($(collectionView.$el)).toHaveHtml("<span>bar</span><span>baz</span>");
    });

    it("should reference each of the rendered view items", function(){
      expect(_.size(collectionView.children)).toBe(2);
    });

    it("should call 'beforeRender' before rendering", function(){
      expect(collectionView.beforeRender).toHaveBeenCalled();
    });

    it("should call 'onRender' after rendering", function(){
      expect(collectionView.onRender).toHaveBeenCalled();
    });

    it("should trigger a 'before:render' event", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("collection:before:render", collectionView);
    });

    it("should trigger a 'rendered' event", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("collection:rendered", collectionView);
    });
  });

  describe("when rendering a collection view without a collection", function(){
    var collectionView;
    var deferredResolved;

    beforeEach(function(){
      collectionView = new CollectionView({
      });

      spyOn(collectionView, "onRender").andCallThrough();
      spyOn(collectionView, "beforeRender").andCallThrough();
      spyOn(collectionView, "trigger").andCallThrough();

      collectionView.render();
    });

    it("should not append any html", function(){
      expect($(collectionView.$el)).not.toHaveHtml("<span>bar</span><span>baz</span>");
    });

    it("should not reference any view items", function(){
      expect(_.size(collectionView.children)).toBe(0);
    });
  });

  describe("when rendering a collection view with an empty collection", function(){
    var collectionView;

    beforeEach(function(){
      var collection = new Collection();
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

  describe("when a collection is reset after the view is loaded", function(){
    var collection;
    var collectionView;

    beforeEach(function(){
      collection = new Collection();

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
      expect(_.size(collectionView.children)).toBe(2);
    });

    it("should call 'onRender' after rendering", function(){
      expect(collectionView.onRender).toHaveBeenCalled();
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
      expect($(collectionView.$el)).toHaveText("bar");
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
      expect($(collectionView.$el).children().length).toBe(0);
    });
  });

  describe("when closing a collection view", function(){
    var collectionView;
    var collection;
    var childView;
    var childModel;

    beforeEach(function(){

      collection = new Collection([{foo: "bar"}, {foo: "baz"}]);
      collectionView = new EventedView({
        template: "#itemTemplate",
        collection: collection
      });
      collectionView.render();


      childModel = collection.at(0);
      childView = collectionView.children[childModel.cid];

      collectionView.bindTo(collection, "foo", collectionView.someCallback);

      spyOn(childView, "close").andCallThrough();
      spyOn(collectionView, "removeItemView").andCallThrough();
      spyOn(collectionView, "unbind").andCallThrough();
      spyOn(collectionView, "unbindAll").andCallThrough();
      spyOn(collectionView, "remove").andCallThrough();
      spyOn(collectionView, "someCallback").andCallThrough();
      spyOn(collectionView, "close").andCallThrough();
      spyOn(collectionView, "onClose").andCallThrough();
      spyOn(collectionView, "beforeClose").andCallThrough();
      spyOn(collectionView, "trigger").andCallThrough();

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
      expect(collectionView.removeItemView).not.toHaveBeenCalled();
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

    it("should call `beforeClose` if provided", function(){
      expect(collectionView.beforeClose).toHaveBeenCalled();
    });

    it("should trigger a 'before:close' event", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("collection:before:close");
    });

    it("should trigger a 'closed", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("collection:closed");
    });
  });

  describe("when override appendHtml", function(){
    var collection = new Collection([{foo: "bar"}, {foo: "baz"}]);
    var collectionView;

    beforeEach(function(){
      collectionView = new PrependHtmlView({
        collection: collection
      });

      collectionView.render();
    });

    it("should append via the overridden method", function(){
      expect($(collectionView.$el)).toHaveHtml("<span>baz</span><span>bar</span>");
    });
  });

  describe("when a child view triggers an event", function(){
    var model = new Model({foo: "bar"});
    var collection = new Collection([model]);
    var collectionView;
    var childView;
    var triggeringView;
    var eventArgs;

    beforeEach(function(){
      collectionView = new PrependHtmlView({
        collection: collection
      });

      collectionView.render();
      collectionView.on("itemview:some:event", function(){
        eventArgs = Array.prototype.slice.call(arguments);
      });

      spyOn(collectionView, "trigger").andCallThrough();
      childView = collectionView.children[model.cid];
      childView.trigger("some:event", "test", model);
    });

    it("should bubble up through the parent collection view", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("itemview:some:event", childView, "test", model);
    });

    it("should provide the child view that triggered the event as the first parameter", function(){
      expect(eventArgs[0]).toBe(childView);
    });

    it("should forward all other arguments in order", function(){
      expect(eventArgs[1]).toBe("test");
      expect(eventArgs[2]).toBe(model);
    });
  });
});
