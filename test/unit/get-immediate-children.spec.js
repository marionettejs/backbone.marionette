describe('_getImmediateChildren', function() {
  beforeEach(function() {

    // A suitable view to use as a child
    this.BaseView = Marionette.View.extend({
      template: _.noop
    });
  });

  describe('Marionette.View', function() {
    beforeEach(function() {
      this.view = new Marionette.View();
    });
    it('should return an empty array for getImmediateChildren', function() {
      expect(this.view._getImmediateChildren())
        .to.be.instanceof(Array)
        .and.to.have.length(0);
    });

    describe('without regions', function() {
      beforeEach(function() {
        this.layoutView = new Marionette.View({
          template: _.noop
        });
      });
      it('should return an empty array for getImmediateChildren', function() {
        expect(this.layoutView._getImmediateChildren())
          .to.be.instanceof(Array)
          .and.to.have.length(0);
      });
    });

    describe('when there are empty regions', function() {
      beforeEach(function() {
        this.layoutView = new Marionette.View({
          template: _.template('<main></main><footer></footer>'),
          regions: {
            main: '.main',
            footer: '.footer'
          }
        });
        this.layoutView.render();
      });
      it('should return an empty array for getImmediateChildren', function() {
        expect(this.layoutView._getImmediateChildren())
          .to.be.instanceof(Array)
          .and.to.have.length(0);
      });
    });

    describe('when there are non-empty regions', function() {
      beforeEach(function() {
        this.layoutView = new Marionette.View({
          template: _.template('<main></main><footer></footer>'),
          regions: {
            main: 'main',
            footer: 'footer'
          }
        });
        this.layoutView.render();
        this.childOne = new this.BaseView();
        this.childTwo = new this.BaseView();
        this.layoutView.getRegion('main').show(this.childOne);
        this.layoutView.getRegion('footer').show(this.childTwo);
      });
      it('should return an empty array for getImmediateChildren', function() {
        expect(this.layoutView._getImmediateChildren())
          .to.be.instanceof(Array)
          .and.to.have.length(2)
          .and.to.contain(this.childOne)
          .and.to.contain(this.childTwo);
      });
    });
  });
});
