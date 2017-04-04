// Anything viewComparator related

import _ from 'underscore';
import Backbone from 'backbone';
import CollectionView from '../../../src/next-collection-view';
import View from '../../../src/view';

describe('NextCollectionView - Sorting', function() {
  let collection;
  let MyChildView;
  let MyCollectionView;

  const noSortText = '0,5,2,1,1,4,2,3,5,3,2,1,4,4,3,';
  const sortText = '1,1,4,3,2,1,2,3,5,4,4,3,0,5,2,';
  const altSortText = '3,2,1,0,5,2,4,4,3,1,1,4,2,3,5,';

  beforeEach(function() {
    collection = new Backbone.Collection([
      { index: 0, sort: 5, altSort: 2 },
      { index: 1, sort: 1, altSort: 4 },
      { index: 2, sort: 3, altSort: 5 },
      { index: 3, sort: 2, altSort: 1 },
      { index: 4, sort: 4, altSort: 3 }
    ]);

    MyChildView = View.extend({
      tagName: 'li',
      template: _.template('<%- index %>,<%- sort %>,<%- altSort %>,')
    });

    MyCollectionView = CollectionView.extend({
      tagName: 'ul',
      childView: MyChildView,
      onBeforeSort: this.sinon.stub(),
      onSort: this.sinon.stub(),
      onRenderChildren: this.sinon.stub()
    });
  });

  describe('#viewComparator', function() {
    describe('when the collection is undefined', function() {
      let myCollectionView;

      beforeEach(function() {
        myCollectionView = new MyCollectionView();

        myCollectionView.addChildView(new View({template: _.noop}));
      });

      // The default viewComparator sorts by the view.model's index in the collection
      it('should not throw an error', function() {
        expect(myCollectionView.render.bind(myCollectionView)).to.not.throw();
      });
    });

    describe('when viewComparator is falsy', function() {
      let myCollectionView;

      beforeEach(function() {
        myCollectionView = new MyCollectionView({
          sortWithCollection: false,
          collection
        });

        myCollectionView.render();
      });


      it('should sort the collection by the collection index', function() {
        expect(myCollectionView.$el.text()).to.equal(noSortText);
      });

      it('should call "before:sort" event', function() {
        expect(myCollectionView.onBeforeSort)
          .to.have.been.calledOnce
          .and.calledWith(myCollectionView);
      });

      it('should call "sort" event', function() {
        expect(myCollectionView.onSort)
          .to.have.been.calledOnce
          .and.calledWith(myCollectionView);
      });

      describe('when resorting the collection', function() {
        it('should sort the collectionView by the collection index', function() {
          collection.comparator = 'sort';
          collection.sort();

          myCollectionView.render();

          expect(myCollectionView.$el.text()).to.equal(sortText);
        });
      });
    });

    describe('when viewComparator is defined', function() {
      let myCollectionView;

      beforeEach(function() {
        myCollectionView = new MyCollectionView({
          viewComparator: 'altSort',
          collection
        });

        myCollectionView.render();
      });

      it('should sort the collectionView by the viewComparator', function() {
        expect(myCollectionView.$el.text()).to.equal(altSortText);
      });

      it('should call "before:sort" event', function() {
        expect(myCollectionView.onBeforeSort)
          .to.have.been.calledOnce
          .and.calledWith(myCollectionView);
      });

      it('should call "sort" event', function() {
        expect(myCollectionView.onSort)
          .to.have.been.calledOnce
          .and.calledWith(myCollectionView);
      });
    });

    describe('when viewComparator is a function', function() {
      let myCollectionView;
      let viewComparator;

      beforeEach(function() {
        viewComparator = this.sinon.stub();

        viewComparator.returns('sort');

        myCollectionView = new MyCollectionView({
          viewComparator,
          collection
        });

        myCollectionView.render();
      });

      it('should call it with the context of the collectionView', function() {
        expect(viewComparator).to.be.calledOn(myCollectionView);
      });
    });
  });

  describe('#getComparator', function() {
    let myCollectionView;

    beforeEach(function() {
      MyCollectionView = MyCollectionView.extend({
        getComparator() {
          return 'altSort';
        }
      });

      myCollectionView = new MyCollectionView({
        collection,
        viewComparator: 'sort'
      });

      myCollectionView.render();
    });

    it('should sort by the return of getComparator', function() {

      expect(myCollectionView.$el.text()).to.equal(altSortText);
    });
  });

  describe('#sort', function() {
    it('should sort the collectionView', function() {
      const myCollectionView = new MyCollectionView({
        collection
      });
      myCollectionView.render();
      myCollectionView.onSort.reset();
      myCollectionView.sort();

      expect(myCollectionView.onSort).to.have.been.calledOnce;
    });

    it('should return the collectionView instance', function() {
      const myCollectionView = new CollectionView();
      this.sinon.spy(myCollectionView, 'sort');

      myCollectionView.sort();

      expect(myCollectionView.sort).to.have.returned(myCollectionView);
    });

    describe('when the view is destroyed', function() {
      let myCollectionView;

      beforeEach(function() {
        myCollectionView = new MyCollectionView({
          collection
        });

        this.sinon.spy(myCollectionView, 'sort');

        myCollectionView.destroy();

        myCollectionView.sort();
      });

      it('should not sort the children', function() {
        expect(myCollectionView.onBeforeSort).to.not.have.been.called;
      });

      it('should not render the children', function() {
        expect(myCollectionView.onRenderChildren).to.not.have.been.called;
      });

      it('should return the collectionView', function() {
        expect(myCollectionView.sort).to.have.returned(myCollectionView);
      });
    });

    describe('when the view collection is empty', function() {
      let myCollectionView;

      beforeEach(function() {
        myCollectionView = new MyCollectionView();

        this.sinon.spy(myCollectionView, 'sort');

        myCollectionView.sort();
      });

      it('should not sort the children', function() {
        expect(myCollectionView.onBeforeSort).to.not.have.been.called;
      });

      it('should not render the children', function() {
        expect(myCollectionView.onRenderChildren).to.not.have.been.called;
      });

      it('should return the collectionView', function() {
        expect(myCollectionView.sort).to.have.returned(myCollectionView);
      });
    });
  });

  describe('#setComparator', function() {
    it('should return the collectionView instance', function() {
      const myCollectionView = new CollectionView();
      this.sinon.spy(myCollectionView, 'setComparator');

      myCollectionView.setComparator();

      expect(myCollectionView.setComparator).to.have.returned(myCollectionView);
    });

    describe('when setting with a new viewComparator', function() {
      let myCollectionView;

      beforeEach(function() {
        myCollectionView = new MyCollectionView({
          viewComparator: 'sort'
        });

        this.sinon.spy(myCollectionView, 'sort');
        myCollectionView.setComparator('altSort');
      });

      it('should set the viewComparator', function() {
        expect(myCollectionView.viewComparator).to.equal('altSort');
      });

      it('should sort the collectionView', function() {
        expect(myCollectionView.sort).to.be.calledOnce;
      });

      describe('when setting with the same viewComparator', function() {
        it('should not sort the collectionView', function() {
          myCollectionView.sort.reset();
          myCollectionView.setComparator('altSort');
          expect(myCollectionView.sort).to.not.be.called;
        });
      });
    });

    describe('when setting with preventRender option', function() {
      let myCollectionView;

      beforeEach(function() {
        myCollectionView = new MyCollectionView({
          viewComparator: 'sort'
        });

        this.sinon.spy(myCollectionView, 'sort');
        myCollectionView.setComparator('altSort', { preventRender: true });
      });

      it('should set the viewComparator', function() {
        expect(myCollectionView.viewComparator).to.equal('altSort');
      });

      it('should not sort the collectionView', function() {

        expect(myCollectionView.sort).to.not.be.called;
      });
    });
  });

  describe('#removeComparator', function() {
    let myCollectionView;

    beforeEach(function() {
      myCollectionView = new CollectionView();
      this.sinon.spy(myCollectionView, 'setComparator');
      this.sinon.spy(myCollectionView, 'removeComparator');

      myCollectionView.removeComparator('foo');
    });

    it('should call setComparator', function() {
      expect(myCollectionView.setComparator)
        .to.be.calledOnce
        .and.to.be.calledWith(null, 'foo');
    });

    it('should return the collectionView instance', function() {
      expect(myCollectionView.removeComparator).to.have.returned(myCollectionView);
    });
  });

  describe('#isEmpty', function() {
    describe('when isEmpty is true', function() {
      it('should not sort', function() {
        const EmptyCollectionView = MyCollectionView.extend({
          isEmpty: _.constant(true)
        });

        const myCollectionView = new EmptyCollectionView({
          collection
        });

        myCollectionView.render();

        expect(myCollectionView.onSort).to.not.have.been.called;
      });
    });

    describe('when isEmpty is false', function() {
      it('should not sort', function() {
        const NotEmptyCollectionView = MyCollectionView.extend({
          isEmpty: _.constant(false)
        });

        const myCollectionView = new NotEmptyCollectionView({
          collection
        });

        myCollectionView.render();

        expect(myCollectionView.onSort).to.have.been.calledOnce;
      });
    });

  });
});
