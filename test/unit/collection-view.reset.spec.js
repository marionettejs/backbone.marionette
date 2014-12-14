describe('collection view - reset', function() {
  'use strict';

  beforeEach(function() {
    this.collection = new Backbone.Collection();

    this.ItemView = Backbone.Marionette.ItemView.extend({
      template: _.template('<%= foo %>')
    });

    this.onRenderStub = this.sinon.stub();
    this.destroyChildrenStub = this.sinon.stub();

    this.CollectionView = Backbone.Marionette.CollectionView.extend({
      childView: this.ItemView,
      onRender: this.onRenderStub,
      destroyChildren: this.destroyChildrenStub
    });

    this.collectionView = new this.CollectionView({
      collection: this.collection
    });
  });

  describe('when a collection is reset after the view is loaded', function() {
    beforeEach(function() {
      this.collectionView.render();
      this.collection.reset([{foo: 'bar'}, {foo: 'baz'}]);
    });

    it('should destroy all open child views', function() {
      expect(this.destroyChildrenStub).to.have.been.called;
    });

    it('should append the html for each childView', function() {
      expect(this.collectionView.$el).to.have.$html('<div>bar</div><div>baz</div>');
    });

    it('should reference each of the rendered view items', function() {
      expect(this.collectionView.children).to.have.lengthOf(2);
    });

    it('should call "onRender" after rendering', function() {
      expect(this.onRenderStub).to.have.been.called;
    });

    it('should remove the event handlers for the original children', function() {
      // Needs to be written this way as Backbone < 1.1 used _listeners instead of _listeningTo
      var listeners = this.collectionView._listeningTo || this.collectionView._listeners;
      expect(_.toArray(listeners)).to.have.lengthOf(3);
    });
  });
});
