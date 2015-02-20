describe('get option', function() {
  'use strict';

  describe('when an object only has the option set on the definition', function() {
    beforeEach(function() {
      this.target = {foo: 'bar'};
      this.value = Marionette.getOption(this.target, 'foo');
    });

    it('should return that definitions option', function() {
      expect(this.value).to.equal(this.target.foo);
    });
  });

  describe('when an object only has the option set on the options', function() {
    beforeEach(function() {
      this.target = {options: {foo: 'bar'}};
      this.value = Marionette.getOption(this.target, 'foo');
    });

    it('should return value from the options', function() {
      expect(this.value).to.equal(this.target.options.foo);
    });
  });

  describe('when an object has the option set on the options, and it is a "falsey" value', function() {
    beforeEach(function() {
      this.target = {options: {foo: false}};
      this.value = Marionette.getOption(this.target, 'foo');
    });

    it('should return value from the options', function() {
      expect(this.value).to.equal(this.target.options.foo);
    });
  });

  describe('when an object has the option set on the options, and it is a "undefined" value', function() {
    beforeEach(function() {
      this.target = {foo: 'bar', options: {foo: undefined}};
      this.value = Marionette.getOption(this.target, 'foo');
    });

    it('should return the objects value', function() {
      expect(this.value).to.equal(this.target.foo);
    });
  });

  describe('when an object has the option set on both the defininition and options', function() {
    beforeEach(function() {
      this.target = {foo: 'bar', options: {foo: 'baz'}};
      this.value = Marionette.getOption(this.target, 'foo');
    });

    it('should return that value from the options', function() {
      expect(this.value).to.equal(this.target.options.foo);
    });
  });

  describe('when proxying getOption', function() {
    beforeEach(function() {
      this.target = {foo: 'bar'};
      this.target.getOption = Marionette.proxyGetOption;
      this.value = this.target.getOption('foo');
    });

    it('should return that definition\'s option', function() {
      expect(this.value).to.equal(this.target.foo);
    });
  });
});
