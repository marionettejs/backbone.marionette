describe('renderer', function() {
  'use strict';

  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when given a template id to render', function() {
    var templateSelector = '#renderer-template';
    var result;

    beforeEach(function() {
      loadFixtures('rendererTemplate.html');
      sinon.spy(Backbone.Marionette.TemplateCache, 'get');
      var html = Backbone.Marionette.Renderer.render(templateSelector).trim();
      result = $(html);
    });

    afterEach(function() {
      Backbone.Marionette.TemplateCache.get.restore();
    });

    it('should retrieve the template from the cache', function() {
      expect(Backbone.Marionette.TemplateCache.get).to.have.been.calledWith(templateSelector);
    });

    it('should render the template', function() {
      expect(result).to.contain.$text('renderer');
    });
  });

  describe('when given a template and data to render', function() {
    var templateSelector = '#renderer-with-data-template';
    var result;

    beforeEach(function() {
      loadFixtures('rendererWithDataTemplate.html');
      sinon.spy(Backbone.Marionette.TemplateCache, 'get');

      var data = {foo: 'bar'};
      var html = Backbone.Marionette.Renderer.render(templateSelector, data).trim();
      result = $(html);
    });

    afterEach(function() {
      Backbone.Marionette.TemplateCache.get.restore();
    });

    it('should retrieve the template from the cache', function() {
      expect(Backbone.Marionette.TemplateCache.get).to.have.been.calledWith(templateSelector);
    });

    it('should render the template', function() {
      expect(result).to.contain.$text('renderer bar');
    });
  });

  describe('when no template is provided', function() {
    var render;

    beforeEach(function() {
      render = _.bind(Backbone.Marionette.Renderer.render, Backbone.Marionette.Renderer);
    });

    it('should raise an error', function() {
      expect(render).to.throw('Cannot render the template since its false, null or undefined.');
    });
  });

  describe('when overriding the `render` method', function() {
    var oldRender, result;

    beforeEach(function() {
      oldRender = Backbone.Marionette.Renderer.render;

      Backbone.Marionette.Renderer.render = function() {
        return '<foo>custom</foo>';
      };

      result = Backbone.Marionette.Renderer.render('', {});
      result = $(result);
    });

    afterEach(function() {
      Backbone.Marionette.Renderer.render = oldRender;
    });

    it('should render the view with the overridden method', function() {
      expect(result).to.contain.$text('custom');
    });
  });

  describe('when providing a precompiled template', function() {
    it('should use the provided template function', function() {
      var templateFunction = _.template('<%= foo %>');
      var result = Backbone.Marionette.Renderer.render(templateFunction, {foo : 'bar'});
      expect(result).to.equal('bar');
    });
  });

});
