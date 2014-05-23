describe('template helper methods', function() {
  'use strict';
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('composite view', function() {
    describe('when rendering with no model or collection and a templateHelpers is found', function() {
      beforeEach(function() {
        var suite = this;

        this.View = Backbone.Marionette.CompositeView.extend({
          templateHelpers: {
            foo: function() {}
          },

          template: function(d) {
            suite.data = d;
          }
        });

        this.view = new this.View();
        this.view.render();
      });

      it('should include the template helpers in the data object', function() {
        expect(this.data.foo).to.exist;
      });
    });
  });

  describe('item view', function() {
    describe('when rendering with no model or collection and a templateHelpers is found', function() {
      beforeEach(function() {
        var suite = this;

        this.View = Backbone.Marionette.ItemView.extend({
          template: function(data) {
            suite.renderData = data;
          },
          templateHelpers: {
            foo: function() {}
          }
        });

        this.view = new this.View();
        this.view.render();
      });

      it('should include the template helpers in the data object', function() {
        expect(this.renderData.foo).to.exist;
      });
    });

    describe('when rendering with a model, and a templateHelpers is found', function() {
      beforeEach(function() {
        var suite = this;

        this.View = Backbone.Marionette.ItemView.extend({
          template: function(data) {
            suite.renderData = data;
          },
          templateHelpers: {
            foo: function() {}
          }
        });

        this.model = new Backbone.Model({bar: 'baz'});
        this.view = new this.View({model: this.model});
        this.view.render();
      });

      it('should include the template helpers in the data object', function() {
        expect(this.renderData.foo).to.exist;
      });

      it('should still have the data from the model', function() {
        expect(this.renderData.bar).to.equal('baz');
      });
    });

    describe('when rendering and a templateHelpers is found as a function', function() {
      beforeEach(function() {
        this.View = Backbone.Marionette.ItemView.extend({
          template: function() {},
          templateHelpers: function() {}
        });

        this.model = new Backbone.Model({bar: 'baz'});
        this.view = new this.View({model: this.model});
        this.sinon.spy(this.view, 'template');
        this.sinon.stub(this.view, 'templateHelpers').returns({foo: function() {}});
        this.view.render();

        this.firstArg = this.view.template.args[0][0];
      });

      it('should include the template helpers in the data object', function() {
        expect(this.firstArg.foo).to.exist;
      });

      it('should still have the data from the model', function() {
        expect(this.firstArg.bar).to.equal('baz');
      });

      it('should maintain the view as the context for the templateHelpers function', function() {
        expect(this.view.templateHelpers).to.have.been.calledOn(this.view);
      });
    });

    describe('when templateHelpers is provided to constructor options', function() {
      beforeEach(function() {
        this.View = Backbone.Marionette.ItemView.extend({
          template: function() {}
        });

        this.model = new Backbone.Model({bar: 'baz'});

        this.view = new this.View({
          model: this.model,
          templateHelpers: {
            foo: function() {}
          }
        });

        this.sinon.spy(this.view, 'template');
        this.view.render();

        this.firstArg = this.view.template.args[0][0];
      });

      it('should include the template helpers in the data object', function() {
        expect(this.firstArg.foo).to.exist;
      });

      it('should still have the data from the model', function() {
        expect(this.firstArg.bar).to.equal('baz');
      });
    });
  });
});
