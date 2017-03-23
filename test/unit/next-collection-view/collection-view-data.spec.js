// Anything related to Bb.collection events

import _ from 'underscore';
import Backbone from 'backbone';
import CollectionView from '../../../src/next-collection-view';
import View from '../../../src/view';

describe('next CollectionView Data', function() {
  let MyCollectionView;

  beforeEach(function() {
    const MyChildView = View.extend({
      template: _.noop
    });

    MyCollectionView = CollectionView.extend({
      childView: MyChildView
    });
  });

  describe('when the collection sorts', function() {
    let collection;

    beforeEach(function() {
      collection = new Backbone.Collection([{ id: 1 }, { id: 3 }, { id: 2 }], { comparator: 'id' });
    });

    describe('when sortWithCollection is false', function() {
      let myCollectionView;

      beforeEach(function() {
        myCollectionView = new MyCollectionView({
          collection,
          sortWithCollection: false
        });

        myCollectionView.render();

        this.sinon.spy(myCollectionView, 'sort');

        myCollectionView.collection.sort();
      });

      it('should not call the sort method', function() {
        expect(myCollectionView.sort).to.not.have.been.called;
      });
    });

    describe('when sortWithCollection is true', function() {
      let myCollectionView;

      beforeEach(function() {
        // sortWithCollection is true by default
        myCollectionView = new MyCollectionView({ collection });

        myCollectionView.render();

        this.sinon.spy(myCollectionView, 'sort');

        myCollectionView.collection.sort();
      });

      it('should call the sort method', function() {
        expect(myCollectionView.sort).to.have.been.calledOnce;
      });
    });

    describe('when sort is triggered from the collection changing', function() {
      let myCollectionView;

      beforeEach(function() {
        // sortWithCollection is true by default
        myCollectionView = new MyCollectionView({ collection });

        myCollectionView.render();

        this.sinon.spy(myCollectionView, 'sort');

        myCollectionView.collection.add({ id: 5 });
      });

      it('should not call the sort method', function() {
        expect(myCollectionView.sort).to.not.have.been.called;
      });

      describe('when the collection changes but the length does not', function() {
        beforeEach(function() {
          const models = _.take(collection.models, 3);
          models.push(new Backbone.Model({ id: 4 }));
          collection.set(models);
        });

        it('should not call the sort method', function() {
          expect(myCollectionView.sort).to.not.have.been.called;
        });
      });
    });

    describe('when the collection resets', function() {
      let myCollectionView;

      beforeEach(function() {
        myCollectionView = new MyCollectionView({
          collection: new Backbone.Collection()
        });

        myCollectionView.render();

        this.sinon.spy(myCollectionView, 'render');

        myCollectionView.collection.reset([{ id: 1 }]);
      });

      it('should call the render method', function() {
        expect(myCollectionView.render).to.have.been.called;
      });
    });
  });

  describe('when managing models in a collectionView.collection', function() {
    let myCollectionView;
    let collection;
    let attachingModel;
    let detachingModel;

    beforeEach(function() {
      collection = new Backbone.Collection([{ id: 1 }, { id: 2 }, { id: 3 }]);
      attachingModel = new Backbone.Model({ id: 'attaching '});
      detachingModel = collection.at(1);
      myCollectionView = new MyCollectionView({ collection });
    });

    describe('when rendering a collectionView', function() {
      it('should add each of the models as children', function() {
        myCollectionView.render();
        expect(myCollectionView.children.length).to.equal(collection.length);
        myCollectionView.children.each((view, index) => {
          expect(view.model).to.equal(collection.at(index));
        });
      });
    });

    describe('when a collection model changes before a render', function() {
      it('should not trigger any events', function() {
        const collectionViewEventStub = this.sinon.stub();
        myCollectionView.on('all', collectionViewEventStub);
        collection.add(attachingModel);
        collection.remove(detachingModel);

        expect(collectionViewEventStub).to.not.have.been.called;
      });
    });

    describe('when a collection model changes after a render', function() {
      let addChildStub;
      let removeChildStub;
      let renderChildrenStub;
      let removingView;
      let removingViewDestroyStub;

      beforeEach(function() {
        addChildStub = this.sinon.stub();
        removeChildStub = this.sinon.stub();
        renderChildrenStub = this.sinon.stub();
        removingViewDestroyStub = this.sinon.stub();

        myCollectionView.render();

        myCollectionView.on({
          'add:child': addChildStub,
          'remove:child': removeChildStub,
          'render:children': renderChildrenStub
        });

        this.sinon.spy(myCollectionView, 'detachHtml');

        removingView = myCollectionView.children.findByModel(detachingModel);

        removingView.on('destroy', removingViewDestroyStub);

        collection.set([collection.at(0), collection.at(2), attachingModel]);
      });

      it('should remove a child before adding one', function() {
        expect(addChildStub).to.be.calledOnce;
        expect(removeChildStub).to.be.calledOnce;
        expect(addChildStub).to.be.calledAfter(removeChildStub);
      });

      it('should render the children', function() {
        expect(myCollectionView.children.length).to.equal(collection.length);
        myCollectionView.children.each((view, index) => {
          expect(view.model).to.equal(collection.at(index));
        });
      });

      it('should detach the child', function() {
        expect(myCollectionView.detachHtml).to.have.been.calledOnce.and.calledWith(removingView);
      });

      it('should destroy the child', function() {
        expect(removingViewDestroyStub).to.have.been.calledOnce;
      });
    });
  });
});
