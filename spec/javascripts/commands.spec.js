describe("application commands", function(){

  describe("when creating an instance of an Application", function(){
    var App;

    beforeEach(function(){
      App = new Marionette.Application();
    });

    it("should provide command execution framework", function(){
      expect(App.commands).toBeInstanceOf(Backbone.Wreqr.Commands);
    });

    it("should allow execution of commands directly", function(){
      expect(typeof App.execute).toBe("function");
    });

  });

});
