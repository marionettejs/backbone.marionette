// Anything viewComparator related

import _ from 'underscore';
import Backbone from 'backbone';
import CollectionView from '../../../src/collection-view';
import View from '../../../src/view';

describe('CollectionView - Sorting', function() {
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

    describe('when viewComparator is false', function() {
      let myCollectionView;

      beforeEach(function() {
        myCollectionView = new MyCollectionView({
          viewComparator: false,
          collection
        });

        myCollectionView.render();
      });


      it('should not sort the collection', function() {
        expect(myCollectionView.$el.text()).to.equal(noSortText);
      });

      it('should not call "before:sort" event', function() {
        expect(myCollectionView.onBeforeSort).to.not.be.called;
      });

      it('should not call "sort" event', function() {
        expect(myCollectionView.onSort).to.not.be.called;
      });

      describe('when resorting the collection', function() {
        beforeEach(function() {
          this.sinon.spy(myCollectionView, 'sort');
          collection.comparator = 'sort';
          collection.sort();
        });

        it('should not call sort', function() {
          expect(myCollectionView.sort).to.not.be.called;
        });

        it('should not resort the children on sort', function() {
          myCollectionView.sort();

          expect(myCollectionView.$el.text()).to.equal(noSortText);
        });
      });
    });

    describe('when viewComparator is falsy but not false', function() {
      let myCollectionView;

      describe('when sortWithCollection is true', function() {
        beforeEach(function() {
          myCollectionView = new MyCollectionView({ collection });

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

      describe('when sortWithCollection is false', function() {
        beforeEach(function() {
          myCollectionView = new MyCollectionView({
            sortWithCollection: false,
            collection
          });

          myCollectionView.render();
        });

        it('should not call "before:sort" event', function() {
          expect(myCollectionView.onBeforeSort).to.not.be.called;
        });

        it('should not call "sort" event', function() {
          expect(myCollectionView.onSort).to.not.be.called;
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
          viewComparator: function(val) {
            return viewComparator.call(this, val);
          },
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

      it('should render no children', function() {
        expect(myCollectionView.onRenderChildren)
          .to.have.been.calledOnce
          .and.calledWith(myCollectionView, []);
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
          myCollectionView.sort.resetHistory();
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

  describe('reorder in place', function() {
    let myCollectionView;

    function renderCollectionView(options = {}) {
      myCollectionView = new MyCollectionView(_.extend({
        collection
      }, options));

      myCollectionView.render();
      return myCollectionView;
    }

    function sortCollection(sortKey = 'sort') {
      collection.comparator = sortKey;
      collection.sort();
    }

    it('should move children in place when only the order changes', function() {
      renderCollectionView();

      this.sinon.spy(myCollectionView.Dom, 'insertContents');
      this.sinon.spy(myCollectionView.Dom, 'appendContents');
      this.sinon.spy(myCollectionView.Dom, 'detachEl');
      this.sinon.spy(myCollectionView.Dom, 'detachContents');
      this.sinon.spy(myCollectionView.Dom, 'replaceEl');
      this.sinon.spy(myCollectionView.Dom, 'setContents');
      this.sinon.spy(myCollectionView.Dom, 'swapEl');
      this.sinon.spy(myCollectionView, 'attachHtml');

      sortCollection();

      expect(myCollectionView.Dom.insertContents).to.have.been.called;
      expect(myCollectionView.attachHtml).to.not.have.been.called;
      expect(myCollectionView.Dom.appendContents).to.not.have.been.called;
      expect(myCollectionView.Dom.detachEl).to.not.have.been.called;
      expect(myCollectionView.Dom.detachContents).to.not.have.been.called;
      expect(myCollectionView.Dom.replaceEl).to.not.have.been.called;
      expect(myCollectionView.Dom.setContents).to.not.have.been.called;
      expect(myCollectionView.Dom.swapEl).to.not.have.been.called;
      expect(myCollectionView.$el.text()).to.equal(sortText);
    });

    it('should use the buffer path when filtering changes membership', function() {
      renderCollectionView({
        viewFilter(view) {
          return view.model.get('visible') !== false;
        }
      });

      this.sinon.spy(myCollectionView.Dom, 'insertContents');
      this.sinon.spy(myCollectionView, 'attachHtml');

      collection.at(0).set('visible', false);
      sortCollection();

      expect(myCollectionView.attachHtml).to.have.been.calledOnce;
      expect(myCollectionView.Dom.insertContents).to.not.have.been.called;
    });

    it('should use the buffer path when sorting after adding a child', function() {
      collection.comparator = 'sort';
      renderCollectionView();

      this.sinon.spy(myCollectionView.Dom, 'insertContents');
      this.sinon.spy(myCollectionView, 'attachHtml');

      collection.add({ index: 5, sort: 0, altSort: 6 }, { sort: true });

      expect(myCollectionView.attachHtml).to.have.been.calledOnce;
      expect(myCollectionView.Dom.insertContents).to.not.have.been.called;
    });

    it('should preserve focused child elements when sorting', function() {
      const InputView = View.extend({
        tagName: 'li',
        template: _.template('<input value="<%- index %>">')
      });

      const InputCollectionView = CollectionView.extend({
        tagName: 'ul',
        childView: InputView
      });

      myCollectionView = new InputCollectionView({ collection });
      myCollectionView.render();
      this.setFixtures(myCollectionView.el);

      const focusedInput = myCollectionView.children.findByIndex(0).$('input')[0];
      focusedInput.focus();

      sortCollection();

      expect(document.activeElement).to.equal(focusedInput);
    });

    it('should preserve child scroll state when sorting', function() {
      const ScrollingView = View.extend({
        tagName: 'li',
        template: _.template('<div class="scrolling" style="height: 10px; overflow: auto;"><div style="height: 100px;"></div></div>')
      });

      const ScrollingCollectionView = CollectionView.extend({
        tagName: 'ul',
        childView: ScrollingView
      });

      myCollectionView = new ScrollingCollectionView({ collection });
      myCollectionView.render();

      const scrollingEl = myCollectionView.children.findByIndex(0).$('.scrolling')[0];
      scrollingEl.scrollTop = 20;

      sortCollection();

      expect(scrollingEl.scrollTop).to.equal(20);
    });

    it('should preserve child element identity when sorting', function() {
      renderCollectionView();

      const childView = myCollectionView.children.findByIndex(0);
      const childEl = childView.el;

      sortCollection();

      expect(childView.el).to.equal(childEl);
    });

    it('should not reconnect custom elements when sorting', function() {
      if (!window.customElements) {
        this.skip();
      }

      const tagName = `mn-reorder-${ _.uniqueId() }`;
      const lifecycle = {
        connected: 0,
        disconnected: 0
      };

      class ReorderElement extends HTMLElement {
        connectedCallback() {
          lifecycle.connected++;
        }

        disconnectedCallback() {
          lifecycle.disconnected++;
        }
      }

      window.customElements.define(tagName, ReorderElement);

      const CustomElementView = View.extend({
        tagName,
        template: false
      });

      const CustomElementCollectionView = CollectionView.extend({
        childView: CustomElementView
      });

      myCollectionView = new CustomElementCollectionView({ collection });
      myCollectionView.render();
      this.setFixtures(myCollectionView.el);

      expect(lifecycle.connected).to.equal(collection.length);
      expect(lifecycle.disconnected).to.equal(0);

      sortCollection();

      expect(lifecycle.connected).to.equal(collection.length);
      expect(lifecycle.disconnected).to.equal(0);
    });

    it('should use the configured Dom.insertContents override', function() {
      const insertContents = this.sinon.spy(function(parent, child, beforeNode) {
        parent.insertBefore(child, beforeNode || null);
      });
      const CustomDomCollectionView = MyCollectionView.extend();
      CustomDomCollectionView.setDomApi({ insertContents });

      myCollectionView = new CustomDomCollectionView({ collection });
      myCollectionView.render();

      sortCollection();

      expect(insertContents).to.have.been.called;
      expect(myCollectionView.$el.text()).to.equal(sortText);
    });
  });
});
