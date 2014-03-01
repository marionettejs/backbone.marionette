describe("collection view - childViewOptions", function(){

  var ItemView = Backbone.Marionette.ItemView.extend({
    tagName: "span",
    render: function(){
      this.$el.html(this.model.get("foo"));
      this.trigger('render');
    },
    onRender: function(){}
  });

  var CollectionView = Backbone.Marionette.CollectionView.extend({
    childView: ItemView,

    onBeforeRender: function(){},

    onRender: function(){},

    onBeforeChildAdded: function(view){},
    onAfterChildAdded: function(view){}
  });

  describe("when rendering and a 'childViewOptions' is provided", function(){
    var CollectionView = Backbone.Marionette.CollectionView.extend({
      childView: ItemView,
      childViewOptions: {
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

  describe("when rendering and a 'childViewOptions' is provided as a function", function(){
    var CollectionView = Backbone.Marionette.CollectionView.extend({
      childView: ItemView,
      childViewOptions: function(model, index){
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
      spyOn(collectionView, 'childViewOptions').andCallThrough();

      collectionView.render();
      view = collectionView.children.findByIndex(0);
    });

    it("should pass the options to every view instance", function(){
      expect(view.options.hasOwnProperty("foo")).toBe(true);
    });

    it("should pass the model when calling 'childViewOptions'", function() {
      expect(collectionView.childViewOptions).toHaveBeenCalledWith(collection.at(0), 0);
      expect(collectionView.childViewOptions).toHaveBeenCalledWith(collection.at(1), 1);
    });
  });

  describe("when rendering and a 'childViewOptions' is provided at construction time", function(){
    var CollectionView = Backbone.Marionette.CollectionView.extend({
      childView: ItemView
    });

    var collection = new Backbone.Collection([{foo: "bar"}]);
    var collectionView, view;

    beforeEach(function(){
      collectionView = new CollectionView({
        collection: collection,
        childViewOptions: {
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
