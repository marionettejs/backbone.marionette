describe('backbone.marionette', function() {
  'use strict';

  describe('Methods on Marionettes global namespace', function() {
    it('should have a working noConflict method', function() {
      var foo = Marionette;
      expect(Marionette.noConflict()).to.deep.equal(Marionette);
      Backbone.Marionette = foo;
    });
  });
});
