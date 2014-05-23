describe('destroying views', function() {
  'use strict';

  describe('when destroying a Marionette.View multiple times', function() {
    beforeEach(function() {
      this.View = Marionette.View.extend({});
      this.view = new this.View();
      this.view.onBeforeDestroy = this.sinon.stub();

      this.view.destroy();
      this.view.destroy();
    });

    it('should only run the destroying code once', function() {
      expect(this.view.onBeforeDestroy).to.have.been.called;
    });

    it('should mark the view as destroyed', function() {
      expect(this.view.isDestroyed).to.be.true;
    });
  });

  describe('when destroying a Marionette.ItemView multiple times', function() {
    beforeEach(function() {
      this.View = Marionette.ItemView.extend({});
      this.view = new this.View();
      this.view.onBeforeDestroy = this.sinon.stub();

      this.view.destroy();
      this.view.destroy();
    });

    it('should only run the destroying code once', function() {
      expect(this.view.onBeforeDestroy).to.have.been.called;
    });

    it('should mark the view as destroyed', function() {
      expect(this.view.isDestroyed).to.be.true;
    });
  });

  describe('when rendering a Marionette.ItemView that was previously destroyed', function() {
    beforeEach(function() {
      this.View = Marionette.ItemView.extend({
        template: function() {}
      });

      this.view = new this.View();
      this.view.onBeforeRender = this.sinon.stub();
      this.view.onRender = this.sinon.stub();

      this.view.destroy();
    });

    it('should throw an error', function() {
      expect(this.view.render).to.throw('Cannot use a view thats already been destroyed.');
    });
  });

  describe('when destroying a Marionette.CollectionView multiple times', function() {
    beforeEach(function() {
      this.View = Marionette.CollectionView.extend({});

      this.view = new this.View();
      this.view.onBeforeDestroy = this.sinon.stub();

      this.view.destroy();
      this.view.destroy();
    });

    it('should only run the destroying code once', function() {
      expect(this.view.onBeforeDestroy).to.have.been.called;
    });

    it('should mark the view as destroyed', function() {
      expect(this.view.isDestroyed).to.be.true;
    });
  });

  describe('when rendering a Marionette.CollectionView that was previously destroyed', function() {
    beforeEach(function() {
      this.ItemView = Marionette.ItemView.extend({
        template: function() {}
      });

      this.CollectionView = Marionette.CollectionView.extend({
        itemView: this.ItemView
      });

      this.view = new this.CollectionView();
      this.view.onBeforeRender = this.sinon.stub();
      this.view.onRender = this.sinon.stub();

      this.view.destroy();
    });

    it('should throw an error', function() {
      expect(this.view.render).to.throw('Cannot use a view thats already been destroyed.');
    });
  });

  describe('when destroying a Marionette.CompositeView multiple times', function() {
    beforeEach(function() {
      this.View = Marionette.CompositeView.extend({});

      this.view = new this.View();
      this.view.onBeforeDestroy = this.sinon.stub();

      this.view.destroy();
      this.view.destroy();
    });

    it('should only run the destroying code once', function() {
      expect(this.view.onBeforeDestroy).to.have.been.called;
    });

    it('should mark the view as destroyed', function() {
      expect(this.view.isDestroyed).to.be.true;
    });
  });

  describe('when rendering a Marionette.CompositeView that was previously destroyed', function() {
    beforeEach(function() {
      this.ItemView = Marionette.ItemView.extend({
        template: function() {}
      });

      this.CompositeView = Marionette.CompositeView.extend({
        template: function() {},
        itemView: this.ItemView
      });

      this.view = new this.CompositeView();

      this.view.onBeforeRender = this.sinon.stub();
      this.view.onRender = this.sinon.stub();

      this.view.destroy();
    });

    it('should throw an error', function() {
      expect(this.view.render).to.throw('Cannot use a view thats already been destroyed.');
    });
  });
});
