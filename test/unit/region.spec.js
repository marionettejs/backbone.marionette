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

      this.MyView = Backbone.View.extend({
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
          this.region = new this.MyRegion();
        });

        it('should throw an exception saying an "el" doesnt exist in DOM', function() {
          expect(function() {
            this.region.show(new this.MyView());
          }.bind(this)).to.throw('An "el" must exist in DOM for this region ' + this.region.cid);
        });

        it('should not have a view', function() {
          expect(this.region.hasView()).to.be.false;
        });
      });

      describe('when allowMissingEl is set', function() {
        beforeEach(function() {
          this.region = new this.MyRegion({allowMissingEl: true});
        });

        it('should not throw an exception', function() {
          expect(function() {
            this.region.show(new this.MyView());
          }.bind(this)).not.to.throw();
        });

        it('should not have a view', function() {
          expect(this.region.hasView()).to.be.false;
        });

        it('should not render the view', function() {
          this.sinon.spy(this.region, '_renderView');
          this.region.show(this.myView);
          expect(this.region._renderView).not.to.have.been.called;
        });
      });
    });
  });

  describe('when showing an initial view', function() {
    beforeEach(function() {
      this.MyRegion = Backbone.Marionette.Region.extend({
        el: '#region',
        onBeforeShow: this.sinon.stub(),
        onShow: this.sinon.stub(),
        onBeforeEmpty: this.sinon.stub(),
        onEmpty: this.sinon.stub(),
      });

      this.MyView = Backbone.View.extend({
        events: {
          'click': function() {}
        },
        render: function() {
          $(this.el).html('some content');
        },
        destroy: function() {},
        onBeforeRender: this.sinon.stub(),
        onRender: this.sinon.stub(),
        onBeforeAttach: this.sinon.stub(),
        onAttach: this.sinon.stub(),
        onDomRefresh: this.sinon.stub()
      });

      this.setFixtures('<div id="region"></div>');
      this.view = new this.MyView();
      this.region = new this.MyRegion();

      this.sinon.spy(this.region, 'show');

      this.showOptions = {foo: 'bar'};
      this.region.show(this.view, this.showOptions);
    });

    it('should have a cidPrefix', function() {
      expect(this.region.cidPrefix).to.equal('mnr');
    });

    it('should have a cid', function() {
      expect(this.region.cid).to.exist;
    });

    it('should render the view', function() {
      expect(this.view.onRender).to.have.been.called;
    });

    it('should have a view', function() {
      expect(this.region.hasView()).to.equal(true);
    });

    it('should reference region', function() {
      expect(this.view._parent).to.deep.equal(this.region);
    });

    it('should reference region, when same view was passed', function() {
      this.region.show(this.view);
      expect(this.view._parent).to.deep.equal(this.region);
    });

    it('should set $el and el', function() {
      expect(this.region.$el[0]).to.equal(this.region.el);
    });

    it('should append the rendered HTML to the managers "el"', function() {
      expect(this.region.$el).to.contain.$html(this.view.$el.html());
    });

    it('should pass the proper arguments to the region "onShow"', function() {
      expect(this.region.onShow).to.have.been.calledWith(this.region, this.view, this.showOptions);
    });

    it('should pass the proper arguments to the region "onBeforeShow"', function() {
      expect(this.region.onBeforeShow).to.have.been.calledWith(this.region, this.view, this.showOptions);
    });

    describe('region and view event ordering', function() {
      it('triggers before:show before before:render', function() {
        expect(this.region.onBeforeShow).to.have.been.calledBefore(this.view.onBeforeRender);
        expect(this.view.onBeforeRender).to.have.been.calledBefore(this.view.onRender);
        expect(this.view.onRender).to.have.been.calledBefore(this.view.onBeforeAttach);
        expect(this.view.onBeforeAttach).to.have.been.calledBefore(this.view.onAttach);
        expect(this.view.onAttach).to.have.been.calledBefore(this.view.onDomRefresh);
        expect(this.view.onDomRefresh).to.have.been.calledBefore(this.region.onShow);
        expect(this.region.onShow).to.have.been.called;
      });
    });

    it('should return the region', function() {
      expect(this.region.show).to.have.returned(this.region);
    });

    describe('and then showing a different view', function() {
      beforeEach(function() {
        this.view = this.region.currentView;

        this.region.onEmpty.reset();
        this.region.onBeforeEmpty.reset();

        this.view2 = new this.MyView();
        this.otherOptions = {
          bar: 'foo'
        };
        this.region.show(this.view2, this.otherOptions);
      });

      it('should trigger empty once', function() {
        expect(this.region.onEmpty).to.have.been.calledOnce;
        expect(this.region.onBeforeEmpty).to.have.been.calledOnce;
      });

      it('should still have a view', function() {
        expect(this.region.hasView()).to.equal(true);
      });

      it('should reference region', function() {
        expect(this.view2._parent).to.deep.equal(this.region);
      });

      it('old view should not reference region', function() {
        expect(this.view._parent).to.be.undefined;
      });
    });

    describe('when passing "preventDestroy" option', function() {
      beforeEach(function() {
        this.MyRegion = Backbone.Marionette.Region.extend({
          el: '#region',
          onShow: function() {}
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

        this.view1 = new this.MyView();
        this.view2 = new this.MyView2();
        this.region = new this.MyRegion();

        this.sinon.spy(this.view1, 'destroy');
        this.sinon.spy(this.view1, 'off');
        this.sinon.spy(this.view2, 'destroy');

        this.region.show(this.view1);
      });

      describe('preventDestroy: true', function() {
        beforeEach(function() {
          this.region.show(this.view2, {preventDestroy: true});
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
          expect(this.region.$el).to.contain.$text('some more content');
          expect(this.region.$el).not.to.contain.$text('some content');
        });

        // https://github.com/marionettejs/backbone.marionette/issues/2159#issue-52745401
        it('should still have view1\'s, event bindings', function() {
          expect(jQuery._data(this.view.el, 'events').click).to.be.defined;
        });

        describe('when setting the "replaceElement" class option', function() {
          beforeEach(function() {
            // empty region to clean existing view
            this.$parentEl = this.region.$el.parent();
            this.regionHtml = this.$parentEl.html();
            this.showOptions = {preventDestroy: true};
            this.region.replaceElement = true;
            this.region.show(this.view, this.showOptions);
          });

          it('should append the view HTML to the parent "el"', function() {
            expect(this.$parentEl).to.contain.$html(this.view.$el.html());
          });

          it('should remove the region\'s "el" from the DOM', function() {
            expect(this.$parentEl).to.not.contain.$html(this.regionHtml);
          });

          describe('and then emptying the region', function() {
            beforeEach(function() {
              this.region.empty();
            });

            it('should remove the view from the parent', function() {
              expect(this.$parentEl).to.not.contain.$html(this.view.$el.html());
            });

            it('should restore the region\'s "el" to the DOM', function() {
              expect(this.$parentEl).to.contain.$html('<div id="region"></div>');
            });
          });
        });

      });

      describe('preventDestroy: false', function() {
        beforeEach(function() {
          this.region.show(this.view2, {preventDestroy: false});
        });

        it('should "destroy" the old view', function() {
          expect(this.view1.destroy).to.have.been.called;
        });

        it('view1 should not reference region', function() {
          expect(this.view1._parent).to.be.undefined;
        });
      });
    });

    describe('when setting the "replaceElement" class option', function() {
      beforeEach(function() {
        // empty region to clean existing view
        this.region.empty();

        this.$parentEl = this.region.$el.parent();
        this.regionHtml = this.$parentEl.html();
        this.region.replaceElement = true;
        this.region.show(this.view);
      });

      it('should append the view HTML to the parent "el"', function() {
        expect(this.$parentEl).to.contain.$html(this.view.$el.html());
      });

      it('should remove the region\'s "el" from the DOM', function() {
        expect(this.$parentEl).to.not.contain.$html(this.regionHtml);
      });

      describe('and then emptying the region', function() {
        beforeEach(function() {
          this.region.empty();
        });

        it('should remove the view from the parent', function() {
          expect(this.$parentEl).to.not.contain.$html(this.view.$el.html());
        });

        it('should restore the region\'s "el" to the DOM', function() {
          expect(this.$parentEl).to.contain.$html('<div id="region"></div>');
        });
      });

      describe('and showing another view', function() {
        beforeEach(function() {
          this.MyView2 = Marionette.View.extend({
            events: {
              'click': function() {}
            },
            template: _.template('some different content'),
            destroy: function() {},
            onBeforeShow: function() {},
            onShow: function() {
              $(this.el).addClass('onShowClass');
            },
            onBeforeRender: function() {},
          });

          this.view2 = new this.MyView2();
          this.region.show(this.view2, this.showOptions);
        });

        it('should append the view HTML to the parent "el"', function() {
          expect(this.$parentEl).to.contain.$html(this.view2.$el.html());
        });
      });

      describe('and calling attachHtml a second time', function() {
        beforeEach(function() {
          this.region.attachHtml(this.view, true);
        });

        it('should append the view HTML to the parent "el"', function() {
          expect(this.$parentEl).to.contain.$html(this.view.$el.html());
        });

        it('should remove the region\'s "el" from the DOM', function() {
          expect(this.$parentEl).to.not.contain.$html(this.regionHtml);
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

      this.View = Backbone.Marionette.View.extend({
        regions: {
          subRegion: '.sub-region'
        },

        render: function() {
          $(this.el).html('<div class="sub-region"></div><div>some content</div>');
          this.triggerMethod('render');
        },

        onRender: function() {
          this.getRegion('subRegion').show(new suite.SubView());
        }
      });

      this.SubView = Backbone.View.extend({
        render: function() {
          $(this.el).html('some content');
        },

        initialize: function() {
          suite.innerRegionRenderSpy = suite.sinon.stub();
          this.on('render', suite.innerRegionRenderSpy);
        }
      });

      this.setFixtures('<div id="region"></div>');
      this.region = new this.MyRegion();
      this.attachHtmlSpy = this.sinon.spy(this.region, 'attachHtml');
      this.region.show(new this.View());
    });

    it('should call inner region render before attaching to DOM', function() {
      expect(this.innerRegionRenderSpy).to.have.been.calledBefore(this.attachHtmlSpy);
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
      this.region = new this.MyRegion();

      this.sinon.spy(this.view1, 'destroy');

      this.region.show(this.view1);
      this.region.show(this.view2);
    });

    it('should call "destroy" on the already open view', function() {
      expect(this.view1.destroy).to.have.been.called;
    });

    it('should reference the new view as the current view', function() {
      expect(this.region.currentView).to.equal(this.view2);
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
      this.region = new this.MyRegion();
      this.region.show(this.view);

      this.sinon.spy(this.view, 'destroy');
      this.sinon.spy(this.region, 'attachHtml');
      this.sinon.spy(this.region, '_renderView');
      this.sinon.spy(this.view, 'render');
      this.region.show(this.view);
    });

    it('should not call "destroy" on the view', function() {
      expect(this.view.destroy).not.to.have.been.called;
    });

    it('should not call "attachHtml" on the view', function() {
      expect(this.region.attachHtml).not.to.have.been.calledWith(this.view);
    });

    it('should not call "_renderView"', function() {
      expect(this.region._renderView).not.to.have.been.called;
    });
  });

  describe('when a Mn view is already shown but destroyed externally', function() {
    beforeEach(function() {
      this.MyRegion = Backbone.Marionette.Region.extend({
        el: '#region'
      });

      this.MyView = Backbone.Marionette.View.extend({
        template: _.template('<div></div>'),
        open: function() {}
      });

      this.setFixtures('<div id="region"></div>');

      this.view = new this.MyView();
      this.region = new this.MyRegion();
      this.region.show(this.view);
      this.view.destroy();

      this.sinon.spy(this.view, 'destroy');
      this.sinon.spy(this.region, 'attachHtml');
      this.sinon.spy(this.view, 'render');
    });

    it('should not throw an error saying the views been destroyed if a destroyed view is passed in', function() {
      expect(function() {
        this.region.show();
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
      this.region = new this.MyRegion();

      this.sinon.spy(this.view1, 'destroy');
    });

    it('shouldnt call "destroy" on an already destroyed view', function() {
      this.region.show(this.view1);
      this.view1.destroy();
      this.region.show(this.view2);

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

      this.region = new this.MyRegion();
      this.view = new this.MyView();
      this.sinon.spy(this.view, 'destroy');
      this.region.show(this.view);
    });

    describe('preventDestroy: true', function() {
      beforeEach(function() {
        this.region.empty({preventDestroy: true});
      });
      it('should not destroy view', function() {
        expect(this.view.destroy).to.have.been.not.called;
      });

      it('should clear region contents', function() {
        expect(this.region.$el.html()).to.eql('');
      });
    });

    describe('preventDestroy: false', function() {
      beforeEach(function() {
        this.region.empty({preventDestroy: false});
      });
      it('should destroy view', function() {
        expect(this.view.destroy).to.have.been.called;
      });
    });
    describe('preventDestroy undefined', function() {
      beforeEach(function() {
        this.region.empty({});
      });
      it('should destroy view', function() {
        expect(this.view.destroy).to.have.been.called;
      });
    });
  });

  describe('when destroying the current view', function() {
    beforeEach(function() {
      this.MyRegion = Backbone.Marionette.Region.extend({
        el: '#region',
        onBeforeEmpty: this.sinon.stub(),
        onEmpty: this.sinon.stub()
      });

      this.MyView = Backbone.View.extend({
        render: function() {
          $(this.el).html('some content');
        },

        destroy: function() {}
      });

      this.setFixtures('<div id="region"></div>');

      this.view = new this.MyView();
      this.sinon.spy(this.view, 'destroy');
      this.sinon.spy(this.view, '_removeElement');

      this.region = new this.MyRegion();
      this.sinon.spy(this.region, 'empty');
      this.region.show(this.view);
      this.region.empty();
    });

    it('should trigger a "before:empty" event with the view thats being destroyed', function() {
      expect(this.region.onBeforeEmpty)
        .to.have.been.calledOnce
        .and.to.have.been.calledWith(this.region, this.view)
        .and.to.have.been.calledOn(this.region);
    });

    it('should trigger a empty event', function() {
      expect(this.region.onEmpty)
        .to.have.been.calledOnce
        .and.to.have.been.calledWith(this.region, this.view)
        .and.to.have.been.calledOn(this.region);
    });

    it('should call "destroy" on the already show view', function() {
      expect(this.view.destroy).to.have.been.called;
    });

    it('should not call "_removeElement" directly, on the view', function() {
      expect(this.view._removeElement).not.to.have.been.called;
    });

    it('should delete the current view reference', function() {
      expect(this.region.currentView).to.be.undefined;
    });

    it('should return the region', function() {
      expect(this.region.empty).to.have.returned(this.region);
    });

    it('should return the region even when there was not a view to destroy', function() {
      // The first empty() should have removed the view, this empty() call would be when there isn't a view
      this.region.empty();
      expect(this.region.empty.thirdCall).to.have.returned(this.region);
    });

    it('should not have a view', function() {
      expect(this.region.hasView()).to.equal(false);
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
      this.sinon.spy(this.view, '_removeElement');
      this.region = new this.MyRegion();
      this.region.show(this.view);
      this.region.empty();
    });

    it('should call "_removeElement" on the view', function() {
      expect(this.view._removeElement).to.have.been.called;
    });

    it('should set "_isDestroyed" on the view', function() {
      expect(this.view._isDestroyed).to.be.true;
    });

    describe('and then attempting to show the view again in the Region', function() {
      beforeEach(function() {
        var suite = this;
        this.showFunction = function() {
          suite.region.show(suite.view);
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

      this.sinon.spy(this.region, '_renderView');
    });

    it('should not render the view', function() {
      expect(this.region._renderView).not.to.have.been.called;
    });

    it('should not `show` the view', function() {
      expect(this.view.onShow).not.to.have.been.called;
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

      this.itemView = new Backbone.Marionette.View();
      this.itemView.addRegions({
        MyRegion: '#region',
        anotherRegion: '#region2'
      });

      this.region = this.itemView.getRegion('MyRegion');
      this.sinon.spy(this.region, 'empty');

      this.itemView.removeRegion('MyRegion');
    });

    it('should be removed from the view', function() {
      expect(this.itemView.getRegion('MyRegion')).to.be.undefined;
    });

    it('should call "empty" of the region', function() {
      expect(this.region.empty).to.have.been.called;
    });
  });

  describe('when getting a region', function() {
    beforeEach(function() {
      this.itemView = new Backbone.Marionette.View();
      this.itemView.addRegions({
        MyRegion: '#region',
        anotherRegion: '#region2'
      });

      this.region = this.itemView._regions.MyRegion;
    });

    it('should return the region', function() {
      expect(this.itemView.getRegion('MyRegion')).to.equal(this.region);
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

  describe('when destroying a region', function() {
    beforeEach(function() {
      this.setFixtures('<div id="region"></div>');

      this.region = new Backbone.Marionette.Region({
        el: '#region'
      });

      this.sinon.spy(this.region, 'reset');

      this.sinon.spy(this.region, 'destroy');
      this.region.destroy();
    });

    it('should reset the region', function() {
      expect(this.region.reset).to.have.been.called;
    });

    it('should return the region', function() {
      expect(this.region.destroy).to.have.returned(this.region);
    });
  });

  describe('when destroying a Mn view in a region', function() {
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
      expect(this.beforeEmptySpy).to.have.been.calledOnce.and.calledWith(this.region, this.view);
      expect(this.emptySpy).to.have.been.calledOnce.calledWith(this.region, this.view);
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

  describe('when showing a Backbone.View child view', function() {
    beforeEach(function() {
      var BbView = Backbone.View.extend({
        onBeforeRender: this.sinon.stub(),
        onRender: this.sinon.stub(),
        onBeforeDestroy: this.sinon.stub(),
        onDestroy: this.sinon.stub()
      });
      this.region = new Marionette.Region({
        el: $('<div></div>')
      });
      this.view = new BbView();
      this.region.show(this.view);
    });

    it('should fire before:render and render on the child view on show', function() {
      expect(this.view.onBeforeRender)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.view)
        .and.to.have.been.calledWith(this.view);
      expect(this.view.onRender)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.view)
        .and.to.have.been.calledWith(this.view);
    });

    describe('when emptying while containing the Backbone.View', function() {
      beforeEach(function() {
        this.region.empty();
      });

      it('should fire before:destroy and destroy on the child view on show', function() {
        expect(this.view.onBeforeDestroy)
          .to.have.been.calledOnce
          .and.to.have.been.calledOn(this.view)
          .and.to.have.been.calledWith(this.view);
        expect(this.view.onDestroy)
          .to.have.been.calledOnce
          .and.to.have.been.calledOn(this.view)
          .and.to.have.been.calledWith(this.view);
      });
    });
  });

  describe('when calling "_renderView"', function() {
    beforeEach(function() {
      this.region = new Backbone.Marionette.Region({
        el: '#region'
      });

      this.View = Backbone.Marionette.View.extend({
        template: _.template('')
      });

      this.view = new this.View();
      this.sinon.spy(this.view, 'render');

      this.region._renderView(this.view);
    });

    it('should call "render" on the view', function() {
      expect(this.view.render).to.have.been.calledOnce;
    });
  });

  describe('when calling "_ensureElement"', function() {
    beforeEach(function() {
      this.region = new Backbone.Marionette.Region({
        el: '#region'
      });
    });

    it('should prefer passed options over initial options', function() {
      this.region.options.allowMissingEl = false;

      expect(this.region._ensureElement({allowMissingEl: true})).to.be.false;
    });

    it('should fallback to initial options when not passed options', function() {
      this.region.options.allowMissingEl = false;

      expect(function() {
        this.region._ensureElement();
      }.bind(this)).to.throw;
    });
  });
});
