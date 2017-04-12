// Anything related to emptyView

import _ from 'underscore';
import Backbone from 'backbone';
import CollectionView from '../../../src/next-collection-view';
import View from '../../../src/view';

describe('NextCollectionView -  Empty', function() {
  let MyEmptyView;
  let MyCollectionView;

  beforeEach(function() {
    const MyChildView = View.extend({
      template: _.noop
    });

    MyEmptyView = View.extend({
      template: _.template('Empty')
    });

    MyCollectionView = CollectionView.extend({
      childView: MyChildView,
      emptyView: MyEmptyView
    });
  });

  describe('when instantiating a CollectionView', function() {
    let myCollectionView;

    beforeEach(function() {
      myCollectionView = new MyCollectionView();
    });

    it('should instantiate the emptyRegion', function() {
      expect(myCollectionView.emptyRegion.el).to.equal(myCollectionView.el);
    });

    describe('when destroying the collectionView', function() {
      it('should destroy the region', function() {
        myCollectionView.destroy();
        expect(myCollectionView.emptyRegion.isDestroyed()).to.be.true;
      });
    });
  });


  describe('when an emptyView is rendered', function() {
    let emptyViewRenderStub;
    let myCollectionView;

    beforeEach(function() {
      const collection = new Backbone.Collection();

      emptyViewRenderStub = this.sinon.stub();

      myCollectionView = new MyCollectionView({
        collection,
        childViewEvents: {
          'render': emptyViewRenderStub
        }
      });

      myCollectionView.render();
    });

    it('should trigger child events on the collectionView', function() {
      expect(emptyViewRenderStub).to.have.been.calledOnce;
    });

    describe('when the collection is no longer empty', function() {
      it('should empty the emptyRegion', function() {
        const emptyRegionEmptyStub = this.sinon.stub();
        myCollectionView.emptyRegion.on('empty', emptyRegionEmptyStub);
        myCollectionView.collection.add({ id: 1 });
        expect(emptyRegionEmptyStub).to.have.been.calledOnce;
      });
    });
  });

  describe('#emptyView', function() {
    const collection = new Backbone.Collection();

    describe('when emptyView is falsey', function() {
      it('should not show an emptyView', function() {
        const myCollectionView = new CollectionView({
          collection,
          emptyView: false
        });

        this.sinon.spy(myCollectionView.emptyRegion, 'show');
        myCollectionView.render();

        expect(myCollectionView.emptyRegion.show).to.not.have.been.called;
      });
    });

    describe('when emptyView is a type of Backbone.View', function() {
      it('should show an emptyView from the defined view', function() {
        const MyView = View.extend({ template: _.noop });
        const myCollectionView = new CollectionView({
          collection,
          emptyView: MyView
        });

        this.sinon.spy(myCollectionView.emptyRegion, 'show');
        myCollectionView.render();

        expect(myCollectionView.emptyRegion.show)
          .to.be.calledOnce
          .and.calledWith(sinon.match.instanceOf(MyView));
      });
    });

    describe('when emptyView is a Backbone.View', function() {
      it('should show an emptyView from the defined view', function() {
        const myCollectionView = new CollectionView({
          collection,
          emptyView: Backbone.View
        });

        this.sinon.spy(myCollectionView.emptyRegion, 'show');
        myCollectionView.render();

        expect(myCollectionView.emptyRegion.show)
          .to.be.calledOnce
          .and.calledWith(sinon.match.instanceOf(Backbone.View));
      });
    });

    describe('when emptyView is a function returning a view', function() {
      it('should show an emptyView from the returned view', function() {
        const emptyViewStub = this.sinon.stub();
        emptyViewStub.returns(Backbone.View);

        const myCollectionView = new CollectionView({
          collection,
          emptyView: emptyViewStub
        });

        this.sinon.spy(myCollectionView.emptyRegion, 'show');
        myCollectionView.render();

        expect(myCollectionView.emptyRegion.show)
          .to.be.calledOnce
          .and.calledWith(sinon.match.instanceOf(Backbone.View));
      });
    });

    describe('when emptyView is not a valid view', function() {
      it('should not show an emptyView', function() {
        const myCollectionView = new CollectionView({
          collection,
          emptyView: 'foo'
        });

        this.sinon.spy(myCollectionView.emptyRegion, 'show');
        myCollectionView.render();

        expect(myCollectionView.emptyRegion.show).to.not.have.been.called;
      });
    });
  });

  describe('#emptyViewOptions', function() {
    describe('when emptyViewOptions is a function', function() {
      const collection = new Backbone.Collection();
      const MyView = View.extend({ template: _.noop });
      const emptyViewOptions = { foo: 'bar' };

      let myCollectionView;
      let emptyViewOptionsStub;

      beforeEach(function() {
        emptyViewOptionsStub = this.sinon.stub();
        emptyViewOptionsStub.returns(emptyViewOptions);

        myCollectionView = new CollectionView({
          collection,
          emptyView: MyView,
          emptyViewOptions: emptyViewOptionsStub
        });

        myCollectionView.render();
      });

      it('should show an emptyView with the emptyViewOptions', function() {
        const emptyView = myCollectionView.emptyRegion.currentView;
        expect(emptyView.options).to.deep.equal(emptyViewOptions);
      });

      it('should call childViewOptions', function() {
        expect(emptyViewOptionsStub).to.have.been.calledOnce;
      });
    });

    describe('when emptyViewOptions is undefined', function() {
      const collection = new Backbone.Collection();
      const MyView = View.extend({ template: _.noop });
      const childViewOptions = { foo: 'bar' };

      let myCollectionView;
      let childViewOptionsStub;

      beforeEach(function() {
        childViewOptionsStub = this.sinon.stub();
        childViewOptionsStub.returns(childViewOptions);

        myCollectionView = new CollectionView({
          collection,
          emptyView: MyView,
          childViewOptions: childViewOptionsStub
        });

        myCollectionView.render();
      });

      it('should show an emptyView with the emptyViewOptions', function() {
        const emptyView = myCollectionView.emptyRegion.currentView;
        expect(emptyView.options).to.deep.equal(childViewOptions);
      });

      it('should call childViewOptions', function() {
        expect(childViewOptionsStub).to.have.been.calledOnce;
      });
    });
  });

  describe('#isEmpty', function() {
    describe('when rendering a collectionView', function() {
      let myCollectionView;

      beforeEach(function() {
        const collection = new Backbone.Collection([{ id: 1 }, { id: 2 }]);
        myCollectionView = new MyCollectionView({ collection });
        this.sinon.spy(myCollectionView, 'isEmpty');
        myCollectionView.render();
      });

      it('should call isEmpty', function() {
        // Once for render and once for filter
        expect(myCollectionView.isEmpty).to.be.calledTwice;
      });

      it('should not show the emptyView', function() {
        expect(myCollectionView.emptyRegion.hasView()).to.be.false;
      });

      describe('when removing one child', function() {
        beforeEach(function() {
          myCollectionView.isEmpty.reset();
          myCollectionView.removeChildView(myCollectionView.children.first());
        });

        it('should call isEmpty', function() {
          expect(myCollectionView.isEmpty).to.be.calledOnce;
        });

        it('should not show the emptyView', function() {
          expect(myCollectionView.emptyRegion.hasView()).to.be.false;
        });
      });

      describe('when removing the only child', function() {
        beforeEach(function() {
          myCollectionView.removeChildView(myCollectionView.children.first());
          myCollectionView.isEmpty.reset();
          myCollectionView.removeChildView(myCollectionView.children.first());
        });

        it('should call isEmpty', function() {
          expect(myCollectionView.isEmpty).to.be.calledOnce;
        });

        it('should show the emptyView', function() {
          expect(myCollectionView.emptyRegion.hasView()).to.be.true;
        });
      });
    });

    describe('when rendering an empty collectionView', function() {
      let myCollectionView;

      beforeEach(function() {
        const collection = new Backbone.Collection();
        myCollectionView = new MyCollectionView({ collection });
        this.sinon.spy(myCollectionView, 'isEmpty');
        myCollectionView.render();
      });

      it('should call isEmpty', function() {
        expect(myCollectionView.isEmpty).to.be.calledOnce;
      });

      it('should show the emptyView', function() {
        expect(myCollectionView.emptyRegion.hasView()).to.be.true;
      });
    });

    describe('when filtering some views from a collectionView', function() {
      let myCollectionView;

      beforeEach(function() {
        const collection = new Backbone.Collection([{ id: 1 }, { id: 2 }]);
        myCollectionView = new MyCollectionView({ collection });
        myCollectionView.render();
        this.sinon.spy(myCollectionView, 'isEmpty');
        myCollectionView.setFilter(view => {
          return view.model.id === 1;
        });
      });

      it('should call isEmpty', function() {
        expect(myCollectionView.isEmpty).to.be.calledOnce.and.calledWith(false);
      });

      it('should not show the emptyView', function() {
        expect(myCollectionView.emptyRegion.hasView()).to.be.false;
      });
    });

    describe('when filtering all views from a collectionView', function() {
      let myCollectionView;

      beforeEach(function() {
        const collection = new Backbone.Collection([{ id: 1 }]);
        myCollectionView = new MyCollectionView({ collection });
        myCollectionView.render();
        this.sinon.spy(myCollectionView, 'isEmpty');
        myCollectionView.setFilter(_.constant(false));
      });

      it('should call isEmpty', function() {
        expect(myCollectionView.isEmpty).to.be.calledOnce.and.calledWith(true);
      });

      it('should show the emptyView', function() {
        expect(myCollectionView.emptyRegion.hasView()).to.be.true;
      });
    });
  });
});
