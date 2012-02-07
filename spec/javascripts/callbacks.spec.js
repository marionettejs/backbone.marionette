describe("callbacks", function(){

  describe("when registering callbacks and running them", function(){
    var wasCalled, secondCall;

    beforeEach(function(){
      var callbacks = new Backbone.Marionette.Callbacks();

      callbacks.add(function(){
        wasCalled = true;
      });

      callbacks.add(function(){
        secondCall = true;
      });

      callbacks.run();
    });

    it("should execute the first", function(){
      expect(wasCalled).toBeTruthy();
    });

    it("should execute the second", function(){
      expect(secondCall).toBeTruthy();
    });
  });

  describe("when running with no callbacks, and then registering callbacks", function(){
    var wasCalled, secondCall;

    beforeEach(function(){
      var callbacks = new Backbone.Marionette.Callbacks();
      callbacks.run();

      callbacks.add(function(){
        wasCalled = true;
      });

      callbacks.add(function(){
        secondCall = true;
      });
    });

    it("should execute the first", function(){
      expect(wasCalled).toBeTruthy();
    });

    it("should execute the second", function(){
      expect(secondCall).toBeTruthy();
    });
  });

});
