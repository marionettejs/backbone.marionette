describe("event binder", function(){
  describe("given an event binder has been added to an object", function(){

    describe("when binding an event with no context specified, then triggering that event", function(){
      var obj, context;

      beforeEach(function(){
        var model = new Backbone.Model();

        obj = {};
        Marionette.addEventBinder(obj);

        obj.bindTo(model, "foo", function(){
          context = this;
        });

        model.trigger("foo");
      });

      it("should execute in the context of the object that has the event binder attached to it", function(){
        expect(context).toBe(obj);
      });

    });

  });
});
