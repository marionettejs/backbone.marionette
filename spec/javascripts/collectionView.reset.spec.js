describe('collection view - reset', function() {
  'use strict';
  beforeEach(global.setup);
  afterEach(global.teardown);

  beforeEach(function() {
    this.ItemView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      render: function() {
        this.$el.html(this.model.get('foo'));
        this.trigger('render');
      },
      onRender: function() {}
    });

    this.CollectionView = Backbone.Marionette.CollectionView.extend({
      childView: this.ItemView,
      onBeforeRender: function() {},
      onRender: function() {},
      onBeforeChildAdded: function() {},
      onAfterChildAdded: function() {}
    });
  });

  describe('when a collection is reset after the view is loaded', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();

      this.collectionView = new this.CollectionView({
        collection: this.collection
      });

      this.sinon.spy(this.collectionView, 'onRender');
      this.sinon.spy(this.collectionView, 'destroyChildren');

      this.collectionView.render();

      this.collection.reset([{foo: 'bar'}, {foo: 'baz'}]);
    });

    it('should destroy all open child views', function() {
      expect(this.collectionView.destroyChildren).to.have.been.called;
    });

    it('should append the html for each childView', function() {
      expect($(this.collectionView.$el)).to.have.$html('<span>bar</span><span>baz</span>');
    });

    it('should reference each of the rendered view items', function() {
      expect(this.collectionView.children.length).to.equal(2);
    });

    it('should call "onRender" after rendering', function() {
      expect(this.collectionView.onRender).to.have.been.called;
    });

    it('should remove the event handlers for the original children', function() {
      // maintain backwards compatibility with backbone 1.0.0 in tests
      if (typeof this.collectionView._listeningTo !== 'undefined') {
        expect(_.size(this.collectionView._listeningTo)).to.equal(4);
      } else {
        expect(_.size(this.collectionView._listeners)).to.equal(4);
      }
    });
  });
});
