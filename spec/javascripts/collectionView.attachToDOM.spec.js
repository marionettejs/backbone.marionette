describe('attaching collection view to existing DOM structure', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when initializing a collection view', function() {
    beforeEach(function() {
      this.CollectionView = Marionette.CollectionView.extend({
        initialize: function() {
          var m = new Backbone.Model();
          var v = new Backbone.View({
            el: '#foo',
            model: m
          });

          this.children.add(v);
        }
      });

      this.collectionView = new this.CollectionView({
        collection: new Backbone.Collection()
      });
    });

    it('should be able to store a new child view that was attached to an existing DOM element', function() {
      expect(this.collectionView.children.length).to.equal(1);
    });
  });
});
