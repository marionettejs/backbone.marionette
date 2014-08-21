describe('destroying views', function() {
  'use strict';

  describe('when using a Marionette.View that was previously destroyed', function() {
    beforeEach(function() {
      this.view = new Marionette.View();

      this.view.destroy();
    });

    it('should mark the view as destroyed', function() {
      expect(this.view).to.have.property('isDestroyed', true);
    });

    it('should throw an error', function() {
      expect(_.bind(this.view.destroy, this.view)).to.throw('Cannot use a view thats already been destroyed.');
    });
  });

  describe('when using a Marionette.ItemView that was previously destroyed', function() {
    beforeEach(function() {
      this.itemView = new Marionette.ItemView();

      this.itemView.destroy();
    });

    it('should mark the view as destroyed', function() {
      expect(this.itemView).to.have.property('isDestroyed', true);
    });

    it('should throw an error', function() {
      expect(this.itemView.render).to.throw('Cannot use a view thats already been destroyed.');
    });

    it('should throw an error', function() {
      expect(_.bind(this.itemView.destroy, this.itemView)).to.throw('Cannot use a view thats already been destroyed.');
    });
  });

  describe('when using a Marionette.CollectionView that was previously destroyed', function() {
    beforeEach(function() {
      this.collectionView = new Marionette.CollectionView();

      this.collectionView.destroy();
    });

    it('should mark the view as destroyed', function() {
      expect(this.collectionView).to.have.property('isDestroyed', true);
    });

    it('should throw an error', function() {
      expect(this.collectionView.render).to.throw('Cannot use a view thats already been destroyed.');
    });

    it('should throw an error', function() {
      expect(_.bind(this.collectionView.destroy, this.collectionView)).to.throw('Cannot use a view thats already been destroyed.');
    });
  });

  describe('when using a Marionette.CompositeView that was previously destroyed', function() {
    beforeEach(function() {
      this.compositeView = new Marionette.CompositeView();

      this.compositeView.destroy();
    });

    it('should mark the view as destroyed', function() {
      expect(this.compositeView).to.have.property('isDestroyed', true);
    });

    it('should throw an error', function() {
      expect(this.compositeView.render).to.throw('Cannot use a view thats already been destroyed.');
    });

    it('should throw an error', function() {
      expect(_.bind(this.compositeView.destroy, this.compositeView)).to.throw('Cannot use a view thats already been destroyed.');
    });
  });

  describe('when using a Marionette.LayoutView that was previously destroyed', function() {
    beforeEach(function() {
      this.layoutView = new Marionette.LayoutView();

      this.layoutView.destroy();
    });

    it('should mark the view as destroyed', function() {
      expect(this.layoutView).to.have.property('isDestroyed', true);
    });

    it('should throw an error', function() {
      expect(this.layoutView.render).to.throw('Cannot use a view thats already been destroyed.');
    });

    it('should throw an error', function() {
      expect(_.bind(this.layoutView.destroy, this.layoutView)).to.throw('Cannot use a view thats already been destroyed.');
    });
  });

});
