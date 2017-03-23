// Tests for the children container integration

import _ from 'underscore';
import Backbone from 'backbone';
import CollectionView from '../../../src/next-collection-view';
import ChildViewContainer from '../../../src/next-child-view-container';
import View from '../../../src/view';
import Region from '../../../src/region';

describe('next CollectionView Children', function() {
  const collection = new Backbone.Collection([
    { id: 1 },
    { id: 2 },
    { id: 3 }
  ]);
  let MyCollectionView;

  beforeEach(function() {
    const MyChildView = View.extend({
      template: _.noop
    });

    MyCollectionView = CollectionView.extend({
      childView: MyChildView
    });
  });

  describe('when instantiating a CollectionView', function() {
    let myCollectionView;

    beforeEach(function() {
      myCollectionView = new MyCollectionView();
    });

    it('should instantiate the children container', function() {
      expect(myCollectionView.children).to.be.instanceOf(ChildViewContainer);
    });
  });

  describe('when rendering a CollectionView', function() {
    let myCollectionView;

    beforeEach(function() {
      myCollectionView = new MyCollectionView({ collection });
      myCollectionView.onBeforeRenderChildren = this.sinon.stub();
      myCollectionView.onRenderChildren = this.sinon.stub();
      myCollectionView.onBeforeAddChild = this.sinon.stub();
      myCollectionView.onAddChild = this.sinon.stub();

      this.sinon.spy(myCollectionView.children, '_init');
      this.sinon.spy(myCollectionView.children, '_add');
      myCollectionView.render();
    });

    it('should reinit the children container', function() {
      expect(myCollectionView.children._init).to.have.been.calledOnce;
    });

    it('should add children to match the collection', function() {
      collection.each((model, index) => {
        const call = myCollectionView.children._add.getCall(index);
        expect(call.args[0].model).to.equal(model);
        expect(call.args[1]).to.equal(undefined);
      });
    });

    it('should trigger "before:render:children"', function() {
      expect(myCollectionView.onBeforeRenderChildren)
        .to.be.calledOnce.and.calledWith(myCollectionView, myCollectionView.children._views);
    });

    it('should trigger "render:children"', function() {
      expect(myCollectionView.onRenderChildren)
        .to.be.calledOnce.and.calledWith(myCollectionView, myCollectionView.children._views);
    });

    it('should trigger "before:add:child" for each model', function() {
      collection.each((model, index) => {
        const call = myCollectionView.onBeforeAddChild.getCall(index);
        expect(call.args[0]).to.equal(myCollectionView);
        expect(call.args[1].model).to.equal(model);
      });
    });

    it('should trigger "add:child" for each model', function() {
      collection.each((model, index) => {
        const call = myCollectionView.onAddChild.getCall(index);
        expect(call.args[0]).to.equal(myCollectionView);
        expect(call.args[1].model).to.equal(model);
      });
    });
  });

  describe('#addChildView', function() {
    let myCollectionView;
    let addView;

    const addIndex = 1;

    beforeEach(function() {
      myCollectionView = new MyCollectionView({ collection });
      addView = new View({ template: _.noop });

      myCollectionView.render();
      myCollectionView.onBeforeRenderChildren = this.sinon.stub();
      myCollectionView.onRenderChildren = this.sinon.stub();
      myCollectionView.onBeforeAddChild = this.sinon.stub();
      myCollectionView.onAddChild = this.sinon.stub();

      this.sinon.spy(myCollectionView.children, '_add');
      this.sinon.spy(myCollectionView, 'addChildView');
      myCollectionView.addChildView(addView, addIndex);
    });

    it('should return the added view', function() {
      expect(myCollectionView.addChildView).to.have.returned(addView);
    });

    it('should add to the children container', function() {
      expect(myCollectionView.children._add)
        .to.have.been.calledOnce.and.calledWith(addView, addIndex);
    });

    it('should trigger "before:render:children"', function() {
      expect(myCollectionView.onBeforeRenderChildren)
        .to.be.calledOnce.and.calledWith(myCollectionView);
    });

    it('should trigger "render:children"', function() {
      expect(myCollectionView.onRenderChildren)
        .to.be.calledOnce.and.calledWith(myCollectionView);
    });

    it('should trigger "add:child"', function() {
      expect(myCollectionView.onAddChild)
        .to.be.calledOnce.and.calledWith(myCollectionView, addView);
    });

    it('should trigger "before:add:child"', function() {
      expect(myCollectionView.onBeforeAddChild)
        .to.be.calledOnce.and.calledWith(myCollectionView, addView);
    });

    describe('when called without a view', function() {
      beforeEach(function() {
        myCollectionView.onAddChild.reset();
        myCollectionView.addChildView.reset();
        myCollectionView.addChildView();
      });

      it('should not trigger "add:child"', function() {
        expect(myCollectionView.onAddChild).to.not.be.called;
      });
    });

    describe('when called with a destroyed view', function() {
      let destroyedView;

      beforeEach(function() {
        destroyedView = new View();
        destroyedView.destroy();

        myCollectionView.onAddChild.reset();
        myCollectionView.addChildView.reset();
        myCollectionView.addChildView(destroyedView);
      });

      it('should not trigger "add:child"', function() {
        expect(myCollectionView.onAddChild).to.not.be.called;
      });

      it('should return the destroyed view', function() {
        expect(myCollectionView.addChildView).to.have.returned(destroyedView);
      });
    });
  });

  describe('#detachChildView', function() {
    let myCollectionView;
    let detachView;

    beforeEach(function() {
      myCollectionView = new MyCollectionView({ collection });
      this.sinon.spy(myCollectionView, 'removeChildView');
      this.sinon.spy(myCollectionView, 'detachChildView');

      myCollectionView.render();
      detachView = myCollectionView.children.first();

      myCollectionView.detachChildView(detachView);
    });

    it('should return the detached view', function() {
      expect(myCollectionView.detachChildView).to.have.returned(detachView);
    });

    it('should call removeChildView', function() {
      expect(myCollectionView.removeChildView)
        .to.have.been.calledOnce.and.calledWith(detachView, { shouldDetach: true });
    });
  });

  describe('#removeChildView', function() {
    let myCollectionView;
    let removeView;

    beforeEach(function() {
      myCollectionView = new MyCollectionView({ collection });
      myCollectionView.onBeforeRemoveChild = this.sinon.stub();
      myCollectionView.onRemoveChild = this.sinon.stub();

      this.sinon.spy(myCollectionView.children, '_remove');
      this.sinon.spy(myCollectionView, 'removeChildView');

      myCollectionView.render();
      removeView = myCollectionView.children.first();

      myCollectionView.removeChildView(removeView);
    });

    it('should return the removed view', function() {
      expect(myCollectionView.removeChildView).to.have.returned(removeView);
    });

    it('should destroy the removed view', function() {
      expect(removeView.isDestroyed()).to.be.true;
    });

    it('should remove from the children container', function() {
      expect(myCollectionView.children._remove)
        .to.have.been.calledOnce.and.calledWith(removeView);
    });

    it('should trigger "remove:child"', function() {
      expect(myCollectionView.onRemoveChild)
        .to.be.calledOnce.and.calledWith(myCollectionView, removeView);
    });

    it('should trigger "before:remove:child"', function() {
      expect(myCollectionView.onBeforeRemoveChild)
        .to.be.calledOnce.and.calledWith(myCollectionView, removeView);
    });

    describe('when called without a view', function() {
      beforeEach(function() {
        myCollectionView.onRemoveChild.reset();
        myCollectionView.removeChildView.reset();
        myCollectionView.removeChildView();
      });

      it('should not trigger "remove:child"', function() {
        expect(myCollectionView.onRemoveChild).to.not.be.called;
      });
    });

    // Used only by #detachChildView
    describe('when called with shouldDetach', function() {
      let detachView;

      beforeEach(function() {
        myCollectionView.onRemoveChild.reset();
        myCollectionView.removeChildView.reset();
        this.sinon.spy(myCollectionView, 'detachHtml');

        detachView = myCollectionView.children.first();

        myCollectionView.removeChildView(detachView, { shouldDetach: true });
      });

      it('should not destroy the view', function() {
        expect(detachView.isDestroyed()).to.be.false;
      });

      it('should detach the view\'s html', function() {
        expect(myCollectionView.detachHtml).to.be.calledOnce.and.calledWith(detachView);
      });
    });
  });

  describe('when destroying a childView', function() {
    let myCollectionView;
    let destroyedView;

    beforeEach(function() {
      myCollectionView = new MyCollectionView({ collection });
      this.sinon.spy(myCollectionView, 'removeChildView');

      myCollectionView.render();
      destroyedView = myCollectionView.children.first();
      destroyedView.destroy();
    });

    it('should remove the childView', function() {
      expect(myCollectionView.removeChildView)
        .to.have.been.calledOnce.and.calledWith(destroyedView);
    });
  });

  // The lifecycle is tested with Backbone.View
  describe('childView lifecycle', function() {
    let myCollectionView;
    let childView;

    beforeEach(function() {
      myCollectionView = new MyCollectionView();

      const ChildView = Backbone.View.extend({
        onBeforeRender: this.sinon.stub(),
        onRender: this.sinon.stub(),
        onBeforeAttach: this.sinon.stub(),
        onAttach: this.sinon.stub(),
        onBeforeDetach: this.sinon.stub(),
        onDetach: this.sinon.stub(),
        onBeforeDestroy: this.sinon.stub(),
        onDestroy: this.sinon.stub()
      });

      childView = new ChildView();
    });

    describe('when the collectionView is attached', function() {
      describe('when attaching the childview', function() {
        beforeEach(function() {
          const myRegion = new Region({ el: '#fixtures' });
          myRegion.show(myCollectionView);
          myCollectionView.addChildView(childView);
        });

        it('should trigger "before:render" event on the childView', function() {
          expect(childView.onBeforeRender).to.have.been.calledOnce.and.calledWith(childView);
        });

        it('should trigger "render" event on the childView', function() {
          expect(childView.onRender).to.have.been.calledOnce.and.calledWith(childView);
        });

        it('should trigger "before:attach" event on the childView', function() {
          expect(childView.onBeforeAttach).to.have.been.calledOnce.and.calledWith(childView);
        });

        it('should trigger "attach" event on the childView', function() {
          expect(childView.onAttach).to.have.been.calledOnce.and.calledWith(childView);
        });

        // All children are possibly attached when adding any children
        describe('when attaching another childview', function() {
          let anotherView;

          beforeEach(function() {
            const AnotherView = View.extend({
              template: _.noop,
              onBeforeAttach: this.sinon.stub(),
              onAttach: this.sinon.stub()
            })
            anotherView = new AnotherView();
            childView.onBeforeAttach.reset();
            childView.onAttach.reset();
            myCollectionView.addChildView(anotherView);
          });

          it('should not trigger "before:attach" event on the childView', function() {
            expect(childView.onBeforeAttach).to.not.be.called;
          });

          it('should not trigger "attach" event on the childView', function() {
            expect(childView.onAttach).to.not.be.called;
          });

          it('should trigger "before:attach" event on anotherView', function() {
            expect(anotherView.onBeforeAttach).to.have.been.calledOnce.and.calledWith(anotherView);
          });

          it('should trigger "attach" event on anotherView', function() {
            expect(anotherView.onAttach).to.have.been.calledOnce.and.calledWith(anotherView);
          });
        });

        describe('when removing the childview', function() {
          beforeEach(function() {
            myCollectionView.removeChildView(childView);
          });

          it('should trigger "before:detach" event on the childView', function() {
            expect(childView.onBeforeDetach).to.have.been.calledOnce.and.calledWith(childView);
          });

          it('should trigger "detach" event on the childView', function() {
            expect(childView.onDetach).to.have.been.calledOnce.and.calledWith(childView);
          });

          it('should trigger "before:destroy" event on the childView', function() {
            expect(childView.onBeforeDestroy).to.have.been.calledOnce.and.calledWith(childView);
          });

          it('should trigger "destroy" event on the childView', function() {
            expect(childView.onDestroy).to.have.been.calledOnce.and.calledWith(childView);
          });
        });

        describe('when detaching the childview', function() {
          beforeEach(function() {
            myCollectionView.detachChildView(childView);
          });

          it('should trigger "before:detach" event on the childView', function() {
            expect(childView.onBeforeDetach).to.have.been.calledOnce.and.calledWith(childView);
          });

          it('should trigger "detach" event on the childView', function() {
            expect(childView.onDetach).to.have.been.calledOnce.and.calledWith(childView);
          });

          it('should not trigger "before:destroy" event on the childView', function() {
            expect(childView.onBeforeDestroy).to.not.be.called;
          });

          it('should not trigger "destroy" event on the childView', function() {
            expect(childView.onDestroy).to.not.be.called;
          });
        });
      });
    });

    describe('when the collectionView is not attached', function() {
      beforeEach(function() {
        myCollectionView.addChildView(childView);
        myCollectionView.removeChildView(childView);
      });

      it('should trigger "before:render" event on the childView', function() {
        expect(childView.onBeforeRender).to.have.been.calledOnce.and.calledWith(childView);
      });

      it('should trigger "render" event on the childView', function() {
        expect(childView.onRender).to.have.been.calledOnce.and.calledWith(childView);
      });

      it('should not trigger "before:attach" event on the childView', function() {
        expect(childView.onBeforeAttach).to.not.be.called;
      });

      it('should not trigger "attach" event on the childView', function() {
        expect(childView.onAttach).to.not.be.called;
      });

      it('should not trigger "before:detach" event on the childView', function() {
        expect(childView.onBeforeDetach).to.not.be.called;
      });

      it('should not trigger "detach" event on the childView', function() {
        expect(childView.onDetach).to.not.be.called;
      });

      it('should trigger "before:destroy" event on the childView', function() {
        expect(childView.onBeforeDestroy).to.have.been.calledOnce.and.calledWith(childView);
      });

      it('should trigger "destroy" event on the childView', function() {
        expect(childView.onDestroy).to.have.been.calledOnce.and.calledWith(childView);
      });
    });
  });

  describe('when destroying the collectionView with children', function() {
    let myCollectionView;

    beforeEach(function() {
      myCollectionView = new MyCollectionView({ collection });
      myCollectionView.onBeforeDestroyChildren = this.sinon.stub();
      myCollectionView.onDestroyChildren = this.sinon.stub();

      myCollectionView.render();
      myCollectionView.destroy();
    });

    it('should destroy each view', function() {
      myCollectionView.children.each(view => {
        expect(view.isDestroyed()).to.be.true;
      });
    });

    it('should trigger "before:destroy:children"', function() {
      expect(myCollectionView.onBeforeDestroyChildren)
        .to.be.calledOnce.and.calledWith(myCollectionView);
    });

    it('should trigger "destroy:children"', function() {
      expect(myCollectionView.onDestroyChildren)
        .to.be.calledOnce.and.calledWith(myCollectionView);
    });
  });

  describe('when destroying the collectionView without children', function() {
    let myCollectionView;

    beforeEach(function() {
      myCollectionView = new MyCollectionView({ collection });
      myCollectionView.onDestroyChildren = this.sinon.stub();

      myCollectionView.destroy();
    });

    it('should not trigger "destroy:children"', function() {
      expect(myCollectionView.onDestroyChildren).to.not.be.called;
    });
  });
});
