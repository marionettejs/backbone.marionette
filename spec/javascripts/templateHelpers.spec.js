describe('template helper methods', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('composite view', function() {
    describe('when rendering with no model or collection and a templateHelpers is found', function() {
      var View, view, data;

      beforeEach(function() {
        View = Backbone.Marionette.CompositeView.extend({
          templateHelpers: {
            foo: function() {}
          },

          template: function(d) {
            data = d;
          }
        });

        view = new View();
        view.render();
      });

      it('should include the template helpers in the data object', function() {
        expect(data.foo).to.exist;
      });
    });
  });

  describe('item view', function() {
    describe('when rendering with no model or collection and a templateHelpers is found', function() {
      var View, view, renderData;

      beforeEach(function() {
        View = Backbone.Marionette.ItemView.extend({
          template: function(data) {
            renderData = data;
          },
          templateHelpers: {
            foo: function() {}
          }
        });

        view = new View();
        view.render();
      });

      it('should include the template helpers in the data object', function() {
        expect(renderData.foo).to.exist;
      });
    });

    describe('when rendering with a model, and a templateHelpers is found', function() {
      var View, model, view, renderData;

      beforeEach(function() {
        View = Backbone.Marionette.ItemView.extend({
          template: function(data) {
            renderData = data;
          },
          templateHelpers: {
            foo: function() {}
          }
        });

        model = new Backbone.Model({bar: 'baz'});
        view = new View({model: model});
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
      var View, view, model;

      beforeEach(function() {
        View = Backbone.Marionette.ItemView.extend({
          template: function() {},
          templateHelpers: function() {}
        });

        model = new Backbone.Model({bar: 'baz'});
        view = new View({model: model});
        this.sinon.spy(view, 'template');
        this.sinon.stub(view, 'templateHelpers').returns({foo: function() {}});
        view.render();
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
      var View, view, model;

      beforeEach(function() {
        View = Backbone.Marionette.ItemView.extend({
          template: function() {}
        });

        model = new Backbone.Model({bar: 'baz'});

        view = new View({
          model: model,
          templateHelpers: {
            foo: function() {}
          }
        });

        this.sinon.spy(view, 'template');
        view.render();
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
