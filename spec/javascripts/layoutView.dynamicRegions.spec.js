describe('layoutView - dynamic regions', function() {
  var template = function() {
    return '<div id="foo"></div><div id="bar"></div>';
  };

  describe('when adding a region to a layoutView, after it has been rendered', function() {
    var MyLayoutView, layoutView, region, addHandler, onAddSpy, beforeAddHandler, onBeforeAddSpy;

    beforeEach(function() {
      MyLayoutView = Marionette.LayoutView.extend({
        onAddRegion: function() {},
        onBeforeAddRegion: function() {}
      });

      layoutView = new MyLayoutView({
        template: template
      });

      beforeAddHandler = sinon.spy();
      addHandler = sinon.spy();
      onBeforeAddSpy = sinon.spy(layoutView, 'onBeforeAddRegion');
      onAddSpy = sinon.spy(layoutView, 'onAddRegion');
      layoutView.on('before:add:region', beforeAddHandler);
      layoutView.on('add:region', addHandler);

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

    it('should trigger a before:add:region event', function() {
      expect(beforeAddHandler).toHaveBeenCalledWith('foo');
      expect(onBeforeAddSpy).toHaveBeenCalledWith('foo');
    });

    it('should trigger a add:region event', function() {
      expect(addHandler).toHaveBeenCalledWith('foo', region);
      expect(onAddSpy).toHaveBeenCalledWith('foo', region);
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
    var layoutView, region, destroyHandler, removeHandler, beforeRemoveHandler, onBeforeRemoveSpy, onRemoveSpy;

    beforeEach(function() {
      LayoutView = Marionette.LayoutView.extend({
        template: template,
        regions: {
          foo: '#foo'
        },
        onBeforeRemoveRegion: function() {},
        onRemoveRegion: function() {}
      });

      destroyHandler = sinon.spy();
      beforeRemoveHandler = sinon.spy();
      removeHandler = sinon.spy();

      layoutView = new LayoutView();

      onBeforeRemoveSpy = sinon.spy(layoutView, 'onBeforeRemoveRegion');
      onRemoveSpy = sinon.spy(layoutView, 'onRemoveRegion');

      layoutView.render();
      layoutView.foo.show(new Backbone.View());
      region = layoutView.foo;

      region.on('destroy', destroyHandler);
      layoutView.on('before:remove:region', beforeRemoveHandler);
      layoutView.on('remove:region', removeHandler);

      layoutView.removeRegion('foo');
    });

    it('should destroy the region', function() {
      expect(destroyHandler).toHaveBeenCalled();
    });

    it('should trigger a before:remove:region event', function() {
      expect(onBeforeRemoveSpy).toHaveBeenCalledWith('foo');
      expect(beforeRemoveHandler).toHaveBeenCalledWith('foo');
    });

    it('should trigger a remove:region event', function() {
      expect(onRemoveSpy).toHaveBeenCalledWith('foo', region);
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
