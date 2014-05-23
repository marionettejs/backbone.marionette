describe('collection view - childViewOptions', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  var ItemView, CollectionView;

  beforeEach(function() {
    ItemView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      render: function() {
        this.$el.html(this.model.get('foo'));
        this.trigger('render');
      },
      onRender: function() {}
    });

    CollectionView = Backbone.Marionette.CollectionView.extend({
      childView: ItemView,
      childViewOptions: {
        foo: 'bar'
      }
    });
  });

  describe('when rendering and a "childViewOptions" is provided', function() {
    var collection, collectionView, view;

    beforeEach(function() {
      collection = new Backbone.Collection([{foo: 'bar'}]);

      collectionView = new CollectionView({
        collection: collection
      });

      collectionView.render();
      view = collectionView.children.findByIndex(0);
    });

    it('should pass the options to every view instance', function() {
      expect(view.options.hasOwnProperty('foo')).to.be.true;
    });
  });

  describe('when rendering and a "childViewOptions" is provided as a function', function() {
    var CollectionView, collection, collectionView, view;

    beforeEach(function() {
      CollectionView = Backbone.Marionette.CollectionView.extend({
        childView: ItemView,
        childViewOptions: function(model, index) {
          return {
            foo: 'bar',
            index: index
          };
        }
      });

      collection = new Backbone.Collection([{foo: 'bar'}, {foo: 'baz'}]);

      collectionView = new CollectionView({
        collection: collection
      });
      this.sinon.spy(collectionView, 'childViewOptions');

      collectionView.render();
      view = collectionView.children.findByIndex(0);
    });

    it('should pass the options to every view instance', function() {
      expect(view.options.hasOwnProperty('foo')).to.be.true;
    });

    it('should pass the model when calling "childViewOptions"', function() {
      expect(collectionView.childViewOptions).to.have.been.calledWith(collection.at(0), 0);
      expect(collectionView.childViewOptions).to.have.been.calledWith(collection.at(1), 1);
    });
  });

  describe('when rendering and a "childViewOptions" is provided at construction time', function() {
    var CollectionView, collection, collectionView, view;

    beforeEach(function() {
      CollectionView = Backbone.Marionette.CollectionView.extend({
        childView: ItemView
      });

      collection = new Backbone.Collection([{foo: 'bar'}]);

      collectionView = new CollectionView({
        collection: collection,
        childViewOptions: {
          foo: 'bar'
        }
      });

      collectionView.render();
      view = _.values(collectionView.children._views)[0];
    });

    it('should pass the options to every view instance', function() {
      expect(view.options.hasOwnProperty('foo')).to.be.true;
    });
  });
});
