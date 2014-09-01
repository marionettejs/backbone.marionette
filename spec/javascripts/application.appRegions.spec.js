describe('application regions', function() {
  'use strict';

  describe('when adding region selectors to an app, and starting the app', function() {
    beforeEach(function() {
      this.app = new Marionette.Application();

      this.beforeAddRegionStub = this.sinon.stub();
      this.addRegionStub = this.sinon.stub();
      this.app.on('before:add:region', this.beforeAddRegionStub);
      this.app.on('add:region', this.addRegionStub);

      this.fooRegion = new Marionette.Region({ el: '#foo-region' });
      this.barRegion = new Marionette.Region({ el: '#bar-region' });

      this.app.addRegions({
        fooRegion: '#foo-region',
        barRegion: '#bar-region'
      });
      this.app.start();
    });

    it('should initialize the regions', function() {
      expect(this.app.fooRegion).to.deep.equal(this.fooRegion);
      expect(this.app.barRegion).to.deep.equal(this.barRegion);
    });

    it('should trigger a before:add:region event', function() {
      expect(this.beforeAddRegionStub).to.have.been.calledWith('fooRegion', this.fooRegion);
    });

    it('should trigger a add:region event', function() {
      expect(this.addRegionStub).to.have.been.calledWith('barRegion', this.barRegion);
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

      this.fooRegion = new this.FooRegion({
        el: this.fooSelector,
        fooOption: this.fooOption
      });

      this.app.addRegions({
        fooRegion: {
          selector: this.fooSelector,
          regionClass: this.FooRegion,
          fooOption: this.fooOption
        }
      });
    });

    it('should initialize the regions, immediately', function() {
      expect(this.app.fooRegion).to.deep.equal(this.fooRegion);
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

  describe('when adding regions as an option', function() {
    beforeEach(function() {
      this.fooSelector  = '#foo-region';
      this.barSelector  = '#bar-region';
      this.bazSelector  = '#baz-region';
      this.quuxSelector = '#quux-selector';

      this.BarRegion = Marionette.Region.extend();
      this.BazRegion = Marionette.Region.extend({ el: this.bazSelector });
    });

    describe('and when regions is an object', function() {
      beforeEach(function() {
        this.app = new Marionette.Application({
          regions: {
            fooRegion: this.fooSelector,
            barRegion: {
              selector: this.barSelector,
              regionClass: this.BarRegion
            },
            bazRegion: this.BazRegion
          }
        });
      });

      it('should initialize the regions immediately', function() {
        expect(this.app.fooRegion).to.exist;
        expect(this.app.barRegion).to.exist;
        expect(this.app.bazRegion).to.exist;
      });

      it('should use the custom region class', function() {
        expect(this.app.barRegion).to.be.an.instanceof(this.BarRegion);
        expect(this.app.bazRegion).to.be.an.instanceof(this.BazRegion);
      });
    });

    describe('and when regions is an object and the application has predefined regions', function() {
      beforeEach(function() {
        this.App = Marionette.Application.extend({
          regions: {
            fooRegion: this.fooSelector,
            barRegion: {
              selector: this.barSelector,
              regionClass: this.BarRegion
            }
          }
        });

        this.app = new this.App({
          regions: {
            barRegion: this.BazRegion,
            quuxRegion: this.quuxSelector
          }
        });
      });

      it('should initialize the regions immediately', function() {
        expect(this.app.fooRegion).to.exist;
        expect(this.app.barRegion).to.exist;
        expect(this.app.quuxRegion).to.exist;
      });

      it('should overwrite regions from the instance options', function() {
        expect(this.app.barRegion).to.be.an.instanceof(this.BazRegion);
        expect(this.app.quuxRegion.el).to.equal(this.quuxSelector);
      });
    });

    describe('and when regions is a function', function() {
      beforeEach(function() {
        this.regionOptionsStub = this.sinon.stub().returns({
          fooRegion: this.fooSelector,
          barRegion: {
            selector: this.barSelector,
            regionClass: this.BarRegion
          },
          bazRegion: this.BazRegion
        });

        this.options = {
          regions: this.regionOptionsStub
        };

        this.app = new Marionette.Application(this.options);
      });

      it('should initialize the regions immediately', function() {
        expect(this.app.fooRegion).to.exist;
        expect(this.app.barRegion).to.exist;
        expect(this.app.bazRegion).to.exist;
      });

      it('should use the custom region class', function() {
        expect(this.app.barRegion).to.be.an.instanceof(this.BarRegion);
        expect(this.app.bazRegion).to.be.an.instanceof(this.BazRegion);
      });

      it('should call the regions function on the application context', function() {
        expect(this.regionOptionsStub)
          .to.have.been.calledOnce
          .and.have.been.calledOn(this.app);
      });

      it('should call the regions function with the options', function() {
        expect(this.regionOptionsStub).to.have.been.calledWith(this.options);
      });
    });

    describe('and when regions is a function and the application has predefined regions', function() {
      beforeEach(function() {
        this.App = Marionette.Application.extend({
          regions: {
            fooRegion: this.fooSelector,
            barRegion: {
              selector: this.barSelector,
              regionClass: this.BarRegion
            }
          }
        });

        this.regionOptionsStub = this.sinon.stub().returns({
          barRegion: this.BazRegion,
          quuxRegion: this.quuxSelector
        });

        this.options = {
          regions: this.regionOptionsStub
        };

        this.app = new this.App(this.options);
      });

      it('should initialize the regions immediately', function() {
        expect(this.app.fooRegion).to.exist;
        expect(this.app.barRegion).to.exist;
        expect(this.app.quuxRegion).to.exist;
      });

      it('should overwrite regions from the instance options', function() {
        expect(this.app.barRegion).to.be.an.instanceof(this.BazRegion);
        expect(this.app.quuxRegion.el).to.equal(this.quuxSelector);
      });

      it('should call the regions function on the application context', function() {
        expect(this.regionOptionsStub)
          .to.have.been.calledOnce
          .and.have.been.calledOn(this.app);
      });

      it('should call the regions function with the options', function() {
        expect(this.regionOptionsStub).to.have.been.calledWith(this.options);
      });
    });
  });

  describe('when defining regions in a class definition', function() {
    beforeEach(function() {
      this.fooSelector  = '#foo-region';
      this.barSelector  = '#bar-region';
      this.bazSelector  = '#baz-region';

      this.BarRegion = Marionette.Region.extend();
      this.BazRegion = Marionette.Region.extend({ el: this.bazSelector });

      this.regions = {
        fooRegion: this.fooSelector,
        barRegion: {
          selector: this.barSelector,
          regionClass: this.BarRegion
        },
        bazRegion: this.BazRegion
      };
    });

    describe('and when regions is an object', function() {
      beforeEach(function() {
        this.App = Marionette.Application.extend({
          regions: this.regions
        });

        this.app = new this.App();
      });

      it('should initialize the regions immediately', function() {
        expect(this.app.fooRegion).to.exist;
        expect(this.app.barRegion).to.exist;
        expect(this.app.bazRegion).to.exist;
      });

      it('should use the custom region class', function() {
        expect(this.app.barRegion).to.be.an.instanceof(this.BarRegion);
        expect(this.app.bazRegion).to.be.an.instanceof(this.BazRegion);
      });
    });

    describe('and when regions is a function', function() {
      beforeEach(function() {
        this.regionOptionsStub = this.sinon.stub().returns(this.regions);

        this.options = { foo: 'bar' };

        this.App = Marionette.Application.extend({
          regions: this.regionOptionsStub
        });

        this.app = new this.App(this.options);
      });

      it('should initialize the regions immediately', function() {
        expect(this.app.fooRegion).to.exist;
        expect(this.app.barRegion).to.exist;
        expect(this.app.bazRegion).to.exist;
      });

      it('should use the custom region class', function() {
        expect(this.app.barRegion).to.be.an.instanceof(this.BarRegion);
        expect(this.app.bazRegion).to.be.an.instanceof(this.BazRegion);
      });

      it('should call the regions function on the application context', function() {
        expect(this.regionOptionsStub)
          .to.have.been.calledOnce
          .and.have.been.calledOn(this.app);
      });

      it('should call the regions function with the options', function() {
        expect(this.regionOptionsStub).to.have.been.calledWith(this.options);
      });
    });
  });

  describe('when adding custom region classes to an app', function() {
    beforeEach(function() {
      this.fooSelector = '#foo-region';
      this.app = new Marionette.Application();
      this.FooRegion = Marionette.Region.extend({ el: this.fooSelector });

      this.fooRegion = new this.FooRegion();

      this.app.addRegions({
        fooRegion: this.FooRegion
      });
    });

    it('should initialize the regions, immediately', function() {
      expect(this.app.fooRegion).to.deep.equal(this.fooRegion);
    });

    it('should create an instance of the specified region class', function() {
      expect(this.app.fooRegion).to.be.instanceof(this.FooRegion);
    });

    it('should set the specified selector', function() {
      expect(this.app.fooRegion.$el.selector).to.equal('#foo-region');
    });
  });

  describe('when adding regions with a function', function() {
    beforeEach(function() {
      this.fooSelector = '#foo-region';
      this.barSelector = '#bar-region';

      this.fooRegion = new Marionette.Region({ el: this.fooSelector });
      this.BarRegion = Marionette.Region.extend();
      this.barRegion = new this.BarRegion({ el: this.barSelector });

      this.app = new Marionette.Application();

      this.regionDefinition = this.sinon.stub().returns({
        fooRegion: this.fooSelector,
        barRegion: {
          selector: this.barSelector,
          regionClass: this.BarRegion
        }
      });

      this.regions = this.app.addRegions(this.regionDefinition);
    });

    it('calls the regions definition function', function() {
      expect(this.regionDefinition)
        .to.have.been.calledOnce
        .and.have.been.calledWith(this.regionDefinition);
    });

    it('returns all the created regions on an object literal', function() {
      expect(this.app.fooRegion).to.deep.equal(this.fooRegion);
      expect(this.app.barRegion).to.deep.equal(this.barRegion);
    });

    it('initializes all the regions immediately', function() {
      expect(this.app.getRegion('fooRegion')).to.deep.equal(this.fooRegion);
      expect(this.app.getRegion('barRegion')).to.deep.equal(this.barRegion);
    });

    it('uses the custom regionClass', function() {
      expect(this.app.getRegion('barRegion')).to.be.an.instanceof(this.BarRegion);
    });
  });

  describe('when an app has a region', function() {
    beforeEach(function() {
      this.app = new Marionette.Application();
      this.fooRegion = new Marionette.Region({ el: '#foo-region' });
      this.app.addRegions({
        fooRegion: '#foo-region'
      });
    });

    it('should make the region available as a named attribute', function() {
      expect(this.app.fooRegion).to.deep.equal(this.fooRegion);
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
      this.regions = this.app.getRegions();

      this.sinon.spy(this.app.fooRegion, 'empty');
      this.sinon.spy(this.app.barRegion, 'empty');

      this.sinon.spy(this.app, 'emptyRegions');
      this.app.emptyRegions();
    });

    it('should empty the regions', function() {
      expect(this.app.fooRegion.empty).to.have.been.called;
      expect(this.app.barRegion.empty).to.have.been.called;
    });

    it('should return the regions', function() {
      expect(this.app.emptyRegions).to.have.returned(this.regions);
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
      this.fooRegion = this.app.fooRegion;

      this.beforeRemoveRegionStub = this.sinon.stub();
      this.removeRegionStub = this.sinon.stub();
      this.app.on('before:remove:region', this.beforeRemoveRegionStub);
      this.app.on('remove:region', this.removeRegionStub);

      this.app.start();

      this.sinon.spy(this.app, 'removeRegion');
      this.app.removeRegion('fooRegion');
    });

    it('should remove the region', function() {
      expect(this.app.fooRegion).to.be.undefined;
    });

    it('should trigger a before:remove:region event', function() {
      expect(this.beforeRemoveRegionStub).to.have.been.calledWith('fooRegion', this.fooRegion);
    });

    it('should trigger a remove:region event', function() {
      expect(this.removeRegionStub).to.have.been.calledWith('fooRegion', this.fooRegion);
    });

    it('should return the region', function() {
      expect(this.app.removeRegion).to.have.returned(this.fooRegion);
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
      expect(this.app.getRegionManager)
        .to.have.been.calledOnce
        .and.have.been.calledOn(this.app);
    });
  });
});
