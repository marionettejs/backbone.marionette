describe('mergeOptions', function() {
  'use strict';

  beforeEach(function() {
    this.MyView = Marionette.ItemView.extend({
      myViewOptions: ['color', 'size'],

      initialize: function(options) {
        this.mergeOptions(options, this.myViewOptions);
      }
    });
  });

  describe('when instantiating a view with no options', function() {
    it('should not throw an Error', function() {
      var suite = this;
      expect(function() {
        suite.myView = new suite.MyView();
      }).to.not.throw(Error);
    });
  });

  describe('when instantiating a view with options, none matching the keys', function() {
    beforeEach(function() {
      this.myView = new this.MyView({
        hungry: true,
        country: 'USA'
      });
    });

    it('should not merge any of those options', function() {
      expect(this.myView).to.not.contain.keys('hungry', 'country');
    });
  });

  describe('when instantiating a view with options, some matching the keys', function() {
    beforeEach(function() {
      this.myView = new this.MyView({
        hungry: true,
        country: 'USA',
        color: 'blue'
      });
    });

    it('should not merge the ones that do not match', function() {
      expect(this.myView).to.not.contain.keys('hungry', 'country');
    });

    it('should merge the ones that match', function() {
      expect(this.myView).to.contain.keys('color');
    });
  });

  describe('when instantiating a view with options, all matching the keys', function() {
    beforeEach(function() {
      this.myView = new this.MyView({
        size: 'large',
        color: 'blue'
      });
    });

    it('should merge all of the options', function() {
      expect(this.myView).to.contain.keys('color', 'size');
    });
  });
});
