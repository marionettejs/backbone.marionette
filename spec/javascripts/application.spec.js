describe("marionette application", function(){

  describe("when registering an initializer and starting the application", function(){
    var MyModule, MyApp;
    var someOptions = {};

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      MyModule = (function(MyApp){
        var module = {};
        module.initializer = function(options){
          module.options = options;
          module.context = this;
        };

        spyOn(module, "initializer").andCallThrough();
        MyApp.addInitializer(module.initializer);

        return module
      })(MyApp);

      spyOn(MyApp, "trigger").andCallThrough();

      MyApp.start(someOptions);
    });

    it("should notify me before initialization starts", function(){
      expect(MyApp.trigger).toHaveBeenCalledWith("initialize:before", someOptions);
    });

    it("should notify me after initialization", function(){
      expect(MyApp.trigger).toHaveBeenCalledWith("initialize:after", someOptions);
    });

    it("should call the initializer", function(){
      expect(MyModule.initializer).toHaveBeenCalled();
    });

    it("should pass the options through to the initializer", function(){
      expect(MyModule.options).toEqual(someOptions);
    });

    it("should run the initializer with the context of the app object", function(){
      expect(MyModule.context).toEqual(MyApp);
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
