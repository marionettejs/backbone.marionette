describe('regionManager', function() {
  'use strict';

  describe('instantiating a regionManager', function() {
    beforeEach(function() {
      this.context = $('<div><div id="thor"></div><div id="eos"></div></div>');
      this.parentElHandler = this.sinon.stub().returns(this.context);

      this.regions = {
        'aRegion': '#thor',
        'bRegion': '#eos'
      };

      this.addRegionSpy = this.sinon.stub();

      this.RegionManager = Marionette.RegionManager.extend({
        addRegions: this.addRegionSpy
      });

      this.regionManager = new this.RegionManager({
        regions: this.regions
      });
    });

    it('should pass regions to addRegions', function() {
      expect(this.addRegionSpy).to.have
      .been.calledWith(this.regions)
      .and.to.have.been.calledOn(this.regionManager);
    });
  });

  describe('.addRegion', function() {
    describe('with a name and selector', function() {
      beforeEach(function() {
        this.addHandler = this.sinon.spy();
        this.beforeAddHandler = this.sinon.spy();

        this.regionManager = new Marionette.RegionManager();
        this.regionManager.on('add:region', this.addHandler);
        this.regionManager.on('before:add:region', this.beforeAddHandler);

        this.region = this.regionManager.addRegion('foo', '#foo');
      });

      it('should create the region', function() {
        expect(this.region).to.exist;
      });

      it('should store the region by name', function() {
        expect(this.regionManager.get('foo')).to.equal(this.region);
      });

      it('should trigger a "before:add:region" event/method', function() {
        expect(this.beforeAddHandler).to.have.been.calledWith('foo', this.region);
      });

      it('should trigger a "add:region" event/method', function() {
        expect(this.addHandler).to.have.been.calledWith('foo', this.region);
      });

      it('should increment the length', function() {
        expect(this.regionManager.length).to.equal(1);
      });
    });

    describe('and with a name and el', function() {
      beforeEach(function() {
        this.buildSpy = sinon.spy(Marionette.Region, 'buildRegion');
        this.$el = $('<div>');

        this.regionManager = new Marionette.RegionManager();
        this.region = this.regionManager.addRegion('foo', {
          el: this.$el
        });
      });

      it('should call Region.buildRegion', function() {
        expect(this.buildSpy).to.have.been.calledOnce;
      });
    });

    describe('and a region instance', function() {
      beforeEach(function() {
        this.addHandler = this.sinon.spy();
        this.beforeAddHandler = this.sinon.spy();

        this.regionManager = new Marionette.RegionManager();
        this.regionManager.on('add:region', this.addHandler);
        this.regionManager.on('before:add:region', this.beforeAddHandler);

        this.region = new Marionette.Region({el: '#foo'});
        this.builtRegion = this.regionManager.addRegion('foo', this.region);
      });

      it('should use the supplied region', function() {
        expect(this.builtRegion).to.equal(this.region);
      });

      it('should store the region by name', function() {
        expect(this.regionManager.get('foo')).to.equal(this.region);
      });

      it('should trigger a "before:add:region" event/method', function() {
        expect(this.beforeAddHandler).to.have.been.calledWith('foo', this.region);
      });

      it('should trigger a "add:region" event/method', function() {
        expect(this.addHandler).to.have.been.calledWith('foo', this.region);
      });

      it('should increment the length', function() {
        expect(this.regionManager.length).to.equal(1);
      });
    });

    describe('and supplying a parent element', function() {
      beforeEach(function() {
        this.context = $('<div><div id="foo"></div><div id="bar"></div></div>');
        this.regionManager = new Marionette.RegionManager();
        this.region = this.regionManager.addRegion('foo', {
          selector: '#foo',
          parentEl: this.context
        });

        this.region.show(new Backbone.View());
      });

      it('should set the regions selector within the supplied jQuery selector object', function() {
        expect(this.region.$el.parent()[0]).to.equal(this.context[0]);
      });
    });

    describe('and supplying a parent element as a function', function() {
      beforeEach(function() {
        this.context = $('<div><div id="foo"></div><div id="bar"></div></div>');
        this.parentElHandler = this.sinon.stub().returns(this.context);
        this.regionManager = new Marionette.RegionManager();
        this.region = this.regionManager.addRegion('foo', {
          selector: '#foo',
          parentEl: this.parentElHandler
        });

        this.view = new Backbone.View();
        this.region.show(this.view);
      });

      it('should set the regions selector within the supplied jQuery selector object', function() {
        expect(this.region.$el.parent()[0]).to.equal(this.context[0]);
      });
    });

    describe('and with an improper object literal', function() {
      beforeEach(function() {
        var regionManager = new Marionette.RegionManager();
        this.addRegion = function() {
          regionManager.addRegion('foo', {});
        };
      });

      it('throws an error', function() {
        expect(this.addRegion).to.throw(Marionette.Error, new Marionette.Error({
          message: 'Improper region configuration type.',
          url: 'marionette.region.html#region-configuration-types'
        }));
      });
    });

  });

  describe('.addRegions', function() {
    describe('with no options', function() {
      beforeEach(function() {
        this.regionManager = new Marionette.RegionManager();

        this.regions = this.regionManager.addRegions({
          foo: '#bar',
          baz: '#quux'
        });
      });

      it('should add all specified regions', function() {
        expect(this.regionManager.get('foo')).to.exist;
        expect(this.regionManager.get('baz')).to.exist;
      });

      it('should return an object literal containing all named region instances', function() {
        expect(this.regions.foo).to.equal(this.regionManager.get('foo'));
        expect(this.regions.baz).to.equal(this.regionManager.get('baz'));
      });
    });

    describe('with region instance', function() {
      beforeEach(function() {
        this.fooRegion = new Marionette.Region({el: '#foo'});
        this.regionManager = new Marionette.RegionManager();

        this.regions = this.regionManager.addRegions({
          foo: this.fooRegion
        });
      });

      it('should add all specified regions', function() {
        expect(this.regionManager.get('foo')).to.equal(this.fooRegion);
      });

      it('should return an object literal containing all named region instances', function() {
        expect(this.regions.foo).to.equal(this.fooRegion);
      });
    });

    describe('with defaults', function() {
      beforeEach(function() {
        this.regionManager = new Marionette.RegionManager();

        this.parent = $('<div></div>');

        this.defaults = {
          parentEl: this.parent
        };

        this.regions = this.regionManager.addRegions({
          foo: '#bar',
          baz: '#quux'
        }, this.defaults);
      });

      it('should add all specified regions with the specified defaults', function() {
        expect(this.regionManager.get('foo')).to.exist;
        expect(this.regionManager.get('baz')).to.exist;
      });
    });

    describe('with a function', function() {
      beforeEach(function() {
        this.regionManager = new Marionette.RegionManager();

        this.fooSelector = '#foo-region';
        this.barSelector = '#bar-region';
        this.bazSelector = '#baz-region';
      });

      describe('without defaults', function() {
        beforeEach(function() {
          this.fooRegion = new Marionette.Region({el: this.fooSelector});
          this.fooRegion._parent = this.regionManager;

          this.barRegion = new Marionette.Region({el: this.barSelector});
          this.barRegion._parent = this.regionManager;

          this.BazRegion = Marionette.Region.extend();
          this.bazRegion = new this.BazRegion({el: this.bazSelector});
          this.bazRegion._parent = this.regionManager;

          this.regionDefinition = this.sinon.stub().returns({
            fooRegion: this.fooSelector,
            barRegion: this.barRegion,
            bazRegion: {
              selector: this.bazSelector,
              regionClass: this.BazRegion
            }
          });

          this.regions = this.regionManager.addRegions(this.regionDefinition);
        });

        it('calls the regions definition function', function() {
          expect(this.regionDefinition)
            .to.have.been.calledOnce
            .and.have.been.calledOn(this.regionManager)
            .and.have.been.calledWith(this.regionDefinition);
        });

        it('returns all the created regions on an object literal', function() {
          expect(this.regions.fooRegion).to.deep.equal(this.fooRegion);
          expect(this.regions.barRegion).to.deep.equal(this.barRegion);
          expect(this.regions.bazRegion).to.deep.equal(this.bazRegion);
        });

        it('adds all the specified regions', function() {
          expect(this.regionManager.get('fooRegion')).to.deep.equal(this.fooRegion);
          expect(this.regionManager.get('barRegion')).to.deep.equal(this.barRegion);
          expect(this.regionManager.get('bazRegion')).to.deep.equal(this.bazRegion);
        });

        it('uses the custom `regionClass`', function() {
          expect(this.regionManager.get('bazRegion')).to.be.an.instanceof(this.BazRegion);
        });
      });

      describe('with defaults', function() {
        beforeEach(function() {
          this.BazRegion = Marionette.Region.extend();
          this.defaults = {regionClass: this.BazRegion};

          this.fooRegion = new this.BazRegion({el: this.fooSelector});
          this.fooRegion._parent = this.regionManager;

          this.barRegion = new this.BazRegion({el: this.barSelector});
          this.barRegion._parent = this.regionManager;

          this.regionDefinition = this.sinon.stub().returns({
            fooRegion: this.fooSelector,
            barRegion: this.barSelector,
            bazRegion: {
              selector: this.bazSelector,
              regionClass: this.BazRegion
            }
          });

          this.regions = this.regionManager.addRegions(this.regionDefinition, this.defaults);
        });

        it('calls the regions definition function', function() {
          expect(this.regionDefinition)
            .to.have.been.calledOnce
            .and.have.been.calledOn(this.regionManager)
            .and.have.been.calledWith(this.regionDefinition, this.defaults);
        });

        it('returns all the created regions on an object literal', function() {
          expect(this.regionManager.get('fooRegion')).to.deep.equal(this.fooRegion);
          expect(this.regionManager.get('barRegion')).to.deep.equal(this.barRegion);
        });

        it('adds all the specified regions', function() {
          expect(this.regionManager.get('fooRegion')).to.deep.equal(this.fooRegion);
          expect(this.regionManager.get('barRegion')).to.deep.equal(this.barRegion);
        });

        it('overrides the regionClass via defaults', function() {
          expect(this.regionManager.get('fooRegion')).to.be.an.instanceof(this.BazRegion);
          expect(this.regionManager.get('barRegion')).to.be.an.instanceof(this.BazRegion);
        });
      });
    });
  });

  describe('.getRegions', function() {
    beforeEach(function() {
      this.regionManager = new Marionette.RegionManager();
      this.r = this.regionManager.addRegion('foo', '#foo');
      this.r2 = this.regionManager.addRegion('bar', '#bar');

      this.regions = this.regionManager.getRegions();
    });

    it('should return all the regions', function() {
      expect(this.regions.foo).to.equal(this.r);
      expect(this.regions.bar).to.equal(this.r2);
    });

  });

  describe('.removeRegion', function() {
    beforeEach(function() {
      this.setFixtures('<div id="foo"></div>');

      this.emptyHandler = this.sinon.spy();
      this.beforeRemoveHandler = this.sinon.spy();
      this.removeHandler = this.sinon.spy();

      this.regionManager = new Marionette.RegionManager();
      this.region = this.regionManager.addRegion('foo', '#foo');
      this.region.show(new Backbone.View());

      this.region.on('empty', this.emptyHandler);
      this.regionManager.on('before:remove:region', this.beforeRemoveHandler);
      this.regionManager.on('remove:region', this.removeHandler);
      this.sinon.spy(this.region, 'stopListening');

      this.sinon.spy(this.regionManager, 'removeRegion');
      this.regionManager.removeRegion('foo');
    });

    it('should empty the region', function() {
      expect(this.emptyHandler).to.have.been.called;
    });

    it('should stopListening on the region', function() {
      expect(this.region.stopListening).to.have.been.calledWith();
    });

    it('should remove the region', function() {
      expect(this.regionManager.get('foo')).to.be.undefined;
    });

    it('should trigger a "before:remove:region" event/method', function() {
      expect(this.beforeRemoveHandler).to.have.been.calledWith('foo', this.region);
    });

    it('should trigger a "remove:region" event/method', function() {
      expect(this.removeHandler).to.have.been.calledWith('foo', this.region);
    });

    it('should adjust the length of the region manager by -1', function() {
      expect(this.regionManager.length).to.equal(0);
    });

    it('should not reference parent', function() {
      expect(this.region._parent).to.be.undefined;
    });

    it('should return the region', function() {
      expect(this.regionManager.removeRegion).to.have.returned(this.region);
    });
  });

  describe('.removeRegions', function() {
    beforeEach(function() {
      this.setFixtures('<div id="foo"></div><div id="bar"></div>');

      this.emptyHandler = this.sinon.stub();
      this.emptyHandler2 = this.sinon.stub();
      this.removeHandler = this.sinon.stub();

      this.regionManager = new Marionette.RegionManager();
      this.region = this.regionManager.addRegion('foo', '#foo');
      this.r2 = this.regionManager.addRegion('bar', '#bar');
      this.regions = this.regionManager.getRegions();

      this.region.show(new Backbone.View());
      this.r2.show(new Backbone.View());

      this.region.on('empty', this.emptyHandler);
      this.r2.on('empty', this.emptyHandler2);

      this.regionManager.on('remove:region', this.removeHandler);

      this.sinon.spy(this.region, 'stopListening');
      this.sinon.spy(this.r2, 'stopListening');

      this.sinon.spy(this.regionManager, 'removeRegions');
      this.regionManager.removeRegions();
    });

    it('should empty the regions', function() {
      expect(this.emptyHandler).to.have.been.called;
      expect(this.emptyHandler2).to.have.been.called;
    });

    it('should stopListening on the regions', function() {
      expect(this.region.stopListening).to.have.been.calledWith();
      expect(this.r2.stopListening).to.have.been.calledWith();
    });

    it('should remove the regions', function() {
      expect(this.regionManager.get('foo')).to.be.undefined;
      expect(this.regionManager.get('bar')).to.be.undefined;
    });

    it('should trigger a "remove:region" event/method for each region', function() {
      expect(this.removeHandler).to.have.been.calledWith('foo', this.region);
      expect(this.removeHandler).to.have.been.calledWith('bar', this.r2);
    });

    it('should return the regions', function() {
      expect(this.regionManager.removeRegions).to.have.returned(this.regions);
    });
  });

  describe('.emptyRegions', function() {
    beforeEach(function() {
      this.setFixtures('<div id="foo">');

      this.emptyHandler = this.sinon.stub();
      this.destroyManagerHandler = this.sinon.stub();

      this.regionManager = new Marionette.RegionManager();
      this.region = this.regionManager.addRegion('foo', '#foo');
      this.regions = this.regionManager.getRegions();
      this.region.show(new Backbone.View());

      this.region.on('empty', this.emptyHandler);

      this.sinon.spy(this.regionManager, 'emptyRegions');
      this.regionManager.emptyRegions();
    });

    it('should empty all regions', function() {
      expect(this.emptyHandler).to.have.been.called;
    });

    it('should not remove all regions', function() {
      expect(this.regionManager.get('foo')).to.equal(this.region);
    });

    it('should return the regions', function() {
      expect(this.regionManager.emptyRegions).to.have.returned(this.regions);
    });
  });

  describe('.destroy', function() {
    beforeEach(function() {
      this.setFixtures('<div id="foo">');
      this.emptyHandler = this.sinon.stub();
      this.destroyManagerHandler = this.sinon.stub();

      this.regionManager = new Marionette.RegionManager();
      this.region = this.regionManager.addRegion('foo', '#foo');
      this.region.show(new Backbone.View());

      this.region.on('empty', this.emptyHandler);
      this.regionManager.on('destroy', this.destroyManagerHandler);

      this.sinon.spy(this.region, 'stopListening');

      this.sinon.spy(this.regionManager, 'destroy');
      this.regionManager.destroy();
    });

    it('should empty all regions', function() {
      expect(this.emptyHandler).to.have.been.called;
    });

    it('should stopListening on all regions', function() {
      expect(this.region.stopListening).to.have.been.calledWith();
    });

    it('should remove all regions', function() {
      expect(this.regionManager.get('foo')).to.be.undefined;
    });

    it('should trigger a "destroy" event/method', function() {
      expect(this.destroyManagerHandler).to.have.been.called;
    });

    it('should return the region manager', function() {
      expect(this.regionManager.destroy).to.have.returned(this.regionManager);
    });
  });

  describe('when iterating the region manager', function() {
    beforeEach(function() {
      this.cb = this.sinon.stub();

      this.rm = new Marionette.RegionManager();

      this.r1 = this.rm.addRegion('foo', '#foo');
      this.r2 = this.rm.addRegion('bar', '#bar');
      this.r3 = this.rm.addRegion('baz', '#baz');

      this.rm.each(this.cb);
    });

    it('should provide access to each region', function() {
      expect(this.cb.firstCall.args[0]).to.equal(this.r1);
      expect(this.cb.secondCall.args[0]).to.equal(this.r2);
      expect(this.cb.thirdCall.args[0]).to.equal(this.r3);
    });
  });
});
