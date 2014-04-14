describe('base view', function() {
  'use strict';

  describe('when initializing a view', function() {
    var fooHandler, view;

    beforeEach(function() {
      fooHandler = jasmine.createSpy();

      var View = Backbone.Marionette.View.extend({
        initialize: function() {
          this.listenTo(this.model, 'foo', fooHandler);
        }
      });

      var model = new Backbone.Model();
      view = new View({
        model: model
      });

      model.trigger('foo');
    });

    it('should allow event to be bound via event binder', function() {
      expect(fooHandler).toHaveBeenCalled();
    });
  });

  describe('when using listenTo for the "destroy" event on itself, and closing the view', function() {
    var destroy;

    beforeEach(function() {
      destroy = jasmine.createSpy('destroy');

      var view = new Marionette.View();
      view.listenTo(view, 'destroy', destroy);

      view.destroy();
    });

    it('should trigger the "destroy" event', function() {
      expect(destroy).toHaveBeenCalled();
    });
  });

  describe('when destroying a view', function() {
    var destroy, view;

    var View = Marionette.View.extend({
      onDestroy: jasmine.createSpy('onDestroy')
    });

    beforeEach(function() {
      view = new View();

      spyOn(view, 'remove').andCallThrough();
      destroy = jasmine.createSpy('destroy');
      view.on('destroy', destroy);

      view.destroy(123, 'second param');
    });

    it('should trigger the destroy event', function() {
      expect(destroy).toHaveBeenCalled();
    });

    it('should call an onDestroy method with any arguments passed to destroy', function() {
      expect(view.onDestroy).toHaveBeenCalledWith(123, 'second param');
    });

    it('should remove the view', function() {
      expect(view.remove).toHaveBeenCalled();
    });

    it('should set the view isDestroyed to true', function() {
      expect(view.isDestroyed).toBe(true);
    });
  });

  describe('when destroying a view and returning false from the onBeforeDestroy method', function() {
    var destroy, view;

    beforeEach(function() {
      view = new Marionette.View();

      spyOn(view, 'remove').andCallThrough();
      destroy = jasmine.createSpy('destroy');
      view.on('destroy', destroy);

      view.onBeforeDestroy = function() {
        return false;
      };

      view.destroy();
    });

    it('should not trigger the destroy event', function() {
      expect(destroy).toHaveBeenCalled();
    });

    it('should not remove the view', function() {
      expect(view.remove).toHaveBeenCalled();
    });

    it('should not set the view isDestroyed to true', function() {
      expect(view.isDestroyed).toBe(true);
    });
  });

  describe('when destroying a view and returning undefined from the onBeforeDestroy method', function() {
    var destroy, view;

    beforeEach(function() {
      view = new Marionette.View();

      spyOn(view, 'remove').andCallThrough();
      destroy = jasmine.createSpy('destroy');
      view.on('destroy', destroy);

      view.onBeforeDestroy = function() {
        return undefined;
      };

      view.destroy(123, 'second param');
    });

    it('should trigger the destroy event', function() {
      expect(destroy).toHaveBeenCalledWith(123, 'second param');
    });

    it('should remove the view', function() {
      expect(view.remove).toHaveBeenCalled();
    });

    it('should set the view isDestroyed to true', function() {
      expect(view.isDestroyed).toBe(true);
    });
  });

  describe('constructing a view with default options', function() {
    var View = Marionette.ItemView.extend();
    var PresetOptions = Marionette.View.extend({
      options: {
        'lila': 'zoidberg'
      }
    });
    var PresetOptionsFn = Marionette.View.extend({
      options: function() {
        return {fry: 'bender'};
      }
    });

    it('should take and store view options', function() {
      var viewInstance = new View({'Guybrush': 'Island'});
      expect(viewInstance.options.Guybrush).toBe('Island');
    });

    it('should take and store view options as a function', function() {
      var viewInstance = new View(function() {
        return {Guybrush: 'Island'};
      });
      expect(viewInstance.options.Guybrush).toBe('Island');
    });

    it('should have an empty hash of options by default', function() {
      var viewInstance = new View();
      expect(typeof(viewInstance.options.Guybrush)).toBe('undefined');
    });

    it('should retain options set on view class', function() {
      var viewInstance = new PresetOptions();
      expect(viewInstance.options.lila).toBe('zoidberg');
    });

    it('should retain options set on view class as a function', function() {
      var viewInstance = new PresetOptionsFn();
      expect(viewInstance.options.fry).toBe('bender');
    });
  });

  describe('should expose its options in the constructor', function() {
    var View = Marionette.View.extend({
      initialize: function() {
        this.info = this.options;
      }
    });

    it('should be able to access instance options', function() {
      var myView = new View({name: 'LeChuck'});
      expect(myView.info.name).toBe('LeChuck');
    });
  });

  describe('when destroying a view that is already destroyed', function() {
    var destroy, view;

    beforeEach(function() {
      view = new Marionette.View();
      view.destroy();

      spyOn(view, 'remove').andCallThrough();
      destroy = jasmine.createSpy('destroy');
      view.on('destroy', destroy);

      view.destroy();
    });

    it('should not trigger the destroy event', function() {
      expect(destroy).not.toHaveBeenCalled();
    });

    it('should not remove the view', function() {
      expect(view.remove).not.toHaveBeenCalled();
    });

    it('should leave isDestroyed as true', function() {
      expect(view.isDestroyed).toBe(true);
    });
  });

});
