describe('pre-compiled template rendering', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when rendering views with pre-compiled template functions', function() {
    var View, view, templateFunc;

    beforeEach(function() {
      templateFunc = _.template('<div>pre-compiled</div>');

      View = Backbone.Marionette.ItemView.extend({
        template: templateFunc
      });

      // store and then replace the render method used by Marionette
      this.render = Backbone.Marionette.Renderer.render;
      Backbone.Marionette.Renderer.render = function(template, data) {
        return template(data);
      };

      view = new View();
      view.render();
    });

    afterEach(function() {
      // restore the render method used by Marionette
      Backbone.Marionette.Renderer.render = this.render;
    });

    it('should render the pre-compiled template', function() {
      expect(view.$el).to.contain.$text('pre-compiled');
    });
  });
});
