describe('composite view - on before render', function() {
  'use strict';

  beforeEach(function() {
    this.onBeforeRenderStub = this.sinon.stub();
    this.renderTemplateStub = this.sinon.stub();

    this.CompositeView = Marionette.CompositeView.extend({
      onBeforeRender: this.onBeforeRenderStub,
      _renderTemplate: this.renderTemplateStub
    });

    this.compositeView = new this.CompositeView();
    this.compositeView.render();
  });

  it('should call onBeforeRender before rendering the model', function() {
    expect(this.renderTemplateStub).to.have.been.calledAfter(this.onBeforeRenderStub);
  });
});
