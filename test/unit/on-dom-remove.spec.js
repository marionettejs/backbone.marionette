describe('onDomRemove', function() {
  'use strict';

  beforeEach(function() {
    this.setFixtures($('<div id="region"></div>'));
    this.attachedRegion = new Marionette.Region({el: '#region'});
    this.detachedRegion = new Marionette.Region({el: $('<div></div>')});
    this.BbView = Backbone.View.extend({
      onDomRemove: this.sinon.stub()
    });
    this.MnView = Marionette.View.extend({
      template: _.noop,
      onDomRemove: this.sinon.stub()
    });
  });

  describe('when a Backbone view is shown detached from the DOM', function() {
    beforeEach(function() {
      this.bbView = new this.BbView();
      this.detachedRegion.show(this.bbView);
      this.detachedRegion.empty();
    });

    it('should never trigger onDomRemove', function() {
      expect(this.bbView.onDomRemove).not.to.have.been.called;
    });
  });

  describe('when a Marionette view is shown detached from the DOM', function() {
    beforeEach(function() {
      this.mnView = new this.MnView();
      this.detachedRegion.show(this.mnView);
      this.mnView.render();
      this.detachedRegion.empty();
    });

    it('should never trigger onDomRemove', function() {
      expect(this.mnView.onDomRemove).not.to.have.been.called;
    });
  });

  describe('when a Backbone view is shown attached to the DOM', function() {
    beforeEach(function() {
      this.bbView = new this.MnView();
      this.attachedRegion.show(this.bbView);
    });

    describe('when the region is emptied', function() {
      it('should trigger onDomRemove on the view', function() {
        this.attachedRegion.empty();
        expect(this.bbView.onDomRemove).to.have.been.calledOnce.and.calledWith(this.bbView);
      });
    });
  });

  describe('when a Marionette view is shown attached to the DOM', function() {
    beforeEach(function() {
      this.mnView = new this.MnView();
      this.attachedRegion.show(this.mnView);
    });

    describe('when the region is emptied', function() {
      it('should trigger onDomRemove on the view', function() {
        this.attachedRegion.empty();
        expect(this.mnView.onDomRemove).to.have.been.calledOnce.and.calledWith(this.mnView);
      });
    });

    describe('when the view is re-rendered', function() {
      it('should trigger onDomRemove on the view', function() {
        this.mnView.render();
        expect(this.mnView.onDomRemove).to.have.been.calledOnce.and.calledWith(this.mnView);
      });
    });
  });
});
