describe('get option', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when an object only has the option set on the definition', function() {
    beforeEach(function() {
      this.target = {
        foo: 'bar'
      };

      this.value = Marionette.getOption(this.target, 'foo');
    });

    it('should return that definitions option', function() {
      expect(this.value).to.equal('bar');
    });
  });

  describe('when an object only has the option set on the options', function() {
    beforeEach(function() {
      this.target = {
        options: {
          foo: 'bar'
        }
      };

      this.value = Marionette.getOption(this.target, 'foo');
    });

    it('should return value from the options', function() {
      expect(this.value).to.equal('bar');
    });
  });

  describe('when an object has the option set on the options, and it is a "falsey" value', function() {
    beforeEach(function() {
      this.target = {
        options: {
          foo: false
        }
      };

      this.value = Marionette.getOption(this.target, 'foo');
    });

    it('should return value from the options', function() {
      expect(this.value).to.equal(false);
    });
  });

  describe('when an object has the option set on the options, and it is a "undefined" value', function() {
    beforeEach(function() {
      this.target = {
        options: {
          foo: undefined
        },

        foo: 'bar'
      };

      this.value = Marionette.getOption(this.target, 'foo');
    });

    it('should return the objects value', function() {
      expect(this.value).to.equal('bar');
    });
  });

  describe('when an object has the option set on both the defininition and options', function() {
    beforeEach(function() {
      this.target = {
        foo: 'bar',

        options: {
          foo: 'quux'
        }
      };

      this.value = Marionette.getOption(this.target, 'foo');
    });

    it('should return that value from the options', function() {
      expect(this.value).to.equal('quux');
    });
  });

  describe('when proxying getOption', function() {
    beforeEach(function() {
      this.target = {
        foo: 'bar',
        getOption: Marionette.proxyGetOption
      };
    });

    it('should return that definition\'s option', function(){
      expect(this.target.getOption('foo')).to.equal('bar');
    });
  });
});
