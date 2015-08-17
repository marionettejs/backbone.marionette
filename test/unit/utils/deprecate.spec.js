import Marionette from '../../../src/backbone-marionette';

describe('Marionette.deprecate', function() {
  beforeEach(function() {
    this.sinon.spy(Marionette.deprecate, '_warn');
    this.sinon.stub(Marionette.deprecate, '_console', {
      warn: this.sinon.stub()
    });
    Marionette.deprecate._cache = {};
  });

  describe('Marionette.deprecate._warn', function() {
    beforeEach(function() {
      Marionette.deprecate._warn('foo');
    });

    it('should `console.warn` the message', function() {
      expect(Marionette.deprecate._console.warn)
        .to.have.been.calledOnce
        .and.calledOn(Marionette.deprecate._console)
        .and.calledWith('foo');
    });
  });

  describe('when calling with a message', function() {
    beforeEach(function() {
      Marionette.deprecate('foo');
    });

    it('should `console.warn` the message', function() {
      expect(Marionette.deprecate._warn)
        .to.have.been.calledOnce
        .and.calledWith('Deprecation warning: foo');
    });
  });

  describe('when calling with an object', function() {
    beforeEach(function() {
      Marionette.deprecate({
        prev: 'foo',
        next: 'bar'
      });
    });

    it('should `console.warn` the message', function() {
      expect(Marionette.deprecate._warn)
        .to.have.been.calledOnce
        .and.calledWith('Deprecation warning: foo is going to be removed in the future. Please use bar instead.');
    });
  });

  describe('when calling with an object with a url', function() {
    beforeEach(function() {
      Marionette.deprecate({
        prev: 'foo',
        next: 'bar',
        url: 'baz'
      });
    });

    it('should `console.warn` the message', function() {
      expect(Marionette.deprecate._warn)
        .to.have.been.calledOnce
        .and.calledWith('Deprecation warning: foo is going to be removed in the future. Please use bar instead. See: baz');
    });
  });

  describe('when calling with a message and a falsy test', function() {
    beforeEach(function() {
      Marionette.deprecate('bar', false);
    });

    it('should `console.warn` the message', function() {
      expect(Marionette.deprecate._warn)
        .to.have.been.calledOnce
        .and.calledWith('Deprecation warning: bar');
    });
  });

  describe('when calling with a message and a truthy test', function() {
    beforeEach(function() {
      Marionette.deprecate('Foo', true);
    });

    it('should not `console.warn` the message', function() {
      expect(Marionette.deprecate._warn).not.to.have.been.called;
    });
  });

  describe('when calling with the same message twice', function() {
    beforeEach(function() {
      Marionette.deprecate('baz');
      Marionette.deprecate('baz');
    });

    it('should `console.warn` the message', function() {
      expect(Marionette.deprecate._warn)
        .to.have.been.calledOnce
        .and.calledWith('Deprecation warning: baz');
    });
  });
});
