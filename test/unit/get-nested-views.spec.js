describe('getNestedView', function() {
  beforeEach(function() {
    this.template = _.template('<div class="main"></div><div class="subheader"></div>');
  });

  describe('Starting with an ItemView', function() {
    beforeEach(function() {
      this.itemView = new Marionette.ItemView({
        template: false
      });
    });

    it('should return an empty array', function() {
      expect(this.itemView._getNestedViews())
        .to.be.instanceof(Array)
        .and.to.have.length(0);
    });
  });

  describe('Starting with a LayoutView with no regions', function() {
    beforeEach(function() {
      this.layoutView = new Marionette.LayoutView({
        template: this.template
      });
    });

    it('should return an empty array', function() {
      expect(this.layoutView._getNestedViews())
        .to.be.instanceof(Array)
        .and.to.have.length(0);
    });
  });

  describe('Starting with a layoutView with regions', function() {
    beforeEach(function() {
      this.Layout = Marionette.LayoutView.extend({
        template: this.template,

        regions: {
          main: '.main',
          subheader: '.subheader'
        }
      });

      this.layoutView = new this.Layout();

      this.layoutView.render();

      // A suitable base item view to use as a child
      this.BaseView = Marionette.ItemView.extend({
        template: false
      });
    });

    it('should return an empty array', function() {
      expect(this.layoutView._getNestedViews())
        .to.be.instanceof(Array)
        .and.to.have.length(0);
    });

    describe('a LayoutView with two regions, both with child views', function() {
      beforeEach(function() {
        this.childOne = new this.BaseView();
        this.childTwo = new this.BaseView();

        this.layoutView.getRegion('main').show(this.childOne);
        this.layoutView.getRegion('subheader').show(this.childTwo);
      });

      it('it should return an array with both views inside of it', function() {
        expect(this.layoutView._getNestedViews())
          .to.be.instanceof(Array)
          .and.to.have.length(2)
          .and.to.contain(this.childOne)
          .and.to.contain(this.childTwo);
      });
    });

    describe('a LayoutView with two regions, one of them empty', function() {
      beforeEach(function() {
        this.childOne = new this.BaseView();

        this.layoutView.getRegion('main').show(this.childOne);
      });

      it('it should return an array with the one view inside of it', function() {
        expect(this.layoutView._getNestedViews())
          .to.be.instanceof(Array)
          .and.to.have.length(1)
          .and.to.contain(this.childOne);
      });
    });

    describe('a LayoutView containing a regular Backbone View', function() {
      beforeEach(function() {
        this.childOne = new Backbone.View();
        this.layoutView.getRegion('main').show(this.childOne);
      });

      it('it should return an array with the one view inside of it', function() {
        expect(this.layoutView._getNestedViews())
          .to.be.instanceof(Array)
          .and.to.have.length(1)
          .and.to.contain(this.childOne);
      });
    });

    describe('a LayoutView with another LayoutView as a child, and that LayoutView has children of its own', function() {
      beforeEach(function() {
        this.childOne = new this.Layout();
        this.subChildOne = new this.BaseView();
        this.layoutView.getRegion('main').show(this.childOne);
        this.childOne.getRegion('subheader').show(this.subChildOne);
      });

      it('it should return an array of both nested views', function() {
        expect(this.layoutView._getNestedViews())
          .to.be.instanceof(Array)
          .and.to.have.length(2)
          .and.to.contain(this.childOne)
          .and.to.contain(this.subChildOne);
      });
    });

    describe('a LayoutView with an empty CollectionView as a child', function() {
      beforeEach(function() {
        this.childOne = new Marionette.CollectionView();
        this.layoutView.getRegion('main').show(this.childOne);
      });

      it('it should return an array with that one view inside of it', function() {
        expect(this.layoutView._getNestedViews())
          .to.be.instanceof(Array)
          .and.to.have.length(1)
          .and.to.contain(this.childOne);
      });
    });

    describe('a LayoutView with a CollectionView with children', function() {
      beforeEach(function() {
        this.childOne = new Marionette.CollectionView({
          collection: new Backbone.Collection([{}, {}, {}]),
          childView: Marionette.ItemView.extend({template: false})
        });

        this.layoutView.getRegion('main').show(this.childOne);
        this.subChildOne = this.childOne.children.findByIndex(0);
        this.subChildTwo = this.childOne.children.findByIndex(1);
        this.subChildThree = this.childOne.children.findByIndex(2);
      });

      it('it should return an array with the child and its children in it', function() {
        expect(this.layoutView._getNestedViews())
          .to.be.instanceof(Array)
          .and.to.have.length(4)
          .and.to.contain(this.childOne)
          .and.to.contain(this.subChildOne)
          .and.to.contain(this.subChildTwo)
          .and.to.contain(this.subChildThree);
      });
    });

    describe('a LayoutView with a CollectionView of LayoutViews, one of them having children of its own', function() {
      beforeEach(function() {
        this.childOne = new Marionette.CollectionView({
          collection: new Backbone.Collection([{}, {}]),
          childView: this.Layout
        });

        this.subSubChildOne = new this.BaseView();
        this.layoutView.getRegion('main').show(this.childOne);
        this.subChildOne = this.childOne.children.findByIndex(0);
        this.subChildTwo = this.childOne.children.findByIndex(1);
        this.subChildOne.getRegion('main').show(this.subSubChildOne);
      });

      it('it should return an array with the child and its children in it', function() {
        expect(this.layoutView._getNestedViews())
          .to.be.instanceof(Array)
          .and.to.have.length(4)
          .and.to.contain(this.childOne)
          .and.to.contain(this.subChildOne)
          .and.to.contain(this.subChildTwo)
          .and.to.contain(this.subSubChildOne);
      });
    });
  });
});
