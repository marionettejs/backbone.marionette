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
  });

  describe("when fetching collection with emptyView", function(){

      var EmptyCollectionView = Backbone.Marionette.CollectionView.extend({
          itemView: ItemView,
          loadingView: LoadingView,
          emptyView: EmptyView
      });

    var collection, collectionView, sync;

    beforeEach(function(){

      collection = new Backbone.Collection([], {
          url: '/fake_collection_url',
      });
      collection.sync =  function(){ sync.apply(this, arguments) };

      collectionView = new EmptyCollectionView({
        collection: collection
      });

      collectionView.render();
    });

    it("should append the html for the loadingView", function(){
      sync = function(_m, model, options){ model.trigger('request', model, null, options); };
      collection.fetch();
      expect($(collectionView.$el)).toHaveHtml("<span class=\"isloading\"></span>");
    });

    it("should remove the html for the loadingView when model is synced", function(){
      var requestIsDone = false;
      sync = function(_m, model, options){
          model.trigger('request', model, null, options);
          setTimeout(function(){
              options.success([]);
              model.trigger('sync', model, null, options);
          }, 0);
      };
      collection.fetch();
      waits(0);
      runs(function() {
        expect($(collectionView.$el)).toHaveHtml("<span class=\"isempty\"></span>");
      });
    });

    it("should show items when collection is synced", function(){
      var requestIsDone = false;
      sync = function(_m, model, options){
          model.trigger('request', model, null, options);
          setTimeout(function(){
              options.success([{ foo: 'bar' }]);
              model.trigger('sync', model, null, options);
          }, 0);
      };
      collection.fetch();
      waits(0);
      runs(function() {
        expect($(collectionView.$el)).toHaveHtml("<span>bar</span>");
      });
    });

    it("should show items when collection is synced with reset option", function(){
      var requestIsDone = false;
      sync = function(_m, model, options){
          model.trigger('request', model, null, options);
          setTimeout(function(){
              options.success([{ foo: 'bar' }]);
              model.trigger('sync', model, null, options);
          }, 0);
      };
      collection.fetch({ reset: true });
      waits(0);
      runs(function() {
        expect($(collectionView.$el)).toHaveHtml("<span>bar</span>");
      });
    });

  });

});
