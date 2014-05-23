describe('collectionview - emptyView', function() {
  'use strict';
  beforeEach(global.setup);
  afterEach(global.teardown);

  beforeEach(function() {
    this.ItemView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      render: function() {
        this.$el.html(this.model.get('foo'));
      },
      onRender: function() {}
    });

    this.EmptyView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      className: 'isempty',
      render: function() {}
    });

    this.EmptyCollectionView = Backbone.Marionette.CollectionView.extend({
      childView: this.ItemView,
      emptyView: this.EmptyView
    });
  });

  describe('when rendering a collection view with an empty collection', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();
      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection
      });

      this.collectionView.render();
    });

    it('should append the html for the emptyView', function() {
      expect(this.collectionView.$el).to.have.$html('<span class="isempty"></span>');
    });

    it('should reference each of the rendered view items', function() {
      expect(_.size(this.collectionView.children)).to.equal(1);
    });

    describe('and then adding an item to the collection', function() {
      beforeEach(function() {
        this.destroySpy = this.sinon.spy(this.EmptyView.prototype, 'destroy');
        this.collection.add({foo: 'wut'});
      });

      it('should destroy the emptyView', function() {
        expect(this.destroySpy).to.have.been.called;
      });

      it('should show the new item', function() {
        expect(this.collectionView.$el).to.contain.$text('wut');
      });
    });
  });

  describe('when the emptyView has been rendered for an empty collection and then collection reset, receiving some values. Then adding an item to the collection', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();
      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection
      });

      this.collectionView.render();

      this.destroySpy = this.sinon.spy(this.EmptyView.prototype, 'destroy');

      this.collection.reset([{foo: 'bar'}, {foo: 'baz'}]);

      this.collection.add({foo: 'wut'});
    });

    it('should destroy the emptyView', function() {
      expect(this.destroySpy).to.have.been.called;
    });

    it('should show all three items without empty view', function() {
      expect(this.collectionView.$el).to.have.$html('<span>bar</span><span>baz</span><span>wut</span>');
    });
  });

  describe('when the last item is removed from a collection', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection([{foo: 'wut'}]);

      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection
      });

      this.collectionView.render();

      this.collection.remove(this.collection.at(0));
    });

    it('should append the html for the emptyView', function() {
      expect(this.collectionView.$el).to.have.$html('<span class="isempty"></span>');
    });

    it('should reference each of the rendered view items', function() {
      expect(_.size(this.collectionView.children)).to.equal(1);
    });
  });


  describe('when the collection is reset multiple times', function() {
    beforeEach(function() {
      this.population = [{foo: 1}, {foo: 2}, {foo: 3}];
      this.collection = new Backbone.Collection();
      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection
      });
    });

    it('should remove all EmptyView', function() {
      this.collectionView.render();           // 1st showEmptyView
      this.collection.reset(this.population); // 1st destroyEmptyView
      this.collection.reset();                // 2nd showEmptyView
      this.collection.reset(this.population); // 2nd destroyEmptyView
      expect(this.collectionView.$el).not.to.contain.$html('<span class="isempty"></span>');
    });

    it('should have only one emptyView open', function() {
      this.collectionView.render();           // 1st showEmptyView
      this.collection.reset(this.population); // 1st destroyEmptyView
      this.collection.reset();                // 2nd destroyEmptyView, showEmptyView
      this.collection.reset();                // 3nd destroyEmptyView, showEmptyView
      expect(this.collectionView.$('span.isempty').length).to.equal(1);
    });
  });

  describe('when a collection is reset with empty data after the view is loaded', function() {
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
        childView: this.ItemView
      });

      this.EmptyView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        render: function() {
          this.$el.text('0 items');
          this.trigger('render');
        },
        onRender: function() {}
      });

      this.data = [{foo: 'bar'}, {foo: 'baz'}];

      this.collection = new Backbone.Collection(this.data);

      this.collectionView = new this.CollectionView({
        collection: this.collection,
        emptyView: this.EmptyView
      });

      this.collectionView.render();

      this.collection.reset([]);
    });

    it('should have 1 child view (empty view)', function() {
      expect(this.collectionView.children.length).to.equal(1);
    });

    it('should append the html for the emptyView', function() {
      expect(this.collectionView.$el).to.have.$html('<span>0 items</span>');
    });

    it('should not have the empty child view after resetting with data', function() {
      this.collection.reset(this.data);

      expect(this.collectionView.$el).to.have.$html('<span>bar</span><span>baz</span>');
    });
  });

  describe('when emptyView is specified with getEmptyView option', function() {
    beforeEach(function() {
      var suite = this;

      this.OtherEmptyView = Backbone.Marionette.ItemView.extend({
        render: function() {}
      });

      this.CollectionView = Backbone.Marionette.CollectionView.extend({
        childView: this.ItemView,
        getEmptyView: function() { return suite.OtherEmptyView; }
      });
    });

    describe('when rendering a collection view with an empty collection', function() {
      beforeEach(function() {
        this.collection = new Backbone.Collection();
        this.collectionView = new this.CollectionView({
          collection: this.collection
        });

        this.collectionView.render();
      });

      it('renders other empty view instance', function() {
        expect(this.collectionView.children.first()).to.be.instanceof(this.OtherEmptyView);
      });
    });
  });

  describe('isEmpty', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();

      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection
      });

      this.collectionView.render();
    });

    it('should return true when the collection is empty', function() {
      expect(this.collectionView.isEmpty()).to.equal(true);
    });

    it('should return false when the collection is not empty', function() {
      this.collectionView.collection.add({foo: 'wut'});
      expect(this.collectionView.isEmpty()).to.equal(false);
    });

    describe('when overriding with a populated collection', function() {
      beforeEach(function() {
        var suite = this;

        this.collection = new Backbone.Collection([{foo: 'wut'}, {foo: 'wat'}]);

        this.OverriddenIsEmptyCollectionView = this.EmptyCollectionView.extend({
          isEmpty: function(col) {
            suite.passedInCollection = col;
            return true;
          }
        });
        this.collectionView = new this.OverriddenIsEmptyCollectionView({
          collection: this.collection
        });

        this.collectionView.render();
      });

      it('should append the html for the emptyView', function() {
        expect(this.collectionView.$el).to.have.$html('<span class="isempty"></span>');
      });

      it('should reference each of the rendered view items', function() {
        expect(_.size(this.collectionView.children)).to.equal(1);
      });

      it('should pass the collection as an argument to isEmpty', function() {
        expect(this.passedInCollection).to.equal(this.collection);
      });
    });
  });

  describe('when rendering and an "emptyViewOptions" is provided', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();
      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection,
        emptyViewOptions: {
          foo: 'bar',
          className: 'baz',
          tagName: 'p'
        }
      });

      this.collectionView.render();
      this.view = this.collectionView.children.findByIndex(0);
    });

    it('should pass the options to the empty view instance', function() {
      expect(this.view.options.hasOwnProperty('foo')).to.be.true;
      expect(this.view.options.foo).to.equal('bar');
    });

    it('overrides options of emptyView class', function() {
      expect($(this.collectionView.$el)).to.have.$html('<p class="baz"></p>');
    });

    describe('when "emptyViewOptions" is provided as a fuction', function() {
      beforeEach(function() {
        this.collection = new Backbone.Collection();
        this.collectionView = new this.EmptyCollectionView({
          collection: this.collection,
          emptyViewOptions: function() {
            return {
              foo: 'bar',
              collection: this.collection
            };
          }
        });

        this.collectionView.render();
        this.view = this.collectionView.children.findByIndex(0);
      });

      it('should pass the options to the empty view instance', function() {
        expect(this.view.options.hasOwnProperty('foo')).to.be.true;
        expect(this.view.options.foo).to.equal('bar');
      });

      it('should pass the collectionView as the context', function() {
        expect(this.view.options.collection).to.equal(this.collection);
      });
    });

    describe('when "childViewOptions" are also provided', function() {
      beforeEach(function() {
        this.collection = new Backbone.Collection();
        this.collectionView = new this.EmptyCollectionView({
          collection: this.collection,
          childViewOptions: {
            foo: 'bar'
          },
          emptyViewOptions: {
            foo: 'baz'
          }
        });

        this.collectionView.render();
        this.view = this.collectionView.children.findByIndex(0);
      });

      it('passes the options to the empty view instance correctly', function() {
        expect(this.view.options.foo).to.equal('baz');
      });
    });
  });

  describe('when rendering and only "childViewOptions" are provided', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();
      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection,
        childViewOptions: {
          foo: 'baz'
        }
      });

      this.collectionView.render();
      this.view = this.collectionView.children.findByIndex(0);
    });

    it('passes the options to the empty view instance', function() {
      expect(this.view.options.foo).to.equal('baz');
    });
  });
});

