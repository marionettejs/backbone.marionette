describe('layoutView', function() {
  'use strict';

  beforeEach(global.setup);
  afterEach(global.teardown);

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
      expect(layoutViewManager).to.have.property('regionOne');
      expect(layoutViewManager).to.have.property('regionTwo');
    });

  });

  describe('on instantiation with no regions defined', function() {
    var NoRegions = Marionette.LayoutView.extend({});
    var layoutViewManager;

    function init() {
      layoutViewManager = new NoRegions();
    }

    it('should instantiate the specified region managers', function() {
      expect(init).not.to.throw;
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
      expect(layoutViewManager).to.have.property('regionOne');
      expect(layoutViewManager.regionOne).to.be.instanceof(CustomRegion1);
      expect(layoutViewManager).to.have.property('regionTwo');
      expect(layoutViewManager.regionTwo).to.be.instanceof(CustomRegion2);
    });

    it('should instantiate the default regionManager if specified', function() {
      expect(layoutViewManager).to.have.property('regionThree');
      expect(layoutViewManager.regionThree).to.be.instanceof(CustomRegion1);
      expect(layoutViewManager).to.have.property('regionFour');
      expect(layoutViewManager.regionThree).to.be.instanceof(CustomRegion1);
    });

    it('should instantiate marionette regions is no regionClass is specified', function() {
      var layoutViewManagerNoDefault = new LayoutViewNoDefaultRegion();
      expect(layoutViewManagerNoDefault).to.have.property('regionTwo');
      expect(layoutViewManagerNoDefault.regionTwo).to.be.instanceof(Backbone.Marionette.Region);
    });

    it('should pass extra options to the custom regionClass', function() {
      expect(layoutViewManager.regionTwo).to.have.property('options');
      expect(layoutViewManager.regionTwo.options).to.have.property('specialOption');
      expect(layoutViewManager.regionTwo.options.specialOption).to.be.ok;
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
      expect(options).to.deep.equal(layoutView.options);
    });

    it('should build the regions from the returns object literal', function() {
      expect(layoutView).to.have.property('foo');
      expect(layoutView.foo).to.be.instanceof(Backbone.Marionette.Region);
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
      layoutViewManager.regionOne._ensureElement();
      var el = layoutViewManager.$('#regionOne');
      expect(layoutViewManager.regionOne.$el[0]).to.equal(el[0]);
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

      sinon.spy(regionOne, 'destroy');
      sinon.spy(regionTwo, 'destroy');

      layoutViewManager.destroy();
    });

    afterEach(function() {
      regionOne.destroy.restore();
      regionTwo.destroy.restore();
    });

    it('should destroy the region managers', function() {
      expect(regionOne.destroy).to.have.been.called;
      expect(regionTwo.destroy).to.have.been.called;
    });

    it('should delete the region managers', function() {
      expect(layoutViewManager.regionOne).to.be.undefined;
      expect(layoutViewManager.regionTwo).to.be.undefined;
    });
  });

  describe('when showing a layoutView via a region', function() {
    var region, layoutView, regionOne, showReturn;

    beforeEach(function() {
      setFixtures('<div id="mgr"></div>');
      loadFixtures('layoutViewManagerTemplate.html');

      layoutView = new LayoutView();
      layoutView.onRender = function() {
        regionOne = layoutView.regionOne;
        regionOne._ensureElement();
      };

      region = new Backbone.Marionette.Region({
        el: '#mgr'
      });

      showReturn = region.show(layoutView);
    });

    it('should make the regions available in `onRender`', function() {
      expect(regionOne).to.exist;
    });

    it('the regions should find their elements in `onRender`', function() {
      expect(regionOne.$el.length).to.equal(1);
    });

    it('should return the region after showing a view in a region', function() {
      expect(showReturn).to.equal(region);
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

      destroyRegionsSpy = sinon.spy(layoutView.regionManager, 'destroyRegions');

      layoutView.render();
      layoutView.regionOne.show(view);
      region = layoutView.regionOne;
    });

    afterEach(function() {
      layoutView.regionManager.destroyRegions.restore();
    });

    it('should destroy the regions', function() {
      expect(destroyRegionsSpy.callCount).to.equal(1);
    });

    it('should re-bind the regions to the newly rendered elements', function() {
      expect(layoutView.regionOne.$el.parent()[0]).to.equal(layoutView.el);
    });

    describe('and the views "render" function is bound to an event in the "initialize" function', function() {
      beforeEach(function() {
        layoutView.onRender = function() {
          this.regionOne.show(view);
        };

        layoutView.model.trigger('change');
      });

      it('should re-bind the regions correctly', function() {
        expect(layoutView.$('#regionOne')).not.to.equal();
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

      sinon.spy(region, 'destroy');
      sinon.spy(view, 'destroy');

      layoutView.onBeforeRender = sinon.stub();
      layoutView.onRender = sinon.stub();
    });

    afterEach(function() {
      region.destroy.restore();
      view.destroy.restore();
    });

    it('should throw an error', function() {
      expect(layoutView.render).to.throw('Cannot use a view thats already been destroyed.');
    });
  });

  describe('has a valid inheritance chain back to Marionette.View', function() {
    var constructor, layoutView;

    beforeEach(function() {
      constructor = sinon.spy(Marionette, 'View');
      layoutView = new Marionette.LayoutView();
    });

    afterEach(function () {
      Marionette.View.restore();
    });

    it('calls the parent Marionette.Views constructor function on instantiation', function() {
      expect(constructor).to.have.been.called;
    });
  });

  describe('when getting a region', function() {
    beforeEach(function() {
      this.layoutView = new LayoutView();
      this.region = this.layoutView.regionOne;
    });

    it('should return the region', function() {
      expect(this.layoutView.getRegion('regionOne')).to.equal(this.region);
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
      expect(layoutView.getRegion('is')).to.exist;
      expect(layoutView.getRegion('war')).to.exist;
    });

    it('should lookup and set the regions when passed a function', function() {
      expect(layoutView2.getRegion('is')).to.exist;
      expect(layoutView2.getRegion('war')).to.exist;
    });

    it('should set custom region classes', function() {
      expect(CustomRegion).to.have.been.called;
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
      expect(spy).to.have.been.called;
    });

    it('should call the custom regionManager with the view as the context', function() {
      expect(spy).to.have.been.calledOn(layout);
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
      expect(this.spy).to.have.been.called;
    });

    it('should call onDomRefresh on region view children when shown within the parents onShow', function() {
      expect(this.spy2).to.have.been.called;
    });
  });
});
