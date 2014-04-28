describe('layoutView - dynamic regions', function() {
  var template = function() {
    return '<div id="foo"></div><div id="bar"></div>';
  };

  describe('when adding a region to a layoutView, after it has been rendered', function() {
    var layoutView, region, addHandler;

    beforeEach(function() {
      layoutView = new Marionette.LayoutView({
        template: template
      });

      addHandler = jasmine.createSpy('add handler');
      layoutView.on('region:add', addHandler);

      layoutView.render();

      region = layoutView.addRegion('foo', '#foo');

      var view = new Backbone.View();
      layoutView.foo.show(view);
    });

    it('should add the region to the layoutView', function() {
      expect(layoutView.foo).toBe(region);
    });

    it('should set the parent of the region to the layoutView', function() {
      expect(region.$el.parent()).toBe(layoutView.$el[0]);
    });

    it('should be able to show a view in the region', function() {
      expect(layoutView.foo.$el.children().length).toBe(1);
    });

    it('should trigger a region:add event', function() {
      expect(addHandler).toHaveBeenCalledWith('foo', region);
    });
  });

  describe('when adding a region to a layoutView, before it has been rendered', function() {
    var layoutView, region;

    beforeEach(function() {
      layoutView = new Marionette.LayoutView({
        template: template
      });

      region = layoutView.addRegion('foo', '#foo');

      layoutView.render();

      var view = new Backbone.View();
      layoutView.foo.show(view);
    });

    it('should add the region to the layoutView after it is rendered', function() {
      expect(layoutView.foo).toBe(region);
    });

    it('should set the parent of the region to the layoutView', function() {
      expect(region.$el.parent()).toBe(layoutView.$el[0]);
    });

    it('should be able to show a view in the region', function() {
      expect(layoutView.foo.$el.children().length).toBe(1);
    });
  });

  describe('when adding a region to a layoutView that does not have any regions defined, and re-rendering the layoutView', function() {
    var layoutView, region, barRegion;

    beforeEach(function() {
      layoutView = new Marionette.LayoutView({
        template: template
      });

      barRegion = layoutView.bar;

      region = layoutView.addRegion('foo', '#foo');

      layoutView.render();
      layoutView.render();

      var view = new Backbone.View();
      layoutView.foo.show(view);
    });

    it('should keep the original regions', function() {
      expect(layoutView.bar).toBe(barRegion);
    });

    it('should re-add the region to the layoutView after it is re-rendered', function() {
      expect(layoutView.foo).toBe(region);
    });

    it('should set the parent of the region to the layoutView', function() {
      expect(region.$el.parent()).toBe(layoutView.$el[0]);
    });

    it('should be able to show a view in the region', function() {
      expect(layoutView.foo.$el.children().length).toBe(1);
    });
  });

  describe('when adding a region to a layoutView that already has regions defined, and re-rendering the layoutView', function() {
    var layoutView, region;

    beforeEach(function() {
      layoutView = new Marionette.LayoutView({
        regions: {
          bar: '#bar'
        },
        template: template
      });

      region = layoutView.addRegion('foo', '#foo');

      layoutView.render();
      layoutView.render();

      var view = new Backbone.View();
      layoutView.foo.show(view);
    });

    it('should re-add the region to the layoutView after it is re-rendered', function() {
      expect(layoutView.foo).toBe(region);
    });

    it('should set the parent of the region to the layoutView', function() {
      region.show(new Backbone.View());
      expect(region.$el.parent()).toBe(layoutView.$el[0]);
    });

    it('should be able to show a view in the region', function() {
      expect(layoutView.foo.$el.children().length).toBe(1);
    });
  });

  describe('when removing a region from a layoutView', function() {
    var LayoutView;
    var layoutView, region, destroyHandler, removeHandler;

    beforeEach(function() {
      LayoutView = Marionette.LayoutView.extend({
        template: template,
        regions: {
          foo: '#foo'
        }
      });

      destroyHandler = jasmine.createSpy('destroy handler');
      removeHandler = jasmine.createSpy('remove handler');

      layoutView = new LayoutView();

      layoutView.render();
      layoutView.foo.show(new Backbone.View());
      region = layoutView.foo;

      region.on('destroy', destroyHandler);
      layoutView.on('region:remove', removeHandler);

      layoutView.removeRegion('foo');
    });

    it('should destroy the region', function() {
      expect(destroyHandler).toHaveBeenCalled();
    });

    it('should trigger a region:remove event', function() {
      expect(removeHandler).toHaveBeenCalledWith('foo', region);
    });

    it('should remove the region', function() {
      expect(layoutView.foo).toBeUndefined();
      expect(layoutView.regions.foo).toBeUndefined();
      expect(layoutView.regionManager.get('foo')).toBeUndefined();
    });
  });

  describe('when removing a region and then re-rendering the layoutView', function() {
    var LayoutView = Marionette.LayoutView.extend({
      template: template,
      regions: {
        foo: '#foo'
      }
    });

    var layoutView, region;

    beforeEach(function() {
      layoutView = new LayoutView();

      layoutView.render();
      layoutView.foo.show(new Backbone.View());

      layoutView.removeRegion('foo');
      layoutView.render();

      region = layoutView.foo;
    });

    it('should not re-attach the region to the layoutView', function() {
      expect(region).toBeUndefined();
      expect(layoutView.regionManager.get('foo')).toBeUndefined();
    });
  });

  describe('when adding a region to a layoutView then destroying the layoutView', function() {
    var layoutView, region, destroyHandler;

    beforeEach(function() {
      destroyHandler = jasmine.createSpy('add handler');
      layoutView = new Marionette.LayoutView({
        template: template
      });

      layoutView.render();

      region = layoutView.addRegion('foo', '#foo');
      region.on('destroy', destroyHandler);

      var view = new Backbone.View();
      layoutView.foo.show(view);

      layoutView.destroy();
    });

    it('should destroy the region', function() {
      expect(destroyHandler).toHaveBeenCalled();
    });
  });
});
