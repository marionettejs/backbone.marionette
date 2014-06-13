describe('template helper methods', function() {
  'use strict';

  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('composite view', function() {

    describe('when rendering with no model or collection and a templateHelpers is found', function() {
      var data;

      var View = Backbone.Marionette.CompositeView.extend({
        templateHelpers: {
          foo: function() {}
        },

        template: function(d) {
          data = d;
        }
      });

      beforeEach(function() {
        var view = new View();
        view.render();
      });

      it('should include the template helpers in the data object', function() {
        expect(data.foo).to.exist;
      });
    });

  });

  describe('item view', function() {

    describe('when rendering with no model or collection and a templateHelpers is found', function() {
      var renderData;

      var View = Backbone.Marionette.ItemView.extend({
        template: function(data) {
          renderData = data;
        },
        templateHelpers: {
          foo: function() {}
        }
      });

      beforeEach(function() {
        var view = new View();
        view.render();
      });

      it('should include the template helpers in the data object', function() {
        expect(renderData.foo).to.exist;
      });
    });

    describe('when rendering with a model, and a templateHelpers is found', function() {
      var renderData;

      var View = Backbone.Marionette.ItemView.extend({
        template: function(data) {
          renderData = data;
        },
        templateHelpers: {
          foo: function() {}
        }
      });

      beforeEach(function() {
        var model = new Backbone.Model({bar: 'baz'});
        var view = new View({model: model});
        view.render();
      });

      it('should include the template helpers in the data object', function() {
        expect(renderData.foo).to.exist;
      });

      it('should still have the data from the model', function() {
        expect(renderData.bar).to.equal('baz');
      });
    });

    describe('when rendering and a templateHelpers is found as a function', function() {
      var view;

      var View = Backbone.Marionette.ItemView.extend({
        template: function() {},
        templateHelpers: function() {}
      });

      beforeEach(function() {
        var model = new Backbone.Model({bar: 'baz'});
        view = new View({model: model});
        sinon.spy(view, 'template');
        sinon.stub(view, 'templateHelpers').returns({foo: function() {}});
        view.render();
      });

      afterEach(function() {
        view.template.restore();
        view.templateHelpers.restore();
      });

      it('should include the template helpers in the data object', function() {
        var firstArg = view.template.args[0][0];
        expect(firstArg.foo).to.exist;
      });

      it('should still have the data from the model', function() {
        var firstArg = view.template.args[0][0];
        expect(firstArg.bar).to.equal('baz');
      });

      it('should maintain the view as the context for the templateHelpers function', function() {
        expect(view.templateHelpers).to.have.been.calledOn(view);
      });
    });

    describe('when templateHelpers is provided to constructor options', function() {
      var view;

      var View = Backbone.Marionette.ItemView.extend({
        template: function() {}
      });

      beforeEach(function() {
        var model = new Backbone.Model({bar: 'baz'});

        view = new View({
          model: model,
          templateHelpers: {
            foo: function() {}
          }
        });

        sinon.spy(view, 'template');
        view.render();
      });

      afterEach(function() {
        view.template.restore();
      });

      it('should include the template helpers in the data object', function() {
        var firstArg = view.template.args[0][0];
        expect(firstArg.foo).to.exist;
      });

      it('should still have the data from the model', function() {
        var firstArg = view.template.args[0][0];
        expect(firstArg.bar).to.equal('baz');
      });
    });

  });

});
