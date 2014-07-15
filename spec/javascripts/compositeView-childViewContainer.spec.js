describe('composite view - childViewContainer', function() {
  'use strict';

  beforeEach(function() {
    this.modelOne   = new Backbone.Model({foo: 'bar'});
    this.modelTwo   = new Backbone.Model({foo: 'baz'});
    this.collection = new Backbone.Collection([this.modelOne, this.modelTwo]);

    this.templateFn = _.template('<div id="foo"></div>');

    this.ItemView = Marionette.ItemView.extend({
      tagName: 'li',
      render: function() {
        this.$el.html(this.model.get('foo'));
      }
    });
  });

  describe('when rendering a collection in a composite view with a "childViewContainer" specified', function() {
    beforeEach(function() {
      this.CompositeView = Marionette.CompositeView.extend({
        childView: this.ItemView,
        template: this.templateFn,
        ui: {foo: '#foo'},
        initialize: function() {
          this.render();
        }
      });

      this.resetChildViewContainerSpy = this.sinon.spy(this.CompositeView.prototype, 'resetChildViewContainer');
    });

    describe('in the view definition', function() {
      beforeEach(function() {
        this.CompositeView = this.CompositeView.extend({
          childViewContainer: '#foo'
        });

        this.compositeView = new this.CompositeView({
          collection: this.collection
        });
      });

      it('should reset any existing childViewContainer', function() {
        expect(this.resetChildViewContainerSpy).to.have.been.calledOnce;
      });

      it('should render the items in to the specified container', function() {
        expect(this.compositeView.ui.foo).to.contain.$html('<li>bar</li><li>baz</li>');
      });
    });

    describe('in the view definition', function() {
      beforeEach(function() {
        this.compositeView = new this.CompositeView({
          childViewContainer: '#foo',
          collection: this.collection
        });
      });

      it('should reset any existing childViewContainer', function() {
        expect(this.resetChildViewContainerSpy).to.have.been.calledOnce;
      });

      it('should render the items in to the specified container', function() {
        expect(this.compositeView.ui.foo).to.contain.$html('<li>bar</li><li>baz</li>');
      });
    });

    describe('in the view definition', function() {
      beforeEach(function() {
        this.compositeView = new this.CompositeView({
          childViewContainer: '@ui.foo',
          collection: this.collection
        });
      });

      it('should reset any existing childViewContainer', function() {
        expect(this.resetChildViewContainerSpy).to.have.been.calledOnce;
      });

      it('should render the items in to the specified container', function() {
        expect(this.compositeView.ui.foo).to.contain.$html('<li>bar</li><li>baz</li>');
      });
    });
  });

  describe('when rendering a collection in a composite view with a missing "childViewContainer" specified', function() {
    beforeEach(function() {
      this.CompositeView = Marionette.CompositeView.extend({
        template: this.templateFn,
        childView: this.ItemView,
        childViewContainer: '#bar'
      });

      this.compositeView = new this.CompositeView({
        collection: this.collection
      });
    });

    it('should throw an error', function() {
      expect(this.compositeView.render).to.throw('The specified "childViewContainer" was not found: #bar');
    });

    describe('and referencing the @ui hash', function() {
      beforeEach(function() {
        this.CompositeView = Marionette.CompositeView.extend({
          template: this.templateFn,
          childView: this.ItemView,
          childViewContainer: '@ui.bar'
        });
      });

      it('should still throw an error', function() {
        expect(this.compositeView.render).to.throw('The specified "childViewContainer" was not found: #bar');
      });
    });
  });

  describe('when rendering a collection in a composite view without a "childViewContainer" specified', function() {
    beforeEach(function() {
      this.CompositeView = Marionette.CompositeView.extend({
        template: this.templateFn,
        childView: this.ItemView,
        collection: this.collection
      });

      this.compositeView = new this.CompositeView();
      this.compositeView.render();
    });

    it('should render the items in to the composite view directly', function() {
      expect(this.compositeView.$el).to.contain.$html('<div id="foo"></div>');
    });
  });

  describe('when a collection is loaded / reset after the view is created and before it is rendered', function() {
    beforeEach(function() {
      this.ItemView = Marionette.ItemView.extend({
        template: this.templateFn
      });

      this.CompositeView = Marionette.CompositeView.extend({
        template: this.templateFn,
        childViewContainer: '#foo',
        childView: this.ItemView,
        collection: this.collection
      });

      this.compositeView = new this.CompositeView();
      this.collection.reset([this.modelOne]);
    });

    it('should not render the items', function() {
      expect(this.compositeView.children).to.have.lengthOf(0);
    });
  });

  describe('when a composite view is not yet rendered', function() {
    beforeEach(function() {
      var suite = this;

      this.CompositeView = Marionette.CompositeView.extend({
        template: this.templateFn,
        childView: this.ItemView,
        childViewContainer: '#foo',
        collection: this.collection
      });

      this.addModel = function() {
        suite.collection.add(suite.modelTwo);
      };

      this.removeModel = function() {
        suite.collection.remove(suite.modelOne);
      };

      this.resetCollection = function() {
        suite.collection.reset([suite.modelOne, suite.modelTwo]);
      };

      this.compositeView = new this.CompositeView();
      this.onCollectionAddSpy = this.sinon.spy(this.compositeView, '_onCollectionAdd');
    });

    it('should not raise any errors when item is added to collection', function() {
      expect(this.addModel).not.to.throw;
    });

    it('should not call _onCollectionAdd when item is added to collection', function() {
      this.addModel();
      expect(this.onCollectionAddSpy).not.to.have.been.called;
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
      this.collection = new Backbone.Collection([{}]);
      this.CompositeView = Marionette.CompositeView.extend({
        template: this.templateFn,
        childView: this.ItemView,
        collection: this.collection
      });

      this.compositeView = new this.CompositeView();
      this.compositeView.childViewContainer = this.sinon.stub().returns('#foo');
      this.compositeView.render();
    });

    it('calls the "childViewContainer" in the context of the composite view', function() {
      expect(this.compositeView.childViewContainer).to.have.been.calledOn(this.compositeView);
    });
  });
});
