describe('layoutView', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  beforeEach(function() {
    this.template = function() {
      return '<span class=".craft"></span><h1 id="#a-fun-game"></h1>';
    };

    this.LayoutView = Backbone.Marionette.LayoutView.extend({
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

    this.CustomRegion1 = function() {};

    this.CustomRegion2 = Backbone.Marionette.Region.extend();

    this.LayoutViewNoDefaultRegion = this.LayoutView.extend({
      regions: {
        regionOne: {
          selector: '#regionOne',
          regionClass: this.CustomRegion1
        },
        regionTwo: '#regionTwo'
      }
    });
  });

  describe('on instantiation', function() {
    beforeEach(function() {
      this.layoutViewManager = new this.LayoutView();
    });

    it('should instantiate the specified region managers', function() {
      expect(this.layoutViewManager).to.have.property('regionOne');
      expect(this.layoutViewManager).to.have.property('regionTwo');
    });
  });

  describe('on instantiation with no regions defined', function() {
    beforeEach(function() {
      var suite = this;
      this.NoRegions = Marionette.LayoutView.extend({});
      this.init = function() {
        suite.layoutViewManager = new suite.NoRegions();
      };
    });

    it('should instantiate the specified region managers', function() {
      expect(this.init).not.to.throw;
    });
  });

  describe('on instantiation with custom region managers', function() {
    beforeEach(function() {
      this.LayoutViewCustomRegion = this.LayoutView.extend({
        regionClass: this.CustomRegion1,
        regions: {
          regionOne: {
            selector: '#regionOne',
            regionClass: this.CustomRegion1
          },
          regionTwo: {
            selector: '#regionTwo',
            regionClass: this.CustomRegion2,
            specialOption: true
          },
          regionThree: {
            selector: '#regionThree'
          },
          regionFour: '#regionFour'
        }
      });

      this.layoutViewManager = new this.LayoutViewCustomRegion();
    });

    it('should instantiate specific regions with custom regions if speficied', function() {
      expect(this.layoutViewManager).to.have.property('regionOne');
      expect(this.layoutViewManager.regionOne).to.be.instanceof(this.CustomRegion1);
      expect(this.layoutViewManager).to.have.property('regionTwo');
      expect(this.layoutViewManager.regionTwo).to.be.instanceof(this.CustomRegion2);
    });

    it('should instantiate the default regionManager if specified', function() {
      expect(this.layoutViewManager).to.have.property('regionThree');
      expect(this.layoutViewManager.regionThree).to.be.instanceof(this.CustomRegion1);
      expect(this.layoutViewManager).to.have.property('regionFour');
      expect(this.layoutViewManager.regionThree).to.be.instanceof(this.CustomRegion1);
    });

    it('should instantiate marionette regions is no regionClass is specified', function() {
      var layoutViewManagerNoDefault = new this.LayoutViewNoDefaultRegion();
      expect(layoutViewManagerNoDefault).to.have.property('regionTwo');
      expect(layoutViewManagerNoDefault.regionTwo).to.be.instanceof(Backbone.Marionette.Region);
    });

    it('should pass extra options to the custom regionClass', function() {
      expect(this.layoutViewManager.regionTwo).to.have.property('options');
      expect(this.layoutViewManager.regionTwo.options).to.have.property('specialOption');
      expect(this.layoutViewManager.regionTwo.options.specialOption).to.be.ok;
    });
  });

  describe('when regions are defined as a function', function() {
    beforeEach(function() {
      var suite = this;
      this.LayoutView = Marionette.LayoutView.extend({
        template: '#foo',
        regions: function(opts) {
          suite.options = opts;
          return {
            'foo': '#bar'
          };
        }
      });

      this.setFixtures('<div id="foo"><div id="bar"></div></div>');
      this.layoutView = new this.LayoutView();
      this.layoutView.render();
    });

    it('should supply the layoutView.options to the function when calling it', function() {
      expect(this.options).to.deep.equal(this.layoutView.options);
    });

    it('should build the regions from the returns object literal', function() {
      expect(this.layoutView).to.have.property('foo');
      expect(this.layoutView.foo).to.be.instanceof(Backbone.Marionette.Region);
    });
  });

  describe('on rendering', function() {
    beforeEach(function() {
      this.loadFixtures('layoutViewManagerTemplate.html');
      this.layoutViewManager = new this.LayoutView();
      this.layoutViewManager.render();
    });

    it('should find the region scoped within the rendered template', function() {
      this.layoutViewManager.regionOne._ensureElement();
      var el = this.layoutViewManager.$('#regionOne');
      expect(this.layoutViewManager.regionOne.$el[0]).to.equal(el[0]);
    });
  });

  describe('when destroying', function() {
    beforeEach(function() {
      this.loadFixtures('layoutViewManagerTemplate.html');
      this.layoutViewManager = new this.LayoutView();
      this.layoutViewManager.render();

      this.regionOne = this.layoutViewManager.regionOne;
      this.regionTwo = this.layoutViewManager.regionTwo;

      this.sinon.spy(this.regionOne, 'destroy');
      this.sinon.spy(this.regionTwo, 'destroy');

      this.layoutViewManager.destroy();
    });

    it('should destroy the region managers', function() {
      expect(this.regionOne.destroy).to.have.been.called;
      expect(this.regionTwo.destroy).to.have.been.called;
    });

    it('should delete the region managers', function() {
      expect(this.layoutViewManager.regionOne).to.be.undefined;
      expect(this.layoutViewManager.regionTwo).to.be.undefined;
    });
  });

  describe('when showing a layoutView via a region', function() {
    beforeEach(function() {
      var suite = this;

      this.setFixtures('<div id="mgr"></div>');
      this.loadFixtures('layoutViewManagerTemplate.html');

      this.layoutView = new this.LayoutView();
      this.layoutView.onRender = function() {
        suite.regionOne = suite.layoutView.regionOne;
        suite.regionOne._ensureElement();
      };

      this.region = new Backbone.Marionette.Region({
        el: '#mgr'
      });

      this.showReturn = this.region.show(this.layoutView);
    });

    it('should make the regions available in `onRender`', function() {
      expect(this.regionOne).to.exist;
    });

    it('the regions should find their elements in `onRender`', function() {
      expect(this.regionOne.$el.length).to.equal(1);
    });

    it('should return the region after showing a view in a region', function() {
      expect(this.showReturn).to.equal(this.region);
    });
  });

  describe('when re-rendering an already rendered layoutView', function() {
    beforeEach(function() {
      this.loadFixtures('layoutViewManagerTemplate.html');

      this.layoutView = new this.LayoutView({
        model: new Backbone.Model()
      });
      this.layoutView.render();

      this.view = new Backbone.View();
      this.view.destroy = function() {};
      this.layoutView.regionOne.show(this.view);

      this.destroyRegionsSpy = this.sinon.spy(this.layoutView.regionManager, 'destroyRegions');

      this.layoutView.render();
      this.layoutView.regionOne.show(this.view);
      this.region = this.layoutView.regionOne;
    });

    it('should destroy the regions', function() {
      expect(this.destroyRegionsSpy.callCount).to.equal(1);
    });

    it('should re-bind the regions to the newly rendered elements', function() {
      expect(this.layoutView.regionOne.$el.parent()[0]).to.equal(this.layoutView.el);
    });

    describe('and the views "render" function is bound to an event in the "initialize" function', function() {
      beforeEach(function() {
        var suite = this;
        this.layoutView.onRender = function() {
          this.regionOne.show(suite.view);
        };

        this.layoutView.model.trigger('change');
      });

      it('should re-bind the regions correctly', function() {
        expect(this.layoutView.$('#regionOne')).not.to.equal();
      });
    });
  });

  describe('when re-rendering a destroyed layoutView', function() {
    beforeEach(function() {
      this.loadFixtures('layoutViewManagerTemplate.html');

      this.layoutView = new this.LayoutView();
      this.layoutView.render();
      this.region = this.layoutView.regionOne;

      this.view = new Backbone.View();
      this.view.destroy = function() {};
      this.layoutView.regionOne.show(this.view);
      this.layoutView.destroy();

      this.sinon.spy(this.region, 'destroy');
      this.sinon.spy(this.view, 'destroy');

      this.layoutView.onBeforeRender = this.sinon.stub();
      this.layoutView.onRender = this.sinon.stub();
    });

    it('should throw an error', function() {
      expect(this.layoutView.render).to.throw('Cannot use a view thats already been destroyed.');
    });
  });

  describe('has a valid inheritance chain back to Marionette.View', function() {
    beforeEach(function() {
      this.constructor = this.sinon.spy(Marionette, 'View');
      this.layoutView = new Marionette.LayoutView();
    });

    it('calls the parent Marionette.Views constructor function on instantiation', function() {
      expect(this.constructor).to.have.been.called;
    });
  });

  describe('when getting a region', function() {
    beforeEach(function() {
      this.layoutView = new this.LayoutView();
      this.region = this.layoutView.regionOne;
    });

    it('should return the region', function() {
      expect(this.layoutView.getRegion('regionOne')).to.equal(this.region);
    });
  });

  describe('when adding regions in a layoutViews options', function() {
    beforeEach(function() {
      var suite = this;

      this.CustomRegion = this.sinon.spy();
      this.regionOptions = {
        war: '.craft',
        is: {
          regionClass: this.CustomRegion,
          selector: '#a-fun-game'
        }
      };

      this.layoutView = new Backbone.Marionette.LayoutView({
        template: this.template,
        regions: this.regionOptions
      });

      this.layoutView2 = new Backbone.Marionette.LayoutView({
        template: this.template,
        regions: function() {
          return suite.regionOptions;
        }
      });
    });

    it('should lookup and set the regions', function() {
      expect(this.layoutView.getRegion('is')).to.exist;
      expect(this.layoutView.getRegion('war')).to.exist;
    });

    it('should lookup and set the regions when passed a function', function() {
      expect(this.layoutView2.getRegion('is')).to.exist;
      expect(this.layoutView2.getRegion('war')).to.exist;
    });

    it('should set custom region classes', function() {
      expect(this.CustomRegion).to.have.been.called;
    });
  });

  describe('overiding default regionManager', function() {
    beforeEach(function() {
      var suite = this;
      this.spy     = this.sinon.spy();
      this.layout  = new (Marionette.LayoutView.extend({
        getRegionManager: function() {
          suite.spy.apply(this, arguments);
          return new Marionette.RegionManager();
        }
      }))();
    });

    it('should call into the custom regionManager lookup', function() {
      expect(this.spy).to.have.been.called;
    });

    it('should call the custom regionManager with the view as the context', function() {
      expect(this.spy).to.have.been.calledOn(this.layout);
    });
  });

  describe('childView get onDomRefresh from parent', function() {
    beforeEach(function() {
      var suite = this;
      this.setFixtures('<div id="james-kyle"></div>');
      this.spy = this.sinon.spy();
      this.spy2 = this.sinon.spy();

      this.ItemView = Marionette.ItemView.extend({
        template: _.template('<yes><my><lord></lord></my></yes>'),
        onDomRefresh: this.spy2
      });

      this.LucasArts = Marionette.CollectionView.extend({
        onDomRefresh: this.spy,
        childView: this.ItemView
      });

      this.Layout = Marionette.LayoutView.extend({
        template: _.template('<sam class="and-max"></sam>'),
        regions: {
          'sam': '.and-max'
        },

        onShow: function() {
          this.getRegion('sam').show(new suite.LucasArts({collection: new Backbone.Collection([{}])}));
        }
      });

      this.region = new Marionette.Region({el: "#james-kyle"});

      this.region.show(new this.Layout());
    });

    it('should call onDomRefresh on region views when shown within the parents onShow', function() {
      expect(this.spy).to.have.been.called;
    });

    it('should call onDomRefresh on region view children when shown within the parents onShow', function() {
      expect(this.spy2).to.have.been.called;
    });
  });
});
