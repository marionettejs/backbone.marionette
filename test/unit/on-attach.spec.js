describe('onAttach', function() {
  const expectTriggerMethod = (method, target, retval, before = null) => {
    expect(method)
      .to.have.been.calledOnce
      .and.to.have.been.calledOn(target)
      .and.to.have.been.calledWithExactly(target)
      .and.to.have.returned(retval);
    if (before) {
      expect(method).to.have.been.calledBefore(before);
    }
  };

  const extendAttachMethods = superConstructor => target => _.assign(target, {
    constructor(options) {
      superConstructor.call(this, options);
      sinon.spy(this, 'onAttach');
      sinon.spy(this, 'onBeforeAttach');
      sinon.spy(this, 'onDetach');
      sinon.spy(this, 'onBeforeDetach');
      sinon.spy(this, 'onDestroy');
    },
    onAttach() {
      return !!this._isAttached;
    },
    onBeforeAttach() {
      return !!this._isAttached;
    },
    onDetach() {
      return !!this._isAttached;
    },
    onBeforeDetach() {
      return !!this._isAttached;
    },
    onDestroy() {
      return !!this._isAttached;
    }
  });

  let sinon;
  let View;
  let EmptyView;
  let ChildView;
  let CollectionView;
  let regionEl;
  let region;  // A Region to show our View within

  beforeEach(function() {
    sinon = this.sinon;
    View = Marionette.View.extend(extendAttachMethods(Marionette.View)({
      template: _.template('<header></header><main></main><footer></footer>'),
      regions: {
        header: 'header',
        main: 'main',
        footer: 'footer'
      }
    }));
    EmptyView = Backbone.View.extend(extendAttachMethods(Backbone.View)({
      template: _.noop
    }));
    ChildView = Backbone.View.extend(extendAttachMethods(Backbone.View)({
      template: _.noop
    }));
    CollectionView = Marionette.CollectionView.extend({
      childView: ChildView,
      emptyView: EmptyView
    });
    // A Region to show our View within
    this.setFixtures('<div id="region"></div>');
    regionEl = document.getElementById('region');
    region = new Marionette.Region({el: regionEl});
  });

  describe('when showing a view into a region not attached to the document', function() {
    let detachedRegion;
    let view;

    beforeEach(function() {
      view = new ChildView();
      detachedRegion = new Marionette.Region({el: document.createElement('div')});
      detachedRegion.show(view);
    });

    it('should not call onAttach/onBeforeAttach methods on the view', function() {
      expect(view.onAttach).to.not.have.been.called;
      expect(view.onBeforeAttach).to.not.have.been.called;
    });

    describe('when removing a view from a region not attached to the document', function() {
      beforeEach(function() {
        detachedRegion.empty();
      });

      it('should not call onDetach/onBeforeDetach methods on the view', function() {
        expect(view.onDetach).to.not.have.been.called;
        expect(view.onBeforeDetach).to.not.have.been.called;
      });
    });
  });

  describe('when showing a view into a region attached to the document', function() {
    let view;

    beforeEach(function() {
      view = new ChildView();
      region.show(view);
    });

    it('should call onBeforeAttach on the view', function() {
      expectTriggerMethod(view.onBeforeAttach, view, false, view.onAttach);
    });

    it('should call onAttach on the view', function() {
      expectTriggerMethod(view.onAttach, view, true);
    });

    describe('when destroying a view from a region attached to the document', function() {
      beforeEach(function() {
        region.empty();
      });

      it('should call onBeforeDetach on the view', function() {
        expectTriggerMethod(view.onBeforeDetach, view, true, view.onDetach);
      });

      it('should call onDetach on the view', function() {
        expectTriggerMethod(view.onDetach, view, false);
      });

      it('should call onDetach before destroying view', function() {
        expect(view.onDestroy).to.have.been.calledAfter(view.onDetach);
      });
    });

    describe('when detaching a view from a region attached to the document', function() {
      beforeEach(function() {
        region.empty({preventDestroy: true});
      });

      it('should call onBeforeDetach on the view', function() {
        expectTriggerMethod(view.onBeforeDetach, view, true, view.onDetach);
      });

      it('should call onDetach on the view', function() {
        expectTriggerMethod(view.onDetach, view, false);
      });
    });
  });

  describe('when the parent view is initially detached', function() {
    describe('When showing a View with a single level of nested views', function() {
      let parentView;
      let mainView;
      let footerView;

      beforeEach(function() {
        const ParentView = View.extend({
          onRender: function() {
            mainView = new ChildView();
            footerView = new ChildView();
            this.showChildView('main', mainView);
            this.showChildView('footer', footerView);
          }
        });

        parentView = new ParentView();
        region.show(parentView);
      });

      it('should trigger onBeforeAttach & onAttach on the mainView', function() {
        expectTriggerMethod(mainView.onBeforeAttach, mainView, false, mainView.onAttach);
        expectTriggerMethod(mainView.onAttach, mainView, true);
      });

      it('should trigger onBeforeAttach & onAttach on the footerView', function() {
        expectTriggerMethod(footerView.onBeforeAttach, footerView, false, footerView.onAttach);
        expectTriggerMethod(footerView.onAttach, footerView, true);
      });

      describe('When destroying a View with a single level of nested view', function() {
        beforeEach(function() {
          region.empty();
        });

        it('should call onBeforeDetach & onDetach on the mainView', function() {
          expectTriggerMethod(mainView.onBeforeDetach, mainView, true, mainView.onDetach);
          expectTriggerMethod(mainView.onDetach, mainView, false);
        });

        it('should call onBeforeDetach & onDetach on the footerView', function() {
          expectTriggerMethod(footerView.onBeforeDetach, footerView, true, footerView.onDetach);
          expectTriggerMethod(footerView.onDetach, footerView, false);
        });
      });
    });

    describe('When showing a View with a single level of nested views in onAttach', function() {
      let parentView;
      let mainView;
      let footerView;

      beforeEach(function() {
        const ParentView = View.extend({
          onAttach: function() {
            mainView = new ChildView();
            footerView = new ChildView();
            this.showChildView('main', mainView);
            this.showChildView('footer', footerView);
          }
        });

        parentView = new ParentView();
        region.show(parentView);
      });

      it('should trigger onBeforeAttach & onAttach on the mainView', function() {
        expectTriggerMethod(mainView.onBeforeAttach, mainView, false, mainView.onAttach);
        expectTriggerMethod(mainView.onAttach, mainView, true);
      });

      it('should trigger onBeforeAttach & onAttach on the footerView', function() {
        expectTriggerMethod(footerView.onBeforeAttach, footerView, false, footerView.onAttach);
        expectTriggerMethod(footerView.onAttach, footerView, true);
      });
    });

    describe('When showing a View with two levels of nested views', function() {
      let grandparentView;
      let parentView;
      let childView;

      beforeEach(function() {
        const GrandparentView = View.extend({
          onRender: function() {
            parentView = new ParentView();
            this.showChildView('main', parentView);
          }
        });

        const ParentView = View.extend({
          onRender: function() {
            childView = new ChildView();
            this.showChildView('main', childView);
          }
        });

        grandparentView = new GrandparentView();
        region.show(grandparentView);
      });

      it('should trigger onBeforeAttach & onAttach on the grandparent view', function() {
        expect(grandparentView.onAttach).to.have.been.calledOnce;
        expect(grandparentView.onBeforeAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the parent view', function() {
        expect(parentView.onBeforeAttach).to.have.been.calledOnce;
        expect(parentView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the child view', function() {
        expectTriggerMethod(childView.onBeforeAttach, childView, false, childView.onAttach);
        expectTriggerMethod(childView.onAttach, childView, true);
      });

      describe('When destroying a View with two levels of nested views', function() {
        beforeEach(function() {
          region.empty();
        });

        it('should trigger onBeforeDetach & onDetach on the grandparent view', function() {
          expect(grandparentView.onDetach).to.have.been.calledOnce;
          expect(grandparentView.onBeforeDetach).to.have.been.calledOnce;
        });

        it('should trigger onBeforeDetach & onDetach on the parent view', function() {
          expect(parentView.onBeforeDetach).to.have.been.calledOnce;
          expect(parentView.onDetach).to.have.been.calledOnce;
        });

        it('should trigger onBeforeDetach & onDetach on the child view', function() {
          expectTriggerMethod(childView.onBeforeDetach, childView, true, childView.onDetach);
          expectTriggerMethod(childView.onDetach, childView, false);
        });
      });
    });
  });

  describe('when the parent view is initially attached', function() {
    describe('When showing a View with a single level of nested views', function() {
      let parentView;
      let mainView;
      let footerView;

      beforeEach(function() {
        parentView = new View();
        region.show(parentView);

        mainView = new ChildView();
        footerView = new ChildView();
        parentView.showChildView('main', mainView);
        parentView.showChildView('footer', footerView);
      });

      it('should trigger onBeforeAttach & onAttach on the mainView', function() {
        expectTriggerMethod(mainView.onBeforeAttach, mainView, false, mainView.onAttach);
        expectTriggerMethod(mainView.onAttach, mainView, true);
      });

      it('should trigger onBeforeAttach & onAttach on the footerView', function() {
        expectTriggerMethod(footerView.onBeforeAttach, footerView, false, footerView.onAttach);
        expect(footerView.onAttach, footerView, true);
      });
    });

    describe('When showing a View with two levels of nested views', function() {
      let grandparentView;
      let parentView;
      let childView;

      beforeEach(function() {
        const ParentView = View.extend({
          onRender: function() {
            childView = new ChildView();
            this.showChildView('main', childView);
          }
        });

        grandparentView = new View();
        region.show(grandparentView);

        parentView = new ParentView();
        grandparentView.showChildView('main', parentView);
      });

      it('should trigger onBeforeAttach & onAttach on the grandparent view', function() {
        expect(grandparentView.onAttach).to.have.been.calledOnce;
        expect(grandparentView.onBeforeAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the parent view', function() {
        expect(parentView.onBeforeAttach).to.have.been.calledOnce;
        expect(parentView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the child view', function() {
        expectTriggerMethod(childView.onBeforeAttach, childView, false, childView.onAttach);
        expect(childView.onAttach, childView, true);
      });
    });
  });

  describe('when showing an empty CollectionView', function() {
    let emptyView;
    let childView;
    let collection;
    let collectionView;

    beforeEach(function() {
      collection = new Backbone.Collection();
      collectionView = new CollectionView({
        collection
      });

      region.show(collectionView);
      emptyView = collectionView.children.findByIndex(0);
    });

    it('should trigger onBeforeAttach and onAttach on the emptyView', function() {
      expect(emptyView).to.be.an.instanceof(EmptyView);
      expectTriggerMethod(emptyView.onBeforeAttach, emptyView, false, emptyView.onAttach);
      expectTriggerMethod(emptyView.onAttach, emptyView, true);
    });

    describe('when adding a new element to the collection', function() {
      beforeEach(function() {
        collection.add({id: 1});
        childView = collectionView.children.findByIndex(0);
      });

      it('should trigger onBeforeDetach and onDetach on the emptyView', function() {
        expectTriggerMethod(emptyView.onBeforeDetach, emptyView, true, emptyView.onDetach);
        expectTriggerMethod(emptyView.onDetach, emptyView, false);
      });

      it('should trigger onBeforeAttach and onAttach on the childView', function() {
        expect(childView).to.be.an.instanceof(ChildView);
        expectTriggerMethod(childView.onBeforeAttach, childView, false, childView.onAttach);
        expect(childView.onAttach, childView, true);
      });
    });
  });

  describe('when showing a non-empty CollectionView', function() {
    let collection;
    let collectionView;
    let childView1;
    let childView2;

    beforeEach(function() {
      collection = new Backbone.Collection([{id: 1}, {id: 2}]);
      collectionView = new CollectionView({
        collection
      });
      region.show(collectionView);
      childView1 = collectionView.children.findByIndex(0);
      childView2 = collectionView.children.findByIndex(1);
    });

    it('should trigger onBeforeAttach and onAttach on each of its childViews', function() {
      expectTriggerMethod(childView1.onBeforeAttach, childView1, false, childView1.onAttach);
      expectTriggerMethod(childView1.onAttach, childView1, true);

      expectTriggerMethod(childView2.onBeforeAttach, childView2, false, childView2.onAttach);
      expectTriggerMethod(childView2.onAttach, childView2, true);
    });

    describe('when re-rendering the CollectionView', function() {
      beforeEach(function() {
        collectionView.render();
      });

      it('should trigger onBeforeDetach and onDetach on each of its childViews', function() {
        expectTriggerMethod(childView1.onBeforeDetach, childView1, true, childView1.onDetach);
        expectTriggerMethod(childView1.onDetach, childView1, false);

        expectTriggerMethod(childView2.onBeforeDetach, childView2, true, childView2.onDetach);
        expectTriggerMethod(childView2.onDetach, childView2, false);
      });

      it('should trigger onBeforeAttach and onAttach on each of its childViews', function() {
        expectTriggerMethod(childView1.onBeforeAttach, childView1, false, childView1.onAttach);
        expect(childView1.onAttach, childView1, true);

        expectTriggerMethod(childView2.onBeforeAttach, childView2, false, childView2.onAttach);
        expectTriggerMethod(childView2.onAttach, childView2, true);
      });
    });

    describe('when emptying the collection', function() {
      let emptyView;

      beforeEach(function() {
        collection.reset();
        emptyView = collectionView.children.findByIndex(0);
      });

      it('should trigger onBeforeDetach and onDetach on each of its childViews', function() {
        expectTriggerMethod(childView1.onBeforeDetach, childView1, true, childView1.onDetach);
        expectTriggerMethod(childView1.onDetach, childView1, false);

        expectTriggerMethod(childView2.onBeforeDetach, childView2, true, childView2.onDetach);
        expectTriggerMethod(childView2.onDetach, childView2, false);
      });

      it('should trigger onBeforeAttach and onAttach on the emptyView', function() {
        expect(emptyView).to.be.an.instanceof(EmptyView);
        expectTriggerMethod(emptyView.onBeforeAttach, emptyView, false, emptyView.onAttach);
        expectTriggerMethod(emptyView.onAttach, emptyView, true);
      });
    });

    describe('when destroying CollectionView tree', function() {
      let detachView;
      let collectionViewOnDetach;

      beforeEach(function() {
        detachView = new ChildView({
          template: _.noop
        });
        ChildView = View.extend({
          template: _.template('<div id="child-region"></div>'),
          regions: {
            'region': '#child-region'
          },
          onAttach() {
            this.showChildView('region', detachView);
          }
        });
        collectionViewOnDetach = this.sinon.spy();
        collectionView = new CollectionView({
          collection: collection,
          childView: ChildView,
          onDetach: collectionViewOnDetach
        });
        region.show(collectionView);
        childView1 = collectionView.children.findByIndex(0);
        childView2 = collectionView.children.findByIndex(1);
        region.empty();
      });

      it('should call onDetach for detachView before destroying parent view', function() {
        expect(childView1.onDetach).to.have.been.calledBefore(detachView.onDestroy);
        expect(childView2.onDetach).to.have.been.calledBefore(detachView.onDestroy);
      });

      it('should call onDetach for childView before destroying collectionView', function() {
        expect(collectionViewOnDetach).to.have.been.calledBefore(childView1.onDestroy);
        expect(collectionViewOnDetach).to.have.been.calledBefore(childView2.onDestroy);
      });

      it('should call onDetach for collectionView before destroying parent', function() {
        expect(collectionViewOnDetach).to.have.been.calledBefore(detachView.onDestroy);
      });
    });
  });
});
