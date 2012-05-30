describe("application modules", function(){
  describe("when specifying a module on an application", function(){
    var MyApp, myModule;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();
      myModule = MyApp.module("MyModule");
    });

    it("should add an object of that name to the app", function(){
      expect(MyApp.MyModule).not.toBeUndefined();
    });

    it("should return the module", function(){
      expect(myModule).toBe(MyApp.MyModule);
    });
  });

  describe("when specifying sub-modules with a . notation", function(){
    var MyApp, lastModule, parentModule, childModule;

    describe("and the parent module already exists", function(){
      beforeEach(function(){
        MyApp = new Backbone.Marionette.Application();
        MyApp.module("Parent");
        parentModule = MyApp.Parent;

        lastModule = MyApp.module("Parent.Child");
      });

      it("should not replace the parent module", function(){
        expect(MyApp.Parent).toBe(parentModule);
      });

      it("should create the child module on the parent module", function(){
        expect(MyApp.Parent.Child).not.toBeUndefined();
      });

      it("should return the last sub-module in the list", function(){
        expect(lastModule).toBe(MyApp.Parent.Child);
      });
    });

    describe("and the parent module does not exist", function(){
      beforeEach(function(){
        MyApp = new Backbone.Marionette.Application();
        lastModule = MyApp.module("Parent.Child");
      });

      it("should create the parent module on the application", function(){
        expect(MyApp.Parent).not.toBeUndefined;
      });

      it("should create the child module on the parent module", function(){
        expect(MyApp.Parent.Child).not.toBeUndefined;
      });

      it("should return the last sub-module in the list", function(){
        expect(lastModule).toBe(MyApp.Parent.Child);
      });
    });

    describe("and a module definition callback is provided", function(){
      var moduleCallCount;
      
      beforeEach(function(){
        moduleCallCount = 0;

        MyApp = new Backbone.Marionette.Application();
        lastModule = MyApp.module("Parent.Child", function(module){
          module.defined = true;
          moduleCallCount += 1;
        });
      });

      it("should only run the module definition once", function(){
        expect(moduleCallCount).toBe(1);
      });

      it("should not call the module definition for the parent module", function(){
        expect(MyApp.Parent.defined).toBeUndefined();
      });

      it("should call the module definition for the last module specified", function(){
        expect(MyApp.Parent.Child.defined).toBe(true);
      });
    });
  });

  describe("when speicfyin a module on an existing module", function(){
    var MyApp, MyModule, SubModule;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      MyApp.module("MyModule");
      MyApp.MyModule.module("SubModule");
    });

    it("should add the sub-module", function(){
      expect(MyApp.MyModule.SubModule).not.toBeUndefined();
    })
  });

  describe("when specifying the same module twice", function(){
    var MyApp, MyModule;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      MyApp.module("MyModule");
      MyModule = MyApp.MyModule;

      MyApp.module("MyModule");
    });

    it("should only create the module one", function(){
      expect(MyApp.MyModule).toBe(MyModule);
    });
  });

  describe("when providing a callback function as a module definition", function(){
    var MyApp, moduleArgs;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      MyApp.module("MyModule", function(){
        moduleArgs = arguments;
      });
    });

    it("should pass the module object as the first parameter", function(){
      expect(moduleArgs[0]).toBe(MyApp.MyModule);
    });

    it("should pass the application object as the second parameter", function(){
      expect(moduleArgs[1]).toBe(MyApp);
    });

    it("should pass Backbone as the third parameter", function(){
      expect(moduleArgs[2]).toBe(Backbone);
    });

    it("should pass Marionette as the fourth parameter", function(){
      expect(moduleArgs[3]).toBe(Backbone.Marionette);
    });
    
    it("should pass jQuery as the fifth parameter", function(){
      expect(moduleArgs[4]).toBe(jQuery);
    });
    
    it("should pass underscore as the sixth parameter", function(){
      expect(moduleArgs[5]).toBe(_);
    });
  });

  describe("when attaching a method to the module parameter, in the module definition", function(){
    var MyApp, myFunc;

    beforeEach(function(){
      myFunc = function(){};
      MyApp = new Backbone.Marionette.Application();

      MyApp.module("MyModule", function(myapp){
        myapp.someFunc = myFunc;
      });
    });

    it("should make that method publicly available on the module", function(){
      expect(MyApp.MyModule.someFunc).toBe(myFunc);
    });
  });

  describe("when specifying the same module, with a definition, more than once", function(){
    var MyApp, myModule;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      myModule = MyApp.module("MyModule", function(MyModule){
        MyModule.definition1 = true;
      });

      MyApp.module("MyModule", function(MyModule){
        MyModule.definition2 = true;
      });
    });

    it("should re-use the same module for all definitions", function(){
      expect(myModule).toBe(MyApp.MyModule);
    });

    it("should allow each definition to modify the resulting module", function(){
      expect(MyApp.MyModule.definition1).toBe(true);
      expect(MyApp.MyModule.definition2).toBe(true);
    });

  });

  describe("when returning an object from the module definition", function(){
    var MyApp, MyModule, CustomModule;

    beforeEach(function(){
      MyModule = {};
      MyApp = new Backbone.Marionette.Application();

      CustomModule = MyApp.module("CustomModule", function(myapp){
        return MyModule;
      });
    });

    it("should not do anything with the returned object", function(){
      expect(MyApp.CustomModule).toBe(CustomModule);
    });
  });

  describe("when creating a sub-module with the . notation, the second parameter should be the object from which .module was called", function(){
    var MyApp, MyModule;

    beforeEach(function(){
      MyModule = {};
      MyApp = new Backbone.Marionette.Application();

      MyApp.module("CustomModule.SubModule", function(CustomModule, MyApp){
        MyModule = MyApp;
      });
    });

    it("should use the returned object as the module", function(){
      expect(MyModule).toBe(MyApp);
    });
  });

});
