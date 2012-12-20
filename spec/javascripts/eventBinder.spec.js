describe("event binder", function(){
  describe("given an event binder has been added to an object", function(){
    var model, obj;

    beforeEach(function(){
      model = new Backbone.Model();

      obj = {};
      Marionette.addEventBinder(obj);
    });

    describe("when binding an event with no context specified, then triggering that event", function(){
      var context, binding;

      beforeEach(function(){
        obj.listenTo(model, "foo", function(){
          context = this;
        });

        model.trigger("foo");
      });

      it("should execute in the context of the object that has the event binder attached to it", function(){
        expect(context).toBe(obj);
      });

    });

    describe("when binding an event with a context specified, then triggering that event", function(){
      var ctx, context;

      beforeEach(function(){
        ctx = {};

        obj.listenTo(model, "foo", function(){
          context = this;
        }, ctx);

        model.trigger("foo");
      });

      it("should execute with the specified context", function(){
        expect(context).toBe(ctx);
      });

    });

  });
});
