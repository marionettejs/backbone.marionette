describe('template helper methods', function() {
  'use strict';

  beforeEach(function() {
    this.templateStub = this.sinon.stub();
    this.templateHelpers = { foo: this.sinon.stub() };
    this.templateHelpersFn = this.sinon.stub().returns(this.templateHelpers);
    this.modelData = { bar: 'baz' };
    this.model = new Backbone.Model(this.modelData);
  });

  describe('composite view', function() {
    describe('when rendering with no model or collection and a templateHelpers is found', function() {
      beforeEach(function() {
        this.View = Marionette.CompositeView.extend({
          templateHelpers: this.templateHelpers,
          template: this.templateStub
        });

        this.view = new this.View();
        this.view.render();
      });

      it('should include the template helpers in the data object', function() {
        expect(this.templateStub).to.have.been.calledOnce.and.calledWith(this.templateHelpers);
      });
    });
  });

  describe('item view', function() {
    describe('when rendering with no model or collection and a templateHelpers is found', function() {
      beforeEach(function() {
        this.View = Marionette.ItemView.extend({
          templateHelpers: this.templateHelpers,
          template: this.templateStub
        });

        this.view = new this.View();
        this.view.render();
      });

      it('should include the template helpers in the data object', function() {
        expect(this.templateStub).to.have.been.calledOnce.and.calledWith(this.templateHelpers);
      });
    });

    describe('when rendering with a model, and a templateHelpers is found', function() {
      beforeEach(function() {
        this.View = Marionette.ItemView.extend({
          templateHelpers: this.templateHelpers,
          template: this.templateStub
        });

        this.view = new this.View({
          model: this.model
        });

        this.view.render();
      });

      it('should include the template helpers in the data object', function() {
        expect(this.templateStub.lastCall.args[0]).to.contain(this.templateHelpers);
      });

      it('should still have the data from the model', function() {
        expect(this.templateStub.lastCall.args[0]).to.contain(this.modelData);
      });
    });

    describe('when rendering and a templateHelpers is found as a function', function() {
      beforeEach(function() {
        this.View = Marionette.ItemView.extend({
          templateHelpers: this.templateHelpersFn,
          template: this.templateStub
        });

        this.view = new this.View({
          model: this.model
        });

        this.view.render();
      });

      it('should include the template helpers in the data object', function() {
        expect(this.templateStub.lastCall.args[0]).to.contain(this.templateHelpers);
      });

      it('should still have the data from the model', function() {
        expect(this.templateStub.lastCall.args[0]).to.contain(this.modelData);
      });

      it('should maintain the view as the context for the templateHelpers function', function() {
        expect(this.templateHelpersFn).to.have.been.calledOnce.and.calledOn(this.view);
      });
    });

    describe('when templateHelpers is provided to constructor options', function() {
      beforeEach(function() {
        this.View = Marionette.ItemView.extend({
          template: this.templateStub
        });

        this.view = new this.View({
          templateHelpers: this.templateHelpers,
          model: this.model
        });

        this.view.render();
      });

      it('should include the template helpers in the data object', function() {
        expect(this.templateStub.lastCall.args[0]).to.contain(this.templateHelpers);
      });

      it('should still have the data from the model', function() {
        expect(this.templateStub.lastCall.args[0]).to.contain(this.modelData);
      });
    });
  });
});
