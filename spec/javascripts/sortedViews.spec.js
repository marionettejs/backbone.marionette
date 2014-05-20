describe('collection/composite view sorting', function(){
  'use strict';

  beforeEach(global.setup);
  afterEach(global.teardown);

  // Shared View Definitions
  // -----------------------

  function getCollectionChildren(el) {
    return el.children().map(function(i, v){return v.innerHTML; }).get().join();
  }

  var ChildView = Backbone.Marionette.ItemView.extend({
    tagName: 'span',
    render: function(){
      this.$el.html(this.model.get('foo'));
      this.trigger('render');
    }
  });

  var CollectionView = Backbone.Marionette.CollectionView.extend({
    childView: ChildView
  });

  var CompositeView = Backbone.Marionette.CompositeView.extend({
    childView: ChildView,
    template: '#composite-template-no-model'
  });

  describe('when working with collections with comparators', function(){
    var collectionView, compositeView, collection, model;

    beforeEach(function(){
      this.loadFixtures('compositeTemplate-noModel.html');

      collection = new Backbone.Collection([{foo: 'abar', foo2: 'wbar'}, {foo: 'bbar', foo2: 'abar'}, {foo: 'wbar', foo2: 'bbar'}]);
      collection.comparator = 'foo';

      collectionView = new CollectionView({
        childView: ChildView,
        collection: collection
      });
      collectionView.render();

      compositeView = new CompositeView({
        childView: ChildView,
        collection: collection,
      });
      compositeView.render();
    });

    describe('when adding a model', function(){
      beforeEach(function(){
        model = new Backbone.Model({foo: 'fbar', foo2: 'sbar'});
        collection.add(model);
      });

      it('should add the model to the list', function(){
        expect(_.size(collectionView.children)).to.equal(4);
      });

      it('should have the order in the dom', function(){
        expect(getCollectionChildren(collectionView.$el)).to.equal('abar,bbar,fbar,wbar');
        expect(getCollectionChildren(compositeView.$el)).to.equal('abar,bbar,fbar,wbar');
      });
    });

    describe('when adding a model with the \'at\' option', function(){
      beforeEach(function(){
        model = new Backbone.Model({foo: 'fbar', foo2: 'sbar'});
        collection.add(model, {at: 5});
      });

      it('should add the model to the list', function(){
        expect(_.size(collectionView.children)).to.equal(4);
      });

      it('should ignore the sorted order in the dom', function(){
        expect(getCollectionChildren(collectionView.$el)).to.equal('abar,bbar,wbar,fbar');
        expect(getCollectionChildren(compositeView.$el)).to.equal('abar,bbar,wbar,fbar');
      });

      describe('and adding another', function(){
        beforeEach(function(){
          model = new Backbone.Model({foo: 'dbar', foo2: 'sbar'});
          collection.add(model);
        });

        it('should render the sorted order in the dom', function(){
          expect(getCollectionChildren(collectionView.$el)).to.equal('abar,bbar,dbar,fbar,wbar');
          expect(getCollectionChildren(compositeView.$el)).to.equal('abar,bbar,dbar,fbar,wbar');
        });
      });
    });

    describe('when silently adding a model', function(){
      beforeEach(function(){
        model = new Backbone.Model({foo: 'fbar', foo2: 'sbar'});
        collection.add(model, {silent: true});
      });

      it('shouldn\'t add the model to the list', function(){
        expect(_.size(collectionView.children)).to.equal(3);
      });

      it('should have the order in the dom', function(){
        expect(getCollectionChildren(collectionView.$el)).to.equal('abar,bbar,wbar');
        expect(getCollectionChildren(compositeView.$el)).to.equal('abar,bbar,wbar');
      });

      describe('and then adding another', function () {
        beforeEach(function(){
          model = new Backbone.Model({foo: 'dbar', foo2: 'qbar'});
          collection.add(model);
        });

        it('should add both models to the list', function(){
          expect(_.size(collectionView.children)).to.equal(5);
        });

        it('should have the order in the dom', function(){
          expect(getCollectionChildren(collectionView.$el)).to.equal('abar,bbar,dbar,fbar,wbar');
          expect(getCollectionChildren(compositeView.$el)).to.equal('abar,bbar,dbar,fbar,wbar');
        });
      });
    });

    describe('when removing a model', function(){
      beforeEach(function(){
        model = collection.at(1);
        collection.remove(model);
      });

      it('should have the order in the dom', function(){
        expect(getCollectionChildren(collectionView.$el)).to.equal('abar,wbar');
        expect(getCollectionChildren(compositeView.$el)).to.equal('abar,wbar');
      });

      describe('and then adding another', function(){
        beforeEach(function(){
          model = new Backbone.Model({foo: 'bbar'});
          sinon.spy(collectionView, 'render');
          collection.add(model);
        });

        afterEach(function() {
          collectionView.render.restore();
        });

        it('should have the order in the dom', function(){
          expect(getCollectionChildren(collectionView.$el)).to.equal('abar,bbar,wbar');
          expect(getCollectionChildren(compositeView.$el)).to.equal('abar,bbar,wbar');
        });

        it('should not call render', function(){
           expect(collectionView.render.callCount).to.equal(0);
        });

      });

    });

    describe('when changing the comparator', function(){
      beforeEach(function(){
        collection.comparator = 'foo2';
      });

      describe('and triggering a sort', function(){
        beforeEach(function(){
          collection.sort();
        });

        it('should have the order in the dom', function(){
          expect(getCollectionChildren(collectionView.$el)).to.equal('bbar,wbar,abar');
          expect(getCollectionChildren(compositeView.$el)).to.equal('bbar,wbar,abar');
        });
      });

      describe('and adding a new child', function(){
        beforeEach(function(){
          model = new Backbone.Model({foo: 'fbar', foo2: 'sbar'});
          collection.add(model);
        });

        it('should have the order in the dom', function(){
          expect(getCollectionChildren(collectionView.$el)).to.equal('bbar,wbar,fbar,abar');
          expect(getCollectionChildren(compositeView.$el)).to.equal('bbar,wbar,fbar,abar');
        });
      });
    });

    describe('when using \'{sort: false}\'', function(){
      beforeEach(function(){
        collection = new Backbone.Collection([{foo: 'abar', foo2: 'wbar'}, {foo: 'bbar', foo2: 'abar'}, {foo: 'wbar', foo2: 'bbar'}]);
        collection.comparator = 'foo';

        collectionView = new CollectionView({
          childView: ChildView,
          collection: collection,
          sort: false
        });
        collectionView.render();

        compositeView = new CompositeView({
          childView: ChildView,
          collection: collection,
          sort: false
        });
        compositeView.render();

        model = new Backbone.Model({foo: 'fbar', foo2: 'sbar'});
        collection.add(model);
      });

      describe('and adding a model', function(){
        it('should add the model to the list', function(){
          expect(_.size(collectionView.children)).to.equal(4);
        });

        it('should have the order in the dom', function(){
          expect(getCollectionChildren(collectionView.$el)).to.equal('abar,bbar,wbar,fbar');
          expect(getCollectionChildren(compositeView.$el)).to.equal('abar,bbar,wbar,fbar');
        });
      });
    });

    afterEach(function(){
      // reset comparator
      collection.comparator = undefined;
    });
  });
});
