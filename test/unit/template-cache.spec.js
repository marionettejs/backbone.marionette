describe('template cache', function() {
  'use strict';

  beforeEach(function() {
    Marionette.TemplateCache.clear();
    this.setFixtures('<script id="foo" type="template">foo</script><script id="bar" type="template">bar</script><script id="baz" type="template">baz</script>');
    this.loadTemplateSpy = this.sinon.spy(Marionette.TemplateCache.prototype, 'loadTemplate');
  });

  describe('when loading a template that does not exist', function() {
    it("should throw", function() {
      expect(function() {
        Marionette.TemplateCache.get('#void');
      })
      .to.throw('Could not find template: "#void"');
    });
  });
  describe('when loading a template for the first time', function() {
    beforeEach(function() {
      Marionette.TemplateCache.get('#foo');
    });

    it('should load from the DOM', function() {
      expect(this.loadTemplateSpy).to.have.been.called;
    });
  });

  describe('when loading a template more than once', function() {
    beforeEach(function() {
      Marionette.TemplateCache.get('#foo');
      Marionette.TemplateCache.get('#foo');
    });

    it('should load from the DOM once', function() {
      expect(this.loadTemplateSpy).to.have.been.calledOnce;
    });
  });

  describe('when clearing the full template cache', function() {
    beforeEach(function() {
      Marionette.TemplateCache.get('#foo');
      Marionette.TemplateCache.clear();
    });

    it('should clear the cache', function() {
      expect(_.size(Marionette.TemplateCache.templateCaches)).to.equal(0);
    });
  });

  describe('when clearing a single template from the cache', function() {
    beforeEach(function() {
      Marionette.TemplateCache.get('#foo');
      Marionette.TemplateCache.get('#bar');
      Marionette.TemplateCache.get('#baz');
      Marionette.TemplateCache.clear('#foo');
    });

    it('should clear the specified templates cache', function() {
      expect(Marionette.TemplateCache.templateCaches).not.to.have.property('#foo');
    });

    it('should not clear other templates from the cache', function() {
      expect(Marionette.TemplateCache.templateCaches).to.have.property('#bar');
      expect(Marionette.TemplateCache.templateCaches).to.have.property('#baz');
    });
  });

  describe('when clearing multiple templates from the cache', function() {
    beforeEach(function() {
      Marionette.TemplateCache.get('#foo');
      Marionette.TemplateCache.get('#bar');
      Marionette.TemplateCache.get('#baz');
      Marionette.TemplateCache.clear('#foo', '#bar');
    });

    it('should clear the specified templates cache', function() {
      expect(Marionette.TemplateCache.templateCaches).not.to.have.property('#foo');
      expect(Marionette.TemplateCache.templateCaches).not.to.have.property('#bar');
    });

    it('should not clear other templates from the cache', function() {
      expect(Marionette.TemplateCache.templateCaches).to.have.property('#baz');
    });
  });
});
