describe('collection view - childViewOptions', function() {
  'use strict';

  beforeEach(function() {
    this.collection = new Backbone.Collection([{foo: 'bar'}, {foo: 'baz'}]);
    this.childViewOptions = {foo: 'bar'};
    this.childViewOptionsStub = this.sinon.stub().returns(this.childViewOptions);

    this.ItemView = Backbone.Marionette.ItemView.extend({
      render: this.sinon.stub()
    });

    this.CollectionView = Backbone.Marionette.CollectionView.extend({
      collection: this.collection,
      childView: this.ItemView,
      childViewOptions: this.childViewOptions
    });
  });

  describe('when rendering and a "childViewOptions" is provided', function() {
    beforeEach(function() {
      this.collectionView = new this.CollectionView();
      this.collectionView.render();
      this.view = this.collectionView.children.findByIndex(0);
    });

    it('should pass the options to every view instance', function() {
      expect(this.view.options).to.contain(this.childViewOptions);
    });
  });

  describe('when rendering and a "childViewOptions" is provided at construction time', function() {
    beforeEach(function() {
      this.collectionView = new this.CollectionView({
        childViewOptions: this.childViewOptions
      });
      this.collectionView.render();
      this.view = this.collectionView.children.findByIndex(0);
    });

    it('should pass the options to every view instance', function() {
      expect(this.view.options).to.contain(this.childViewOptions);
    });
  });

  describe('when rendering and a "childViewOptions" is provided as a function', function() {
    beforeEach(function() {
      this.collectionView = new this.CollectionView({
        childViewOptions: this.childViewOptionsStub
      });
      this.collectionView.render();
      this.view = this.collectionView.children.findByIndex(0);
    });

    it('should pass the options to every view instance', function() {
      expect(this.view.options).to.contain(this.childViewOptions);
    });

    it('should pass the model when calling "childViewOptions"', function() {
      expect(this.childViewOptionsStub).to.have.been.calledTwice.and.calledWith(this.collection.at(0), 0);
      expect(this.childViewOptionsStub).to.have.been.calledTwice.and.calledWith(this.collection.at(1), 1);
    });
  });
});
