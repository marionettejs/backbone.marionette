describe('onAttach', function() {
  'use strict';

  beforeEach(function() {

    // A Region to show our LayoutView within
    this.setFixtures('<div id="region"></div>');
    this.el = $('#region')[0];
    this.region = new (Backbone.Marionette.Region.extend({
      el: this.el
    }))();

    // A view we can use as nested child views
    this.BasicView = Marionette.ItemView.extend({
      template: false,
      onAttach: function() {}
    });
  });

  describe('When calling triggerAttach', function() {
    describe('and the el of the view is a child of the document', function() {
      beforeEach(function() {
        this.setFixtures('<div class="view"></div>');

        this.MyView = Marionette.ItemView.extend({
          el: '.view'
        });

        this.myView = new this.MyView();
        this.sinon.stub(this.myView, 'triggerMethod');
        this.myView.triggerAttach();
      });

      it('should triggerMethod the attach event', function() {
        expect(this.myView.triggerMethod)
          .to.have.been.calledOnce
          .and.calledWithExactly('attach');
      });
    });

    describe('and the el of the view is not a child of the document', function() {
      beforeEach(function() {
        this.myView = new Marionette.ItemView();
        this.sinon.stub(this.myView, 'triggerMethod');
        this.myView.triggerAttach();
      });

      it('should not triggerMethod the attach event', function() {
        expect(this.myView.triggerMethod).to.not.have.beenCalled;
      });
    });
  });

  describe('When calling triggerAttach and the view is a collectionView with children', function() {
    beforeEach(function() {
      this.setFixtures('<div class="view"></div>');

      this.collection = new Backbone.Collection([{},{}]);

      this.MyView = Marionette.CollectionView.extend({
        el: '.view',
        childView: this.BasicView
      });

      this.myView = new this.MyView({
        collection: this.collection
      });

      this.myView.render();

      _.each(this.myView.children._views, function(view) {
        this.sinon.stub(view, 'triggerMethod');
      }, this);

      this.myView.triggerAttach();
    });

    it('should triggerMethod the attach event on each child', function() {
      _.each(this.myView.children._views, function(view) {
        expect(view.triggerMethod)
          .to.have.been.calledOnce
          .and.calledWithExactly('attach');
      }, this);
    });
  });

  describe('when the parent view is initially detached', function() {
    beforeEach(function() {
      
      // A LayoutView class that we can use for all of our tests
      this.LayoutView = Backbone.Marionette.LayoutView.extend({
        template: _.template('<main></main><footer></footer>'),
        regions: {
          main: 'main',
          footer: 'footer'
        },
        onAttach: function() {}
      });
    });

    describe('When showing a View in a Region', function() {
      beforeEach(function() {
        this.MyView = Marionette.ItemView.extend({
          template: _.template(''),
          onAttach: this.sinon.stub()
        });

        this.myView = new this.MyView();
        this.region.show(this.myView);
      });

      it('should trigger onAttach on the View a single time', function() {
        expect(this.myView.onAttach).to.have.been.calledOnce;
      });
    });

    describe('When showing a LayoutView with a single level of nested views that are attached within onBeforeShow', function() {
      beforeEach(function() {
        this.mainView = new this.BasicView();
        this.footerView = new this.BasicView();

        this.sinon.spy(this.mainView, 'onAttach');
        this.sinon.spy(this.footerView, 'onAttach');

        var suite = this;

        this.CustomLayoutView = this.LayoutView.extend({
          onBeforeShow: function() {
            this.getRegion('main').show(suite.mainView);
            this.getRegion('footer').show(suite.footerView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onAttach on the LayoutView a single time', function() {
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the mainView a single time', function() {
        expect(this.mainView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the footerView a single time', function() {
        expect(this.footerView.onAttach).to.have.been.calledOnce;
      });
    });

    describe('When showing a LayoutView with two levels of nested views; with onBeforeShow for the first and second level', function() {
      beforeEach(function() {
        var suite = this;
        this.headerView = new this.BasicView();
        this.sinon.spy(this.headerView, 'onAttach');

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

        this.CustomLayoutView = this.LayoutView.extend({
          onBeforeShow: function() {
            this.getRegion('main').show(suite.mainView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onAttach on the LayoutView a single time', function() {
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the mainView a single time', function() {
        expect(this.mainView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the headerView a single time', function() {
        expect(this.headerView.onAttach).to.have.been.calledOnce;
      });
    });

    describe('When showing a LayoutView with two levels of nested views; onBeforeShow for the first level, then onShow for the second', function() {
      beforeEach(function() {
        var suite = this;
        this.headerView = new this.BasicView();
        this.sinon.spy(this.headerView, 'onAttach');

        this.MainView = Marionette.LayoutView.extend({
          template: _.template('<header></header>'),
          onAttach: this.sinon.stub(),
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

        this.region.show(this.layoutView);
      });

      it('should trigger onAttach on the LayoutView a single time', function() {
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the mainView a single time', function() {
        expect(this.mainView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the headerView a single time', function() {
        expect(this.headerView.onAttach).to.have.been.calledOnce;
      });
    });

    describe('When showing a LayoutView with two levels of nested views; with onShow for the first level, onBeforeShow for the second', function() {
      beforeEach(function() {
        var suite = this;
        this.headerView = new this.BasicView();
        this.sinon.spy(this.headerView, 'onAttach');

        this.MainView = Marionette.LayoutView.extend({
          template: _.template('<header></header>'),
          onAttach: this.sinon.stub(),
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
        this.sinon.spy(this.layoutView, 'onAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onAttach on the LayoutView a single time', function() {
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the mainView a single time', function() {
        expect(this.mainView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the headerView a single time', function() {
        expect(this.headerView.onAttach).to.have.been.calledOnce;
      });
    });

    describe('When showing a LayoutView with a single level of nested views that are attached within onShow', function() {
      beforeEach(function() {
        this.mainView = new this.BasicView();
        this.footerView = new this.BasicView();

        this.sinon.spy(this.mainView, 'onAttach');
        this.sinon.spy(this.footerView, 'onAttach');

        var suite = this;

        this.CustomLayoutView = this.LayoutView.extend({
          onShow: function() {
            this.getRegion('main').show(suite.mainView);
            this.getRegion('footer').show(suite.footerView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onAttach on the layoutView a single time', function() {
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the mainView a single time', function() {
        expect(this.mainView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the footerView a single time', function() {
        expect(this.footerView.onAttach).to.have.been.calledOnce;
      });
    });
  });

  describe('when the parent view is initially attached', function() {
    beforeEach(function() {
      this.setFixtures('<div class="layout-view"></div>');

      // A LayoutView class that we can use for all of our tests
      this.LayoutView = Backbone.Marionette.LayoutView.extend({
        el: '.layout-view',
        template: _.template('<main></main><footer></footer>'),
        regions: {
          main: 'main',
          footer: 'footer'
        },
        onAttach: function() {}
      });
    });

    describe('When showing a View in a Region', function() {
      beforeEach(function() {
        this.MyView = Marionette.ItemView.extend({
          el: '.layout-view',
          template: _.template(''),
          onAttach: this.sinon.stub()
        });

        this.myView = new this.MyView();
        this.region.show(this.myView);
      });

      it('should trigger onAttach on the View a single time', function() {
        expect(this.myView.onAttach).to.have.been.calledOnce;
      });
    });

    describe('When showing a LayoutView with a single level of nested views that are attached within onBeforeShow', function() {
      beforeEach(function() {
        this.mainView = new this.BasicView();
        this.footerView = new this.BasicView();

        this.sinon.spy(this.mainView, 'onAttach');
        this.sinon.spy(this.footerView, 'onAttach');

        var suite = this;

        this.CustomLayoutView = this.LayoutView.extend({
          onBeforeShow: function() {
            this.getRegion('main').show(suite.mainView);
            this.getRegion('footer').show(suite.footerView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onAttach on the LayoutView a single time', function() {
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the mainView twice', function() {
        expect(this.mainView.onAttach).to.have.been.calledTwice;
      });

      it('should trigger onAttach on the footerView twice', function() {
        expect(this.footerView.onAttach).to.have.been.calledTwice;
      });
    });

    describe('When showing a LayoutView with two levels of nested views; with onBeforeShow for the first and second level', function() {
      beforeEach(function() {
        var suite = this;
        this.headerView = new this.BasicView();
        this.sinon.spy(this.headerView, 'onAttach');

        this.MainView = Marionette.LayoutView.extend({
          template: _.template('<header></header>'),
          onAttach: this.sinon.stub(),
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
            console.log('attached?', Marionette.isNodeAttached(this.el));
            this.getRegion('main').show(suite.mainView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onAttach on the LayoutView a single time', function() {
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the mainView twice', function() {
        expect(this.mainView.onAttach).to.have.been.calledTwice;
      });

      it('should trigger onAttach on the headerView twice', function() {
        expect(this.headerView.onAttach).to.have.been.calledTwice;
      });
    });

    describe('When showing a LayoutView with two levels of nested views; onBeforeShow for the first level, then onShow for the second', function() {
      beforeEach(function() {
        var suite = this;
        this.headerView = new this.BasicView();
        this.sinon.spy(this.headerView, 'onAttach');

        this.MainView = Marionette.LayoutView.extend({
          template: _.template('<header></header>'),
          onAttach: this.sinon.stub(),
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

        this.region.show(this.layoutView);
      });

      it('should trigger onAttach on the LayoutView a single time', function() {
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the mainView twice', function() {
        expect(this.mainView.onAttach).to.have.been.calledTwice;
      });

      it('should trigger onAttach on the headerView twice', function() {
        expect(this.headerView.onAttach).to.have.been.calledTwice;
      });
    });

    describe('When showing a LayoutView with two levels of nested views; with onShow for the first level, onBeforeShow for the second', function() {
      beforeEach(function() {
        var suite = this;
        this.headerView = new this.BasicView();
        this.sinon.spy(this.headerView, 'onAttach');

        this.MainView = Marionette.LayoutView.extend({
          template: _.template('<header></header>'),
          onAttach: this.sinon.stub(),
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
        this.sinon.spy(this.layoutView, 'onAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onAttach on the LayoutView a single time', function() {
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the mainView a single time', function() {
        expect(this.mainView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the headerView a single time', function() {
        expect(this.headerView.onAttach).to.have.been.calledOnce;
      });
    });

    describe('When showing a LayoutView with a single level of nested views that are attached within onShow', function() {
      beforeEach(function() {
        this.mainView = new this.BasicView();
        this.footerView = new this.BasicView();

        this.sinon.spy(this.mainView, 'onAttach');
        this.sinon.spy(this.footerView, 'onAttach');

        var suite = this;

        this.CustomLayoutView = this.LayoutView.extend({
          onShow: function() {
            this.getRegion('main').show(suite.mainView);
            this.getRegion('footer').show(suite.footerView);
          }
        });

        this.layoutView = new this.CustomLayoutView();
        this.sinon.spy(this.layoutView, 'onAttach');

        this.region.show(this.layoutView);
      });

      it('should trigger onAttach on the layoutView a single time', function() {
        expect(this.layoutView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the mainView a single time', function() {
        expect(this.mainView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onAttach on the footerView a single time', function() {
        expect(this.footerView.onAttach).to.have.been.calledOnce;
      });
    });
  });
});
