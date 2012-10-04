describe("attaching collection view to existing DOM structure", function(){

  describe("when initializing a collection view", function(){

    var CollectionView = Marionette.CollectionView.extend({
      initialize: function(){
        var m = new Backbone.Model();
        var v = new Backbone.View({
          el: "#foo",
          model: m
        });

        this.storeChild(v);
      }
    });

    var cv;

    beforeEach(function(){
      cv = new CollectionView({
        collection: new Backbone.Collection()
      });
    });

    it("should be able to store a new child view that was attached to an existing DOM element", function(){
      expect(_.size(cv.children)).toBe(1);
    });

  });

});
