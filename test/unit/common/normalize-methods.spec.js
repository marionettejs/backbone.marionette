import View from '../../../src/view';

describe('normalizeMethods', function() {
  'use strict';

  let MyView;
  let view;
  let hash;
  let normalizedHash;

  beforeEach(function() {
    MyView = View.extend({
      foo: this.sinon.stub()
    });
    view = new MyView();
    hash = {
      'foo': 'foo',
      'bar': 'bar'
    };
    normalizedHash = view.normalizeMethods(hash);
  });

  describe('when normalizeMethods is called with a hash of functions and strings', function() {
    it('should convert the strings that exist as functions to functions', function() {
      expect(normalizedHash).to.have.property('foo');
    });

    it('should ignore strings that dont exist as functions on the context', function() {
      expect(normalizedHash).not.to.have.property('bar');
    });
  });
});
