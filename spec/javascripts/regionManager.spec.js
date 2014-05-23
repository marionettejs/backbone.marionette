describe('regionManager', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

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
  });

  describe('.removeRegion', function() {
    beforeEach(function() {
      this.setFixtures('<div id="foo"></div>');

      this.destroyHandler = this.sinon.spy();
      this.beforeRemoveHandler = this.sinon.spy();
      this.removeHandler = this.sinon.spy();

      this.regionManager = new Marionette.RegionManager();
      this.region = this.regionManager.addRegion('foo', '#foo');
      this.region.show(new Backbone.View());

      this.region.on('destroy', this.destroyHandler);
      this.regionManager.on('before:remove:region', this.beforeRemoveHandler);
      this.regionManager.on('remove:region', this.removeHandler);

      this.sinon.spy(this.region, 'stopListening');

      this.regionManager.removeRegion('foo');
    });

    it('should destroy the region', function() {
      expect(this.destroyHandler).to.have.been.called;
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
  });

  describe('.removeRegions', function() {
    beforeEach(function() {
      this.setFixtures('<div id="foo"></div><div id="bar"></div>');

      this.destroyHandler = this.sinon.stub();
      this.destroyHandler2 = this.sinon.stub();
      this.removeHandler = this.sinon.stub();

      this.regionManager = new Marionette.RegionManager();
      this.region = this.regionManager.addRegion('foo', '#foo');
      this.r2 = this.regionManager.addRegion('bar', '#bar');

      this.region.show(new Backbone.View());
      this.r2.show(new Backbone.View());

      this.region.on('destroy', this.destroyHandler);
      this.r2.on('destroy', this.destroyHandler2);

      this.regionManager.on('remove:region', this.removeHandler);

      this.sinon.spy(this.region, 'stopListening');
      this.sinon.spy(this.r2, 'stopListening');

      this.regionManager.removeRegions();
    });

    it('should destroy the regions', function() {
      expect(this.destroyHandler).to.have.been.called;
      expect(this.destroyHandler2).to.have.been.called;
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
  });

  describe('.destroyRegions', function() {
    beforeEach(function() {
      this.setFixtures('<div id="foo">');

      this.destroyHandler = this.sinon.stub();
      this.destroyManagerHandler = this.sinon.stub();

      this.regionManager = new Marionette.RegionManager();
      this.region = this.regionManager.addRegion('foo', '#foo');
      this.region.show(new Backbone.View());

      this.region.on('destroy', this.destroyHandler);

      this.regionManager.destroyRegions();
    });

    it('should destroy all regions', function() {
      expect(this.destroyHandler).to.have.been.called;
    });

    it('should not remove all regions', function() {
      expect(this.regionManager.get('foo')).to.equal(this.region);
    });
  });

  describe('.destroy', function() {
    beforeEach(function() {
      this.setFixtures('<div id="foo">');
      this.destroyHandler = this.sinon.stub();
      this.destroyManagerHandler = this.sinon.stub();

      this.regionManager = new Marionette.RegionManager();
      this.region = this.regionManager.addRegion('foo', '#foo');
      this.region.show(new Backbone.View());

      this.region.on('destroy', this.destroyHandler);
      this.regionManager.on('destroy', this.destroyManagerHandler);

      this.sinon.spy(this.region, 'stopListening');

      this.regionManager.destroy();
    });

    it('should destroy all regions', function() {
      expect(this.destroyHandler).to.have.been.called;
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
