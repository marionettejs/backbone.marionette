describe('isNodeAttached', function() {
  'use strict';

  describe('document.documentElement', function() {
    it('should exist', function() {
      expect(document.documentElement).to.not.be.undefined;
    });
  });
});
