describe('layoutView', function() {
  'use strict';

  var template = function() {
    return '<span class=".craft"></span><h1 id="#a-fun-game"></h1>';
  };

  var LayoutView = Backbone.Marionette.LayoutView.extend({
    template: '#layout-view-manager-template',
    regions: {
      regionOne: '#regionOne',
      regionTwo: '#regionTwo'
    },
    initialize: function() {
      if (this.model) {
        this.listenTo(this.model, 'change', this.render);
      }
    }
  });

  var CustomRegion1 = function() {};

  var CustomRegion2 = Backbone.Marionette.Region.extend();

  var LayoutViewNoDefaultRegion = LayoutView.extend({
    regions: {
      regionOne: {
        selector: '#regionOne',
        regionClass: CustomRegion1
      },
      regionTwo: '#regionTwo'
    }
  });

  describe('on instantiation', function() {
    var layoutViewManager;

    beforeEach(function() {
      layoutViewManager = new LayoutView();
    });

    it('should instantiate the specified region managers', function() {
      expect(layoutViewManager).toHaveOwnProperty('regionOne');
      expect(layoutViewManager).toHaveOwnProperty('regionTwo');
    });

  });

  describe('on instantiation with no regions defined', function() {
    var NoRegions = Marionette.LayoutView.extend({});
    var layoutViewManager;

    function init() {
      layoutViewManager = new NoRegions();
    }

    it('should instantiate the specified region managers', function() {
      expect(init).not.toThrow();
    });

  });

  describe('on instantiation with custom region managers', function() {
    var LayoutViewCustomRegion = LayoutView.extend({
      regionClass: CustomRegion1,
      regions: {
        regionOne: {
          selector: '#regionOne',
          regionClass: CustomRegion1
        },
        regionTwo: {
          selector: '#regionTwo',
          regionClass: CustomRegion2,
          specialOption: true
        },
        regionThree: {
          selector: '#regionThree'
        },
        regionFour: '#regionFour'
      }
    });

    var layoutViewManager;

    beforeEach(function() {
      layoutViewManager = new LayoutViewCustomRegion();
    });

    it('should instantiate specific regions with custom regions if speficied', function() {
      expect(layoutViewManager).toHaveOwnProperty('regionOne');
      expect(layoutViewManager.regionOne).toBeInstanceOf(CustomRegion1);
      expect(layoutViewManager).toHaveOwnProperty('regionTwo');
      expect(layoutViewManager.regionTwo).toBeInstanceOf(CustomRegion2);
    });

    it('should instantiate the default regionManager if specified', function() {
      expect(layoutViewManager).toHaveOwnProperty('regionThree');
      expect(layoutViewManager.regionThree).toBeInstanceOf(CustomRegion1);
      expect(layoutViewManager).toHaveOwnProperty('regionFour');
      expect(layoutViewManager.regionThree).toBeInstanceOf(CustomRegion1);
    });

    it('should instantiate marionette regions is no regionClass is specified', function() {
      var layoutViewManagerNoDefault = new LayoutViewNoDefaultRegion();
      expect(layoutViewManagerNoDefault).toHaveOwnProperty('regionTwo');
      expect(layoutViewManagerNoDefault.regionTwo).toBeInstanceOf(Backbone.Marionette.Region);
    });

    it('should pass extra options to the custom regionClass', function() {
      expect(layoutViewManager.regionTwo).toHaveOwnProperty('options');
      expect(layoutViewManager.regionTwo.options).toHaveOwnProperty('specialOption');
      expect(layoutViewManager.regionTwo.options.specialOption).toBeTruthy();
    });

  });

  describe('when regions are defined as a function', function() {
    var options, layoutView;

    var LayoutView = Marionette.LayoutView.extend({
      template: '#foo',
      regions: function(opts) {
        options = opts;
        return {
          'foo': '#bar'
        };
      }
    });

    beforeEach(function() {
      setFixtures('<div id="foo"><div id="bar"></div></div>');
      layoutView = new LayoutView();
      layoutView.render();
    });

    it('should supply the layoutView.options to the function when calling it', function() {
      expect(options).toEqual(layoutView.options);
    });

    it('should build the regions from the returns object literal', function() {
      expect(layoutView).toHaveOwnProperty('foo');
      expect(layoutView.foo).toBeInstanceOf(Backbone.Marionette.Region);
    });
  });

  describe('on rendering', function() {
    var layoutViewManager;

    beforeEach(function() {
      loadFixtures('layoutViewManagerTemplate.html');
      layoutViewManager = new LayoutView();
      layoutViewManager.render();
    });

    it('should find the region scoped within the rendered template', function() {
      layoutViewManager.regionOne.ensureEl();
      var el = layoutViewManager.$('#regionOne');
      expect(layoutViewManager.regionOne.$el[0]).toEqual(el[0]);
    });
  });

  describe('when destroying', function() {
    var layoutViewManager, regionOne, regionTwo;

    beforeEach(function() {
      loadFixtures('layoutViewManagerTemplate.html');
      layoutViewManager = new LayoutView();
      layoutViewManager.render();

      regionOne = layoutViewManager.regionOne;
      regionTwo = layoutViewManager.regionTwo;

      spyOn(regionOne, 'destroy').andCallThrough();
      spyOn(regionTwo, 'destroy').andCallThrough();

      layoutViewManager.destroy();
    });

    it('should destroy the region managers', function() {
      expect(regionOne.destroy).toHaveBeenCalled();
      expect(regionTwo.destroy).toHaveBeenCalled();
    });

    it('should delete the region managers', function() {
      expect(layoutViewManager.regionOne).toBeUndefined();
      expect(layoutViewManager.regionTwo).toBeUndefined();
    });
  });

  describe('when showing a layoutView via a region', function() {
    var region, layoutView, regionOne;

    beforeEach(function() {
      setFixtures('<div id="mgr"></div>');
      appendLoadFixtures('layoutViewManagerTemplate.html');

      layoutView = new LayoutView();
      layoutView.onRender = function() {
        regionOne = layoutView.regionOne;
        regionOne.ensureEl();
      };

      region = new Backbone.Marionette.Region({
        el: '#mgr'
      });
      region.show(layoutView);
    });

    it('should make the regions available in `onRender`', function() {
      expect(regionOne).not.toBeUndefined();
    });

    it('the regions should find their elements in `onRender`', function() {
      expect(regionOne.$el.length).toBe(1);
    });
  });

  describe('when re-rendering an already rendered layoutView', function() {
    var region, layoutView, view, destroyRegionsSpy;

    beforeEach(function() {
      loadFixtures('layoutViewManagerTemplate.html');

      layoutView = new LayoutView({
        model: new Backbone.Model()
      });
      layoutView.render();

      view = new Backbone.View();
      view.destroy = function() {};
      layoutView.regionOne.show(view);

      destroyRegionsSpy = spyOn(layoutView.regionManager, 'destroyRegions').andCallThrough();

      layoutView.render();
      layoutView.regionOne.show(view);
      region = layoutView.regionOne;
    });

    it('should destroy the regions', function() {
      expect(destroyRegionsSpy.callCount).toBe(1);
    });

    it('should re-bind the regions to the newly rendered elements', function() {
      expect(layoutView.regionOne.$el.parent()).toBe(layoutView.$el);
    });

    describe('and the views "render" function is bound to an event in the "initialize" function', function() {
      beforeEach(function() {
        layoutView.onRender = function() {
          this.regionOne.show(view);
        };

        layoutView.model.trigger('change');
      });

      it('should re-bind the regions correctly', function() {
        expect(layoutView.$('#regionOne')).not.toBeEmpty();
      });
    });

  });

  describe('when re-rendering a destroyed layoutView', function() {
    var region, layoutView, view;

    beforeEach(function() {
      loadFixtures('layoutViewManagerTemplate.html');

      layoutView = new LayoutView();
      layoutView.render();
      region = layoutView.regionOne;

      view = new Backbone.View();
      view.destroy = function() {};
      layoutView.regionOne.show(view);
      layoutView.destroy();

      spyOn(region, 'destroy').andCallThrough();
      spyOn(view, 'destroy').andCallThrough();

      layoutView.onBeforeRender = jasmine.createSpy('before render');
      layoutView.onRender = jasmine.createSpy('on render');
    });

    it('should throw an error', function() {
      expect(layoutView.render).toThrow('Cannot use a view thats already been destroyed.');
    });
  });

  describe('has a valid inheritance chain back to Marionette.View', function() {
    var constructor, layoutView;

    beforeEach(function() {
      constructor = spyOn(Marionette.View.prototype, 'constructor');
      layoutView = new Marionette.LayoutView();
    });

    it('calls the parent Marionette.Views constructor function on instantiation', function() {
      expect(constructor).toHaveBeenCalled();
    });
  });

  describe('when getting a region', function() {
    beforeEach(function() {
      this.layoutView = new LayoutView();
      this.region = this.layoutView.regionOne;
    });

    it('should return the region', function() {
      expect(this.layoutView.getRegion('regionOne')).toBe(this.region);
    });
  });

  describe('when adding regions in a layoutViews options', function() {
    var layoutView, CustomRegion, layoutView2;

    beforeEach(function() {
      CustomRegion = sinon.spy();
      var regionOptions = {
        war: '.craft',
        is: {
          regionClass: CustomRegion,
          selector: '#a-fun-game'
        }
      };

      layoutView = new Backbone.Marionette.LayoutView({
        template: template,
        regions: regionOptions
      });

      layoutView2 = new Backbone.Marionette.LayoutView({
        template: template,
        regions: function() {
          return regionOptions;
        }
      });
    });

    it('should lookup and set the regions', function() {
      expect(layoutView.getRegion('is')).toBeDefined();
      expect(layoutView.getRegion('war')).toBeDefined();
    });

    it('should lookup and set the regions when passed a function', function() {
      expect(layoutView2.getRegion('is')).toBeDefined();
      expect(layoutView2.getRegion('war')).toBeDefined();
    });

    it('should set custom region classes', function() {
      expect(CustomRegion).toHaveBeenCalled();
    });
  });

  describe('overiding default regionManager', function() {
    var spy, layout;

    beforeEach(function() {
      spy     = sinon.spy();
      layout  = new (Marionette.LayoutView.extend({
        getRegionManager: function() {
          spy.apply(this, arguments);
          return new Marionette.RegionManager();
        }
      }))();
    });

    it('should call into the custom regionManager lookup', function() {
      expect(spy).toHaveBeenCalled();
    });

    it('should call the custom regionManager with the view as the context', function() {
      expect(spy).toHaveBeenCalledOn(layout);
    });

  });

  describe('childView get onDomRefresh from parent', function() {
    beforeEach(function() {
      setFixtures('<div id="james-kyle"></div>');
      this.spy = sinon.spy();
      this.spy2 = sinon.spy();

      var ItemView = Marionette.ItemView.extend({
        template: _.template('<yes><my><lord></lord></my></yes>'),
        onDomRefresh: this.spy2
      });

      var LucasArts = Marionette.CollectionView.extend({
        onDomRefresh: this.spy,
        childView: ItemView
      });


      var Layout = Marionette.LayoutView.extend({
        template: _.template('<sam class="and-max"></sam>'),
        regions: {
          'sam': '.and-max'
        },

        onShow: function() {
          this.getRegion('sam').show(new LucasArts({collection: new Backbone.Collection([{}])}));
        }
      });

      var region = new Marionette.Region({el: "#james-kyle"});

      region.show(new Layout());
    });

    it('should call onDomRefresh on region views when shown within the parents onShow', function() {
      expect(this.spy).toHaveBeenCalled();
    });

    it('should call onDomRefresh on region view children when shown within the parents onShow', function() {
      expect(this.spy2).toHaveBeenCalled();
    });
  });
});
