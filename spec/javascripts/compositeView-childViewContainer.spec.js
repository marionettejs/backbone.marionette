describe('composite view - childViewContainer', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  var Model, Collection, ItemView;

  beforeEach(function() {
    Model = Backbone.Model.extend({});

    Collection = Backbone.Collection.extend({
      model: Model
    });

    ItemView = Backbone.Marionette.ItemView.extend({
      tagName: 'li',
      render: function() {
        this.$el.html(this.model.get('foo'));
      }
    });
  });

  describe('when rendering a collection in a composite view with a "childViewContainer" specified', function() {
    var CompositeView, CompositeViewWithoutItemViewContainer, compositeView, order, collection, m1, m2;

    beforeEach(function() {
      CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: ItemView,
        childViewContainer: 'ul',
        template: '#composite-child-container-template',
        ui: {
          list: 'ul'
        }
      });

      CompositeViewWithoutItemViewContainer = Backbone.Marionette.CompositeView.extend({
        childView: ItemView,
        template: '#composite-child-container-template'
      });

      order = [];
      this.loadFixtures('compositeChildContainerTemplate.html');

      m1 = new Model({foo: 'bar'});
      m2 = new Model({foo: 'baz'});
      collection = new Collection([ m1, m2 ]);
    });

    function specCase(desc, viewCreation) {
      describe(desc, function() {
        beforeEach(function() {
          compositeView = viewCreation();

          this.sinon.spy(compositeView, 'resetChildViewContainer');

          compositeView.render();
        });

        it('should reset any existing childViewContainer', function() {
          expect(compositeView.resetChildViewContainer).to.have.been.called;
        });

        it('should render the items in to the specified container', function() {
          expect(compositeView.$('ul')).to.contain.$text('bar');
          expect(compositeView.$('ul')).to.contain.$text('baz');
        });
      });
    }

    specCase('in the view definition', function() {
      return new CompositeView({
        collection: collection
      });
    });

    specCase('in the view creation', function() {
      return new CompositeViewWithoutItemViewContainer({
        childViewContainer: 'ul',
        collection: collection
      });
    });

    specCase('with a @ui element', function() {
      return new CompositeView({
        childViewContainer: '@ui.list',
        collection: collection
      });
    });
  });

  describe('when rendering a collection in a composite view with a missing "childViewContainer" specified', function() {
    var CompositeView, compositeView, order, m1, m2, collection;

    beforeEach(function() {
      CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: ItemView,
        childViewContainer: '#missing-container',
        template: '#composite-child-container-template'
      });

      order = [];
      this.loadFixtures('compositeChildContainerTemplate.html');

      m1 = new Model({foo: 'bar'});
      m2 = new Model({foo: 'baz'});
      collection = new Collection([m1, m2]);

      compositeView = new CompositeView({
        collection: collection
      });

      this.sinon.spy(compositeView, 'resetChildViewContainer');
    });

    it('should throw an error', function() {
      expect(compositeView.render).to.throw('The specified "childViewContainer" was not found: #missing-container');
    });

    describe('and referencing the @ui hash', function() {
      beforeEach(function() {
        CompositeView = Backbone.Marionette.CompositeView.extend({
          childView: ItemView,
          childViewContainer: '@ui.missing-container',
          template: '#composite-child-container-template'
        });
      });

      it('should still throw an error', function() {
        expect(compositeView.render).to.throw('The specified "childViewContainer" was not found: #missing-container');
      });
    });
  });

  describe('when rendering a collection in a composite view without a "childViewContainer" specified', function() {
    var CompositeView, compositeView, order, m1, m2, collection;

    beforeEach(function() {
      CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: ItemView,
        template: '#composite-child-container-template'
      });

      order = [];
      this.loadFixtures('compositeChildContainerTemplate.html');

      m1 = new Model({foo: 'bar'});
      m2 = new Model({foo: 'baz'});
      collection = new Collection([m1, m2]);

      compositeView = new CompositeView({
        collection: collection
      });

      compositeView.render();
    });

    it('should render the items in to the composite view directly', function() {
      expect(compositeView.$el).to.contain.$html('<ul></ul>');
    });
  });

  describe('when a collection is loaded / reset after the view is created and before it is rendered', function() {
    var ItemView, ListView, view, collection;

    beforeEach(function() {
      ItemView = Marionette.ItemView.extend({
        template: _.template('test')
      });

      ListView = Marionette.CompositeView.extend({
        template: _.template('<table><tbody></tbody></table>'),
        childViewContainer: 'tbody',
        childView: ItemView
      });

      collection = new Backbone.Collection();

      view = new ListView({
        collection: collection
      });

      collection.reset([{id: 1}]);
    });

    it('should not render the items', function() {
      expect(view.children.length).to.equal(0);
    });
  });

  describe('when a composite view is not yet rendered', function() {
    var CompositeView, compositeView, collection, model1, model2, addModel, removeModel, resetCollection;

    beforeEach(function() {
      CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: ItemView,
        childViewContainer: 'ul',
        template: '#composite-child-container-template'
      });

      addModel = function() {
        collection.add([model2]);
      };

      removeModel = function() {
        collection.remove([model1]);
      };

      resetCollection = function() {
        collection.reset([model1, model2]);
      };

      this.loadFixtures('compositeChildContainerTemplate.html');
      model1 = new Model({foo: 'bar'});
      model2 = new Model({foo: 'baz'});
      collection = new Collection([ model1 ]);
      compositeView = new CompositeView({
        collection: collection
      });
      this.sinon.spy(compositeView, '_onCollectionAdd');
    });

    it('should not raise any errors when item is added to collection', function() {
      expect(addModel).not.to.throw;
    });

    it('should not call _onCollectionAdd when item is added to collection', function() {
      addModel();
      expect(compositeView._onCollectionAdd).not.to.have.been.called;
    });

    it('should not raise any errors when item is removed from collection', function() {
      expect(removeModel).not.to.throw;
    });

    it('should not raise any errors when collection is reset', function() {
      expect(resetCollection).not.to.throw;
    });
  });

  describe('when a composite view has the "childViewContainer" specified as a function', function() {
    var CompositeView, compositeView;

    beforeEach(function() {
      CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: ItemView,
        template: '#composite-child-container-template'
      });

      compositeView = new CompositeView();
      compositeView.childViewContainer = this.sinon.stub().returns('ul');
      compositeView.render();
    });

    it('calls the "childViewContainer" in the context of the composite view', function() {
      expect(compositeView.childViewContainer).to.have.been.calledOn(compositeView);
    });
  });
});
