describe('application regions', function() {
  'use strict';

  describe('when adding region selectors to an app, and starting the app', function() {
    beforeEach(function() {
      this.app = new Marionette.Application();

      this.beforeAddRegionStub = this.sinon.stub();
      this.addRegionStub = this.sinon.stub();
      this.app.on('before:add:region', this.beforeAddRegionStub);
      this.app.on('add:region', this.addRegionStub);

      this.app.addRegions({
        fooRegion: '#foo-region',
        barRegion: '#bar-region'
      });
      this.app.start();
    });

    it('should initialize the regions', function() {
      expect(this.app.fooRegion).to.exist;
      expect(this.app.barRegion).to.exist;
    });

    it('should trigger a before:add:region event', function() {
      expect(this.beforeAddRegionStub).to.have.been.calledWith('fooRegion');
    });

    it('should trigger a add:region event', function() {
      expect(this.addRegionStub).to.have.been.calledWith('barRegion');
    });
  });

  describe('when adding region objects to an app', function() {
    beforeEach(function() {
      this.app = new Marionette.Application();
      this.FooRegion = Marionette.Region.extend({ el: '#foo-region' });
      this.BarRegion = Marionette.Region.extend({ el: '#bar-region' });

      this.app.addRegions({
        fooRegion: this.FooRegion,
        barRegion: this.BarRegion
      });
    });

    it('should initialize the regions, immediately', function() {
      expect(this.app.fooRegion).to.be.instanceof(this.FooRegion);
      expect(this.app.barRegion).to.be.instanceof(this.BarRegion);
    });
  });

  describe('when adding custom region classes to an app, with selectors', function() {
    beforeEach(function() {
      this.fooOption = 'bar';
      this.fooSelector = '#foo-region';
      this.app = new Marionette.Application();
      this.FooRegion = Marionette.Region.extend();

      this.app.addRegions({
        fooRegion: {
          selector: this.fooSelector,
          regionClass: this.FooRegion,
          fooOption: this.fooOption
        }
      });
    });

    it('should initialize the regions, immediately', function() {
      expect(this.app.fooRegion).to.exist;
    });

    it('should create an instance of the specified region class', function() {
      expect(this.app.fooRegion).to.be.instanceof(this.FooRegion);
    });

    it('should set the specified selector', function() {
      expect(this.app.fooRegion.$el.selector).to.equal('#foo-region');
    });

    it('should pass extra options to the custom regionClass', function() {
      expect(this.app.fooRegion).to.have.deep.property('options.fooOption', this.fooOption);
    });
  });

  describe('when an app has a region', function() {
    beforeEach(function() {
      this.app = new Marionette.Application();
      this.app.addRegions({
        fooRegion: '#foo-region'
      });
    });

    it('should make the region available as a named attribute', function() {
      expect(this.app.fooRegion).to.exist;
    });

    it('should be able to retrieve the region', function() {
      expect(this.app.getRegion('fooRegion')).to.equal(this.app.fooRegion);
    });
  });

  describe('when destroying all regions in the app', function() {
    beforeEach(function() {
      this.app = new Marionette.Application();
      this.app.addRegions({
        fooRegion: '#foo-region',
        barRegion: '#bar-region'
      });

      this.sinon.spy(this.app.fooRegion, 'empty');
      this.sinon.spy(this.app.barRegion, 'empty');

      this.app.emptyRegions();
    });

    it('should empty the regions', function() {
      expect(this.app.fooRegion.empty).to.have.been.called;
      expect(this.app.barRegion.empty).to.have.been.called;
    });
  });

  describe("when an app has multiple regions", function(){
    beforeEach(function(){
      this.App = new Marionette.Application();
      this.App.addRegions({
        r1: "#region1",
        r2: "#region2"
      });

      this.regions = this.App.getRegions();
    });

    it("should be able to retrieve all regions", function(){
      expect(this.regions.r1).to.equal(this.App.getRegion("r1"));
      expect(this.regions.r2).to.equal(this.App.getRegion("r2"));
    });
  });

  describe('when removing a region', function() {
    beforeEach(function() {
      this.app = new Marionette.Application();
      this.app.addRegions({
        fooRegion: '#foo-region',
        barRegion: '#bar-region'
      });

      this.beforeRemoveRegionStub = this.sinon.stub();
      this.removeRegionStub = this.sinon.stub();
      this.app.on('before:remove:region', this.beforeRemoveRegionStub);
      this.app.on('remove:region', this.removeRegionStub);

      this.app.start();
      this.app.removeRegion('fooRegion');
    });

    it('should remove the region', function() {
      expect(this.app.fooRegion).to.be.undefined;
    });

    it('should trigger a before:remove:region event', function() {
      expect(this.beforeRemoveRegionStub).to.have.been.calledWith('fooRegion');
    });

    it('should trigger a remove:region event', function() {
      expect(this.removeRegionStub).to.have.been.calledWith('fooRegion');
    });
  });

  describe('overriding default regionManager', function() {
    beforeEach(function() {
      this.getRegionManagerStub = this.sinon.stub().returns(new Marionette.RegionManager());

      this.App = Marionette.Application.extend({
        getRegionManager: this.getRegionManagerStub
      });

      this.app = new this.App();
    });

    it('should call into the custom regionManager lookup', function() {
      expect(this.app.getRegionManager).
        to.have.been.calledOnce.
        and.have.been.calledOn(this.app);
    });
  });
});
