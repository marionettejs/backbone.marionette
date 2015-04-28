describe('onAttach', function() {
  'use strict';

  beforeEach(function() {

    // A Region to show our LayoutView within
    this.setFixtures('<div id="region"></div>');
    this.el = $('#region')[0];
    this.region = new Marionette.Region({el: this.el});

    // A view we can use as nested child views
    this.BasicView = Marionette.ItemView.extend({
      template: false,
      onAttach: function() {},
      onBeforeAttach: function() {}
    });

    var spec = this;
    this.EmptyView = Marionette.ItemView.extend({
      template: false,
      constructor: function(options) {
        Marionette.ItemView.prototype.constructor.call(this, options);
        this.onAttach = spec.sinon.stub();
        this.onBeforeAttach = spec.sinon.stub();
      }
    });
    this.ChildView = Marionette.ItemView.extend({
      template: false,
      constructor: function(options) {
        Marionette.ItemView.prototype.constructor.call(this, options);
        this.onAttach = spec.sinon.stub();
        this.onBeforeAttach = spec.sinon.stub();
      }
    });
    this.BasicCollectionView = Marionette.CollectionView.extend({
      childView: this.ChildView,
      emptyView: this.EmptyView
    });
  });

  describe('when showing a region that is not attached to the document', function() {
    beforeEach(function() {
      this.detachedRegion = new Marionette.Region({el: $('<div></div>')});

      this.view = new this.BasicView();
      this.view.onAttach = this.sinon.stub();
      this.view.onBeforeAttach = this.sinon.stub();

      this.detachedRegion.show(new this.BasicView());
    });

    it('should not call either trigger method on the view', function() {
      expect(this.view.onAttach).to.not.have.been.called;
      expect(this.view.onBeforeAttach).to.not.have.been.called;
    });
  });

  describe('when showing a region that is attached to the document', function() {
    beforeEach(function() {
      this.view = new this.BasicView();
      this.view.onAttach = this.sinon.stub();
      this.view.onBeforeAttach = this.sinon.stub();

      this.sinon.spy(this.region, 'attachHtml');
      this.region.show(this.view);
    });

    it('should call onBeforeAttach on the view', function() {
      expect(this.view.onBeforeAttach)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(this.view, this.region)
        .and.to.be.calledBefore(this.region.attachHtml);

    });

    it('should call onAttach on the view', function() {
      expect(this.view.onAttach)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(this.view, this.region)
        .and.to.be.calledAfter(this.region.attachHtml);
    });
  });

  describe('when showing a region that is attached to the document & has triggerBeforeAttach set to false', function() {
    beforeEach(function() {
      this.view = new this.BasicView();
      this.view.onAttach = this.sinon.stub();
      this.view.onBeforeAttach = this.sinon.stub();
      this.region.triggerBeforeAttach = false;

      this.region.show(this.view);
    });

    it('should not call onBeforeAttach on the view', function() {
      expect(this.view.onBeforeAttach).to.not.have.been.called;
    });

    it('should call onBeforeAttach on the view', function() {
      expect(this.view.onAttach)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(this.view, this.region);
    });
  });

  describe('when showing a region that is attached to the document & has triggerBeforeAttach set to false, but the option is passed as true', function() {
    beforeEach(function() {
      this.view = new this.BasicView();
      this.view.onAttach = this.sinon.stub();
      this.view.onBeforeAttach = this.sinon.stub();
      this.region.triggerBeforeAttach = false;

      this.region.show(this.view, {triggerBeforeAttach: true});
    });

    it('should call onBeforeAttach on the view', function() {
      expect(this.view.onBeforeAttach)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(this.view, this.region);
    });

    it('should call onAttach on the view', function() {
      expect(this.view.onAttach)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(this.view, this.region);
    });
  });

  describe('when showing a region that is attached to the document & triggerBeforeAttach defaults to true, but the option is passed as false', function() {
    beforeEach(function() {
      this.view = new this.BasicView();
      this.view.onAttach = this.sinon.stub();
      this.view.onBeforeAttach = this.sinon.stub();

      this.region.show(this.view, {triggerBeforeAttach: false});
    });

    it('should not call onBeforeAttach on the view', function() {
      expect(this.view.onBeforeAttach).to.not.have.been.called;
    });

    it('should call onAttach on the view', function() {
      expect(this.view.onAttach)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(this.view, this.region);
    });
  });

  describe('when showing a region that is attached to the document & has triggerAttach set to false', function() {
    beforeEach(function() {
      this.view = new this.BasicView();
      this.view.onAttach = this.sinon.stub();
      this.view.onBeforeAttach = this.sinon.stub();
      this.region.triggerAttach = false;

      this.region.show(this.view);
    });

    it('should call onBeforeAttach on the view', function() {
      expect(this.view.onBeforeAttach)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(this.view, this.region);
    });

    it('should not call onAttach on the view', function() {
      expect(this.view.onAttach).to.not.have.been.called;
    });
  });

  describe('when showing a region that is attached to the document & has triggerAttach set to false, but the option is passed as true', function() {
    beforeEach(function() {
      this.view = new this.BasicView();
      this.view.onAttach = this.sinon.stub();
      this.view.onBeforeAttach = this.sinon.stub();
      this.region.triggerAttach = false;

      this.region.show(this.view, {triggerAttach: true});
    });

    it('should call onBeforeAttach on the view', function() {
      expect(this.view.onBeforeAttach)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(this.view, this.region);
    });

    it('should call onAttach on the view', function() {
      expect(this.view.onAttach)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(this.view, this.region);
    });
  });

  describe('when showing a region that is attached to the document & triggerAttach defaults to true, but the option is passed as false', function() {
    beforeEach(function() {
      this.view = new this.BasicView();
      this.view.onAttach = this.sinon.stub();
      this.view.onBeforeAttach = this.sinon.stub();

      this.region.show(this.view, {triggerAttach: false});
    });

    it('should call onBeforeAttach on the view', function() {
      expect(this.view.onBeforeAttach)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(this.view, this.region);
    });

    it('should not call onAttach on the view', function() {
      expect(this.view.onAttach).to.not.have.been.called;
    });
  });

  describe('when a view is shown in a region', function() {
    beforeEach(function() {
      this.childView = new this.BasicView();
      this.childView.onBeforeAttach = function() {
        this.beforeAttached = Marionette.isNodeAttached(this.el);
      };
      this.childView.onAttach = function() {
        this.attached = Marionette.isNodeAttached(this.el);
      };
      this.region.show(this.childView);
    });

    it('should be detached in onBeforeAttach', function() {
      expect(this.childView.beforeAttached).to.be.false;
    });

    it('should be attached in onAttach', function() {
      expect(this.childView.attached).to.be.true;
    });
  });

  describe('when the parent view is initially detached', function() {
    beforeEach(function() {

      // A LayoutView class that we can use for all of our tests
      this.LayoutView = Marionette.LayoutView.extend({
        template: _.template('<main></main><footer></footer>'),
        regions: {
          main: 'main',
          footer: 'footer'
        },
        onBeforeAttach: function() {},
        onAttach: function() {}
      });
    });

    describe('When showing a View in a Region', function() {
      beforeEach(function() {
        this.MyView = Marionette.ItemView.extend({
          template: _.template(''),
          onBeforeAttach: this.sinon.stub(),
          onAttach: this.sinon.stub()
        });

        this.myView = new this.MyView();
        this.region.show(this.myView);
      });

      it('should trigger onAttach on the View a single time', function() {
        expect(this.myView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach on the View a single time', function() {
        expect(this.myView.onBeforeAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach before onAttach', function() {
        expect(this.myView.onBeforeAttach).to.have.been.calledBefore(this.myView.onAttach);
      });
    });

    describe('When showing a LayoutView with a single level of nested views that are attached within onBeforeShow', function() {
      beforeEach(function() {
        this.mainView = new this.BasicView();
        this.footerView = new this.BasicView();

        this.sinon.spy(this.mainView, 'onAttach');
        this.sinon.spy(this.mainView, 'onBeforeAttach');
        this.sinon.spy(this.footerView, 'onAttach');
        this.sinon.spy(this.footerView, 'onBeforeAttach');

        var suite = this;

        this.CustomLayoutView = this.LayoutView.extend({
          onBeforeShow: function() {
            this.getRegion('main').show(suite.mainView);
            this.getRegion('footer').show(suite.footerView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onAttach');
        this.sinon.spy(this.layoutView, 'onBeforeAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onBeforeAttach & onAttach on the layoutView a single time', function() {
        expect(this.layoutView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the mainView a single time', function() {
        expect(this.mainView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.mainView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the footerView a single time', function() {
        expect(this.footerView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.footerView.onAttach).to.have.been.calledOnce;
      });
    });

    describe('When showing a LayoutView with a single level of nested views that are attached within onBeforeAttach', function() {
      beforeEach(function() {
        this.mainView = new this.BasicView();
        this.footerView = new this.BasicView();

        this.sinon.spy(this.mainView, 'onAttach');
        this.sinon.spy(this.mainView, 'onBeforeAttach');
        this.sinon.spy(this.footerView, 'onAttach');
        this.sinon.spy(this.footerView, 'onBeforeAttach');

        var suite = this;

        this.CustomLayoutView = this.LayoutView.extend({
          onBeforeAttach: function() {
            this.getRegion('main').show(suite.mainView);
            this.getRegion('footer').show(suite.footerView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onAttach');
        this.sinon.spy(this.layoutView, 'onBeforeAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onBeforeAttach & onAttach on the layoutView a single time', function() {
        expect(this.layoutView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the mainView a single time, but not onBeforeAttach', function() {
        expect(this.mainView.onBeforeAttach).to.not.have.been.calledOnce;
        expect(this.mainView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the footerView a single time, but not onBeforeAttach', function() {
        expect(this.footerView.onBeforeAttach).to.not.have.been.calledOnce;
        expect(this.footerView.onAttach).to.have.been.calledOnce;
      });
    });

    describe('When showing a LayoutView with two levels of nested views; with onBeforeShow for the first and second level', function() {
      beforeEach(function() {
        var suite = this;
        this.headerView = new this.BasicView();
        this.sinon.spy(this.headerView, 'onAttach');
        this.sinon.spy(this.headerView, 'onBeforeAttach');

        this.MainView = this.LayoutView.extend({
          template: _.template('<header></header>'),
          regions: {
            header: 'header'
          },
          onBeforeShow: function() {
            this.getRegion('header').show(suite.headerView);
          }
        });
        this.mainView = new this.MainView();
        this.sinon.spy(this.mainView, 'onAttach');
        this.sinon.spy(this.mainView, 'onBeforeAttach');

        this.CustomLayoutView = this.LayoutView.extend({
          onBeforeShow: function() {
            this.getRegion('main').show(suite.mainView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onAttach');
        this.sinon.spy(this.layoutView, 'onBeforeAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onBeforeAttach & onAttach on the layoutView a single time', function() {
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
        expect(this.layoutView.onBeforeAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the mainView a single time', function() {
        expect(this.mainView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.mainView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the headerView a single time', function() {
        expect(this.headerView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.headerView.onAttach).to.have.been.calledOnce;
      });
    });

    describe('When showing a LayoutView with two levels of nested views; onBeforeShow for the first level, then onShow for the second', function() {
      beforeEach(function() {
        var suite = this;
        this.headerView = new this.BasicView();
        this.sinon.spy(this.headerView, 'onBeforeAttach');
        this.sinon.spy(this.headerView, 'onAttach');

        this.MainView = Marionette.LayoutView.extend({
          template: _.template('<header></header>'),
          onAttach: this.sinon.stub(),
          onBeforeAttach: this.sinon.stub(),
          regions: {
            header: 'header'
          },
          onShow: function() {
            this.getRegion('header').show(suite.headerView);
          }
        });
        this.mainView = new this.MainView();

        this.CustomLayoutView = this.LayoutView.extend({
          onBeforeShow: function() {
            this.getRegion('main').show(suite.mainView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onAttach');
        this.sinon.spy(this.layoutView, 'onBeforeAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onBeforeAttach & onAttach on the layoutView a single time', function() {
        expect(this.layoutView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the mainView a single time', function() {
        expect(this.mainView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.mainView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the headerView a single time', function() {
        expect(this.headerView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.headerView.onAttach).to.have.been.calledOnce;
      });
    });

    describe('When showing a LayoutView with two levels of nested views; with onShow for the first level, onBeforeShow for the second', function() {
      beforeEach(function() {
        var suite = this;
        this.headerView = new this.BasicView();
        this.sinon.spy(this.headerView, 'onBeforeAttach');
        this.sinon.spy(this.headerView, 'onAttach');

        this.MainView = Marionette.LayoutView.extend({
          template: _.template('<header></header>'),
          onAttach: this.sinon.stub(),
          onBeforeAttach: this.sinon.stub(),
          regions: {
            header: 'header'
          },
          onBeforeShow: function() {
            this.getRegion('header').show(suite.headerView);
          }
        });
        this.mainView = new this.MainView();

        this.CustomLayoutView = this.LayoutView.extend({
          onShow: function() {
            this.getRegion('main').show(suite.mainView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onBeforeAttach');
        this.sinon.spy(this.layoutView, 'onAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onBeforeAttach & onAttach on the layoutView a single time', function() {
        expect(this.layoutView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the mainView a single time', function() {
        expect(this.mainView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.mainView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the headerView a single time', function() {
        expect(this.headerView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.headerView.onAttach).to.have.been.calledOnce;
      });
    });

    describe('When showing a LayoutView with a single level of nested views that are attached within onShow', function() {
      beforeEach(function() {
        this.mainView = new this.BasicView();
        this.footerView = new this.BasicView();

        this.sinon.spy(this.mainView, 'onBeforeAttach');
        this.sinon.spy(this.mainView, 'onAttach');
        this.sinon.spy(this.footerView, 'onBeforeAttach');
        this.sinon.spy(this.footerView, 'onAttach');

        var suite = this;

        this.CustomLayoutView = this.LayoutView.extend({
          onShow: function() {
            this.getRegion('main').show(suite.mainView);
            this.getRegion('footer').show(suite.footerView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onBeforeAttach');
        this.sinon.spy(this.layoutView, 'onAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onBeforeAttach & onAttach on the layoutView a single time', function() {
        expect(this.layoutView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the mainView a single time', function() {
        expect(this.mainView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.mainView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the footerView a single time', function() {
        expect(this.footerView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.footerView.onAttach).to.have.been.calledOnce;
      });
    });
  });

  describe('when the parent view is initially attached', function() {
    beforeEach(function() {
      this.setFixtures('<div class="layout-view"></div>');

      // A LayoutView class that we can use for all of our tests
      this.LayoutView = Marionette.LayoutView.extend({
        el: '.layout-view',
        template: _.template('<main></main><footer></footer>'),
        regions: {
          main: 'main',
          footer: 'footer'
        },
        onAttach: function() {},
        onBeforeAttach: function() {}
      });
    });

    describe('When showing a View in a Region', function() {
      beforeEach(function() {
        this.MyView = Marionette.ItemView.extend({
          el: '.layout-view',
          template: _.template(''),
          onBeforeAttach: this.sinon.stub(),
          onAttach: this.sinon.stub()
        });

        this.myView = new this.MyView();
        this.region.show(this.myView);
      });

      it('should trigger onBeforeAttach & onAttach on the View a single time', function() {
        expect(this.myView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.myView.onAttach).to.have.been.calledOnce;
      });
    });

    describe('When showing a LayoutView with a single level of nested views that are attached within onBeforeShow', function() {
      beforeEach(function() {
        this.mainView = new this.BasicView();
        this.footerView = new this.BasicView();

        this.sinon.spy(this.mainView, 'onBeforeAttach');
        this.sinon.spy(this.mainView, 'onAttach');
        this.sinon.spy(this.footerView, 'onBeforeAttach');
        this.sinon.spy(this.footerView, 'onAttach');

        var suite = this;

        this.CustomLayoutView = this.LayoutView.extend({
          onBeforeShow: function() {
            this.getRegion('main').show(suite.mainView);
            this.getRegion('footer').show(suite.footerView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onBeforeAttach');
        this.sinon.spy(this.layoutView, 'onAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onBeforeAttach & onAttach on the layoutView a single time', function() {
        expect(this.layoutView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the mainView twice', function() {
        expect(this.mainView.onBeforeAttach).to.have.been.calledTwice;
        expect(this.mainView.onAttach).to.have.been.calledTwice;
      });

      it('should trigger onBeforeAttach & onAttach on the footerView twice', function() {
        expect(this.footerView.onBeforeAttach).to.have.been.calledTwice;
        expect(this.footerView.onAttach).to.have.been.calledTwice;
      });
    });

    describe('When showing a LayoutView with two levels of nested views; with onBeforeShow for the first and second level', function() {
      beforeEach(function() {
        var suite = this;
        this.headerView = new this.BasicView();
        this.sinon.spy(this.headerView, 'onBeforeAttach');
        this.sinon.spy(this.headerView, 'onAttach');

        this.MainView = Marionette.LayoutView.extend({
          template: _.template('<header></header>'),
          onAttach: this.sinon.stub(),
          onBeforeAttach: this.sinon.stub(),
          regions: {
            header: 'header'
          },
          onBeforeShow: function() {
            this.getRegion('header').show(suite.headerView);
          }
        });
        this.mainView = new this.MainView();

        this.CustomLayoutView = this.LayoutView.extend({
          onBeforeShow: function() {
            this.getRegion('main').show(suite.mainView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onBeforeAttach');
        this.sinon.spy(this.layoutView, 'onAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onBeforeAttach & onAttach on the layoutView a single time', function() {
        expect(this.layoutView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the mainView twice', function() {
        expect(this.mainView.onBeforeAttach).to.have.been.calledTwice;
        expect(this.mainView.onAttach).to.have.been.calledTwice;
      });

      it('should trigger onBeforeAttach & onAttach on the headerView twice', function() {
        expect(this.headerView.onBeforeAttach).to.have.been.calledTwice;
        expect(this.headerView.onAttach).to.have.been.calledTwice;
      });
    });

    describe('When showing a LayoutView with two levels of nested views; onBeforeShow for the first level, then onShow for the second', function() {
      beforeEach(function() {
        var suite = this;
        this.headerView = new this.BasicView();
        this.sinon.spy(this.headerView, 'onBeforeAttach');
        this.sinon.spy(this.headerView, 'onAttach');

        this.MainView = Marionette.LayoutView.extend({
          template: _.template('<header></header>'),
          onAttach: this.sinon.stub(),
          onBeforeAttach: this.sinon.stub(),
          regions: {
            header: 'header'
          },
          onShow: function() {
            this.getRegion('header').show(suite.headerView);
          }
        });
        this.mainView = new this.MainView();

        this.CustomLayoutView = this.LayoutView.extend({
          onBeforeShow: function() {
            this.getRegion('main').show(suite.mainView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onBeforeAttach');
        this.sinon.spy(this.layoutView, 'onAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onBeforeAttach & onAttach on the layoutView a single time', function() {
        expect(this.layoutView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the mainView twice', function() {
        expect(this.mainView.onBeforeAttach).to.have.been.calledTwice;
        expect(this.mainView.onAttach).to.have.been.calledTwice;
      });

      it('should trigger onBeforeAttach & onAttach on the headerView twice', function() {
        expect(this.headerView.onBeforeAttach).to.have.been.calledTwice;
        expect(this.headerView.onAttach).to.have.been.calledTwice;
      });
    });

    describe('When showing a LayoutView with two levels of nested views; with onShow for the first level, onBeforeShow for the second', function() {
      beforeEach(function() {
        var suite = this;
        this.headerView = new this.BasicView();
        this.sinon.spy(this.headerView, 'onBeforeAttach');
        this.sinon.spy(this.headerView, 'onAttach');

        this.MainView = Marionette.LayoutView.extend({
          template: _.template('<header></header>'),
          onAttach: this.sinon.stub(),
          onBeforeAttach: this.sinon.stub(),
          regions: {
            header: 'header'
          },
          onBeforeShow: function() {
            this.getRegion('header').show(suite.headerView);
          }
        });
        this.mainView = new this.MainView();

        this.CustomLayoutView = this.LayoutView.extend({
          onShow: function() {
            this.getRegion('main').show(suite.mainView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onBeforeAttach');
        this.sinon.spy(this.layoutView, 'onAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onBeforeAttach & onAttach on the layoutView a single time', function() {
        expect(this.layoutView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the mainView a single time', function() {
        expect(this.mainView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.mainView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the headerView a single time', function() {
        expect(this.headerView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.headerView.onAttach).to.have.been.calledOnce;
      });
    });

    describe('When showing a LayoutView with a single level of nested views that are attached within onShow', function() {
      beforeEach(function() {
        this.mainView = new this.BasicView();
        this.footerView = new this.BasicView();

        this.sinon.spy(this.mainView, 'onBeforeAttach');
        this.sinon.spy(this.mainView, 'onAttach');
        this.sinon.spy(this.footerView, 'onBeforeAttach');
        this.sinon.spy(this.footerView, 'onAttach');

        var suite = this;

        this.CustomLayoutView = this.LayoutView.extend({
          onShow: function() {
            this.getRegion('main').show(suite.mainView);
            this.getRegion('footer').show(suite.footerView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onBeforeAttach');
        this.sinon.spy(this.layoutView, 'onAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onBeforeAttach & onAttach on the layoutView a single time', function() {
        expect(this.layoutView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the mainView a single time', function() {
        expect(this.mainView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.mainView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach & onAttach on the footerView a single time', function() {
        expect(this.footerView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.footerView.onAttach).to.have.been.calledOnce;
      });
    });
  });

  describe('when showing an empty CollectionView', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();
      this.collectionView = new this.BasicCollectionView({
        collection: this.collection
      });
      this.region.show(this.collectionView);
      this.childView = this.collectionView.children.findByIndex(0);
    });

    it('should trigger onBeforeAttach and onAttach on the emptyView a single time', function() {
      expect(this.childView).to.be.an.instanceof(this.EmptyView);
      expect(this.childView.onBeforeAttach).to.have.been.calledOnce;
      expect(this.childView.onBeforeAttach).to.have.been.calledOn(this.childView);
      expect(this.childView.onBeforeAttach).to.have.been.calledWith(this.childView);
      expect(this.childView.onAttach).to.have.been.calledOnce;
      expect(this.childView.onAttach).to.have.been.calledOn(this.childView);
      expect(this.childView.onAttach).to.have.been.calledWith(this.childView);
    });

    describe('when adding a new element to the collection', function() {
      beforeEach(function() {
        this.collection.add({id: 1});
        this.childView = this.collectionView.children.findByIndex(0);
      });
      it('should trigger onBeforeAttach and onAttach on the childView a single time', function() {
        expect(this.childView).to.be.an.instanceof(this.ChildView);
        expect(this.childView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.childView.onBeforeAttach).to.have.been.calledOn(this.childView);
        expect(this.childView.onBeforeAttach).to.have.been.calledWith(this.childView);
        expect(this.childView.onAttach).to.have.been.calledOnce;
        expect(this.childView.onAttach).to.have.been.calledOn(this.childView);
        expect(this.childView.onAttach).to.have.been.calledWith(this.childView);
      });
    });
  });

  describe('when showing an empty CollectionView with triggerBeforeAttach and triggerAttach set to false on the region', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();
      this.collectionView = new this.BasicCollectionView({
        collection: this.collection
      });
      this.region.triggerAttach = false;
      this.region.triggerBeforeAttach = false;
      this.region.show(this.collectionView);
      this.childView = this.collectionView.children.findByIndex(0);
    });

    it('should not trigger onAttach or onBeforeAttach on the emptyView a single time', function() {
      expect(this.childView).to.be.an.instanceof(this.EmptyView);
      expect(this.childView.onBeforeAttach).to.not.have.been.calledOnce;
      expect(this.childView.onBeforeAttach).to.not.have.been.calledOn(this.childView);
      expect(this.childView.onBeforeAttach).to.not.have.been.calledWith(this.childView);
      expect(this.childView.onAttach).to.not.have.been.calledOnce;
      expect(this.childView.onAttach).to.not.have.been.calledOn(this.childView);
      expect(this.childView.onAttach).to.not.have.been.calledWith(this.childView);
    });

    describe('when adding a new element to the collection', function() {
      beforeEach(function() {
        this.collection.add({id: 1});
        this.childView = this.collectionView.children.findByIndex(0);
      });
      it('should not trigger onBeforeAttach or onAttach on the childView a single time', function() {
        expect(this.childView).to.be.an.instanceof(this.ChildView);
        expect(this.childView.onBeforeAttach).to.not.have.been.calledOnce;
        expect(this.childView.onBeforeAttach).to.not.have.been.calledOn(this.childView);
        expect(this.childView.onBeforeAttach).to.not.have.been.calledWith(this.childView);
        expect(this.childView.onAttach).to.not.have.been.calledOnce;
        expect(this.childView.onAttach).to.not.have.been.calledOn(this.childView);
        expect(this.childView.onAttach).to.not.have.been.calledWith(this.childView);
      });
    });
  });

  describe('when showing a non-empty CollectionView', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection([{id: 1}, {id: 2}]);
      this.collectionView = new this.BasicCollectionView({
        collection: this.collection
      });
      this.region.show(this.collectionView);
      this.childView1 = this.collectionView.children.findByIndex(0);
      this.childView2 = this.collectionView.children.findByIndex(1);
    });

    it('should trigger onBeforeAttach and onAttach on each of its childViews a single time', function() {
      expect(this.childView1.onBeforeAttach).to.have.been.calledOnce;
      expect(this.childView1.onBeforeAttach).to.have.been.calledOn(this.childView1);
      expect(this.childView1.onBeforeAttach).to.have.been.calledWith(this.childView1);
      expect(this.childView1.onAttach).to.have.been.calledOnce;
      expect(this.childView1.onAttach).to.have.been.calledOn(this.childView1);
      expect(this.childView1.onAttach).to.have.been.calledWith(this.childView1);
      expect(this.childView2.onBeforeAttach).to.have.been.calledOnce;
      expect(this.childView2.onBeforeAttach).to.have.been.calledOn(this.childView2);
      expect(this.childView2.onBeforeAttach).to.have.been.calledWith(this.childView2);
      expect(this.childView2.onAttach).to.have.been.calledOnce;
      expect(this.childView2.onAttach).to.have.been.calledOn(this.childView2);
      expect(this.childView2.onAttach).to.have.been.calledWith(this.childView2);
    });

    describe('when re-rendering the CollectionView', function() {
      beforeEach(function() {
        this.collectionView.render();
      });

      it('should trigger onBeforeAttach and onAttach on each of its childViews a single time', function() {
        expect(this.childView1.onBeforeAttach).to.have.been.calledOnce;
        expect(this.childView1.onBeforeAttach).to.have.been.calledOn(this.childView1);
        expect(this.childView1.onBeforeAttach).to.have.been.calledWith(this.childView1);
        expect(this.childView1.onAttach).to.have.been.calledOnce;
        expect(this.childView1.onAttach).to.have.been.calledOn(this.childView1);
        expect(this.childView1.onAttach).to.have.been.calledWith(this.childView1);
        expect(this.childView2.onBeforeAttach).to.have.been.calledOnce;
        expect(this.childView2.onBeforeAttach).to.have.been.calledOn(this.childView2);
        expect(this.childView2.onBeforeAttach).to.have.been.calledWith(this.childView2);
        expect(this.childView2.onAttach).to.have.been.calledOnce;
        expect(this.childView2.onAttach).to.have.been.calledOn(this.childView2);
        expect(this.childView2.onAttach).to.have.been.calledWith(this.childView2);
      });
    });

    describe('when emptying the collection', function() {
      beforeEach(function() {
        this.collection.reset();
        this.childView = this.collectionView.children.findByIndex(0);
      });
      it('should trigger onBeforeAttach and onAttach on the emptyView a single time', function() {
        expect(this.childView).to.be.an.instanceof(this.EmptyView);
        expect(this.childView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.childView.onBeforeAttach).to.have.been.calledOn(this.childView);
        expect(this.childView.onBeforeAttach).to.have.been.calledWith(this.childView);
        expect(this.childView.onAttach).to.have.been.calledOnce;
        expect(this.childView.onAttach).to.have.been.calledOn(this.childView);
        expect(this.childView.onAttach).to.have.been.calledWith(this.childView);
      });
    });
  });

  describe('when showing a non-empty CollectionView with triggerBeforeAttach and triggerAttach set to false on the region', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection([{id: 1}, {id: 2}]);
      this.collectionView = new this.BasicCollectionView({
        collection: this.collection
      });
      this.region.triggerAttach = false;
      this.region.triggerBeforeAttach = false;
      this.region.show(this.collectionView);
      this.childView1 = this.collectionView.children.findByIndex(0);
      this.childView2 = this.collectionView.children.findByIndex(1);
    });

    it('should not trigger onBeforeAttach or onAttach on each of its childViews a single time', function() {
      expect(this.childView1.onBeforeAttach).to.not.have.been.calledOnce;
      expect(this.childView1.onBeforeAttach).to.not.have.been.calledOn(this.childView1);
      expect(this.childView1.onBeforeAttach).to.not.have.been.calledWith(this.childView1);
      expect(this.childView1.onAttach).to.not.have.been.calledOnce;
      expect(this.childView1.onAttach).to.not.have.been.calledOn(this.childView1);
      expect(this.childView1.onAttach).to.not.have.been.calledWith(this.childView1);
      expect(this.childView2.onBeforeAttach).to.not.have.been.calledOnce;
      expect(this.childView2.onBeforeAttach).to.not.have.been.calledOn(this.childView2);
      expect(this.childView2.onBeforeAttach).to.not.have.been.calledWith(this.childView2);
      expect(this.childView2.onAttach).to.not.have.been.calledOnce;
      expect(this.childView2.onAttach).to.not.have.been.calledOn(this.childView2);
      expect(this.childView2.onAttach).to.not.have.been.calledWith(this.childView2);
    });

    describe('when re-rendering the CollectionView', function() {
      beforeEach(function() {
        this.collectionView.render();
      });

      it('should not trigger onBeforeAttach or onAttach on each of its childViews a single time', function() {
        expect(this.childView1.onBeforeAttach).to.not.have.been.calledOnce;
        expect(this.childView1.onBeforeAttach).to.not.have.been.calledOn(this.childView1);
        expect(this.childView1.onBeforeAttach).to.not.have.been.calledWith(this.childView1);
        expect(this.childView1.onAttach).to.not.have.been.calledOnce;
        expect(this.childView1.onAttach).to.not.have.been.calledOn(this.childView1);
        expect(this.childView1.onAttach).to.not.have.been.calledWith(this.childView1);
        expect(this.childView2.onBeforeAttach).to.not.have.been.calledOnce;
        expect(this.childView2.onBeforeAttach).to.not.have.been.calledOn(this.childView2);
        expect(this.childView2.onBeforeAttach).to.not.have.been.calledWith(this.childView2);
        expect(this.childView2.onAttach).to.not.have.been.calledOnce;
        expect(this.childView2.onAttach).to.not.have.been.calledOn(this.childView2);
        expect(this.childView2.onAttach).to.not.have.been.calledWith(this.childView2);
      });
    });

    describe('when emptying the collection', function() {
      beforeEach(function() {
        this.collection.reset();
        this.childView = this.collectionView.children.findByIndex(0);
      });
      it('should not trigger onBeforeAttach or onAttach on the emptyView a single time', function() {
        expect(this.childView).to.be.an.instanceof(this.EmptyView);
        expect(this.childView.onBeforeAttach).to.not.have.been.calledOnce;
        expect(this.childView.onBeforeAttach).to.not.have.been.calledOn(this.childView);
        expect(this.childView.onBeforeAttach).to.not.have.been.calledWith(this.childView);
        expect(this.childView.onAttach).to.not.have.been.calledOnce;
        expect(this.childView.onAttach).to.not.have.been.calledOn(this.childView);
        expect(this.childView.onAttach).to.not.have.been.calledWith(this.childView);
      });
    });
  });
});
