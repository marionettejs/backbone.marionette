describe("template helper methods", function(){
  "use strict";

  describe("composite view", function(){

    describe("when rendering with no model or collection and a templateHelpers is found", function(){
      var data;

      var View = Backbone.Marionette.CompositeView.extend({
        templateHelpers: {
          foo: function(){}
        },

        template: function(d){
          data = d;
        }
      });

      beforeEach(function(){
        var view = new View();
        view.render();
      });

      it('should include the template helpers in the data object', function(){
        expect(data.foo).not.toBeUndefined();
      });
    });

  });

  describe("item view", function(){

    describe("when rendering with no model or collection and a templateHelpers is found", function(){
      var renderData;

      var View = Backbone.Marionette.ItemView.extend({
        template: function(data){
          renderData = data;
        },
        templateHelpers: {
          foo: function(){}
        }
      });

      beforeEach(function(){
        var view = new View();
        view.render();
      });

      it('should include the template helpers in the data object', function(){
        expect(renderData.foo).not.toBeUndefined();
      });
    });

    describe("when rendering with a model, and a templateHelpers is found", function(){
      var renderData;

      var View = Backbone.Marionette.ItemView.extend({
        template: function(data){
          renderData = data;
        },
        templateHelpers: {
          foo: function(){}
        }
      });

      beforeEach(function(){
        var model = new Backbone.Model({bar: "baz"});
        var view = new View({ model:model });
        view.render();
      });

      it('should include the template helpers in the data object', function(){
        expect(renderData.foo).not.toBeUndefined();
      });

      it('should still have the data from the model', function(){
        expect(renderData.bar).toBe("baz");
      });
    });

    describe("when rendering and a templateHelpers is found as a function", function(){
      var view, renderData, context;

      var View = Backbone.Marionette.ItemView.extend({
        template: function(data){
          renderData = data;
        },

        templateHelpers: function(){
          context = this;
          return {
            foo: function(){}
          }
        }
      });

      beforeEach(function(){
        var model = new Backbone.Model({bar: "baz"});
        view = new View({ model:model });
        view.render();
      });

      it('should include the template helpers in the data object', function(){
        expect(renderData.foo).not.toBeUndefined();
      });

      it('should still have the data from the model', function(){
        expect(renderData.bar).toBe("baz");
      });

      it('should maintain the view as the context for the templateHelpers function', function(){
        expect(context).toBe(view);
      });
    });

  });

});
