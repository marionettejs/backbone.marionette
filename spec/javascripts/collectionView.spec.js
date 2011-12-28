describe("collection view", function(){
  var ItemView = Backbone.Marionette.ItemView.extend({
  });

  var CollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: ItemView
  });
  
  describe("when rendering a collection view", function(){
    it("should render the specified itemView for each item", function(){
      fail
    });
  });

});
