describe('onDomRefresh', function() {
  'use strict';

  beforeEach(function() {
    this.setFixtures($('<div id="region"></div>'));
    this.attachedRegion = new Marionette.Region({el: '#region'});
    this.detachedRegion = new Marionette.Region({el: $('<div></div>')});
    this.BbView = Backbone.View.extend({
      onDomRefresh: this.sinon.stub()
    });
    _.extend(this.BbView.prototype, Marionette.BackboneViewMixin);
    this.MnView = Marionette.View.extend({
      template: _.noop,
      onDomRefresh: this.sinon.stub()
    });
  });

  describe('when a Backbone view is shown detached from the DOM', function() {
    beforeEach(function() {
      this.bbView = new this.BbView();
      this.detachedRegion.show(this.bbView);
    });

    it('should never trigger onDomRefresh', function() {
      expect(this.bbView.onDomRefresh).not.to.have.been.calledOnce;
    });
  });

  describe('when a Marionette view is shown detached from the DOM', function() {
    beforeEach(function() {
      this.mnView = new this.MnView();
      this.detachedRegion.show(this.mnView);
    });

    it('should never trigger onDomRefresh', function() {
      expect(this.mnView.onDomRefresh).not.to.have.been.calledOnce;
    });
  });

  describe('when a Backbone view is shown attached to the DOM', function() {
    beforeEach(function() {
      this.bbView = new this.MnView();
      this.attachedRegion.show(this.bbView);
    });

    it('should trigger onDomRefresh on the view', function() {
      expect(this.bbView.onDomRefresh).to.have.been.calledOnce;
    });
  });

  describe('when a Marionette view is shown attached to the DOM', function() {
    beforeEach(function() {
      this.mnView = new this.MnView();
      this.attachedRegion.show(this.mnView);
    });

    it('should trigger onDomRefresh on the view', function() {
      expect(this.mnView.onDomRefresh).to.have.been.calledOnce;
    });
  });

});
