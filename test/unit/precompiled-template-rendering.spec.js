import View from '../../src/view';

describe('pre-compiled template rendering', function() {
  'use strict';

  describe('when rendering views with pre-compiled template functions', function() {
    let template;
    let view;

    beforeEach(function() {
      template = 'foobar';
      const TestView = View.extend({
        template: _.template(template)
      });
      view = new TestView();
      view.render();
    });

    it('should render the pre-compiled template', function() {
      expect(view.$el).to.contain.$text(template);
    });
  });
});
