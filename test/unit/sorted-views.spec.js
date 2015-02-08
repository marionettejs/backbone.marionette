describe('collection/composite view sorting', function() {
  'use strict';

  beforeEach(function() {
    this.ChildView = Marionette.ItemView.extend({
      template: _.template('<%= foo %>')
    });

    this.CollectionView = Marionette.CollectionView.extend({
      childView: this.ChildView
    });

    this.CompositeView = Marionette.CompositeView.extend({
      childView: this.ChildView,
      template: this.sinon.stub()
    });

    this.collection = new Backbone.Collection([{foo: 1, bar: 4}, {foo: 2, bar: 3}, {foo: 3, bar: 2}]);
  });

  describe('when working with collections with comparators', function() {
    beforeEach(function() {
      this.collection.comparator = 'foo';

      this.collectionView = new this.CollectionView({
        childView: this.ChildView,
        collection: this.collection
      });

      this.compositeView = new this.CompositeView({
        childView: this.ChildView,
        collection: this.collection,
      });

      this.sinon.spy(this.collectionView, 'resortView');
      this.sinon.spy(this.compositeView, 'resortView');

      this.collectionView.render();
      this.compositeView.render();
    });

    describe('when adding a model', function() {
      beforeEach(function() {
        this.model = new Backbone.Model({foo: 4, bar: 1});
        this.collection.add(this.model);
      });

      it('should add the model to the list', function() {
        expect(this.collectionView.children).to.have.lengthOf(4);
      });

      it('should have the order in the dom', function() {
        expect(this.collectionView.$el).to.have.$text('1234');
        expect(this.compositeView.$el).to.have.$text('1234');
      });
    });

    describe('when adding a model with the "at" option', function() {
      beforeEach(function() {
        this.model = new Backbone.Model({foo: 0, bar: 1});
        this.collection.add(this.model, {at: 5});
      });

      it('should add the model to the list', function() {
        expect(this.collectionView.children).to.have.lengthOf(4);
      });

      it('should ignore the sorted order in the dom', function() {
        expect(this.collectionView.$el).to.have.$text('1230');
        expect(this.compositeView.$el).to.have.$text('1230');
      });

      describe('and adding another', function() {
        beforeEach(function() {
          this.model = new Backbone.Model({foo: 5, bar: 0});
          this.collection.add(this.model);
        });

        it('should render the sorted order in the dom', function() {
          expect(this.collectionView.$el).to.have.$text('01235');
          expect(this.compositeView.$el).to.have.$text('01235');
        });
      });
    });

    describe('when silently adding a model', function() {
      beforeEach(function() {
        this.model = new Backbone.Model({foo: 4, bar: 1});
        this.collection.add(this.model, {silent: true});
      });

      it('should not add the model to the list', function() {
        expect(this.collectionView.children).to.have.lengthOf(3);
      });

      it('should have the order in the dom', function() {
        expect(this.collectionView.$el).to.have.$text('123');
        expect(this.compositeView.$el).to.have.$text('123');
      });

      describe('and then adding another', function () {
        beforeEach(function() {
          this.model = new Backbone.Model({foo: 5, bar: 0});
          this.collection.add(this.model);
        });

        it('should add both models to the list', function() {
          expect(this.collectionView.children).to.have.lengthOf(5);
        });

        it('should have the order in the dom', function() {
          expect(this.collectionView.$el).to.have.$text('12345');
          expect(this.compositeView.$el).to.have.$text('12345');
        });

        it('should call resortViews', function() {
          expect(this.collectionView.resortView).to.have.been.calledOnce;
          expect(this.compositeView.resortView).to.have.been.calledOnce;
        });
      });
    });

    describe('when removing a model', function() {
      beforeEach(function() {
        this.model = this.collection.at(1);
        this.collection.remove(this.model);
      });

      it('should have the order in the dom', function() {
        expect(this.collectionView.$el).to.have.$text('13');
        expect(this.compositeView.$el).to.have.$text('13');
      });

      describe('and then adding another', function() {
        beforeEach(function() {
          this.model = new Backbone.Model({foo: '4'});
          this.sinon.spy(this.collectionView, 'render');
          this.collection.add(this.model);
        });

        it('should have the order in the dom', function() {
          expect(this.collectionView.$el).to.have.$text('134');
          expect(this.compositeView.$el).to.have.$text('134');
        });

        it('should not call render', function() {
          expect(this.collectionView.render.callCount).to.equal(0);
        });
      });
    });

    describe('when changing the comparator', function() {
      beforeEach(function() {
        this.collection.comparator = 'bar';
      });

      describe('and triggering a sort', function() {
        beforeEach(function() {
          this.collection.sort();
        });

        it('should have the order in the dom', function() {
          expect(this.collectionView.$el).to.have.$text('321');
          expect(this.compositeView.$el).to.have.$text('321');
        });

        it('should call resortViews', function() {
          expect(this.collectionView.resortView).to.have.been.calledOnce;
          expect(this.compositeView.resortView).to.have.been.calledOnce;
        });
      });

      describe('and adding a new child', function() {
        beforeEach(function() {
          this.model = new Backbone.Model({foo: '4', bar: '4'});
          this.collection.add(this.model);
        });

        it('should have the order in the dom', function() {
          expect(this.collectionView.$el).to.have.$text('3214');
          expect(this.compositeView.$el).to.have.$text('3214');
        });
      });
    });
  });

  describe('when working with collections with a custom view comparator', function() {
    beforeEach(function() {
      this.collection.comparator = 'foo';

      this.collectionView = new this.CollectionView({
        childView: this.ChildView,
        collection: this.collection,
        viewComparator: 'bar'
      });

      this.compositeView = new this.CompositeView({
        childView: this.ChildView,
        collection: this.collection,
        viewComparator: function(model) { return model.get('bar'); }
      });

      this.sinon.spy(this.collectionView, 'resortView');
      this.sinon.spy(this.compositeView, 'resortView');

      this.collectionView.render();
      this.compositeView.render();
    });

    describe('when adding a model', function() {
      beforeEach(function() {
        this.model = new Backbone.Model({foo: 4, bar: 1});
        this.collection.add(this.model);
      });

      it('should add the model to the list', function() {
        expect(this.collectionView.children).to.have.lengthOf(4);
      });

      it('should have the order in the dom', function() {
        expect(this.collectionView.$el).to.have.$text('4321');
        expect(this.compositeView.$el).to.have.$text('4321');
      });
    });

    describe('when silently adding a model', function() {
      beforeEach(function() {
        this.model = new Backbone.Model({foo: 4, bar: 1});
        this.collection.add(this.model, {silent: true});
      });

      it('should not add the model to the list', function() {
        expect(this.collectionView.children).to.have.lengthOf(3);
      });

      it('should have the order in the dom', function() {
        expect(this.collectionView.$el).to.have.$text('321');
        expect(this.compositeView.$el).to.have.$text('321');
      });

      describe('and then adding another', function () {
        beforeEach(function() {
          this.model = new Backbone.Model({foo: 5, bar: 0});
          this.collection.add(this.model);
        });

        it('should add both models to the list', function() {
          expect(this.collectionView.children).to.have.lengthOf(5);
        });

        it('should have the order in the dom', function() {
          expect(this.collectionView.$el).to.have.$text('54321');
          expect(this.compositeView.$el).to.have.$text('54321');
        });

        it('should call resortViews', function() {
          expect(this.collectionView.resortView).to.have.been.calledOnce;
          expect(this.compositeView.resortView).to.have.been.calledOnce;
        });
      });
    });

    describe('when removing a model', function() {
      beforeEach(function() {
        this.model = this.collection.at(1);
        this.collection.remove(this.model);
      });

      it('should have the order in the dom', function() {
        expect(this.collectionView.$el).to.have.$text('31');
        expect(this.compositeView.$el).to.have.$text('31');
      });

      describe('and then adding another', function() {
        beforeEach(function() {
          this.model = new Backbone.Model({foo: '4', bar: '1'});
          this.sinon.spy(this.collectionView, 'render');
          this.collection.add(this.model);
        });

        it('should have the order in the dom', function() {
          expect(this.collectionView.$el).to.have.$text('431');
          expect(this.compositeView.$el).to.have.$text('431');
        });

        it('should not call render', function() {
          expect(this.collectionView.render.callCount).to.equal(0);
        });
      });
    });

    describe('when adding a model with the "at" option', function() {
      beforeEach(function() {
        this.model = new Backbone.Model({foo: 6, bar: -1});
        this.collection.add(this.model, {at: 5});
      });

      it('should add the model to the list', function() {
        expect(this.collectionView.children).to.have.lengthOf(4);
      });

      it('should ignore the sorted order in the dom', function() {
        expect(this.collectionView.$el).to.have.$text('3216');
        expect(this.compositeView.$el).to.have.$text('3216');
      });

      describe('and adding another', function() {
        beforeEach(function() {
          this.model = new Backbone.Model({foo: 5, bar: 0});
          this.collection.add(this.model);
        });

        it('should render the sorted order in the dom', function() {
          expect(this.collectionView.$el).to.have.$text('65321');
          expect(this.compositeView.$el).to.have.$text('65321');
        });
      });
    });

    describe('when changing the comparator', function() {
      beforeEach(function() {
        this.collectionView.options.viewComparator = function(a, b) {
          if (a.get('foo') < b.get('foo')) { return -1; }
          if (a.get('foo') > b.get('foo')) { return 1; }
          return 0;
        };
        this.compositeView.options.viewComparator = 'foo';
      });

      describe('and triggering a sort', function() {
        beforeEach(function() {
          this.collection.sort();
        });

        it('should have the order in the dom', function() {
          expect(this.collectionView.$el).to.have.$text('123');
          expect(this.compositeView.$el).to.have.$text('123');
        });

        it('should call resortViews', function() {
          expect(this.collectionView.resortView).to.have.been.calledOnce;
          expect(this.compositeView.resortView).to.have.been.calledOnce;
        });
      });

      describe('and adding a new child', function() {
        beforeEach(function() {
          this.model = new Backbone.Model({foo: '4', bar: '1'});
          this.collection.add(this.model);
        });

        it('should have the order in the dom', function() {
          expect(this.collectionView.$el).to.have.$text('1234');
          expect(this.compositeView.$el).to.have.$text('1234');
        });
      });
    });
  });

  describe('when using `{sort: false}`', function() {
    beforeEach(function() {
      this.collectionView = new this.CollectionView({
        childView: this.ChildView,
        collection: this.collection,
        sort: false
      });

      this.compositeView = new this.CompositeView({
        childView: this.ChildView,
        collection: this.collection,
        sort: false
      });

      this.collectionView.render();
      this.compositeView.render();
    });

    describe('and adding a model', function() {
      beforeEach(function() {
        this.model = new Backbone.Model({foo: '0', bar: '5'});
        this.collection.add(this.model);
      });

      it('should add the model to the list', function() {
        expect(this.collectionView.children).to.have.lengthOf(4);
      });

      it('should have the order in the dom', function() {
        expect(this.collectionView.$el).to.have.$text('1230');
        expect(this.compositeView.$el).to.have.$text('1230');
      });
    });
  });

  describe('when using `{ reorderOnSort: true }`', function () {
    var texts = {
      asOption: 'as an option',
      onPrototype: 'on the prototype',
      viewComparator: 'with viewComparator'
    };

    var getSpecTitle = function(options) {
      return _.map(options, function (v, k) {
        return texts[k];
      }).join(' ');
    };

    var describeSpec = function (specOptions) {
      describe(getSpecTitle(specOptions), function () {
        beforeEach(function () {
          var commonAttrs = {
            childView: this.ChildView,
            collection: this.collection
          };

          if (specOptions.viewComparator) {
            commonAttrs.viewComparator = 'foo';
          }

          if (specOptions.asOption) {
            this.collectionView = new this.CollectionView(_.extend({}, {
              reorderOnSort: true
            }, commonAttrs));
          } else if (specOptions.onPrototype) {
            var ReorderedCollectionView = this.CollectionView.extend({
              reorderOnSort: true,
              onReorder: this.sinon.spy(),
              onBeforeReorder: this.sinon.spy()
            });
            this.collectionView = new ReorderedCollectionView(commonAttrs);
          }

          this.collectionView.render();
          this.sinon.spy(this.collectionView, 'reorder');
          this.sinon.spy(this.collectionView, 'render');
          this.sinon.spy(this.collectionView, 'trigger');

          var cmp = function (m) {
            return m.get('bar');
          };
          if (specOptions.viewComparator) {
            this.collection.comparator = 'foo';
            this.collectionView.options.viewComparator = cmp;
          } else {
            this.collection.comparator = cmp;
          }
          this.collection.sort();
        });

        it('should call reorder instead of render', function () {
          expect(this.collectionView.render).not.to.have.been.called;
          expect(this.collectionView.reorder).to.have.been.calledOnce;
        });

        it('should reorder the DOM', function () {
          expect(this.collectionView.$el).to.have.$text('321');
        });

        it('should triggerMethods events', function () {
          var cv = this.collectionView;
          if (specOptions.onPrototype) {
            expect(cv.onBeforeReorder).calledBefore(cv.onReorder);
          }
          expect(cv.trigger).to.have.been.calledWith('before:reorder');
          expect(cv.trigger).to.have.been.calledWith('reorder');
          expect(cv.trigger).to.have.been.calledTwice;
        });
      });
    };

    describeSpec({ asOption: true });
    describeSpec({ asOption: true, viewComparator: true });
    describeSpec({ onPrototype: true });
    describeSpec({ onPrototype: true, viewComparator: true });
  });
});
