describe("async collection view", function(){
  beforeEach(function(){
    this.render = Backbone.Marionette.CollectionView.prototype.render;
    this.renderItemView = Backbone.Marionette.CollectionView.prototype.renderItemView;

    // replace the standard render with an async render
    _.extend(Backbone.Marionette.CollectionView.prototype, Backbone.Marionette.Async.CollectionView);
  });

  afterEach(function(){
    Backbone.Marionette.CollectionView.prototype.render = this.render;
    Backbone.Marionette.CollectionView.prototype.renderItemView = this.renderItemView;
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

      var deferred = collectionView.render();

      deferred.done(function(){ deferredResolved = true });
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

    it("should resolve the deferred object that it returned", function(){
      expect(deferredResolved).toBe(true);
    });
  });
});
