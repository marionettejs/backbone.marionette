describe('pre-compiled template rendering', function() {
  'use strict';

  describe('when rendering views with pre-compiled template functions', function() {
    beforeEach(function() {
      this.template = 'foobar';
      this.View = Backbone.Marionette.ItemView.extend({
        template: _.template(this.template)
      });
      this.view = new this.View();
      this.view.render();
    });

    it('should render the pre-compiled template', function() {
      expect(this.view.$el).to.contain.$text(this.template);
    });
  });
});
