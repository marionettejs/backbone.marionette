describe("template helper methods", function(){
  describe("when serializing data with no model or collection and a templateHelpers is found", function(){
    var View = Backbone.Marionette.View.extend({
      templateHelpers: {
        foo: function(){}
      }
    });

    var data;

    beforeEach(function(){
      var view = new View();
      data = view.serializeData();
    });

    it('should include the template helpers in the data object', function(){
      expect(data.foo).not.toBeUndefined();
    });
  });

  describe("when serializing data with a model, and a templateHelpers is found", function(){
    var View = Backbone.Marionette.View.extend({
      templateHelpers: {
        foo: function(){}
      }
    });

    var data;

    beforeEach(function(){
      var model = new Backbone.Model({bar: "baz"});
      var view = new View({ model:model });
      data = view.serializeData();
    });

    it('should include the template helpers in the data object', function(){
      expect(data.foo).not.toBeUndefined();
    });

    it('should still have the data from the model', function(){
      expect(data.bar).toBe("baz");
    });
  });

  describe("when serializing data and a templateHelpers is found as a function", function(){
    var view, data, context;

    var View = Backbone.Marionette.View.extend({
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
      data = view.serializeData();
    });

    it('should include the template helpers in the data object', function(){
      expect(data.foo).not.toBeUndefined();
    });

    it('should still have the data from the model', function(){
      expect(data.bar).toBe("baz");
    });

    it('should maintain the view as the context for the templateHelpers function', function(){
      expect(context).toBe(view);
    });
  });
});
