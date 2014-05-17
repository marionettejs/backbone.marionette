describe('collection view - reset', function() {

  var ItemView = Backbone.Marionette.ItemView.extend({
    tagName: 'span',
    render: function() {
      this.$el.html(this.model.get('foo'));
      this.trigger('render');
    },
    onRender: function() {}
  });

  var CollectionView = Backbone.Marionette.CollectionView.extend({
    childView: ItemView,

    onBeforeRender: function() {},
    onRender: function() {},
    onBeforeChildAdded: function() {},
    onAfterChildAdded: function() {}
  });

  describe('when a collection is reset after the view is loaded', function() {
    var collection;
    var collectionView;

    beforeEach(function() {
      collection = new Backbone.Collection();

      collectionView = new CollectionView({
        collection: collection
      });

      spyOn(collectionView, 'onRender').andCallThrough();
      spyOn(collectionView, 'destroyChildren').andCallThrough();

      collectionView.render();

      collection.reset([{foo: 'bar'}, {foo: 'baz'}]);
    });

    it('should destroy all open child views', function() {
      expect(collectionView.destroyChildren).toHaveBeenCalled();
    });

    it('should append the html for each childView', function() {
      expect($(collectionView.$el)).toHaveHtml('<span>bar</span><span>baz</span>');
    });

    it('should reference each of the rendered view items', function() {
      expect(collectionView.children.length).toBe(2);
    });

    it('should call "onRender" after rendering', function() {
      expect(collectionView.onRender).toHaveBeenCalled();
    });

    it('should remove the event handlers for the original children', function() {
      // maintain backwards compatibility with backbone 1.0.0 in tests
      if (typeof collectionView._listeningTo !== 'undefined') {
        expect(_.size(collectionView._listeningTo)).toBe(4);
      } else {
        expect(_.size(collectionView._listeners)).toBe(4);
      }
    });
  });
});
