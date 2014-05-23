describe('collection view - childViewOptions', function() {
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
      childViewOptions: {
        foo: 'bar'
      }
    });
  });

  describe('when rendering and a "childViewOptions" is provided', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection([{foo: 'bar'}]);

      this.collectionView = new this.CollectionView({
        collection: this.collection
      });

      this.collectionView.render();
      this.view = this.collectionView.children.findByIndex(0);
    });

    it('should pass the options to every view instance', function() {
      expect(this.view.options.hasOwnProperty('foo')).to.be.true;
    });
  });

  describe('when rendering and a "childViewOptions" is provided as a function', function() {
    beforeEach(function() {
      this.CollectionView = Backbone.Marionette.CollectionView.extend({
        childView: this.ItemView,
        childViewOptions: function(model, index) {
          return {
            foo: 'bar',
            index: index
          };
        }
      });

      this.collection = new Backbone.Collection([{foo: 'bar'}, {foo: 'baz'}]);

      this.collectionView = new this.CollectionView({
        collection: this.collection
      });
      this.sinon.spy(this.collectionView, 'childViewOptions');

      this.collectionView.render();
      this.view = this.collectionView.children.findByIndex(0);
    });

    it('should pass the options to every view instance', function() {
      expect(this.view.options.hasOwnProperty('foo')).to.be.true;
    });

    it('should pass the model when calling "childViewOptions"', function() {
      expect(this.collectionView.childViewOptions).to.have.been.calledWith(this.collection.at(0), 0);
      expect(this.collectionView.childViewOptions).to.have.been.calledWith(this.collection.at(1), 1);
    });
  });

  describe('when rendering and a "childViewOptions" is provided at construction time', function() {
    beforeEach(function() {
      this.CollectionView = Backbone.Marionette.CollectionView.extend({
        childView: this.ItemView
      });

      this.collection = new Backbone.Collection([{foo: 'bar'}]);

      this.collectionView = new this.CollectionView({
        collection: this.collection,
        childViewOptions: {
          foo: 'bar'
        }
      });

      this.collectionView.render();
      this.view = _.values(this.collectionView.children._views)[0];
    });

    it('should pass the options to every view instance', function() {
      expect(this.view.options.hasOwnProperty('foo')).to.be.true;
    });
  });
});
