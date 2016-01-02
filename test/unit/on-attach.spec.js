describe('onAttach', function() {
  'use strict';

  beforeEach(function() {
    var spec = this;

    // A Region to show our View within
    this.setFixtures('<div id="region"></div>');
    this.el = $('#region')[0];
    this.region = new Marionette.Region({el: this.el});

    // A view we can use as nested child views
    // this.ChildView = Backbone.View.extend({
    //   template: false,
    //   constructor: function(options) {
    //     Backbone.View.prototype.constructor.call(this, options);
    //     spec.sinon.spy(this, 'onAttach');
    //     spec.sinon.spy(this, 'onBeforeAttach');
    //   },
    //   onAttach: function() {},
    //   onBeforeAttach: function() {}
    // });

    this.BasicView = Marionette.View.extend({
      template: _.template('<header></header><main></main><footer></footer>'),
      regions: {
        header: 'header',
        main: 'main',
        footer: 'footer'
      },
      constructor: function() {
        Marionette.View.prototype.constructor.apply(this, arguments);
        spec.sinon.spy(this, 'onBeforeAttach');
        spec.sinon.spy(this, 'onAttach');
      },
      onAttach: function() {},
      onBeforeAttach: function() {}
    });

    this.EmptyView = Backbone.View.extend({
      template: false,
      constructor: function(options) {
        Backbone.View.prototype.constructor.call(this, options);
        this.onAttach = spec.sinon.stub();
        this.onBeforeAttach = spec.sinon.stub();
      }
    });
    this.ChildView = Backbone.View.extend({
      template: false,
      constructor: function(options) {
        Backbone.View.prototype.constructor.call(this, options);
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

      this.view = new this.ChildView();
      this.view.onAttach = this.sinon.stub();
      this.view.onBeforeAttach = this.sinon.stub();

      this.detachedRegion.show(new this.ChildView());
    });

    it('should not call either trigger method on the view', function() {
      expect(this.view.onAttach).to.not.have.been.called;
      expect(this.view.onBeforeAttach).to.not.have.been.called;
    });
  });

  describe('when showing a region that is attached to the document', function() {
    beforeEach(function() {
      this.view = new this.ChildView();
      this.view.onAttach = this.sinon.stub();
      this.view.onBeforeAttach = this.sinon.stub();

      this.sinon.spy(this.region, 'attachHtml');
      this.region.show(this.view);
    });

    it('should call onBeforeAttach on the view', function() {
      expect(this.view.onBeforeAttach)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(this.view)
        .and.to.be.calledBefore(this.region.attachHtml);
    });

    it('should call onAttach on the view', function() {
      expect(this.view.onAttach)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(this.view)
        .and.to.be.calledAfter(this.region.attachHtml);
    });
  });

  describe('when showing a region that is attached to the document & has triggerAttach set to false', function() {
    beforeEach(function() {
      this.view = new this.ChildView();
      this.view.onAttach = this.sinon.stub();
      this.region.triggerAttach = false;

      this.region.show(this.view);
    });

    it('should not call onBeforeAttach or onAttach on the view', function() {
      expect(this.view.onBeforeAttach).to.not.have.been.called;
      expect(this.view.onAttach).to.not.have.been.called;
    });
  });

  describe('when a view is shown in a region', function() {
    beforeEach(function() {
      this.childView = new this.ChildView();
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
    describe('When showing a View in a Region', function() {
      beforeEach(function() {
        this.myView = new this.ChildView();
        this.region.show(this.myView);
      });

      it('should trigger onBeforeAttach and onAttach on the View a single time', function() {
        expect(this.myView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.myView.onAttach).to.have.been.calledOnce;
      });

      it('should trigger onBeforeAttach before onAttach', function() {
        expect(this.myView.onBeforeAttach).to.have.been.calledBefore(this.myView.onAttach);
      });
    });

    describe('When showing a View with a single level of nested views', function() {
      beforeEach(function() {
        this.mainView = new this.ChildView();
        this.footerView = new this.ChildView();

        var suite = this;

        this.CustomView = this.BasicView.extend({
          onRender: function() {
            this.getRegion('main').show(suite.mainView);
            this.getRegion('footer').show(suite.footerView);
          }
        });

        this.layoutView = new this.CustomView();

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

    describe('When showing a View with two levels of nested views', function() {
      beforeEach(function() {
        var suite = this;
        this.headerView = new this.ChildView();

        this.MainView = this.BasicView.extend({
          template: _.template('<header></header>'),
          regions: {
            header: 'header'
          },
          onRender: function() {
            this.getRegion('header').show(suite.headerView);
          }
        });
        this.mainView = new this.MainView();

        this.CustomView = this.BasicView.extend({
          onRender: function() {
            this.getRegion('main').show(suite.mainView);
          }
        });

        this.layoutView = new this.CustomView();

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
  });

  describe('when the parent view is initially attached', function() {
    beforeEach(function() {
      this.setFixtures('<div class="layout-view"></div>');

      // A View class that we can use for all of our tests
      this.View = this.BasicView.extend({
        el: '.layout-view'
      });
    });

    describe('When showing a View in a Region', function() {
      beforeEach(function() {
        this.myView = new this.ChildView();
        this.region.show(this.myView);
      });

      it('should trigger onBeforeAttach & onAttach on the View a single time', function() {
        expect(this.myView.onBeforeAttach).to.have.been.calledOnce;
        expect(this.myView.onAttach).to.have.been.calledOnce;
      });
    });

    describe('When showing a View with a single level of nested views', function() {
      beforeEach(function() {
        this.mainView = new this.ChildView();
        this.footerView = new this.ChildView();

        var suite = this;

        this.CustomView = this.View.extend({
          onRender: function() {
            this.getRegion('main').show(suite.mainView);
            this.getRegion('footer').show(suite.footerView);
          }
        });

        this.layoutView = new this.CustomView();

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

    describe('When showing a View with two levels of nested views', function() {
      beforeEach(function() {
        var suite = this;
        this.headerView = new this.ChildView();

        this.MainView = this.BasicView.extend({
          onRender: function() {
            this.getRegion('header').show(suite.headerView);
          }
        });
        this.mainView = new this.MainView();

        this.CustomView = this.View.extend({
          onRender: function() {
            this.getRegion('main').show(suite.mainView);
          }
        });

        this.layoutView = new this.CustomView();

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
      expect(this.childView.onBeforeAttach)
        .and.to.have.been.calledOnce
        .and.to.have.been.calledOn(this.childView)
        .and.to.have.been.calledWith(this.childView);
      expect(this.childView.onAttach)
        .and.to.have.been.calledOnce
        .and.to.have.been.calledOn(this.childView)
        .and.to.have.been.calledWith(this.childView);
    });

    describe('when adding a new element to the collection', function() {
      beforeEach(function() {
        this.collection.add({id: 1});
        this.childView = this.collectionView.children.findByIndex(0);
      });
      it('should trigger onBeforeAttach and onAttach on the childView a single time', function() {
        expect(this.childView).to.be.an.instanceof(this.ChildView);
        expect(this.childView.onBeforeAttach)
          .and.to.have.been.calledOnce
          .and.to.have.been.calledOn(this.childView)
          .and.to.have.been.calledWith(this.childView);
        expect(this.childView.onAttach)
          .and.to.have.been.calledOnce
          .and.to.have.been.calledOn(this.childView)
          .and.to.have.been.calledWith(this.childView);
      });
    });
  });

  describe('when showing an empty CollectionView with triggerAttach set to false', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();
      this.collectionView = new this.BasicCollectionView({
        collection: this.collection
      });
      this.collectionView.triggerAttach = false;
      this.region.show(this.collectionView);
      this.childView = this.collectionView.children.findByIndex(0);
    });

    it('should not trigger onAttach on the emptyView a single time', function() {
      expect(this.childView).to.be.an.instanceof(this.EmptyView);
      expect(this.childView.onAttach)
        .and.to.not.have.been.called
        .and.to.not.have.been.calledOn(this.childView)
        .and.to.not.have.been.calledWith(this.childView);
    });

    describe('when adding a new element to the collection', function() {
      beforeEach(function() {
        this.collection.add({id: 1});
        this.childView = this.collectionView.children.findByIndex(0);
      });
      it('should not trigger onAttach on the childView a single time', function() {
        expect(this.childView).to.be.an.instanceof(this.ChildView);
        expect(this.childView.onAttach)
          .and.to.not.have.been.called
          .and.to.not.have.been.calledOn(this.childView)
          .and.to.not.have.been.calledWith(this.childView);
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
      expect(this.childView1.onBeforeAttach)
        .and.to.have.been.calledOnce
        .and.to.have.been.calledOn(this.childView1)
        .and.to.have.been.calledWith(this.childView1);
      expect(this.childView1.onAttach)
        .and.to.have.been.calledOnce
        .and.to.have.been.calledOn(this.childView1)
        .and.to.have.been.calledWith(this.childView1);
      expect(this.childView2.onBeforeAttach)
        .and.to.have.been.calledOnce
        .and.to.have.been.calledOn(this.childView2)
        .and.to.have.been.calledWith(this.childView2);
      expect(this.childView2.onAttach)
        .and.to.have.been.calledOnce
        .and.to.have.been.calledOn(this.childView2)
        .and.to.have.been.calledWith(this.childView2);
    });

    describe('when re-rendering the CollectionView', function() {
      beforeEach(function() {
        this.collectionView.render();
      });

      it('should trigger onBeforeAttach and onAttach on each of its childViews a single time', function() {
        expect(this.childView1.onBeforeAttach)
          .and.to.have.been.calledOnce
          .and.to.have.been.calledOn(this.childView1)
          .and.to.have.been.calledWith(this.childView1);
        expect(this.childView1.onAttach)
          .and.to.have.been.calledOnce
          .and.to.have.been.calledOn(this.childView1)
          .and.to.have.been.calledWith(this.childView1);
        expect(this.childView2.onBeforeAttach)
          .and.to.have.been.calledOnce
          .and.to.have.been.calledOn(this.childView2)
          .and.to.have.been.calledWith(this.childView2);
        expect(this.childView2.onAttach)
          .and.to.have.been.calledOnce
          .and.to.have.been.calledOn(this.childView2)
          .and.to.have.been.calledWith(this.childView2);
      });
    });

    describe('when emptying the collection', function() {
      beforeEach(function() {
        this.collection.reset();
        this.childView = this.collectionView.children.findByIndex(0);
      });
      it('should trigger onBeforeAttach and onAttach on the emptyView a single time', function() {
        expect(this.childView).to.be.an.instanceof(this.EmptyView);
        expect(this.childView.onBeforeAttach)
          .and.to.have.been.calledOnce
          .and.to.have.been.calledOn(this.childView)
          .and.to.have.been.calledWith(this.childView);
        expect(this.childView.onAttach)
          .and.to.have.been.calledOnce
          .and.to.have.been.calledOn(this.childView)
          .and.to.have.been.calledWith(this.childView);
      });
    });
  });

  describe('when showing a non-empty CollectionView with triggerAttach set to false', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection([{id: 1}, {id: 2}]);
      this.collectionView = new this.BasicCollectionView({
        collection: this.collection
      });
      this.collectionView.triggerAttach = false;
      this.region.show(this.collectionView);
      this.childView1 = this.collectionView.children.findByIndex(0);
      this.childView2 = this.collectionView.children.findByIndex(1);
    });

    it('should not trigger onBeforeAttach or onAttach on each of its childViews a single time', function() {
      expect(this.childView1.onBeforeAttach)
        .and.to.not.have.been.calledOnce
        .and.to.not.have.been.calledOn(this.childView1)
        .and.to.not.have.been.calledWith(this.childView1);
      expect(this.childView1.onAttach)
        .and.to.not.have.been.calledOnce
        .and.to.not.have.been.calledOn(this.childView1)
        .and.to.not.have.been.calledWith(this.childView1);
      expect(this.childView2.onBeforeAttach)
        .and.to.not.have.been.calledOnce
        .and.to.not.have.been.calledOn(this.childView2)
        .and.to.not.have.been.calledWith(this.childView2);
      expect(this.childView2.onAttach)
        .and.to.not.have.been.calledOnce
        .and.to.not.have.been.calledOn(this.childView2)
        .and.to.not.have.been.calledWith(this.childView2);
    });

    describe('when re-rendering the CollectionView', function() {
      beforeEach(function() {
        this.collectionView.render();
      });

      it('should not trigger onBeforeAttach or onAttach on each of its childViews a single time', function() {
        expect(this.childView1.onBeforeAttach)
          .and.to.not.have.been.calledOnce
          .and.to.not.have.been.calledOn(this.childView1)
          .and.to.not.have.been.calledWith(this.childView1);
        expect(this.childView1.onAttach)
          .and.to.not.have.been.calledOnce
          .and.to.not.have.been.calledOn(this.childView1)
          .and.to.not.have.been.calledWith(this.childView1);
        expect(this.childView2.onBeforeAttach)
          .and.to.not.have.been.calledOnce
          .and.to.not.have.been.calledOn(this.childView2)
          .and.to.not.have.been.calledWith(this.childView2);
        expect(this.childView2.onAttach)
          .and.to.not.have.been.calledOnce
          .and.to.not.have.been.calledOn(this.childView2)
          .and.to.not.have.been.calledWith(this.childView2);
      });
    });

    describe('when emptying the collection', function() {
      beforeEach(function() {
        this.collection.reset();
        this.childView = this.collectionView.children.findByIndex(0);
      });
      it('should not trigger onBeforeAttach or onAttach on the emptyView a single time', function() {
        expect(this.childView).to.be.an.instanceof(this.EmptyView);
        expect(this.childView.onBeforeAttach)
          .and.to.not.have.been.calledOnce
          .and.to.not.have.been.calledOn(this.childView)
          .and.to.not.have.been.calledWith(this.childView);
        expect(this.childView.onAttach)
          .and.to.not.have.been.calledOnce
          .and.to.not.have.been.calledOn(this.childView)
          .and.to.not.have.been.calledWith(this.childView);
      });
    });
  });
});
