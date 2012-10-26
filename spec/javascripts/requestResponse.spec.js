describe("application request/response", function(){
  "use strict";

  describe("when creating an instance of an Application", function(){
    var App;

    beforeEach(function(){
      App = new Marionette.Application();
    });

    it("should provide request/response framework", function(){
      expect(App.reqres).toBeInstanceOf(Backbone.Wreqr.RequestResponse);
    });

    it("should allow direct request", function(){
      expect(typeof App.request).toBe("function");
    });

  });

});
