describe('region', function() {
  'use strict';

  describe('when creating a new region and no configuration has been provided', function() {
    it('should throw an exception saying an "el" is required', function() {
      expect(function() {
        return new Backbone.Marionette.Region();
      }).to.throw('An "el" must be specified for a region.');
    });
  });

  describe('when passing an el DOM reference in directly', function() {
    beforeEach(function() {
      this.setFixtures('<div id="region"></div>');
      this.el = $('#region')[0];

      this.customRegion = new (Backbone.Marionette.Region.extend({
        el: this.el
      }))();

      this.optionRegion = new Backbone.Marionette.Region({el: this.el});

      this.optionRegionJquery = new Backbone.Marionette.Region({el: $(this.el)});
    });

    it('should work when el is passed in as an option', function() {
      expect(this.optionRegionJquery.$el[0]).to.equal(this.el);
      expect(this.optionRegionJquery.el).to.equal(this.el);
    });

    it('should handle when the el option is passed in as a jquery selector', function() {
      expect(this.optionRegion.$el[0]).to.equal(this.el);
    });

    it('should work when el is set in the region extend', function() {
      expect(this.customRegion.$el[0]).to.equal(this.el);
    });

    it('should not have a view', function() {
      expect(this.customRegion.hasView()).to.equal(false);
      expect(this.optionRegion.hasView()).to.equal(false);
    });

    it('should complain if the el passed in as an option is invalid', function() {
      expect(function() {
        Backbone.Marionette.Region({el: $('the-ghost-of-lechuck')[0]});
      }).to.throw;
    });

    it('should complain if the el passed in via an extended region is invalid', function() {
      expect(function() {
        (Backbone.Marionette.Region.extend({el: $('the-ghost-of-lechuck')[0]}))();
      }).to.throw;
    });
  });

  describe('when creating a new region and the "el" does not exist in DOM', function() {
    beforeEach(function() {
      this.MyRegion = Backbone.Marionette.Region.extend({
        el: '#not-existed-region'
      });

      this.MyView = Backbone.Marionette.View.extend({
        render: function() {
          $(this.el).html('some content');
        }
      });
      this.myView = new this.MyView();

      this.setFixtures('<div id="region"></div>');
    });

    describe('when showing a view', function() {
      describe('when allowMissingEl is not set', function() {
        beforeEach(function() {
          this.myRegion = new this.MyRegion();
        });

        it('should throw an exception saying an "el" doesnt exist in DOM', function() {
          expect(function() {
            this.myRegion.show(new this.MyView());
          }.bind(this)).to.throw('An "el" #not-existed-region must exist in DOM');
        });

        it('should not have a view', function() {
          expect(this.myRegion.hasView()).to.be.false;
        });
      });

      describe('when allowMissingEl is set', function() {
        beforeEach(function() {
          this.myRegion = new this.MyRegion({allowMissingEl: true});
        });

        it('should not throw an exception', function() {
          expect(function() {
            this.myRegion.show(new this.MyView());
          }.bind(this)).not.to.throw();
        });

        it('should not have a view', function() {
          expect(this.myRegion.hasView()).to.be.false;
        });

        it('should not render the view', function() {
          sinon.spy(this.myView, 'render');
          this.myRegion.show(this.myView);
          expect(this.myView.render).not.to.have.been.called;
        });
      });
    });
  });

  describe('when showing an initial view', function() {
    beforeEach(function() {
      this.MyRegion = Backbone.Marionette.Region.extend({
        el: '#region',
        onBeforeShow: function() {},
        onShow: function() {},
        onSwap: function() {},
        onBeforeSwapOut: function() {},
        onSwapOut: function() {}
      });

      this.MyView = Backbone.View.extend({
        events: {
          'click': function() {}
        },
        render: function() {
          $(this.el).html('some content');
        },
        destroy: function() {},
        onBeforeShow: function() {},
        onShow: function() {
          $(this.el).addClass('onShowClass');
        }
      });

      this.setFixtures('<div id="region"></div>');
      this.regionShowSpy = this.sinon.spy();
      this.regionBeforeShowSpy = this.sinon.spy();
      this.regionBeforeSwapSpy = this.sinon.spy();
      this.regionSwapSpy = this.sinon.spy();
      this.viewBeforeShowSpy = this.sinon.spy();
      this.viewShowSpy = this.sinon.spy();
      this.regionEmptySpy = this.sinon.spy();
      this.regionBeforeEmptySpy = this.sinon.spy();

      this.view = new this.MyView();
      this.viewRenderSpy = this.sinon.spy(this.view, 'render');
      this.viewOnBeforeShowSpy = this.sinon.spy(this.view, 'onBeforeShow');
      this.viewOnShowSpy = this.sinon.spy(this.view, 'onShow');

      this.myRegion = new this.MyRegion();
      this.regionOnBeforeShowSpy = this.sinon.spy(this.myRegion, 'onBeforeShow');
      this.regionOnShowSpy = this.sinon.spy(this.myRegion, 'onShow');
      this.regionOnAttachHtmlSpy = this.sinon.spy(this.myRegion, 'attachHtml');
      this.regionOnSwapSpy = this.sinon.spy(this.myRegion, 'onSwap');
      this.regionOnBeforeSwapOutSpy = this.sinon.spy(this.myRegion, 'onBeforeSwapOut');
      this.regionOnSwapOutSpy = this.sinon.spy(this.myRegion, 'onSwapOut');

      this.myRegion.on('show', this.regionShowSpy);
      this.myRegion.on('before:show', this.regionBeforeShowSpy);
      this.myRegion.on('before:swap', this.regionBeforeSwapSpy);
      this.myRegion.on('swap', this.regionSwapSpy);
      this.myRegion.on('empty', this.regionEmptySpy);
      this.myRegion.on('before:empty', this.regionBeforeEmptySpy);
      this.view.on('before:show', this.viewBeforeShowSpy);
      this.view.on('show', this.viewShowSpy);

      this.sinon.spy(this.myRegion, 'show');

      this.showOptions = {foo: 'bar'};
      this.myRegion.show(this.view, this.showOptions);
    });

    it('should render the view', function() {
      expect(this.viewRenderSpy).to.have.been.called;
    });

    it('should have a view', function() {
      expect(this.myRegion.hasView()).to.equal(true);
    });

    it('should reference region', function() {
      expect(this.view._parent).to.deep.equal(this.myRegion);
    });

    it('should set $el and el', function() {
      expect(this.myRegion.$el[0]).to.equal(this.myRegion.el);
    });

    it('should append the rendered HTML to the managers "el"', function() {
      expect(this.myRegion.$el).to.contain.$html(this.view.$el.html());
    });

    it('should call region attachHtml', function() {
      expect(this.regionOnAttachHtmlSpy).to.have.been.called;
    });

    it('should call "onShow" for the view, after the rendered HTML has been added to the DOM', function() {
      expect(this.viewOnShowSpy).to.have.been.called;
      expect($(this.view.el)).to.have.$class('onShowClass');
    });

    it('should pass the shown view, region and options arguments to the view "onShow"', function() {
      expect(this.viewOnShowSpy).to.have.been.calledWith(this.view, this.myRegion, this.showOptions);
    });

    it('should call "onShow" for the region, after the rendered HTML has been added to the DOM', function() {
      expect(this.regionOnShowSpy).to.have.been.called;
    });

    it('should pass the shown view, region and options arguments to the region "onShow"', function() {
      expect(this.regionOnShowSpy).to.have.been.calledWith(this.view, this.myRegion, this.showOptions);
    });

    it('should trigger a show event for the region', function() {
      expect(this.regionShowSpy).to.have.been.called;
    });

    it('should pass the shown view, region and options arguments to the region show listener event', function() {
      expect(this.regionShowSpy).to.have.been.calledWith(this.view, this.myRegion, this.showOptions);
    });

    it('should trigger a before show event for the region', function() {
      expect(this.regionBeforeShowSpy).to.have.been.called;
    });

    it('should pass the shown view, region and options arguments to the region before show event listener', function() {
      expect(this.regionBeforeShowSpy).to.have.been.calledWith(this.view, this.myRegion, this.showOptions);
    });

    it('should pass the shown view, region and options arguments to the region "onBeforeShow"', function() {
      expect(this.regionOnBeforeShowSpy).to.have.been.calledWith(this.view, this.myRegion, this.showOptions);
    });

    it('should trigger a before show event for the view', function() {
      expect(this.viewBeforeShowSpy).to.have.been.called;
    });

    it('should pass the shown view, region and options arguments to the view before show listener event', function() {
      expect(this.viewBeforeShowSpy).to.have.been.calledWith(this.view, this.myRegion, this.showOptions);
    });

    it('should pass the shown view, region and options arguments to the view "onBeforeShow"', function() {
      expect(this.viewOnBeforeShowSpy).to.have.been.calledWith(this.view, this.myRegion, this.showOptions);
    });

    it('should trigger a show event for the view', function() {
      expect(this.viewShowSpy).to.have.been.calledOnce;
    });

    it('should pass the shown view, region and options arguments to the view show listener event', function() {
      expect(this.viewShowSpy).to.have.been.calledWith(this.view, this.myRegion, this.showOptions);
    });

    it('should trigger a before show before attachHtml is called', function() {
      expect(this.regionBeforeShowSpy.calledBefore(this.regionOnAttachHtmlSpy)).to.be.true;
    });

    it('should pass the shown view, region and options arguments to the region show listener event', function() {
      expect(this.regionShowSpy).to.have.been.calledWith(this.view, this.myRegion, this.showOptions);
    });

    it('should set "this" to the manager, from the show event', function() {
      expect(this.regionShowSpy).to.have.been.calledOn(this.myRegion);
    });

    it('should not trigger a before swap event for the region', function() {
      expect(this.regionBeforeSwapSpy).to.have.not.been.called;
    });

    it('should not trigger a beforeSwapOut event for the region', function() {
      expect(this.regionOnBeforeSwapOutSpy).to.have.not.been.called;
    });

    it('should not trigger a swapOut event for the region', function() {
      expect(this.regionOnSwapOutSpy).to.have.not.been.called;
    });

    it('should not trigger a swap event for the region', function() {
      expect(this.regionSwapSpy).to.have.not.been.called;
    });

    it('should not call the `onSwap` function on the region', function() {
      expect(this.regionOnSwapSpy).to.have.not.been.called;
    });

    it('should return the region', function() {
      expect(this.myRegion.show).to.have.returned(this.myRegion);
    });

    describe('and then showing a different view', function() {
      beforeEach(function() {
        this.view = this.myRegion.currentView;

        this.regionEmptySpy.reset();
        this.regionBeforeEmptySpy.reset();
        this.regionOnBeforeSwapOutSpy.reset();
        this.regionOnSwapOutSpy.reset();

        this.view2 = new this.MyView();
        this.otherOptions = {
          bar: 'foo'
        };
        this.myRegion.show(this.view2, this.otherOptions);
      });

      it('should trigger a before swap event for the region', function() {
        expect(this.regionBeforeSwapSpy).to.have.been.called;
      });

      it('should pass the shown view, region and options arguments to the regions before swap event', function() {
        expect(this.regionBeforeSwapSpy).to.have.been.calledWith(this.view2, this.myRegion, this.otherOptions);
      });

      it('should trigger empty once', function() {
        expect(this.regionEmptySpy).to.have.been.calledOnce;
        expect(this.regionBeforeEmptySpy).to.have.been.calledOnce;
      });

      it('should trigger a swap event for the region', function() {
        expect(this.regionSwapSpy).to.have.been.called;
      });

      it('should pass the swapped view, region and options as arguments for the swap event for the region', function() {
        expect(this.regionSwapSpy).to.have.been.calledWith(this.view2, this.myRegion, this.otherOptions);
      });

      it('should call the `onSwap` function on the region', function() {
        expect(this.regionOnSwapSpy).to.have.been.called;
      });

      it('should pass the swapped view, region and options as arguments for the swap event', function() {
        expect(this.regionOnSwapSpy).to.have.been.calledWith(this.view2, this.myRegion, this.otherOptions);
      });

      it('should set "this" to the manager, from the swap event', function() {
        expect(this.regionOnSwapSpy).to.have.been.calledOn(this.myRegion);
      });

      it('should still have a view', function() {
        expect(this.myRegion.hasView()).to.equal(true);
      });

      it('should reference region', function() {
        expect(this.view2._parent).to.deep.equal(this.myRegion);
      });

      it('old view should not reference region', function() {
        expect(this.view._parent).to.be.undefined;
      });

      it('should trigger a beforeSwapOut event for the region', function() {
        expect(this.regionOnBeforeSwapOutSpy)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.myRegion)
        .and.to.have.been.calledWith(this.view, this.myRegion, this.otherOptions);
      });

      it('should trigger a swapOut event for the region', function() {
        expect(this.regionOnSwapOutSpy).to.have.been.calledOnce
        .and.to.have.been.calledOn(this.myRegion)
        // see issue #2055
        .and.to.have.been.calledWith(undefined, this.myRegion, this.otherOptions);
      });
    });

    describe('when passing "preventDestroy" option', function() {
      beforeEach(function() {
        this.MyRegion = Backbone.Marionette.Region.extend({
          el: '#region',
          onShow: function() {},
          onSwap: function() {}
        });

        this.MyView2 = Backbone.View.extend({
          render: function() {
            $(this.el).html('some more content');
          },

          destroy: function() {},

          onShow: function() {
            $(this.el).addClass('onShowClass');
          }
        });

        this.setFixtures('<div id="region"></div>');

        this.view1 = new this.MyView();
        this.view2 = new this.MyView2();
        this.myRegion = new this.MyRegion();

        this.sinon.spy(this.view1, 'destroy');
        this.sinon.spy(this.view1, 'off');
        this.sinon.spy(this.view2, 'destroy');

        this.myRegion.show(this.view1);
      });

      describe('preventDestroy: true', function() {
        beforeEach(function() {
          this.myRegion.show(this.view2, {preventDestroy: true});
        });

        it('shouldnt "destroy" the old view', function() {
          expect(this.view1.destroy.callCount).to.equal(0);
        });

        it('view1 should not reference region', function() {
          expect(this.view1._parent).to.be.undefined;
        });

        it('should remove destroy listener from old view', function() {
          expect(this.view1.off).to.be.calledOnce;
        });

        it('should not empty region after destorying old view', function() {
          expect(this.view1.off).to.be.calledOnce;
          this.view1.destroy();
          expect(this.view2.destroy).not.to.have.been.called;
        });

        it('should replace the content in the DOM', function() {
          expect(this.myRegion.$el).to.contain.$text('some more content');
          expect(this.myRegion.$el).not.to.contain.$text('some content');
        });

        // https://github.com/marionettejs/backbone.marionette/issues/2159#issue-52745401
        it('should still have view1\'s, event bindings', function() {
          expect(jQuery._data(this.view.el, 'events').click).to.be.defined;
        });
      });

      describe('preventDestroy: false', function() {
        beforeEach(function() {
          this.myRegion.show(this.view2, {preventDestroy: false});
        });

        it('should "destroy" the old view', function() {
          expect(this.view1.destroy).to.have.been.called;
        });

        it('view1 should not reference region', function() {
          expect(this.view1._parent).to.be.undefined;
        });
      });
    });
  });

  describe('when showing nested views', function() {
    beforeEach(function() {
      var suite = this;

      this.MyRegion = Backbone.Marionette.Region.extend({
        el: '#region'
      });

      this.LayoutView = Backbone.Marionette.LayoutView.extend({
        regions: {
          subRegion: '.sub-region'
        },

        render: function() {
          $(this.el).html('<div class="sub-region"></div><div>some content</div>');
        },

        onBeforeShow: function() {
          this.subRegion.show(new suite.SubView());
        }
      });

      this.SubView = Backbone.Marionette.ItemView.extend({
        render: function() {
          $(this.el).html('some content');
        },

        initialize: function() {
          suite.innerRegionBeforeShowSpy = suite.sinon.spy();
          suite.innerRegionShowSpy = suite.sinon.spy();
          this.on('before:show', suite.innerRegionBeforeShowSpy);
          this.on('show', suite.innerRegionShowSpy);
        }
      });

      this.setFixtures('<div id="region"></div>');
      this.region = new this.MyRegion();
      this.attachHtmlSpy = this.sinon.spy(this.region, 'attachHtml');
      this.region.show(new this.LayoutView());
    });

    it('should call inner region before:show before region open', function() {
      expect(this.innerRegionBeforeShowSpy.calledBefore(this.attachHtmlSpy)).to.be.true;
    });

    it('should call inner region show before region attachHtml', function() {
      expect(this.innerRegionShowSpy.calledBefore(this.attachHtmlSpy)).to.be.true;
    });

    it('should call inner region before:show before inner region show', function() {
      expect(this.innerRegionBeforeShowSpy.calledBefore(this.innerRegionShowSpy)).to.be.true;
    });
  });

  describe('when a view is already shown and showing another', function() {
    beforeEach(function() {
      this.MyRegion = Backbone.Marionette.Region.extend({
        el: '#region'
      });

      this.MyView = Backbone.View.extend({
        render: function() {
          $(this.el).html('some content');
        },

        destroy: function() {}
      });

      this.setFixtures('<div id="region"></div>');

      this.view1 = new this.MyView();
      this.view2 = new this.MyView();
      this.myRegion = new this.MyRegion();

      this.sinon.spy(this.view1, 'destroy');

      this.myRegion.show(this.view1);
      this.myRegion.show(this.view2);
    });

    it('should call "destroy" on the already open view', function() {
      expect(this.view1.destroy).to.have.been.called;
    });

    it('should reference the new view as the current view', function() {
      expect(this.myRegion.currentView).to.equal(this.view2);
    });
  });

  describe('when a view is already shown and showing the same one', function() {
    beforeEach(function() {
      this.MyRegion = Backbone.Marionette.Region.extend({
        el: '#region'
      });

      this.MyView = Backbone.View.extend({
        render: function() {
          $(this.el).html('some content');
        },
        destroy: function() {},
        attachHtml: function() {}
      });

      this.setFixtures('<div id="region"></div>');

      this.view = new this.MyView();
      this.myRegion = new this.MyRegion();
      this.myRegion.show(this.view);

      this.sinon.spy(this.view, 'destroy');
      this.sinon.spy(this.myRegion, 'attachHtml');
      this.sinon.spy(this.view, 'render');
      this.myRegion.show(this.view);
    });

    it('should not call "destroy" on the view', function() {
      expect(this.view.destroy).not.to.have.been.called;
    });

    it('should not call "attachHtml" on the view', function() {
      expect(this.myRegion.attachHtml).not.to.have.been.calledWith(this.view);
    });

    it('should not call "render" on the view', function() {
      expect(this.view.render).not.to.have.been.called;
    });
  });

  describe('when a view is already shown and showing the same one with a forceShow flag', function() {
    beforeEach(function() {
      this.MyRegion = Backbone.Marionette.Region.extend({
        el: '#region'
      });

      this.MyView = Backbone.View.extend({
        render: function() {
          $(this.el).html('some content');
        },

        destroy: function() {},
        attachHtml: function() {}
      });

      this.setFixtures('<div id="region"></div>');

      this.view = new this.MyView();
      this.myRegion = new this.MyRegion();
      this.myRegion.show(this.view);

      this.sinon.spy(this.view, 'destroy');
      this.sinon.spy(this.myRegion, 'attachHtml');
      this.sinon.spy(this.view, 'render');
      this.myRegion.show(this.view, {forceShow: true});
    });

    it('should not call "destroy" on the view', function() {
      expect(this.view.destroy).not.to.have.been.called;
    });

    it('should call "attachHtml" on the view', function() {
      expect(this.myRegion.attachHtml).to.have.been.calledWith(this.view);
    });

    it('should call "render" on the view', function() {
      expect(this.view.render).to.have.been.called;
    });
  });

  describe('when a view is already shown but destroyed externally', function() {
    beforeEach(function() {
      this.MyRegion = Backbone.Marionette.Region.extend({
        el: '#region'
      });

      this.MyView = Backbone.Marionette.ItemView.extend({
        template: _.template('<div></div>'),
        open : function() {}
      });

      this.setFixtures('<div id="region"></div>');

      this.view = new this.MyView();
      this.myRegion = new this.MyRegion();
      this.myRegion.show(this.view);
      this.view.destroy();

      this.sinon.spy(this.view, 'destroy');
      this.sinon.spy(this.myRegion, 'attachHtml');
      this.sinon.spy(this.view, 'render');
    });

    it('should not throw an error saying the views been destroyed if a destroyed view is passed in', function() {
      expect(function() {
        this.myRegion.show();
      }).not.to.throw(new Error('View (cid: "' + this.view.cid +
          '") has already been destroyed and cannot be used.'));
    });
  });

  describe('when a view is already destroyed and showing another', function() {
    beforeEach(function() {
      this.MyRegion = Backbone.Marionette.Region.extend({
        el: '#region'
      });

      this.MyView = Backbone.Marionette.View.extend({
        render: function() {
          $(this.el).html('some content');
        }
      });

      this.setFixtures('<div id="region"></div>');

      this.view1 = new this.MyView();
      this.view2 = new this.MyView();
      this.myRegion = new this.MyRegion();

      this.sinon.spy(this.view1, 'destroy');
    });

    it('shouldnt call "destroy" on an already destroyed view', function() {
      this.myRegion.show(this.view1);
      this.view1.destroy();
      this.myRegion.show(this.view2);

      expect(this.view1.destroy.callCount).to.equal(1);
    });
  });

  describe('when passing options to empty', function() {
    beforeEach(function() {
      this.MyRegion = Backbone.Marionette.Region.extend({
        el: '#region'
      });

      this.setFixtures('<div id="region"></div>');
      this.MyView = Backbone.View.extend({
        render: function() {
          $(this.el).html('some content');
        },

        destroy: function() {}
      });

      this.myRegion = new this.MyRegion();
      this.view = new this.MyView();
      this.sinon.spy(this.view, 'destroy');
      this.myRegion.show(this.view);
    });

    describe('preventDestroy: true', function() {
      beforeEach(function() {
        this.myRegion.empty({preventDestroy: true});
      });
      it('should not destroy view', function() {
        expect(this.view.destroy).to.have.been.not.called;
      });

      it('should clear region contents', function() {
        expect(this.myRegion.$el.html()).to.eql('');
      });
    });

    describe('preventDestroy: false', function() {
      beforeEach(function() {
        this.myRegion.empty({preventDestroy: false});
      });
      it('should destroy view', function() {
        expect(this.view.destroy).to.have.been.called;
      });
    });
    describe('preventDestroy undefined', function() {
      beforeEach(function() {
        this.myRegion.empty({});
      });
      it('should destroy view', function() {
        expect(this.view.destroy).to.have.been.called;
      });
    });
  });

  describe('when destroying the current view', function() {
    beforeEach(function() {
      this.MyRegion = Backbone.Marionette.Region.extend({
        el: '#region'
      });

      this.MyView = Backbone.View.extend({
        render: function() {
          $(this.el).html('some content');
        },

        destroy: function() {}
      });

      this.setFixtures('<div id="region"></div>');
      this.beforeEmptySpy = this.sinon.spy();
      this.emptySpy = this.sinon.spy();

      this.view = new this.MyView();

      this.sinon.spy(this.view, 'destroy');
      this.sinon.spy(this.view, 'remove');

      this.myRegion = new this.MyRegion();
      this.myRegion.on('before:empty', this.beforeEmptySpy);
      this.myRegion.on('empty', this.emptySpy);
      this.myRegion.show(this.view);

      this.sinon.spy(this.myRegion, 'empty');
      this.myRegion.empty();
    });

    it('should trigger a "before:empty" event with the view thats being destroyed', function() {
      expect(this.beforeEmptySpy).to.have.been.calledWith(this.view);
    });

    it('should set "this" to the manager, from the before:empty event', function() {
      expect(this.beforeEmptySpy).to.have.been.calledOn(this.myRegion);
    });

    it('should trigger a empty event', function() {
      expect(this.emptySpy).to.have.been.called;
    });

    it('should trigger a empty event with the view thats being emptied', function() {
      expect(this.emptySpy).to.have.been.calledWith(this.view);
    });

    it('should set "this" to the manager, from the empty event', function() {
      expect(this.emptySpy).to.have.been.calledOn(this.myRegion);
    });

    it('should call "destroy" on the already show view', function() {
      expect(this.view.destroy).to.have.been.called;
    });

    it('should not call "remove" directly, on the view', function() {
      expect(this.view.remove).not.to.have.been.called;
    });

    it('should delete the current view reference', function() {
      expect(this.myRegion.currentView).to.be.undefined;
    });

    it('should return the region', function() {
      expect(this.myRegion.empty).to.have.returned(this.myRegion);
    });

    it('should not have a view', function() {
      expect(this.myRegion.hasView()).to.equal(false);
    });
  });

  describe('when destroying the current view and it does not have a "destroy" method', function() {
    beforeEach(function() {
      this.MyRegion = Backbone.Marionette.Region.extend({
        el: '<div></div>'
      });

      this.MyView = Backbone.View.extend({
        render: function() {
          $(this.el).html('some content');
        }
      });

      this.view = new this.MyView();
      this.sinon.spy(this.view, 'remove');
      this.myRegion = new this.MyRegion();
      this.myRegion.show(this.view);
      this.myRegion.empty();
    });

    it('should call "remove" on the view', function() {
      expect(this.view.remove).to.have.been.called;
    });

    it('should set "isDestroyed" on the view', function() {
      expect(this.view.isDestroyed).to.be.true;
    });

    describe('and then attempting to show the view again in the Region', function() {
      beforeEach(function() {
        var suite = this;
        this.showFunction = function() {
          suite.myRegion.show(suite.view);
        };
      });

      it('should throw an error.', function() {
        var errorMessage = 'View (cid: "' + this.view.cid + '") has already been destroyed and cannot be used.';
        expect(this.showFunction).to.throw(errorMessage);
      });
    });
  });

  describe('when initializing a region and passing an "el" option', function() {
    beforeEach(function() {
      this.el = '#foo';
      this.region = new Backbone.Marionette.Region({
        el: this.el
      });
    });

    it('should manage the specified el', function() {
      expect(this.region.$el.selector).to.equal(this.el);
    });
  });

  describe('when initializing a region with an existing view', function() {
    beforeEach(function() {
      this.View = Backbone.View.extend({
        onShow: function() {}
      });

      this.view = new this.View();

      this.sinon.spy(this.view, 'render');
      this.sinon.spy(this.view, 'onShow');

      this.region = new Backbone.Marionette.Region({
        el: '#foo',
        currentView: this.view
      });
    });

    it('should not render the view', function() {
      expect(this.view.render).not.to.have.been.called;
    });

    it('should not `show` the view', function() {
      expect(this.view.onShow).not.to.have.been.called;
    });
  });

  describe('when attaching an existing view to a region', function() {
    beforeEach(function() {
      this.setFixtures('<div id="foo">bar<div id="bar"><div id="baz"></div></div></div>');

      this.ItemView = Backbone.Marionette.ItemView.extend({
        onShow: function() {},
        triggers: {
          'click': 'attachViewClicked'
        }
      });

      this.viewAttached = new this.ItemView({el: '#baz'});

      this.sinon.spy(this.viewAttached, 'render');
      this.sinon.spy(this.viewAttached, 'onShow');

      this.LayoutView = Backbone.Marionette.LayoutView.extend({
        el: '#foo',
        regions: {
          barRegion: '#bar'
        },
        childEvents: {
          attachViewClicked: function() {},
        }
      });

      this.fooView = new this.LayoutView();

      this.barRegion = this.fooView.getRegion('barRegion');
      this.sinon.spy(this.barRegion, 'attachView');
      this.sinon.spy(this.fooView.childEvents, 'attachViewClicked');
      this.fooView.getRegion('barRegion').attachView(this.viewAttached);
    });

    it('should not render the view', function() {
      expect(this.viewAttached.render).not.to.have.been.called;
    });

    it('should not `show` the view', function() {
      expect(this.viewAttached.onShow).not.to.have.been.called;
    });

    it('should not replace the existing html', function() {
      expect($(this.fooView.el).text()).to.equal('bar');
    });

    it('should return the region', function() {
      expect(this.barRegion.attachView).to.have.returned(this.fooView.barRegion);
    });

    it('calls the child events defined on parent view', function() {
      this.viewAttached.$el.click();
      expect(this.fooView.childEvents.attachViewClicked).to.have.been.called;
    });
  });

  describe('when creating a region instance with an initialize method', function() {
    beforeEach(function() {
      this.expectedOptions = {foo: 'bar'};
      this.Region = Backbone.Marionette.Region.extend({
        el: '#foo',
        initialize: function() {}
      });

      this.sinon.spy(this.Region.prototype, 'initialize');

      this.region = new this.Region(this.expectedOptions);
    });

    it('should call the initialize method with the options from the constructor', function() {
      expect(this.Region.prototype.initialize).to.have.been.calledWith(this.expectedOptions);
    });
  });

  describe('when removing a region', function() {
    beforeEach(function() {
      this.setFixtures('<div id="region"></div><div id="region2"></div>');

      this.myApp = new Backbone.Marionette.Application();
      this.myApp.addRegions({
        MyRegion: '#region',
        anotherRegion: '#region2'
      });

      this.region = this.myApp.MyRegion;
      this.sinon.spy(this.region, 'empty');

      this.myApp.removeRegion('MyRegion');
    });

    it('should be removed from the app', function() {
      expect(this.myApp.MyRegion).to.be.undefined;
    });

    it('should call "empty" of the region', function() {
      expect(this.region.empty).to.have.been.called;
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
      expect(this.MyApp.getRegion('MyRegion')).to.equal(this.region);
    });
  });

  describe('when resetting a region', function() {
    beforeEach(function() {
      this.setFixtures('<div id="region"></div>');

      this.region = new Backbone.Marionette.Region({
        el: '#region'
      });

      this.sinon.spy(this.region, 'empty');

      this.region._ensureElement();

      this.sinon.spy(this.region, 'reset');
      this.region.reset();
    });

    it('should not hold on to the regions previous "el"', function() {
      expect(this.region.$el).not.to.exist;
    });

    it('should empty any existing view', function() {
      expect(this.region.empty).to.have.been.called;
    });

    it('should return the region', function() {
      expect(this.region.reset).to.have.returned(this.region);
    });
  });

  describe('when destroying a view in a region', function() {
    beforeEach(function() {
      this.setFixtures('<div id="region"></div>');
      this.beforeEmptySpy = new sinon.spy();
      this.emptySpy = new sinon.spy();
      this.onBeforeDestroy = this.sinon.stub();
      this.onDestroy = this.sinon.stub();

      this.region = new Backbone.Marionette.Region({
        el: '#region'
      });

      this.region.on('before:empty', this.beforeEmptySpy);
      this.region.on('empty', this.emptySpy);

      this.View = Backbone.Marionette.View.extend({
        template: _.template('')
      });

      this.view = new this.View();

      this.view.on('before:destroy', this.onBeforeDestroy);
      this.view.on('destroy', this.onDestroy);

      this.region.show(this.view);
      this.region.currentView.destroy();
    });

    it('should remove the view from the region after being destroyed', function() {
      expect(this.beforeEmptySpy).to.have.been.calledOnce.and.calledWith(this.view);
      expect(this.emptySpy).to.have.been.calledOnce.calledWith(this.view);
      expect(this.region.currentView).to.be.undefined;
    });

    it('view "before:destroy" event is triggered once', function() {
      expect(this.onBeforeDestroy).to.have.been.calledOnce;
    });

    it('view "destroy" event is triggered once', function() {
      expect(this.onDestroy).to.have.been.calledOnce;
    });
  });

  describe('when showing undefined in a region', function() {
    beforeEach(function() {
      this.setFixtures('<div id="region"></div>');

      this.region = new Backbone.Marionette.Region({
        el: '#region'
      });

      this.insertUndefined = function() {
        this.region.show(undefined);
      }.bind(this);
    });

    it('should throw an error', function() {
      var errorMessage = 'The view passed is undefined and therefore invalid. You must pass a view instance to show.';
      expect(this.insertUndefined).to.throw(errorMessage);
    });
  });
});
