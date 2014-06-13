describe('region', function() {
  'use strict';

  describe('when creating a new region and no configuration has been provided', function() {
    it('should throw an exception saying an "el" is required', function() {
      expect(function () {
        return new Backbone.Marionette.Region();
      }).toThrow('An "el" must be specified for a region.');
    });
  });

  describe('when passing an el DOM reference in directly', function() {
    beforeEach(function() {
      setFixtures('<div id="region"></div>');
      this.el = $('#region')[0];

      this.customRegion = new (Backbone.Marionette.Region.extend({
        el: this.el
      }))();

      this.optionRegion = new Backbone.Marionette.Region({el: this.el});

      this.optionRegionJquery = new Backbone.Marionette.Region({el: $(this.el)});
    });

    it('should work when el is passed in as an option', function() {
      expect(this.optionRegionJquery.$el[0]).toEqual(this.el);
      expect(this.optionRegionJquery.el).toEqual(this.el);
    });

    it('should handle when the el option is passed in as a jquery selector', function() {
      expect(this.optionRegion.$el[0]).toEqual(this.el);
    });

    it('should work when el is set in the region extend', function() {
      expect(this.customRegion.$el[0]).toEqual(this.el);
    });

    it('should complain if the el passed in as an option is invalid', function() {
      expect(function() {
        Backbone.Marionette.Region({el: $("the-ghost-of-lechuck")[0]});
      }).toThrow();
    });

    it('should complain if the el passed in via an extended region is invalid', function() {
      expect(function() {
        (Backbone.Marionette.Region.extend({el: $("the-ghost-of-lechuck")[0]}))();
      }).toThrow();
    });
  });

  describe('when creating a new region and the "el" does not exist in DOM', function() {
    var MyRegion = Backbone.Marionette.Region.extend({
      el: '#not-existed-region'
    });

    var MyView = Backbone.Marionette.View.extend({
      render: function() {
        $(this.el).html('some content');
      }
    });

    var myRegion;

    beforeEach(function() {
      setFixtures('<div id="region"></div>');
      myRegion = new MyRegion();
    });

    describe('when showing a view', function() {
      it('should throw an exception saying an "el" doesnt exist in DOM', function() {
        var view = new MyView();
        expect(function() {
          myRegion.show(view);
        }).toThrow('An "el" #not-existed-region must exist in DOM');
      });
    });
  });

  describe('when showing an initial view', function() {
    var MyRegion = Backbone.Marionette.Region.extend({
      el: '#region',

      onShow: function() {},

      onSwap: function() {}
    });

    var MyView = Backbone.View.extend({
      render: function() {
        $(this.el).html('some content');
      },

      destroy: function() {},

      onShow: function() {
        $(this.el).addClass('onShowClass');
      }
    });

    var myRegion, view, showSpy, regionBeforeShowSpy, swapSpy, regionBeforeSwapSpy, regionSwapSpy, viewBeforeShowSpy, setHtmlSpy;

    beforeEach(function() {
      setFixtures('<div id="region"></div>');
      showSpy = sinon.spy();
      regionBeforeShowSpy = sinon.spy();
      regionBeforeSwapSpy = sinon.spy();
      regionSwapSpy = sinon.spy();
      viewBeforeShowSpy = sinon.spy();

      view = new MyView();
      spyOn(view, 'render').andCallThrough();

      myRegion = new MyRegion();
      spyOn(myRegion, 'onShow');
      setHtmlSpy = sinon.spy(myRegion, 'setHtml');
      swapSpy = sinon.spy(myRegion, 'onSwap');

      myRegion.on('show', showSpy);
      myRegion.on('before:show', regionBeforeShowSpy);
      myRegion.on('before:swap', regionBeforeSwapSpy);
      myRegion.on('swap', regionSwapSpy);

      view.on('before:show', viewBeforeShowSpy);

      myRegion.show(view);
    });

    it('should render the view', function() {
      expect(view.render).toHaveBeenCalled();
    });

    it('should set $el and el', function() {
      expect(myRegion.$el[0]).toEqual(myRegion.el);
    });

    it('should append the rendered HTML to the managers "el"', function() {
      expect(myRegion.$el).toHaveHtml(view.el);
    });

    it('should call region setHtml', function() {
      expect(setHtmlSpy).toHaveBeenCalled();
    });

    it('should call "onShow" for the view, after the rendered HTML has been added to the DOM', function() {
      expect($(view.el)).toHaveClass('onShowClass');
    });

    it('should call "onShow" for the region, after the rendered HTML has been added to the DOM', function() {
      expect(myRegion.onShow).toHaveBeenCalled();
    });

    it('should trigger a show event for the view', function() {
      expect(showSpy).toHaveBeenCalled();
    });

    it('should trigger a before show event for the region', function() {
      expect(regionBeforeShowSpy).toHaveBeenCalled();
    });

    it('should trigger a before show event for the view', function() {
      expect(viewBeforeShowSpy).toHaveBeenCalled();
    });

    it('should trigger a before show before setHtml is called', function() {
      expect(regionBeforeShowSpy.calledBefore(setHtmlSpy)).toBe(true);
    });

    it('should pass the shown view as an argument for the show event', function() {
      expect(showSpy).toHaveBeenCalledWith(view);
    });

    it('should set "this" to the manager, from the show event', function() {
      expect(showSpy).toHaveBeenCalledOn(myRegion);
    });

    it('should not trigger a before swap event for the region', function() {
      expect(regionBeforeSwapSpy.callCount).toEqual(0);
    });

    it('should not trigger a swap event for the region', function() {
      expect(regionSwapSpy.callCount).toEqual(0);
    });

    it('should not call the `onSwap` function on the region', function() {
      expect(swapSpy.callCount).toEqual(0);
    });

    describe('and then showing a different view', function() {
      beforeEach(function() {
        this.view2 = new MyView();
        myRegion.show(this.view2);
      });

      it('should trigger a before swap event for the region', function() {
        expect(regionBeforeSwapSpy).toHaveBeenCalled();
      });

      it('should trigger a swap event for the region', function() {
        expect(regionSwapSpy).toHaveBeenCalled();
      });

      it('should call the `onSwap` function on the region', function() {
        expect(swapSpy).toHaveBeenCalled();
      });

      it('should pass the swapped view as an argument for the swap event', function() {
        expect(swapSpy).toHaveBeenCalledWith(this.view2);
      });

      it('should set "this" to the manager, from the swap event', function() {
        expect(swapSpy).toHaveBeenCalledOn(myRegion);
      });
    });

    describe('when passing "preventDestroy" option', function() {
      var MyView2 = Backbone.View.extend({
        render: function() {
          $(this.el).html('some more content');
        },

        destroy: function() {},

        onShow: function() {
          $(this.el).addClass('onShowClass');
        }
      });

      var myRegion, view1, view2;

      beforeEach(function() {
        setFixtures('<div id="region"></div>');

        view1 = new MyView();
        view2 = new MyView2();
        myRegion = new MyRegion();

        spyOn(view1, 'destroy').andCallThrough();

        myRegion.show(view1);
      });

      describe('preventDestroy: true', function() {
        beforeEach(function() {
          myRegion.show(view2, {preventDestroy: true});
        });

        it('shouldnt "destroy" the old view', function() {
          expect(view1.destroy.callCount).toEqual(0);
        });

        it('should replace the content in the DOM', function() {
          expect(myRegion.$el).toHaveText('some more content');
          expect(myRegion.$el).not.toHaveText('some content');
        });
      });

      describe('preventDestroy: false', function() {
        beforeEach(function() {
          myRegion.show(view2, {preventDestroy: false});
        });

        it('should "destroy" the old view', function() {
          expect(view1.destroy).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when showing nested views', function() {
    var MyRegion, LayoutView, SubView, region, setHtmlSpy,
      innerRegionBeforeShowSpy, innerRegionShowSpy;

    MyRegion = Backbone.Marionette.Region.extend({
      el: '#region'
    });

    LayoutView = Backbone.Marionette.LayoutView.extend({
      regions: {
        subRegion: '.sub-region'
      },

      render: function() {
        $(this.el).html('<div class="sub-region"></div><div>some content</div>');
      },

      onBeforeShow: function() {
        this.subRegion.show(new SubView());
      }
    });

    SubView = Backbone.Marionette.ItemView.extend({
      render: function() {
        $(this.el).html('some content');
      },

      initialize: function() {
        innerRegionBeforeShowSpy = sinon.spy();
        innerRegionShowSpy = sinon.spy();
        this.on('before:show', innerRegionBeforeShowSpy);
        this.on('show', innerRegionShowSpy);
      }
    });

    beforeEach(function() {
      setFixtures('<div id="region"></div>');
      region = new MyRegion();
      setHtmlSpy = sinon.spy(region, 'setHtml');
      region.show(new LayoutView());
    });

    it('should call inner region before:show before region setHtml', function() {
      expect(innerRegionBeforeShowSpy.calledBefore(setHtmlSpy)).toBe(true);
    });

    it('should call inner region show before region setHtml', function() {
      expect(innerRegionShowSpy.calledBefore(setHtmlSpy)).toBe(true);
    });

    it('should call inner region before:show before inner region show', function() {
      expect(innerRegionBeforeShowSpy.calledBefore(innerRegionShowSpy)).toBe(true);
    });
  });

  describe('when a view is already shown and showing another', function() {
    var MyRegion = Backbone.Marionette.Region.extend({
      el: '#region'
    });

    var MyView = Backbone.View.extend({
      render: function() {
        $(this.el).html('some content');
      },

      destroy: function() {}
    });

    var myRegion, view1, view2;

    beforeEach(function() {
      setFixtures('<div id="region"></div>');

      view1 = new MyView();
      view2 = new MyView();
      myRegion = new MyRegion();

      spyOn(view1, 'destroy');

      myRegion.show(view1);
      myRegion.show(view2);
    });

    it('should call "destroy" on the already open view', function() {
      expect(view1.destroy).toHaveBeenCalled();
    });

    it('should reference the new view as the current view', function() {
      expect(myRegion.currentView).toBe(view2);
    });
  });

  describe('when a view is already shown and showing the same one', function() {
    var MyRegion = Backbone.Marionette.Region.extend({
      el: '#region'
    });

    var MyView = Backbone.View.extend({
      render: function() {
        $(this.el).html('some content');
      },

      destroy: function() {},
      setHtml: function() {}
    });

    var myRegion, view;

    beforeEach(function() {
      setFixtures('<div id="region"></div>');

      view = new MyView();
      myRegion = new MyRegion();
      myRegion.show(view);

      spyOn(view, 'destroy');
      spyOn(myRegion, 'setHtml');
      spyOn(view, 'render');
      myRegion.show(view);
    });

    it('should not call "destroy" on the view', function() {
      expect(view.destroy).not.toHaveBeenCalled();
    });

    it('should not call "setHtml" on the view', function() {
      expect(myRegion.setHtml).not.toHaveBeenCalledWith(view);
    });

    it('should not call "render" on the view', function() {
      expect(view.render).not.toHaveBeenCalled();
    });
  });

  describe('when a view is already shown and showing the same one with a forceShow flag', function() {
    var MyRegion = Backbone.Marionette.Region.extend({
      el: '#region'
    });

    var MyView = Backbone.View.extend({
      render: function() {
        $(this.el).html('some content');
      },

      destroy: function() {},
      setHtml: function() {}
    });

    var myRegion, view;

    beforeEach(function() {
      setFixtures('<div id="region"></div>');

      view = new MyView();
      myRegion = new MyRegion();
      myRegion.show(view);

      spyOn(view, 'destroy');
      spyOn(myRegion, 'setHtml');
      spyOn(view, 'render');
      myRegion.show(view, {forceShow: true});
    });

    it('should not call "destroy" on the view', function() {
      expect(view.destroy).not.toHaveBeenCalled();
    });

    it('should call "setHtml" on the view', function() {
      expect(myRegion.setHtml).toHaveBeenCalledWith(view);
    });

    it('should call "render" on the view', function() {
      expect(view.render).toHaveBeenCalled();
    });
  });

  describe('when a view is already shown but destroyed externally', function() {
    var MyRegion = Backbone.Marionette.Region.extend({
      el: '#region'
    });

    var MyView = Backbone.Marionette.ItemView.extend({
      template: _.template('<div></div>'),
      setHtml : function() {}
    });

    var myRegion, view;

    beforeEach(function() {
      setFixtures('<div id="region"></div>');

      view = new MyView();
      myRegion = new MyRegion();
      myRegion.show(view);
      view.destroy();

      spyOn(view, 'destroy');
      spyOn(myRegion, 'setHtml');
      spyOn(view, 'render').andCallThrough();
    });

    it('should not throw an error saying the views been destroyed if a destroyed view is passed in', function() {
      expect(function() {
        myRegion.show();
      }).not.toThrow(new Error('Cannot use a view thats already been destroyed.'));
    });
  });

  describe('when a view is already destroyed and showing another', function() {
    var MyRegion = Backbone.Marionette.Region.extend({
      el: '#region'
    });

    var MyView = Backbone.Marionette.View.extend({
      render: function() {
        $(this.el).html('some content');
      }
    });

    var myRegion, view1, view2;

    beforeEach(function() {
      setFixtures('<div id="region"></div>');

      view1 = new MyView();
      view2 = new MyView();
      myRegion = new MyRegion();

      spyOn(view1, 'destroy').andCallThrough();
    });

    it('shouldnt call "destroy" on an already destroyed view', function() {
      myRegion.show(view1);
      view1.destroy();
      myRegion.show(view2);

      expect(view1.destroy.callCount).toEqual(1);
    });
  });

  describe('when destroying the current view', function() {
    var MyRegion = Backbone.Marionette.Region.extend({
      el: '#region'
    });

    var MyView = Backbone.View.extend({
      render: function() {
        $(this.el).html('some content');
      },

      destroy: function() {}
    });

    var myRegion, view, beforeDestroySpy ,destroyedSpy;

    beforeEach(function() {
      setFixtures('<div id="region"></div>');
      beforeDestroySpy = sinon.spy();
      destroyedSpy = sinon.spy();

      view = new MyView();

      spyOn(view, 'destroy');
      spyOn(view, 'remove');

      myRegion = new MyRegion();
      myRegion.on('before:destroy', beforeDestroySpy);
      myRegion.on('destroy', destroyedSpy);
      myRegion.show(view);

      myRegion.destroy();
    });

    it('should trigger a "before:destroy" event with the view thats being destroyed', function() {
      expect(beforeDestroySpy).toHaveBeenCalledWith(view);
    });

    it('should set "this" to the manager, from the before:destroy event', function() {
      expect(beforeDestroySpy).toHaveBeenCalledOn(myRegion);
    });

    it('should trigger a destroy event', function() {
      expect(destroyedSpy).toHaveBeenCalled();
    });

    it('should trigger a destroy event with the view thats being destroyd', function() {
      expect(destroyedSpy).toHaveBeenCalledWith(view);
    });

    it('should set "this" to the manager, from the destroy event', function() {
      expect(destroyedSpy).toHaveBeenCalledOn(myRegion);
    });

    it('should call "destroy" on the already show view', function() {
      expect(view.destroy).toHaveBeenCalled();
    });

    it('should not call "remove" directly, on the view', function() {
      expect(view.remove).not.toHaveBeenCalled();
    });

    it('should delete the current view reference', function() {
      expect(myRegion.currentView).toBeUndefined();
    });
  });

  describe('when destroying the current view and it does not have a "destroy" method', function() {
    var MyRegion = Backbone.Marionette.Region.extend({
      el: '<div></div>'
    });

    var MyView = Backbone.View.extend({
      render: function() {
        $(this.el).html('some content');
      }
    });

    var myRegion, view;

    beforeEach(function() {
      view = new MyView();
      spyOn(view, 'remove');
      myRegion = new MyRegion();
      myRegion.show(view);
      myRegion.destroy();
    });

    it('should call "remove" on the view', function() {
      expect(view.remove).toHaveBeenCalled();
    });

  });

  describe('when initializing a region and passing an "el" option', function() {
    var region, el;

    beforeEach(function() {
      el = '#foo';
      region = new Backbone.Marionette.Region({
        el: el
      });
    });

    it('should manage the specified el', function() {
      expect(region.$el.selector).toBe(el);
    });
  });

  describe('when initializing a region with an existing view', function() {
    var region, view, View;

    beforeEach(function() {
      View = Backbone.View.extend({
        onShow: function() {}
      });

      view = new View();

      spyOn(view, 'render');
      spyOn(view, 'onShow');

      region = new Backbone.Marionette.Region({
        el: '#foo',
        currentView: view
      });
    });

    it('should not render the view', function() {
      expect(view.render).not.toHaveBeenCalled();
    });

    it('should not `show` the view', function() {
      expect(view.onShow).not.toHaveBeenCalled();
    });
  });

  describe('when attaching an existing view to a region', function() {
    var region, view, View;

    beforeEach(function() {
      setFixtures('<div id="foo">bar</div>');

      View = Backbone.View.extend({
        onShow: function() {}
      });

      view = new View();

      spyOn(view, 'render');
      spyOn(view, 'onShow');

      region = new Backbone.Marionette.Region({
        el: '#foo'
      });

      region.attachView(view);
    });

    it('should not render the view', function() {
      expect(view.render).not.toHaveBeenCalled();
    });

    it('should not `show` the view', function() {
      expect(view.onShow).not.toHaveBeenCalled();
    });

    it('should not replace the existing html', function() {
      expect($(region.el).text()).toBe('bar');
    });
  });

  describe('when creating a region instance with an initialize method', function() {
    var Region, region, expectedOptions;

    beforeEach(function() {
      expectedOptions = {foo: 'bar'};
      Region = Backbone.Marionette.Region.extend({
        el: '#foo',
        initialize: function() {}
      });

      spyOn(Region.prototype, 'initialize').andCallThrough();

      region = new Region({
        foo: 'bar'
      });
    });

    it('should call the initialize method with the options from the constructor', function() {
      expect(Region.prototype.initialize).toHaveBeenCalledWith(expectedOptions);
    });
  });

  describe('when removing a region', function() {
    var MyApp, region;

    beforeEach(function() {
      setFixtures('<div id="region"></div><div id="region2"></div>');

      MyApp = new Backbone.Marionette.Application();
      MyApp.addRegions({
        MyRegion: '#region',
        anotherRegion: '#region2'
      });

      region = MyApp.MyRegion;
      spyOn(region, 'destroy');

      MyApp.removeRegion('MyRegion');
    });

    it('should be removed from the app', function() {
      expect(MyApp.MyRegion).not.toBeDefined();
    });

    it('should call "destroy" of the region', function() {
      expect(region.destroy).toHaveBeenCalled();
    });
  });

  describe('when getting a region', function() {
    beforeEach(function() {
      this.MyApp = new Backbone.Marionette.Application();
      this.MyApp.addRegions({
        MyRegion: '#region',
        anotherRegion: '#region2'
      });

      this.region = this.MyApp.MyRegion;
    });

    it('should return the region', function() {
      expect(this.MyApp.getRegion('MyRegion')).toBe(this.region);
    });
  });

  describe('when resetting a region', function() {
    var region;

    beforeEach(function() {
      setFixtures('<div id="region"></div>');

      region = new Backbone.Marionette.Region({
        el: '#region'
      });

      spyOn(region, 'destroy');

      region._ensureElement();

      region.reset();
    });

    it('should not hold on to the regions previous "el"', function() {
      expect(region.$el).not.toExist();
    });

    it('should destroy any existing view', function() {
      expect(region.destroy).toHaveBeenCalled();
    });

  });
});
