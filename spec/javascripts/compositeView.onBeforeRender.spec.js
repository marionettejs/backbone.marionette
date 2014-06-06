describe('composite view - on before render', function() {
  'use strict';

  beforeEach(function() {
    this.onBeforeRenderStub = this.sinon.stub();
    this.renderRootStub = this.sinon.stub();

    this.CompositeView = Marionette.CompositeView.extend({
      onBeforeRender: this.onBeforeRenderStub,
      _renderRoot: this.renderRootStub
    });

    this.compositeView = new this.CompositeView();
    this.compositeView.render();
  });

  it('should call onBeforeRender before rendering the model', function() {
    expect(this.renderRootStub).to.have.been.calledAfter(this.onBeforeRenderStub);
  });
});
