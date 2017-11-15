import View from '../../../src/view';

describe('mergeOptions', function() {
  'use strict';
  let MyView;
  let MyUndefinedMergeOptionsView;

  beforeEach(function() {
    MyView = View.extend({
      myViewOptions: ['color', 'size'],

      initialize: function(options) {
        this.mergeOptions(options, this.myViewOptions);
      }
    });

    MyUndefinedMergeOptionsView = View.extend({
      initialize: function(options) {
        this.mergeOptions(undefined);
      }
    });
  });

  describe('when instantiating a view with no options', function() {
    it('should not throw an Error', function() {
      expect(function() {
        new MyView();
      }).to.not.throw();
    });
  });

  describe('when calling mergeOptions with an undefined', function() {
    let view;

    it('should return instantly without merging anything', function() {
      view = new MyUndefinedMergeOptionsView();
      expect(view.options).to.deep.equal({});
    });
  });

  describe('when instantiating a view with options, none matching the keys', function() {
    let myView;

    beforeEach(function() {
      myView = new MyView({
        hungry: true,
        country: 'USA'
      });
    });

    it('should not merge any of those options', function() {
      expect(myView).to.not.contain.keys('hungry', 'country');
    });
  });

  describe('when instantiating a view with options, some matching the keys', function() {
    let myView;

    beforeEach(function() {
      myView = new MyView({
        hungry: true,
        country: 'USA',
        color: 'blue'
      });
    });

    it('should not merge the ones that do not match', function() {
      expect(myView).to.not.contain.keys('hungry', 'country');
    });

    it('should merge the ones that match', function() {
      expect(myView).to.contain.keys('color');
    });
  });

  describe('when instantiating a view with options, all matching the keys', function() {
    let myView;

    beforeEach(function() {
      myView = new MyView({
        size: 'large',
        color: 'blue'
      });
    });

    it('should merge all of the options', function() {
      expect(myView).to.contain.keys('color', 'size');
    });
  });
});
