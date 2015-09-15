describe('template context methods', function() {
  'use strict';

  beforeEach(function() {
    this.templateStub = this.sinon.stub();
    this.templateContext = {foo: this.sinon.stub()};
    this.templateContextFn = this.sinon.stub().returns(this.templateContext);
    this.modelData = {bar: 'baz'};
    this.model = new Backbone.Model(this.modelData);
  });

  describe('composite view', function() {
    describe('when rendering with no model or collection and a templateContext is found', function() {
      beforeEach(function() {
        this.View = Marionette.CompositeView.extend({
          templateContext: this.templateContext,
          template: this.templateStub
        });

        this.view = new this.View();
        this.view.render();
      });

      it('should include the template context in the data object', function() {
        expect(this.templateStub).to.have.been.calledOnce.and.calledWith(this.templateContext);
      });
    });
  });

  describe('item view', function() {
    describe('when rendering with no model or collection and a templateContext is found', function() {
      beforeEach(function() {
        this.View = Marionette.View.extend({
          templateContext: this.templateContext,
          template: this.templateStub
        });

        this.view = new this.View();
        this.view.render();
      });

      it('should include the template context in the data object', function() {
        expect(this.templateStub).to.have.been.calledOnce.and.calledWith(this.templateContext);
      });
    });

    describe('when rendering with a model, and a templateContext is found', function() {
      beforeEach(function() {
        this.View = Marionette.View.extend({
          templateContext: this.templateContext,
          template: this.templateStub
        });

        this.view = new this.View({
          model: this.model
        });

        this.view.render();
      });

      it('should include the template context in the data object', function() {
        expect(this.templateStub.lastCall.args[0]).to.contain(this.templateContext);
      });

      it('should still have the data from the model', function() {
        expect(this.templateStub.lastCall.args[0]).to.contain(this.modelData);
      });
    });

    describe('when rendering and a templateContext is found as a function', function() {
      beforeEach(function() {
        this.View = Marionette.View.extend({
          templateContext: this.templateContextFn,
          template: this.templateStub
        });

        this.view = new this.View({
          model: this.model
        });

        this.view.render();
      });

      it('should include the template context in the data object', function() {
        expect(this.templateStub.lastCall.args[0]).to.contain(this.templateContext);
      });

      it('should still have the data from the model', function() {
        expect(this.templateStub.lastCall.args[0]).to.contain(this.modelData);
      });

      it('should maintain the view as the context for the templateContext function', function() {
        expect(this.templateContextFn).to.have.been.calledOnce.and.calledOn(this.view);
      });
    });

    describe('when templateContext is provided to constructor options', function() {
      beforeEach(function() {
        this.View = Marionette.View.extend({
          template: this.templateStub
        });

        this.view = new this.View({
          templateContext: this.templateContext,
          model: this.model
        });

        this.view.render();
      });

      it('should include the template context in the data object', function() {
        expect(this.templateStub.lastCall.args[0]).to.contain(this.templateContext);
      });

      it('should still have the data from the model', function() {
        expect(this.templateStub.lastCall.args[0]).to.contain(this.modelData);
      });
    });
  });
});
