describe("marionette application", function(){

  describe("when registering an initializer and starting the application", function(){
    var MyModule, MyApp;
    var options = {};

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      MyModule = (function(MyApp){
        var module = {};
        module.initializer = function(options){
          module.options = options;
        };

        spyOn(module, "initializer").andCallThrough();
        MyApp.addInitializer(module.initializer);

        return module
      })(MyApp);

      MyApp.start(options);
    });

    it("should call the initializer", function(){
      expect(MyModule.initializer).toHaveBeenCalled();
    });

    it("should pass the options through to the initializer", function(){
      expect(MyModule.options).toEqual(options);
    });
  });

  describe("when instantiating an app with options specified", function(){
    var MyApp;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application({
        someOption: "some value"
      });
    });

    it("should merge those options into the app", function(){
      expect(MyApp.someOption).toEqual("some value");
    });
  });

});
