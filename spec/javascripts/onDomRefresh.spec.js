describe('onDomRefresh', function() {
  'use strict';

  beforeEach(function() {
    this.onDomRefreshStub = this.sinon.stub();
    this.View = Backbone.Marionette.ItemView.extend({
      onDomRefresh: this.onDomRefreshStub
    });
    this.view = new this.View();
  });

  describe('when the view is not in the DOM', function() {
    beforeEach(function() {
      this.view.trigger('show');
      this.view.trigger('render');
    });

    it('should never trigger onDomRefresh', function() {
      expect(this.onDomRefreshStub).not.to.have.been.called;
    });
  });

  describe('when the view is in the DOM', function() {
    beforeEach(function() {
      $('body').append(this.view.$el);
      this.view.trigger('show');
      this.view.trigger('render');
    });

    it('should trigger onDomRefresh if "show" and "render" have both been triggered on the view', function() {
      expect(this.onDomRefreshStub).to.have.been.called;
    });
  });
});
