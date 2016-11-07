describe('destroying views', function() {
  'use strict';

  describe('when destroying a Marionette.View multiple times', function() {
    beforeEach(function() {
      this.onDestroyStub = this.sinon.spy(function() {
        return this.isRendered();
      });

      this.view = new Marionette.View();
      this.view.onDestroy = this.onDestroyStub;

      this.view.destroy();
      this.view.destroy();
    });

    it('should only run the destroying code once', function() {
      expect(this.onDestroyStub).to.have.been.calledOnce;
    });

    it('should mark the view as destroyed', function() {
      expect(this.view).to.have.property('_isDestroyed', true);
    });
  });

  describe('when destroying a Marionette.View multiple times', function() {
    beforeEach(function() {
      this.onBeforeDestroyStub = this.sinon.stub();

      this.itemView = new Marionette.View();
      this.itemView.onBeforeDestroy = this.onBeforeDestroyStub;

      this.itemView.destroy();
      this.itemView.destroy();
    });

    it('should only run the destroying code once', function() {
      expect(this.onBeforeDestroyStub).to.have.been.calledOnce;
    });

    it('should mark the view as destroyed', function() {
      expect(this.itemView).to.have.property('_isDestroyed', true);
    });
  });

  describe('when destroying a Marionette.CollectionView multiple times', function() {
    beforeEach(function() {
      this.onDestroyStub = this.sinon.stub();

      this.collectionView = new Marionette.CollectionView();
      this.collectionView.onDestroy = this.onDestroyStub;

      this.collectionView.destroy();
      this.collectionView.destroy();
    });

    it('should only run the destroying code once', function() {
      expect(this.onDestroyStub).to.have.been.calledOnce;
    });

    it('should mark the view as destroyed', function() {
      expect(this.collectionView).to.have.property('_isDestroyed', true);
    });
  });

  describe('when destroying a Marionette.CompositeView multiple times', function() {
    beforeEach(function() {
      this.onDestroyStub = this.sinon.stub();

      this.compositeView = new Marionette.CompositeView();
      this.compositeView.onDestroy = this.onDestroyStub;

      this.compositeView.destroy();
      this.compositeView.destroy();
    });

    it('should only run the destroying code once', function() {
      expect(this.onDestroyStub).to.have.been.calledOnce;
    });

    it('should mark the view as destroyed', function() {
      expect(this.compositeView).to.have.property('_isDestroyed', true);
    });
  });
});
