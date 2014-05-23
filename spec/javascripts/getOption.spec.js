describe('get option', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when an object only has the option set on the definition', function() {
    var target, value;

    beforeEach(function() {
      target = {
        foo: 'bar'
      };

      value = Marionette.getOption(target, 'foo');
    });

    it('should return that definitions option', function() {
      expect(value).to.equal('bar');
    });
  });

  describe('when an object only has the option set on the options', function() {
    var target, value;

    beforeEach(function() {
      target = {
        options: {
          foo: 'bar'
        }
      };

      value = Marionette.getOption(target, 'foo');
    });

    it('should return value from the options', function() {
      expect(value).to.equal('bar');
    });
  });

  describe('when an object has the option set on the options, and it is a "falsey" value', function() {
    var target, value;

    beforeEach(function() {
      target = {
        options: {
          foo: false
        }
      };

      value = Marionette.getOption(target, 'foo');
    });

    it('should return value from the options', function() {
      expect(value).to.equal(false);
    });
  });

  describe('when an object has the option set on the options, and it is a "undefined" value', function() {
    var target, value;

    beforeEach(function() {
      target = {
        options: {
          foo: undefined
        },

        foo: 'bar'
      };

      value = Marionette.getOption(target, 'foo');
    });

    it('should return the objects value', function() {
      expect(value).to.equal('bar');
    });
  });

  describe('when an object has the option set on both the defininition and options', function() {
    var target, value;

    beforeEach(function() {
      target = {
        foo: 'bar',

        options: {
          foo: 'quux'
        }
      };

      value = Marionette.getOption(target, 'foo');
    });

    it('should return that value from the options', function() {
      expect(value).to.equal('quux');
    });
  });

  describe('when proxying getOption', function() {
    var target;

    beforeEach(function() {
      target = {
        foo: 'bar',
        getOption: Marionette.proxyGetOption
      };
    });

    it('should return that definition\'s option', function(){
      expect(target.getOption('foo')).to.equal('bar');
    });
  });
});
