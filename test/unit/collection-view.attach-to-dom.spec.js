describe('attaching collection view to existing DOM structure', function() {
  'use strict';

  describe('when initializing a collection view', function() {
    beforeEach(function() {
      this.collectionView = new Marionette.CollectionView();
      this.collectionView.children.add(new Backbone.View());
    });

    it('should be able to store a new child view that was attached to an existing DOM element', function() {
      expect(this.collectionView.children.length).to.equal(1);
    });
  });
});
