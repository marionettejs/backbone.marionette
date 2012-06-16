describe("async collection view", function(){
  beforeEach(function(){
    this.render = Backbone.Marionette.CollectionView.prototype.render;
    this.renderItemView = Backbone.Marionette.CollectionView.prototype.renderItemView;
    this.showCollection = Backbone.Marionette.CollectionView.prototype.showCollection;
    this.showEmptyView = Backbone.Marionette.CollectionView.prototype.showEmptyView;

    // replace the standard render with an async render
    _.extend(Backbone.Marionette.CollectionView.prototype, Backbone.Marionette.Async.CollectionView);
  });

  afterEach(function(){
    Backbone.Marionette.CollectionView.prototype.render = this.render;
    Backbone.Marionette.CollectionView.prototype.renderItemView = this.renderItemView;
    Backbone.Marionette.CollectionView.prototype.showCollection = this.showCollection;
    Backbone.Marionette.CollectionView.prototype.showEmptyView = this.showEmptyView;
  });

  describe("when rendering a collection view", function(){
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

    var CollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView,

      beforeRender: function(){},

      onRender: function(){}
    });
  
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
      spyOn(collectionView, "appendHtml").andCallThrough();

      var deferred = collectionView.render();

      deferred.done(function(){ deferredResolved = true });
    });

    it("should append the html for each itemView", function(){
      expect($(collectionView.$el)).toHaveHtml("<span>bar</span><span>baz</span>");
    });

    it("should provide the index for each itemView, when appending", function(){
      expect(collectionView.appendHtml.calls[0].args[2]).toBe(0);
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

    it("should resolve the deferred object that it returned", function(){
      expect(deferredResolved).toBe(true);
    });
  });

  describe("when a model is added to the collection", function(){
    var Model = Backbone.Model.extend({});

    var Collection = Backbone.Collection.extend({
      model: Model
    });

    var ItemView = Backbone.Marionette.ItemView.extend({
      tagName: "span",
      render: function(){
        this.$el.html(this.model.get("foo"));
      },
      onRender: function(){}
    });

    var CollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView,

      beforeRender: function(){},

      onRender: function(){},

      onItemAdded: function(view){}
    });

    var collectionView;
    var collection;
    var model;

    beforeEach(function(){
      spyOn(ItemView.prototype, "onRender");

      collection = new Collection();
      collectionView = new CollectionView({
        itemView: ItemView,
        collection: collection
      });
      collectionView.render();

      spyOn(collectionView, "appendHtml").andCallThrough();

      model = new Model({foo: "bar"});
      collection.add(model);
    });

    it("should add the model to the list", function(){
      expect(_.size(collectionView.children)).toBe(1);
    });

    it("should render the model in to the DOM", function(){
      expect($(collectionView.$el)).toHaveText("bar");
    });

    it("should provide the index for each itemView, when appending", function(){
      expect(collectionView.appendHtml.calls[0].args[2]).toBe(0);
    });

    describe("emptyView", function(){

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

      describe("when the emptyView has been rendered for an empty collection, then adding an item to the collection", function(){
        var collectionView, closeSpy;

        beforeEach(function(){
          var collection = new Collection();
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

    });

  });

});
