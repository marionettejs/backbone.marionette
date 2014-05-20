describe('application regions', function() {
  'use strict';

  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when adding region selectors to an app, and starting the app', function() {
    var MyApp, addHandler, beforeAddHandler;

    MyApp = new Backbone.Marionette.Application();

    beforeEach(function() {
      this.setFixtures('<div id="region"></div>');
      this.setFixtures('<div id="region2"></div>');

      beforeAddHandler = sinon.spy();
      addHandler = sinon.spy();

      MyApp.on('before:add:region', beforeAddHandler);
      MyApp.on('add:region', addHandler);

      MyApp.addRegions({
        MyRegion: '#region',
        anotherRegion: 'region2'
      });

      MyApp.start();
    });

    it('should initialize the regions', function() {
      expect(MyApp.MyRegion).to.exist;
      expect(MyApp.anotherRegion).to.exist;
    });

    it('should trigger a before:add:region event', function() {
      expect(beforeAddHandler).to.have.been.calledWith('MyRegion');
    });

    it('should trigger a add:region event', function() {
      expect(addHandler).to.have.been.calledWith('MyRegion');
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
      this.setFixtures('<div id="region"></div>');
      this.setFixtures('<div id="region2"></div>');

      MyApp.addRegions({
        MyRegion: MyRegion,
        anotherRegion: MyRegion2
      });
    });

    it('should initialize the regions, immediately', function() {
      expect(MyApp.MyRegion instanceof MyRegion).to.be.true;
      expect(MyApp.anotherRegion instanceof MyRegion2).to.be.true;
    });
  });

  describe('when adding custom region classes to an app, with selectors', function() {
    var MyApp = new Backbone.Marionette.Application();
    var MyRegion = Backbone.Marionette.Region.extend({});

    beforeEach(function() {
      this.setFixtures('<div id="region"></div>');
      this.setFixtures('<div id="region2"></div>');

      MyApp.addRegions({
        MyRegion: {
          selector: '#region',
          regionClass: MyRegion,
          specialOption: true
        }
      });
    });

    it('should initialize the regions, immediately', function() {
      expect(MyApp.MyRegion).to.exist;
    });

    it('should create an instance of the specified region class', function() {
      expect(MyApp.MyRegion).to.be.instanceof(MyRegion);
    });

    it('should set the specified selector', function() {
      expect(MyApp.MyRegion.$el.selector).to.equal('#region');
    });

    it('should pass extra options to the custom regionClass', function() {
      expect(MyApp.MyRegion).to.have.property('options');
      expect(MyApp.MyRegion.options).to.have.property('specialOption');
      expect(MyApp.MyRegion.options.specialOption).to.be.ok;
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
      expect(app.r1).to.exist;
    });

    it('should be able to retrieve the region', function() {
      expect(app.getRegion('r1')).to.equal(app.r1);
    });
  });

  describe('when destroying all regions in the app', function() {
    var r1, r2;

    beforeEach(function() {
      var app = new Backbone.Marionette.Application();

      this.setFixtures('<div id="region"></div>');
      this.setFixtures('<div id="r2"></div>');

      app.addRegions({
        myRegion: '#region',
        r2: '#r2'
      });

      r1 = app.myRegion;
      r2 = app.r2;

      sinon.spy(r1, 'destroy');
      sinon.spy(r2, 'destroy');

      app.destroyRegions();
    });

    afterEach(function () {
      r1.destroy.restore();
      r2.destroy.restore();
    });

    it('should destroy the regions', function() {
      expect(r1.destroy).to.have.been.called;
      expect(r2.destroy).to.have.been.called;
    });
  });

  describe('when removing a region', function() {
    var MyApp, removeHandler, beforeRemoveHandler;

    MyApp = new Backbone.Marionette.Application();

    beforeEach(function() {
      this.setFixtures('<div id="region"></div>');
      this.setFixtures('<div id="region2"></div>');

      beforeRemoveHandler = sinon.spy();
      removeHandler = sinon.spy();

      MyApp.on('before:remove:region', beforeRemoveHandler);
      MyApp.on('remove:region', removeHandler);

      MyApp.addRegions({
        MyRegion: '#region',
        anotherRegion: 'region2'
      });

      MyApp.start();

      MyApp.removeRegion('MyRegion');
    });

    it('should remove the region', function() {
      expect(MyApp.MyRegion).to.be.undefined;
    });

    it('should trigger a before:remove:region event', function() {
      expect(beforeRemoveHandler).to.have.been.calledWith('MyRegion');
    });

    it('should trigger a remove:region event', function() {
      expect(removeHandler).to.have.been.calledWith('MyRegion');
    });
  });
});
