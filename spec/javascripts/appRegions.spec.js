describe("application regions", function(){
  "use strict";

  describe("when adding region selectors to an app, and starting the app", function(){
    var MyApp = new Backbone.Marionette.Application();

    beforeEach(function(){
      setFixtures("<div id='region'></div>");
      setFixtures("<div id='region2'></div>");

      MyApp.addRegions({
        MyRegion: "#region", 
        anotherRegion: "region2"
      });

      MyApp.start();
    });
    
    it("should initialize the regions", function(){
      expect(MyApp.MyRegion).not.toBeUndefined();
      expect(MyApp.anotherRegion).not.toBeUndefined();
    });
  });

  describe("when adding region objects to an app", function(){
    var MyApp = new Backbone.Marionette.Application();

    var myRegion = Backbone.Marionette.Region.extend({
      el: "#region",
      Foooooooo: "bar"
    });

    var myRegion2 = Backbone.Marionette.Region.extend({
      el: "#region2"
    });

    beforeEach(function(){
      setFixtures("<div id='region'></div>");
      setFixtures("<div id='region2'></div>");

      MyApp.addRegions({
        MyRegion: myRegion, 
        anotherRegion: myRegion2
      });
    });
    
    it("should initialize the regions, immediately", function(){
      expect(MyApp.MyRegion).not.toBeUndefined();
      expect(MyApp.anotherRegion).not.toBeUndefined();
    });
  });

  describe("when adding custom region types to an app, with selectors", function(){
    var MyApp = new Backbone.Marionette.Application();
    var MyRegion = Backbone.Marionette.Region.extend({});

    beforeEach(function(){
      setFixtures("<div id='region'></div>");
      setFixtures("<div id='region2'></div>");

      MyApp.addRegions({
        MyRegion: {
          selector: '#region',
          regionType: MyRegion
        }
      });
    });
    
    it("should initialize the regions, immediately", function(){
      expect(MyApp.MyRegion).not.toBeUndefined();
    });

    it("should create an instance of the specified region type", function(){
      expect(MyApp.MyRegion).toBeInstanceOf(MyRegion);
    });

    it("should set the specified selector", function(){
      expect(MyApp.MyRegion.el).toBe("#region");
    });
  });

});
