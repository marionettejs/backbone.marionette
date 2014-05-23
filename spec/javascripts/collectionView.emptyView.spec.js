describe('collectionview - emptyView', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  var ItemView, EmptyView, EmptyCollectionView;

  beforeEach(function() {
    ItemView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      render: function() {
        this.$el.html(this.model.get('foo'));
      },
      onRender: function() {}
    });

    EmptyView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      className: 'isempty',
      render: function() {}
    });

    EmptyCollectionView = Backbone.Marionette.CollectionView.extend({
      childView: ItemView,
      emptyView: EmptyView
    });
  });

  describe('when rendering a collection view with an empty collection', function() {
    var collectionView, collection;

    beforeEach(function() {
      collection = new Backbone.Collection();
      collectionView = new EmptyCollectionView({
        collection: collection
      });

      collectionView.render();
    });

    it('should append the html for the emptyView', function() {
      expect(collectionView.$el).to.have.$html('<span class="isempty"></span>');
    });

    it('should reference each of the rendered view items', function() {
      expect(_.size(collectionView.children)).to.equal(1);
    });

    describe('and then adding an item to the collection', function() {
      var destroySpy;

      beforeEach(function() {
        destroySpy = this.sinon.spy(EmptyView.prototype, 'destroy');
        collection.add({foo: 'wut'});
      });

      it('should destroy the emptyView', function() {
        expect(destroySpy).to.have.been.called;
      });

      it('should show the new item', function() {
        expect(collectionView.$el).to.contain.$text('wut');
      });
    });
  });

  describe('when the emptyView has been rendered for an empty collection and then collection reset, receiving some values. Then adding an item to the collection', function() {
    var collectionView, destroySpy, collection;

    beforeEach(function() {
      collection = new Backbone.Collection();
      collectionView = new EmptyCollectionView({
        collection: collection
      });

      collectionView.render();

      destroySpy = this.sinon.spy(EmptyView.prototype, 'destroy');

      collection.reset([{foo: 'bar'}, {foo: 'baz'}]);

      collection.add({foo: 'wut'});
    });

    it('should destroy the emptyView', function() {
      expect(destroySpy).to.have.been.called;
    });

    it('should show all three items without empty view', function() {
      expect(collectionView.$el).to.have.$html('<span>bar</span><span>baz</span><span>wut</span>');
    });
  });

  describe('when the last item is removed from a collection', function() {
    var collectionView, collection;

    beforeEach(function() {
      collection = new Backbone.Collection([{foo: 'wut'}]);

      collectionView = new EmptyCollectionView({
        collection: collection
      });

      collectionView.render();

      collection.remove(collection.at(0));
    });

    it('should append the html for the emptyView', function() {
      expect(collectionView.$el).to.have.$html('<span class="isempty"></span>');
    });

    it('should reference each of the rendered view items', function() {
      expect(_.size(collectionView.children)).to.equal(1);
    });
  });


  describe('when the collection is reset multiple times', function() {
    var collectionView, collection, population = [{foo: 1}, {foo: 2}, {foo: 3}];

    beforeEach(function() {
      collection = new Backbone.Collection();
      collectionView = new EmptyCollectionView({
        collection: collection
      });
    });

    it('should remove all EmptyView', function() {
      collectionView.render();        // 1st showEmptyView
      collection.reset(population);   // 1st destroyEmptyView
      collection.reset();             // 2nd showEmptyView
      collection.reset(population);   // 2nd destroyEmptyView
      expect(collectionView.$el).not.to.contain.$html('<span class="isempty"></span>');
    });

    it('should have only one emptyView open', function() {
      collectionView.render();        // 1st showEmptyView
      collection.reset(population);   // 1st destroyEmptyView
      collection.reset();             // 2nd destroyEmptyView, showEmptyView
      collection.reset();             // 3nd destroyEmptyView, showEmptyView
      expect(collectionView.$('span.isempty').length).to.equal(1);
    });
  });

  describe('when a collection is reset with empty data after the view is loaded', function() {
    var ItemView, CollectionView, EmptyView, collection, collectionView, data;

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
        childView: ItemView
      });

      EmptyView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        render: function() {
          this.$el.text('0 items');
          this.trigger('render');
        },
        onRender: function() {}
      });

      data = [{foo: 'bar'}, {foo: 'baz'}];

      collection = new Backbone.Collection(data);

      collectionView = new CollectionView({
        collection: collection,
        emptyView: EmptyView
      });

      collectionView.render();

      collection.reset([]);
    });

    it('should have 1 child view (empty view)', function() {
      expect(collectionView.children.length).to.equal(1);
    });

    it('should append the html for the emptyView', function() {
      expect(collectionView.$el).to.have.$html('<span>0 items</span>');
    });

    it('should not have the empty child view after resetting with data', function() {
      collection.reset(data);

      expect(collectionView.$el).to.have.$html('<span>bar</span><span>baz</span>');
    });
  });

  describe('when emptyView is specified with getEmptyView option', function() {
    var OtherEmptyView, CollectionView;

    beforeEach(function() {
      OtherEmptyView = Backbone.Marionette.ItemView.extend({
        render: function() {}
      });

      CollectionView = Backbone.Marionette.CollectionView.extend({
        childView: ItemView,
        getEmptyView: function() { return OtherEmptyView; }
      });
    });

    describe('when rendering a collection view with an empty collection', function() {
      var collectionView, collection;

      beforeEach(function() {
        collection = new Backbone.Collection();
        collectionView = new CollectionView({
          collection: collection
        });

        collectionView.render();
      });

      it('renders other empty view instance', function() {
        expect(collectionView.children.first()).to.be.instanceof(OtherEmptyView);
      });
    });
  });

  describe('isEmpty', function() {
    var collectionView, collection;

    beforeEach(function() {
      collection = new Backbone.Collection();

      collectionView = new EmptyCollectionView({
        collection: collection
      });

      collectionView.render();
    });

    it('should return true when the collection is empty', function() {
      expect(collectionView.isEmpty()).to.equal(true);
    });

    it('should return false when the collection is not empty', function() {
      collectionView.collection.add({foo: 'wut'});
      expect(collectionView.isEmpty()).to.equal(false);
    });

    describe('when overriding with a populated collection', function() {
      var collection, passedInCollection, OverriddenIsEmptyCollectionView;

      beforeEach(function() {
        collection = new Backbone.Collection([{foo: 'wut'}, {foo: 'wat'}]);

        OverriddenIsEmptyCollectionView = EmptyCollectionView.extend({
          isEmpty: function(col) {
            passedInCollection = col;
            return true;
          }
        });
        collectionView = new OverriddenIsEmptyCollectionView({
          collection: collection
        });

        collectionView.render();
      });

      it('should append the html for the emptyView', function() {
        expect(collectionView.$el).to.have.$html('<span class="isempty"></span>');
      });

      it('should reference each of the rendered view items', function() {
        expect(_.size(collectionView.children)).to.equal(1);
      });

      it('should pass the collection as an argument to isEmpty', function() {
        expect(passedInCollection).to.equal(collection);
      });
    });
  });

  describe('when rendering and an "emptyViewOptions" is provided', function() {
    var collectionView, view, collection;

    beforeEach(function() {
      collection = new Backbone.Collection();
      collectionView = new EmptyCollectionView({
        collection: collection,
        emptyViewOptions: {
          foo: 'bar',
          className: 'baz',
          tagName: 'p'
        }
      });

      collectionView.render();
      view = collectionView.children.findByIndex(0);
    });

    it('should pass the options to the empty view instance', function() {
      expect(view.options.hasOwnProperty('foo')).to.be.true;
      expect(view.options.foo).to.equal('bar');
    });

    it('overrides options of emptyView class', function() {
      expect($(collectionView.$el)).to.have.$html('<p class="baz"></p>');
    });

    describe('when "emptyViewOptions" is provided as a fuction', function() {
      var collection;

      beforeEach(function() {
        collection = new Backbone.Collection();
        collectionView = new EmptyCollectionView({
          collection: collection,
          emptyViewOptions: function() {
            return {
              foo: 'bar',
              collection: this.collection
            };
          }
        });

        collectionView.render();
        view = collectionView.children.findByIndex(0);
      });

      it('should pass the options to the empty view instance', function() {
        expect(view.options.hasOwnProperty('foo')).to.be.true;
        expect(view.options.foo).to.equal('bar');
      });

      it('should pass the collectionView as the context', function() {
        expect(view.options.collection).to.equal(collection);
      });
    });

    describe('when "childViewOptions" are also provided', function() {
      var collection;

      beforeEach(function() {
        collection = new Backbone.Collection();
        collectionView = new EmptyCollectionView({
          collection: collection,
          childViewOptions: {
            foo: 'bar'
          },
          emptyViewOptions: {
            foo: 'baz'
          }
        });

        collectionView.render();
        view = collectionView.children.findByIndex(0);
      });

      it('passes the options to the empty view instance correctly', function() {
        expect(view.options.foo).to.equal('baz');
      });
    });
  });

  describe('when rendering and only "childViewOptions" are provided', function() {
    var collectionView, view, collection;

    beforeEach(function() {
      collection = new Backbone.Collection();
      collectionView = new EmptyCollectionView({
        collection: collection,
        childViewOptions: {
          foo: 'baz'
        }
      });

      collectionView.render();
      view = collectionView.children.findByIndex(0);
    });

    it('passes the options to the empty view instance', function() {
      expect(view.options.foo).to.equal('baz');
    });
  });
});

