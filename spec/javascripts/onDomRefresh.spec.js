describe('onDomRefresh', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  beforeEach(function() {
    this.View = Backbone.Marionette.ItemView.extend({
      onDomRefresh: function() {}
    });

    this.sinon.spy(this.View.prototype, 'onDomRefresh');
    this.view = new this.View();
    this.view.trigger('show');
    this.view.trigger('render');
  });

  afterEach(function() {
    this.view.remove();
  });

  describe('when the view is not in the DOM', function() {
    it('should never trigger onDomRefresh', function() {
      expect(this.View.prototype.onDomRefresh).not.to.have.been.called;
    });
  });

  describe('when the view is in the DOM', function() {
    beforeEach(function() {
      $('body').append(this.view.$el);
      this.view.trigger('show');
      this.view.trigger('render');
    });

    it('should trigger onDomRefresh if "show" and "render" have both been triggered on the view', function() {
      expect(this.View.prototype.onDomRefresh).to.have.been.called;
    });
  });
});
