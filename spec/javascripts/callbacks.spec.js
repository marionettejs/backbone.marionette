describe("callbacks", function(){

  describe("when registering callbacks and running them", function(){
    var wasCalled, secondCall, 
        options, specifiedOptions, 
        context, specifiedContext;

    beforeEach(function(){
      var callbacks = new Backbone.Marionette.Callbacks();
      specifiedOptions = {};
      specifiedContext = {};

      callbacks.add(function(opts){
        wasCalled = true;
        options = opts;
        context = this;
      });

      callbacks.add(function(){
        secondCall = true;
      });

      callbacks.run(specifiedContext, specifiedOptions);
    });

    it("should execute the first", function(){
      expect(wasCalled).toBeTruthy();
    });

    it("should execute the second", function(){
      expect(secondCall).toBeTruthy();
    });

    it("should pass the options along", function(){
      expect(options).toBe(specifiedOptions);
    });

    it("should execute in the specified context", function(){
      expect(context).toBe(specifiedContext);
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
