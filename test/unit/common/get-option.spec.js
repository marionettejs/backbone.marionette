import { getOption } from '../../../src/backbone.marionette';

describe('get option', function() {
  'use strict';

  describe('when an object only has the option set on the definition', function() {
    let target;
    let value;

    beforeEach(function() {
      target = {foo: 'bar'};
      value = getOption(target, 'foo');
    });

    it('should return that definitions option', function() {
      expect(value).to.equal(target.foo);
    });
  });

  describe('when an object only has the option set on the options', function() {
    let target;
    let value;

    beforeEach(function() {
      target = {options: {foo: 'bar'}};
      value = getOption(target, 'foo');
    });

    it('should return value from the options', function() {
      expect(value).to.equal(target.options.foo);
    });
  });

  describe('when an object has the option set on the options, and it is a "falsey" value', function() {
    let target;
    let value;

    beforeEach(function() {
      target = {options: {foo: false}};
      value = getOption(target, 'foo');
    });

    it('should return value from the options', function() {
      expect(value).to.equal(target.options.foo);
    });
  });

  describe('when an object has the option set on the options, and it is a "undefined" value', function() {
    let target;
    let value;

    beforeEach(function() {
      target = {foo: 'bar', options: {foo: undefined}};
      value = getOption(target, 'foo');
    });

    it('should return the objects value', function() {
      expect(value).to.equal(target.foo);
    });
  });

  describe('when an object has the option set on both the defininition and options', function() {
    let target;
    let value;

    beforeEach(function() {
      target = {foo: 'bar', options: {foo: 'baz'}};
      value = getOption(target, 'foo');
    });

    it('should return that value from the options', function() {
      expect(value).to.equal(target.options.foo);
    });
  });
});
