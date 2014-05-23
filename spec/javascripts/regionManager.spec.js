describe('regionManager', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('.addRegion', function() {
    describe('with a name and selector', function() {
      var region, regionManager, addHandler, beforeAddHandler;

      beforeEach(function() {
        addHandler = this.sinon.spy();
        beforeAddHandler = this.sinon.spy();

        regionManager = new Marionette.RegionManager();
        regionManager.on('add:region', addHandler);
        regionManager.on('before:add:region', beforeAddHandler);

        region = regionManager.addRegion('foo', '#foo');
      });

      it('should create the region', function() {
        expect(region).to.exist;
      });

      it('should store the region by name', function() {
        expect(regionManager.get('foo')).to.equal(region);
      });

      it('should trigger a "before:add:region" event/method', function() {
        expect(beforeAddHandler).to.have.been.calledWith('foo', region);
      });

      it('should trigger a "add:region" event/method', function() {
        expect(addHandler).to.have.been.calledWith('foo', region);
      });

      it('should increment the length', function() {
        expect(regionManager.length).to.equal(1);
      });
    });

    describe('and a region instance', function() {
      var region, builtRegion, regionManager, addHandler, beforeAddHandler;

      beforeEach(function() {
        addHandler = this.sinon.spy();
        beforeAddHandler = this.sinon.spy();

        regionManager = new Marionette.RegionManager();
        regionManager.on('add:region', addHandler);
        regionManager.on('before:add:region', beforeAddHandler);

        region = new Marionette.Region({el: '#foo'});
        builtRegion = regionManager.addRegion('foo', region);
      });

      it('should use the supplied region', function() {
        expect(builtRegion).to.equal(region);
      });

      it('should store the region by name', function() {
        expect(regionManager.get('foo')).to.equal(region);
      });

      it('should trigger a "before:add:region" event/method', function() {
        expect(beforeAddHandler).to.have.been.calledWith('foo', region);
      });

      it('should trigger a "add:region" event/method', function() {
        expect(addHandler).to.have.been.calledWith('foo', region);
      });

      it('should increment the length', function() {
        expect(regionManager.length).to.equal(1);
      });
    });

    describe('and supplying a parent element', function() {
      var region, regionManager, context;

      beforeEach(function() {
        context = $('<div><div id="foo"></div><div id="bar"></div></div>');
        regionManager = new Marionette.RegionManager();
        region = regionManager.addRegion('foo', {
          selector: '#foo',
          parentEl: context
        });

        region.show(new Backbone.View());
      });

      it('should set the regions selector within the supplied jQuery selector object', function() {
        expect(region.$el.parent()[0]).to.equal(context[0]);
      });
    });

    describe('and supplying a parent element as a function', function() {
      var region, regionManager, context, parentElHandler, view;

      beforeEach(function() {
        context = $('<div><div id="foo"></div><div id="bar"></div></div>');
        parentElHandler = this.sinon.stub().returns(context);
        regionManager = new Marionette.RegionManager();
        region = regionManager.addRegion('foo', {
          selector: '#foo',
          parentEl: parentElHandler
        });

        view = new Backbone.View();
        region.show(view);
      });

      it('should set the regions selector within the supplied jQuery selector object', function() {
        expect(region.$el.parent()[0]).to.equal(context[0]);
      });
    });
  });

  describe('.addRegions', function() {
    describe('with no options', function() {
      var regions, regionManager;

      beforeEach(function() {
        regionManager = new Marionette.RegionManager();

        regions = regionManager.addRegions({
          foo: '#bar',
          baz: '#quux'
        });
      });

      it('should add all specified regions', function() {
        expect(regionManager.get('foo')).to.exist;
        expect(regionManager.get('baz')).to.exist;
      });

      it('should return an object literal containing all named region instances', function() {
        expect(regions.foo).to.equal(regionManager.get('foo'));
        expect(regions.baz).to.equal(regionManager.get('baz'));
      });
    });

    describe('with region instance', function() {
      var fooRegion, regions, regionManager;

      beforeEach(function() {
        fooRegion = new Marionette.Region({el: '#foo'});
        regionManager = new Marionette.RegionManager();

        regions = regionManager.addRegions({
          foo: fooRegion
        });
      });

      it('should add all specified regions', function() {
        expect(regionManager.get('foo')).to.equal(fooRegion);
      });

      it('should return an object literal containing all named region instances', function() {
        expect(regions.foo).to.equal(fooRegion);
      });
    });

    describe('with defaults', function() {
      var regions, regionManager, parent, defaults;

      beforeEach(function() {
        regionManager = new Marionette.RegionManager();

        parent = $('<div></div>');

        defaults = {
          parentEl: parent
        };

        regions = regionManager.addRegions({
          foo: '#bar',
          baz: '#quux'
        }, defaults);
      });

      it('should add all specified regions with the specified defaults', function() {
        expect(regionManager.get('foo')).to.exist;
        expect(regionManager.get('baz')).to.exist;
      });
    });
  });

  describe('.removeRegion', function() {
    var region, regionManager, destroyHandler, removeHandler, beforeRemoveHandler;

    beforeEach(function() {
      this.setFixtures('<div id="foo"></div>');

      destroyHandler = this.sinon.spy();
      beforeRemoveHandler = this.sinon.spy();
      removeHandler = this.sinon.spy();

      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion('foo', '#foo');
      region.show(new Backbone.View());

      region.on('destroy', destroyHandler);
      regionManager.on('before:remove:region', beforeRemoveHandler);
      regionManager.on('remove:region', removeHandler);

      this.sinon.spy(region, 'stopListening');

      regionManager.removeRegion('foo');
    });

    it('should destroy the region', function() {
      expect(destroyHandler).to.have.been.called;
    });

    it('should stopListening on the region', function() {
      expect(region.stopListening).to.have.been.calledWith();
    });

    it('should remove the region', function() {
      expect(regionManager.get('foo')).to.be.undefined;
    });

    it('should trigger a "before:remove:region" event/method', function() {
      expect(beforeRemoveHandler).to.have.been.calledWith('foo', region);
    });

    it('should trigger a "remove:region" event/method', function() {
      expect(removeHandler).to.have.been.calledWith('foo', region);
    });

    it('should adjust the length of the region manager by -1', function() {
      expect(regionManager.length).to.equal(0);
    });
  });

  describe('.removeRegions', function() {
    var region, r2, regionManager, destroyHandler, destroyHandler2, removeHandler;

    beforeEach(function() {
      this.setFixtures('<div id="foo"></div><div id="bar"></div>');

      destroyHandler = this.sinon.stub();
      destroyHandler2 = this.sinon.stub();
      removeHandler = this.sinon.stub();

      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion('foo', '#foo');
      r2 = regionManager.addRegion('bar', '#bar');

      region.show(new Backbone.View());
      r2.show(new Backbone.View());

      region.on('destroy', destroyHandler);
      r2.on('destroy', destroyHandler2);

      regionManager.on('remove:region', removeHandler);

      this.sinon.spy(region, 'stopListening');
      this.sinon.spy(r2, 'stopListening');

      regionManager.removeRegions();
    });

    it('should destroy the regions', function() {
      expect(destroyHandler).to.have.been.called;
      expect(destroyHandler2).to.have.been.called;
    });

    it('should stopListening on the regions', function() {
      expect(region.stopListening).to.have.been.calledWith();
      expect(r2.stopListening).to.have.been.calledWith();
    });

    it('should remove the regions', function() {
      expect(regionManager.get('foo')).to.be.undefined;
      expect(regionManager.get('bar')).to.be.undefined;
    });

    it('should trigger a "remove:region" event/method for each region', function() {
      expect(removeHandler).to.have.been.calledWith('foo', region);
      expect(removeHandler).to.have.been.calledWith('bar', r2);
    });
  });

  describe('.destroyRegions', function() {
    var region, regionManager, destroyHandler, destroyManagerHandler;

    beforeEach(function() {
      this.setFixtures('<div id="foo">');

      destroyHandler = this.sinon.stub();
      destroyManagerHandler = this.sinon.stub();

      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion('foo', '#foo');
      region.show(new Backbone.View());

      region.on('destroy', destroyHandler);

      regionManager.destroyRegions();
    });

    it('should destroy all regions', function() {
      expect(destroyHandler).to.have.been.called;
    });

    it('should not remove all regions', function() {
      expect(regionManager.get('foo')).to.equal(region);
    });
  });

  describe('.destroy', function() {
    var region, regionManager, destroyHandler, destroyManagerHandler;

    beforeEach(function() {
      this.setFixtures('<div id="foo">');
      destroyHandler = this.sinon.stub();
      destroyManagerHandler = this.sinon.stub();

      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion('foo', '#foo');
      region.show(new Backbone.View());

      region.on('destroy', destroyHandler);
      regionManager.on('destroy', destroyManagerHandler);

      this.sinon.spy(region, 'stopListening');

      regionManager.destroy();
    });

    it('should destroy all regions', function() {
      expect(destroyHandler).to.have.been.called;
    });

    it('should stopListening on all regions', function() {
      expect(region.stopListening).to.have.been.calledWith();
    });

    it('should remove all regions', function() {
      expect(regionManager.get('foo')).to.be.undefined;
    });

    it('should trigger a "destroy" event/method', function() {
      expect(destroyManagerHandler).to.have.been.called;
    });
  });

  describe('when iterating the region manager', function() {
    var cb, r1, r2, r3, rm;

    beforeEach(function() {
      cb = this.sinon.stub();

      rm = new Marionette.RegionManager();

      r1 = rm.addRegion('foo', '#foo');
      r2 = rm.addRegion('bar', '#bar');
      r3 = rm.addRegion('baz', '#baz');

      rm.each(cb);
    });

    it('should provide access to each region', function() {
      expect(cb.firstCall.args[0]).to.equal(r1);
      expect(cb.secondCall.args[0]).to.equal(r2);
      expect(cb.thirdCall.args[0]).to.equal(r3);
    });
  });
});
