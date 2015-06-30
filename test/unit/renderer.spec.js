describe('renderer', function() {
  'use strict';

  beforeEach(function() {
    this.templateCacheSpy = this.sinon.spy(Marionette.TemplateCache, 'get');
    this.data = {foo: 'bar'};
  });

  describe('when given a template id to render', function() {
    beforeEach(function() {
      this.setFixtures('<script type="text/template" id="renderer-template"><div>renderer</div></script>');
      this.templateSelector = '#renderer-template';
      this.result = Marionette.Renderer.render(this.templateSelector).trim();
    });

    it('should retrieve the template from the cache', function() {
      expect(this.templateCacheSpy).to.have.been.calledWith(this.templateSelector);
    });

    it('should render the template', function() {
      expect(this.result).to.equal('<div>renderer</div>');
    });
  });

  describe('when given a template and data to render', function() {
    beforeEach(function() {
      this.setFixtures('<script type="text/template" id="renderer-with-data-template"><div><%= foo %></div></script>');
      this.templateSelector = '#renderer-with-data-template';
      this.result = Marionette.Renderer.render(this.templateSelector, this.data).trim();
    });

    it('should retrieve the template from the cache', function() {
      expect(this.templateCacheSpy).to.have.been.calledWith(this.templateSelector);
    });

    it('should render the template', function() {
      expect(this.result).to.equal('<div>bar</div>');
    });
  });

  describe('when given an empty template to render', function() {
    beforeEach(function() {
      this.setFixtures('<script type="text/template" id="renderer-empty-template"></script>');
      this.templateSelector = '#renderer-empty-template';
      this.result = Marionette.Renderer.render(this.templateSelector).trim();
    });

    it('should retrieve the template from the cache', function() {
      expect(this.templateCacheSpy).to.have.been.calledWith(this.templateSelector);
    });

    it('should render the template', function() {
      expect(this.result).to.equal('');
    });
  });

  describe('when no template is provided', function() {
    beforeEach(function() {
      this.render = _.bind(Marionette.Renderer.render, Marionette.Renderer);
    });

    it('should raise an error', function() {
      expect(this.render).to.throw('Cannot render the template since its false, null or undefined.');
    });
  });

  describe('when overriding the `render` method', function() {
    beforeEach(function() {
      this.renderStub = this.sinon.stub(Marionette.Renderer, 'render');

      this.view = new Marionette.ItemView({
        template: 'foobar'
      });

      this.view.render();
    });

    it('should render the view with the overridden method', function() {
      expect(this.renderStub).to.have.been.called;
    });
  });

  describe('when providing a precompiled template', function() {
    beforeEach(function() {
      this.templateFunction = _.template('<%= foo %>');
      this.renderSpy = this.sinon.spy(Marionette.Renderer, 'render');
      Marionette.Renderer.render(this.templateFunction, this.data);
    });

    it('should use the provided template function', function() {
      expect(this.renderSpy).to.have.been.calledOnce.and.returned(this.data.foo);
    });
  });
});
