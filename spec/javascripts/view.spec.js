describe("base view", function(){
  describe("when initializing a view", function(){
    var fooHandler;

    beforeEach(function(){
      fooHandler = jasmine.createSpy();
      
      var view = Backbone.Marionette.View.extend({
        initialize: function(){
          this.bindTo(this.model, "foo", fooHandler);
        }
      });

      var model = new Backbone.Model();

      new view({
        model: model
      });

      model.trigger("foo");
    });

    it("should allow event to be bound via event binder", function(){
      expect(fooHandler).toHaveBeenCalled();
    });
  });
});
