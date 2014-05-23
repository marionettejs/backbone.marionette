describe('composite view - childViewContainer', function() {
  'use strict';
  beforeEach(global.setup);
  afterEach(global.teardown);

  beforeEach(function() {
    this.Model = Backbone.Model.extend({});

    this.Collection = Backbone.Collection.extend({
      model: this.Model
    });

    this.ItemView = Backbone.Marionette.ItemView.extend({
      tagName: 'li',
      render: function() {
        this.$el.html(this.model.get('foo'));
      }
    });
  });

  describe('when rendering a collection in a composite view with a "childViewContainer" specified', function() {
    beforeEach(function() {
      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ItemView,
        childViewContainer: 'ul',
        template: '#composite-child-container-template',
        ui: {
          list: 'ul'
        }
      });

      this.CompositeViewWithoutItemViewContainer = Backbone.Marionette.CompositeView.extend({
        childView: this.ItemView,
        template: '#composite-child-container-template'
      });

      this.order = [];
      this.loadFixtures('compositeChildContainerTemplate.html');

      this.m1 = new this.Model({foo: 'bar'});
      this.m2 = new this.Model({foo: 'baz'});
      this.collection = new this.Collection([ this.m1, this.m2 ]);
    });

    function specCase(desc, viewCreation) {
      describe(desc, function() {
        beforeEach(function() {
          this.compositeView = viewCreation.apply(this);

          this.sinon.spy(this.compositeView, 'resetChildViewContainer');

          this.compositeView.render();
        });

        it('should reset any existing childViewContainer', function() {
          expect(this.compositeView.resetChildViewContainer).to.have.been.called;
        });

        it('should render the items in to the specified container', function() {
          expect(this.compositeView.$('ul')).to.contain.$text('bar');
          expect(this.compositeView.$('ul')).to.contain.$text('baz');
        });
      });
    }

    specCase('in the view definition', function() {
      return new this.CompositeView({
        collection: this.collection
      });
    });

    specCase('in the view creation', function() {
      return new this.CompositeViewWithoutItemViewContainer({
        childViewContainer: 'ul',
        collection: this.collection
      });
    });

    specCase('with a @ui element', function() {
      return new this.CompositeView({
        childViewContainer: '@ui.list',
        collection: this.collection
      });
    });
  });

  describe('when rendering a collection in a composite view with a missing "childViewContainer" specified', function() {
    beforeEach(function() {
      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ItemView,
        childViewContainer: '#missing-container',
        template: '#composite-child-container-template'
      });

      this.order = [];
      this.loadFixtures('compositeChildContainerTemplate.html');

      this.m1 = new this.Model({foo: 'bar'});
      this.m2 = new this.Model({foo: 'baz'});
      this.collection = new this.Collection([this.m1, this.m2]);

      this.compositeView = new this.CompositeView({
        collection: this.collection
      });

      this.sinon.spy(this.compositeView, 'resetChildViewContainer');
    });

    it('should throw an error', function() {
      expect(this.compositeView.render).to.throw('The specified "childViewContainer" was not found: #missing-container');
    });

    describe('and referencing the @ui hash', function() {
      beforeEach(function() {
        this.CompositeView = Backbone.Marionette.CompositeView.extend({
          childView: this.ItemView,
          childViewContainer: '@ui.missing-container',
          template: '#composite-child-container-template'
        });
      });

      it('should still throw an error', function() {
        expect(this.compositeView.render).to.throw('The specified "childViewContainer" was not found: #missing-container');
      });
    });
  });

  describe('when rendering a collection in a composite view without a "childViewContainer" specified', function() {
    beforeEach(function() {
      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ItemView,
        template: '#composite-child-container-template'
      });

      this.order = [];
      this.loadFixtures('compositeChildContainerTemplate.html');

      this.m1 = new this.Model({foo: 'bar'});
      this.m2 = new this.Model({foo: 'baz'});
      this.collection = new this.Collection([this.m1, this.m2]);

      this.compositeView = new this.CompositeView({
        collection: this.collection
      });

      this.compositeView.render();
    });

    it('should render the items in to the composite view directly', function() {
      expect(this.compositeView.$el).to.contain.$html('<ul></ul>');
    });
  });

  describe('when a collection is loaded / reset after the view is created and before it is rendered', function() {
    beforeEach(function() {
      this.ItemView = Marionette.ItemView.extend({
        template: _.template('test')
      });

      this.ListView = Marionette.CompositeView.extend({
        template: _.template('<table><tbody></tbody></table>'),
        childViewContainer: 'tbody',
        childView: this.ItemView
      });

      this.collection = new Backbone.Collection();

      this.view = new this.ListView({
        collection: this.collection
      });

      this.collection.reset([{id: 1}]);
    });

    it('should not render the items', function() {
      expect(this.view.children.length).to.equal(0);
    });
  });

  describe('when a composite view is not yet rendered', function() {
    beforeEach(function() {
      var suite = this;

      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ItemView,
        childViewContainer: 'ul',
        template: '#composite-child-container-template'
      });

      this.addModel = function() {
        suite.collection.add([suite.model2]);
      };

      this.removeModel = function() {
        suite.collection.remove([suite.model1]);
      };

      this.resetCollection = function() {
        suite.collection.reset([suite.model1, suite.model2]);
      };

      this.loadFixtures('compositeChildContainerTemplate.html');
      this.model1 = new this.Model({foo: 'bar'});
      this.model2 = new this.Model({foo: 'baz'});
      this.collection = new this.Collection([ this.model1 ]);
      this.compositeView = new this.CompositeView({
        collection: this.collection
      });
      this.sinon.spy(this.compositeView, '_onCollectionAdd');
    });

    it('should not raise any errors when item is added to collection', function() {
      expect(this.addModel).not.to.throw;
    });

    it('should not call _onCollectionAdd when item is added to collection', function() {
      this.addModel();
      expect(this.compositeView._onCollectionAdd).not.to.have.been.called;
    });

    it('should not raise any errors when item is removed from collection', function() {
      expect(this.removeModel).not.to.throw;
    });

    it('should not raise any errors when collection is reset', function() {
      expect(this.resetCollection).not.to.throw;
    });
  });

  describe('when a composite view has the "childViewContainer" specified as a function', function() {
    beforeEach(function() {
      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ItemView,
        template: '#composite-child-container-template'
      });

      this.compositeView = new this.CompositeView();
      this.compositeView.childViewContainer = this.sinon.stub().returns('ul');
      this.compositeView.render();
    });

    it('calls the "childViewContainer" in the context of the composite view', function() {
      expect(this.compositeView.childViewContainer).to.have.been.calledOn(this.compositeView);
    });
  });
});
