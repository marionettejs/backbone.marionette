describe('normalizeMethods', function() {
  'use strict';

  beforeEach(function() {
    this.View = Backbone.Marionette.ItemView.extend({
      foo: this.sinon.stub()
    });
    this.view = new this.View();
    this.hash = {
      'foo': 'foo',
      'bar': 'bar'
    };
    this.normalizedHash = this.view.normalizeMethods(this.hash);
  });

  describe('when normalizeMethods is called with a hash of functions and strings', function() {
    it('should convert the strings that exist as functions to functions', function() {
      expect(this.normalizedHash).to.have.property('foo');
    });

    it('should ignore strings that dont exist as functions on the context', function() {
      expect(this.normalizedHash).not.to.have.property('bar');
    });
  });
});
