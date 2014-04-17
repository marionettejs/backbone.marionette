/* jshint maxstatements: 15 */
describe('regionManager', function() {

  describe('.addRegion', function() {

    describe('with a name and selector', function() {
      var region, regionManager, addHandler;

      beforeEach(function() {
        addHandler = jasmine.createSpy('region:add handler');

        regionManager = new Marionette.RegionManager();
        regionManager.on('region:add', addHandler);

        region = regionManager.addRegion('foo', '#foo');
      });

      it('should create the region', function() {
        expect(region).not.toBeUndefined();
      });

      it('should store the region by name', function() {
        expect(regionManager.get('foo')).toBe(region);
      });

      it('should trigger a "region:add" event/method', function() {
        expect(addHandler).toHaveBeenCalledWith('foo', region);
      });

      it('should increment the length', function() {
        expect(regionManager.length).toBe(1);
      });
    });

    describe('and a region instance', function() {
      var region, builtRegion, regionManager, addHandler;

      beforeEach(function() {
        addHandler = jasmine.createSpy('region:add handler');

        regionManager = new Marionette.RegionManager();
        regionManager.on('region:add', addHandler);

        region = new Marionette.Region({el: '#foo'});
        builtRegion = regionManager.addRegion('foo', region);
      });

      it('should use the supplied region', function() {
        expect(builtRegion).toBe(region);
      });

      it('should store the region by name', function() {
        expect(regionManager.get('foo')).toBe(region);
      });

      it('should trigger a "region:add" event/method', function() {
        expect(addHandler).toHaveBeenCalledWith('foo', region);
      });

      it('should increment the length', function() {
        expect(regionManager.length).toBe(1);
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
        expect(region.$el.parent()).toBe(context);
      });
    });

    describe('and supplying a parent element as a function', function() {
      var region, regionManager, context, parentElHandler, view;

      beforeEach(function() {
        context = $('<div><div id="foo"></div><div id="bar"></div></div>');
        parentElHandler = jasmine.createSpy('parent el handler').andReturn(context);
        regionManager = new Marionette.RegionManager();
        region = regionManager.addRegion('foo', {
          selector: '#foo',
          parentEl: parentElHandler
        });

        view = new Backbone.View();
        region.show(view);
      });

      it('should set the regions selector within the supplied jQuery selector object', function() {
        expect(region.$el.parent()).toBe(context);
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
        expect(regionManager.get('foo')).not.toBeUndefined();
        expect(regionManager.get('baz')).not.toBeUndefined();
      });

      it('should return an object literal containing all named region instances', function() {
        expect(regions.foo).toBe(regionManager.get('foo'));
        expect(regions.baz).toBe(regionManager.get('baz'));
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
        expect(regionManager.get('foo')).toBe(fooRegion);
      });

      it('should return an object literal containing all named region instances', function() {
        expect(regions.foo).toBe(fooRegion);
      });
    });

    describe('with defaults', function() {
      var regions, regionManager, parent;

      beforeEach(function() {
        regionManager = new Marionette.RegionManager();

        parent = $('<div></div>');

        var defaults = {
          parentEl: parent
        };

        regions = regionManager.addRegions({
          foo: '#bar',
          baz: '#quux'
        }, defaults);
      });

      it('should add all specified regions with the specified defaults', function() {
        expect(regionManager.get('foo')).not.toBeUndefined();
        expect(regionManager.get('baz')).not.toBeUndefined();
      });
    });
  });

  describe('.removeRegion', function() {
    var region, regionManager, destroyHandler, removeHandler;

    beforeEach(function() {
      setFixtures('<div id="foo"></div>');

      destroyHandler = jasmine.createSpy('destroy handler');
      removeHandler = jasmine.createSpy('remove handler');

      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion('foo', '#foo');
      region.show(new Backbone.View());

      region.on('destroy', destroyHandler);
      regionManager.on('region:remove', removeHandler);

      spyOn(region, 'stopListening');

      regionManager.removeRegion('foo');
    });

    it('should destroy the region', function() {
      expect(destroyHandler).toHaveBeenCalled();
    });

    it('should stopListening on the region', function() {
      expect(region.stopListening).toHaveBeenCalledWith();
    });

    it('should remove the region', function() {
      expect(regionManager.get('foo')).toBeUndefined();
    });

    it('should trigger a "region:remove" event/method', function() {
      expect(removeHandler).toHaveBeenCalledWith('foo', region);
    });

    it('should adjust the length of the region manager by -1', function() {
      expect(regionManager.length).toBe(0);
    });
  });

  describe('.removeRegions', function() {
    var region, r2, regionManager, destroyHandler, destroyHandler2, removeHandler;

    beforeEach(function() {
      setFixtures('<div id="foo"></div><div id="bar"></div>');

      destroyHandler = jasmine.createSpy('destroy handler');
      destroyHandler2 = jasmine.createSpy('destroy handler');
      removeHandler = jasmine.createSpy('remove handler');

      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion('foo', '#foo');
      r2 = regionManager.addRegion('bar', '#bar');

      region.show(new Backbone.View());
      r2.show(new Backbone.View());

      region.on('destroy', destroyHandler);
      r2.on('destroy', destroyHandler2);

      regionManager.on('region:remove', removeHandler);

      spyOn(region, 'stopListening');
      spyOn(r2, 'stopListening');

      regionManager.removeRegions();
    });

    it('should destroy the regions', function() {
      expect(destroyHandler).toHaveBeenCalled();
      expect(destroyHandler2).toHaveBeenCalled();
    });

    it('should stopListening on the regions', function() {
      expect(region.stopListening).toHaveBeenCalledWith();
      expect(r2.stopListening).toHaveBeenCalledWith();
    });

    it('should remove the regions', function() {
      expect(regionManager.get('foo')).toBeUndefined();
      expect(regionManager.get('bar')).toBeUndefined();
    });

    it('should trigger a "region:remove" event/method for each region', function() {
      expect(removeHandler).toHaveBeenCalledWith('foo', region);
      expect(removeHandler).toHaveBeenCalledWith('bar', r2);
    });
  });

  describe('.destroyRegions', function() {
    var region, regionManager, destroyHandler, destroyManagerHandler;

    beforeEach(function() {
      setFixtures('<div id="foo">');

      destroyHandler = jasmine.createSpy('destroy region handler');
      destroyManagerHandler = jasmine.createSpy('destroy manager handler');

      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion('foo', '#foo');
      region.show(new Backbone.View());

      region.on('destroy', destroyHandler);

      regionManager.destroyRegions();
    });

    it('should destroy all regions', function() {
      expect(destroyHandler).toHaveBeenCalled();
    });

    it('should not remove all regions', function() {
      expect(regionManager.get('foo')).toBe(region);
    });
  });

  describe('.destroy', function() {
    var region, regionManager, destroyHandler, destroyManagerHandler;

    beforeEach(function() {
      setFixtures('<div id="foo">');
      destroyHandler = jasmine.createSpy('destroy region handler');
      destroyManagerHandler = jasmine.createSpy('destroy manager handler');

      regionManager = new Marionette.RegionManager();
      region = regionManager.addRegion('foo', '#foo');
      region.show(new Backbone.View());

      region.on('destroy', destroyHandler);
      regionManager.on('destroy', destroyManagerHandler);

      spyOn(region, 'stopListening');

      regionManager.destroy();
    });

    it('should destroy all regions', function() {
      expect(destroyHandler).toHaveBeenCalled();
    });

    it('should stopListening on all regions', function() {
      expect(region.stopListening).toHaveBeenCalledWith();
    });

    it('should remove all regions', function() {
      expect(regionManager.get('foo')).toBeUndefined();
    });

    it('should trigger a "destroy" event/method', function() {
      expect(destroyManagerHandler).toHaveBeenCalled();
    });
  });

  describe('when iterating the region manager', function() {
    var cb, r1, r2, r3;

    beforeEach(function() {
      cb = jasmine.createSpy('iterator callback');

      var rm = new Marionette.RegionManager();

      r1 = rm.addRegion('foo', '#foo');
      r2 = rm.addRegion('bar', '#bar');
      r3 = rm.addRegion('baz', '#baz');

      rm.each(cb);
    });

    it('should provide access to each region', function() {
      expect(cb.calls[0].args[0]).toBe(r1);
      expect(cb.calls[1].args[0]).toBe(r2);
      expect(cb.calls[2].args[0]).toBe(r3);
    });
  });
});
