describe('application regions', function() {
  'use strict';

  describe('when adding region selectors to an app, and starting the app', function() {
    beforeEach(function() {
      this.MyApp = new Backbone.Marionette.Application();

      this.setFixtures('<div id="region"></div>');
      this.setFixtures('<div id="region2"></div>');

      this.beforeAddHandler = this.sinon.spy();
      this.addHandler = this.sinon.spy();

      this.MyApp.on('before:add:region', this.beforeAddHandler);
      this.MyApp.on('add:region', this.addHandler);

      this.MyApp.addRegions({
        MyRegion: '#region',
        anotherRegion: 'region2'
      });

      this.MyApp.start();
    });

    it('should initialize the regions', function() {
      expect(this.MyApp.MyRegion).to.exist;
      expect(this.MyApp.anotherRegion).to.exist;
    });

    it('should trigger a before:add:region event', function() {
      expect(this.beforeAddHandler).to.have.been.calledWith('MyRegion');
    });

    it('should trigger a add:region event', function() {
      expect(this.addHandler).to.have.been.calledWith('MyRegion');
    });
  });

  describe('when adding region objects to an app', function() {
    beforeEach(function() {
      this.MyApp = new Backbone.Marionette.Application();

      this.MyRegion = Backbone.Marionette.Region.extend({
        el: '#region',
        Foooooooo: 'bar'
      });

      this.MyRegion2 = Backbone.Marionette.Region.extend({
        el: '#region2'
      });

      this.setFixtures('<div id="region"></div>');
      this.setFixtures('<div id="region2"></div>');

      this.MyApp.addRegions({
        MyRegion: this.MyRegion,
        anotherRegion: this.MyRegion2
      });
    });

    it('should initialize the regions, immediately', function() {
      expect(this.MyApp.MyRegion instanceof this.MyRegion).to.be.true;
      expect(this.MyApp.anotherRegion instanceof this.MyRegion2).to.be.true;
    });
  });

  describe('when adding custom region classes to an app, with selectors', function() {
    beforeEach(function() {
      this.MyApp = new Backbone.Marionette.Application();
      this.MyRegion = Backbone.Marionette.Region.extend({});

      this.setFixtures('<div id="region"></div>');
      this.setFixtures('<div id="region2"></div>');

      this.MyApp.addRegions({
        MyRegion: {
          selector: '#region',
          regionClass: this.MyRegion,
          specialOption: true
        }
      });
    });

    it('should initialize the regions, immediately', function() {
      expect(this.MyApp.MyRegion).to.exist;
    });

    it('should create an instance of the specified region class', function() {
      expect(this.MyApp.MyRegion).to.be.instanceof(this.MyRegion);
    });

    it('should set the specified selector', function() {
      expect(this.MyApp.MyRegion.$el.selector).to.equal('#region');
    });

    it('should pass extra options to the custom regionClass', function() {
      expect(this.MyApp.MyRegion).to.have.property('options');
      expect(this.MyApp.MyRegion.options).to.have.property('specialOption');
      expect(this.MyApp.MyRegion.options.specialOption).to.be.ok;
    });
  });

  describe('when an app has a region', function() {
    beforeEach(function() {
      this.app = new Marionette.Application();
      this.app.addRegions({
        r1: '#region1'
      });
    });

    it('should make the region available as a named attribute', function() {
      expect(this.app.r1).to.exist;
    });

    it('should be able to retrieve the region', function() {
      expect(this.app.getRegion('r1')).to.equal(this.app.r1);
    });
  });

  describe('when destroying all regions in the app', function() {
    beforeEach(function() {
      this.app = new Backbone.Marionette.Application();

      this.setFixtures('<div id="region"></div>');
      this.setFixtures('<div id="r2"></div>');

      this.app.addRegions({
        myRegion: '#region',
        r2: '#r2'
      });

      this.r1 = this.app.myRegion;
      this.r2 = this.app.r2;

      this.sinon.spy(this.r1, 'empty');
      this.sinon.spy(this.r2, 'empty');

      this.app.emptyRegions();
    });

    it('should empty the regions', function() {
      expect(this.r1.empty).to.have.been.called;
      expect(this.r2.empty).to.have.been.called;
    });
  });

  describe('when removing a region', function() {
    beforeEach(function() {
      this.MyApp = new Backbone.Marionette.Application();

      this.setFixtures('<div id="region"></div>');
      this.setFixtures('<div id="region2"></div>');

      this.beforeRemoveHandler = this.sinon.spy();
      this.removeHandler = this.sinon.spy();

      this.MyApp.on('before:remove:region', this.beforeRemoveHandler);
      this.MyApp.on('remove:region', this.removeHandler);

      this.MyApp.addRegions({
        MyRegion: '#region',
        anotherRegion: 'region2'
      });

      this.MyApp.start();

      this.MyApp.removeRegion('MyRegion');
    });

    it('should remove the region', function() {
      expect(this.MyApp.MyRegion).to.be.undefined;
    });

    it('should trigger a before:remove:region event', function() {
      expect(this.beforeRemoveHandler).to.have.been.calledWith('MyRegion');
    });

    it('should trigger a remove:region event', function() {
      expect(this.removeHandler).to.have.been.calledWith('MyRegion');
    });
  });
});
