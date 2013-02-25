describe("collection view - itemViewOptions", function(){

  var ItemView = Backbone.Marionette.ItemView.extend({
    tagName: "span",
    render: function(){
      this.$el.html(this.model.get("foo"));
      this.trigger('render');
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

  describe("when rendering and an 'itemViewOptions' is provided", function(){
    var CollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView,
      itemViewOptions: {
        foo: "bar"
      }
    });

    var collection = new Backbone.Collection([{foo: "bar"}]);
    var collectionView, view;

    beforeEach(function(){
      collectionView = new CollectionView({
        collection: collection
      });

      collectionView.render();
      view = collectionView.children.findByIndex(0);
    });

    it("should pass the options to every view instance", function(){
      expect(view.options.hasOwnProperty("foo")).toBe(true);
    });
  });

  describe("when rendering and an 'itemViewOptions' is provided as a function", function(){
    var CollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView,
      itemViewOptions: function(model, index){
        return {
          foo: "bar",
          index: index
        };
      }
    });

    var collection = new Backbone.Collection([{foo: "bar"},{foo: "baz"}]);
    var collectionView, view;

    beforeEach(function(){
      collectionView = new CollectionView({
        collection: collection
      });
      spyOn(collectionView, 'itemViewOptions').andCallThrough();

      collectionView.render();
      view = collectionView.children.findByIndex(0);
    });

    it("should pass the options to every view instance", function(){
      expect(view.options.hasOwnProperty("foo")).toBe(true);
    });

    it("should get the item index passed through the itemViewOptions function", function(){
      expect(view.options.index).toBe(0);
    });
    
    it("should pass the model when calling 'itemViewOptions'", function() {
      expect(collectionView.itemViewOptions).toHaveBeenCalledWith(collection.at(0)); 
      expect(collectionView.itemViewOptions).toHaveBeenCalledWith(collection.at(1)); 
    });
  });

  describe("when rendering and an 'itemViewOptions' is provided at construction time", function(){
    var CollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView
    });

    var collection = new Backbone.Collection([{foo: "bar"}]);
    var collectionView, view;

    beforeEach(function(){
      collectionView = new CollectionView({
        collection: collection,
        itemViewOptions: {
          foo: "bar"
        }
      });

      collectionView.render();
      view = _.values(collectionView.children._views)[0];
    });

    it("should pass the options to every view instance", function(){
      expect(view.options.hasOwnProperty("foo")).toBe(true);
    });
  });

});
