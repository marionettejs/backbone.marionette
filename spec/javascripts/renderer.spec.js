describe('renderer', function() {
  'use strict';

  describe('when given a template id to render', function() {
    beforeEach(function() {
      this.templateSelector = '#renderer-template';

      this.loadFixtures('rendererTemplate.html');
      this.sinon.spy(Backbone.Marionette.TemplateCache, 'get');
      this.html = Backbone.Marionette.Renderer.render(this.templateSelector).trim();
      this.result = $(this.html);
    });

    it('should retrieve the template from the cache', function() {
      expect(Backbone.Marionette.TemplateCache.get).to.have.been.calledWith(this.templateSelector);
    });

    it('should render the template', function() {
      expect(this.result).to.contain.$text('renderer');
    });
  });

  describe('when given a template and data to render', function() {
    beforeEach(function() {
      this.templateSelector = '#renderer-with-data-template';

      this.loadFixtures('rendererWithDataTemplate.html');
      this.sinon.spy(Backbone.Marionette.TemplateCache, 'get');

      this.data = {foo: 'bar'};
      this.html = Backbone.Marionette.Renderer.render(this.templateSelector, this.data).trim();
      this.result = $(this.html);
    });

    it('should retrieve the template from the cache', function() {
      expect(Backbone.Marionette.TemplateCache.get).to.have.been.calledWith(this.templateSelector);
    });

    it('should render the template', function() {
      expect(this.result).to.contain.$text('renderer bar');
    });
  });

  describe('when no template is provided', function() {
    beforeEach(function() {
      this.render = _.bind(Backbone.Marionette.Renderer.render, Backbone.Marionette.Renderer);
    });

    it('should raise an error', function() {
      expect(this.render).to.throw('Cannot render the template since its false, null or undefined.');
    });
  });

  describe('when overriding the `render` method', function() {
    beforeEach(function() {
      this.oldRender = Backbone.Marionette.Renderer.render;

      Backbone.Marionette.Renderer.render = function() {
        return '<foo>custom</foo>';
      };

      this.result = Backbone.Marionette.Renderer.render('', {});
      this.result = $(this.result);
    });

    afterEach(function() {
      Backbone.Marionette.Renderer.render = this.oldRender;
    });

    it('should render the view with the overridden method', function() {
      expect(this.result).to.contain.$text('custom');
    });
  });

  describe('when providing a precompiled template', function() {
    beforeEach(function() {
      this.templateFunction = _.template('<%= foo %>');
      this.result = Backbone.Marionette.Renderer.render(this.templateFunction, {foo : 'bar'});
    });

    it('should use the provided template function', function() {
      expect(this.result).to.equal('bar');
    });
  });
});
