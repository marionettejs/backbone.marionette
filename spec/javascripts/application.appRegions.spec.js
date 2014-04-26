describe('application regions', function() {
  'use strict';

  describe('when adding region selectors to an app, and starting the app', function() {
    var MyApp = new Backbone.Marionette.Application();

    beforeEach(function() {
      setFixtures('<div id="region"></div>');
      setFixtures('<div id="region2"></div>');

      MyApp.addRegions({
        MyRegion: '#region',
        anotherRegion: 'region2'
      });

      MyApp.start();
    });

    it('should initialize the regions', function() {
      expect(MyApp.MyRegion).not.toBeUndefined();
      expect(MyApp.anotherRegion).not.toBeUndefined();
    });
  });

  describe('when adding region objects to an app', function() {
    var MyApp = new Backbone.Marionette.Application();

    var MyRegion = Backbone.Marionette.Region.extend({
      el: '#region',
      Foooooooo: 'bar'
    });

    var MyRegion2 = Backbone.Marionette.Region.extend({
      el: '#region2'
    });

    beforeEach(function() {
      setFixtures('<div id="region"></div>');
      setFixtures('<div id="region2"></div>');

      MyApp.addRegions({
        MyRegion: MyRegion,
        anotherRegion: MyRegion2
      });
    });

    it('should initialize the regions, immediately', function() {
      expect(MyApp.MyRegion instanceof MyRegion).toBe(true);
      expect(MyApp.anotherRegion instanceof MyRegion2).toBe(true);
    });
  });

  describe('when adding custom region classes to an app, with selectors', function() {
    var MyApp = new Backbone.Marionette.Application();
    var MyRegion = Backbone.Marionette.Region.extend({});

    beforeEach(function() {
      setFixtures('<div id="region"></div>');
      setFixtures('<div id="region2"></div>');

      MyApp.addRegions({
        MyRegion: {
          selector: '#region',
          regionClass: MyRegion,
          specialOption: true
        }
      });
    });

    it('should initialize the regions, immediately', function() {
      expect(MyApp.MyRegion).not.toBeUndefined();
    });

    it('should create an instance of the specified region class', function() {
      expect(MyApp.MyRegion).toBeInstanceOf(MyRegion);
    });

    it('should set the specified selector', function() {
      expect(MyApp.MyRegion.el).toBe('#region');
    });

    it('should pass extra options to the custom regionClass', function() {
      expect(MyApp.MyRegion).toHaveOwnProperty('options');
      expect(MyApp.MyRegion.options).toHaveOwnProperty('specialOption');
      expect(MyApp.MyRegion.options.specialOption).toBeTruthy();
    });
  });

  describe('when an app has a region', function() {
    var app;

    beforeEach(function() {
      app = new Marionette.Application();
      app.addRegions({
        r1: '#region1'
      });
    });

    it('should make the region available as a named attribute', function() {
      expect(app.r1).not.toBeUndefined();
    });

    it('should be able to retrieve the region', function() {
      expect(app.getRegion('r1')).toBe(app.r1);
    });
  });

  describe('when destroying all regions in the app', function() {
    var r1, r2;

    beforeEach(function() {
      var app = new Backbone.Marionette.Application();

      setFixtures('<div id="region"></div>');
      setFixtures('<div id="r2"></div>');

      app.addRegions({
        myRegion: '#region',
        r2: '#r2'
      });

      r1 = app.myRegion;
      r2 = app.r2;

      spyOn(r1, 'destroy').andCallThrough();
      spyOn(r2, 'destroy').andCallThrough();

      app.destroyRegions();
    });

    it('should destroy the regions', function() {
      expect(r1.destroy).toHaveBeenCalled();
      expect(r2.destroy).toHaveBeenCalled();
    });
  });
});
