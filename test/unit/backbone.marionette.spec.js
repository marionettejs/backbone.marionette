describe('backbone.marionette', function() {
  'use strict';

  describe('when Marionettes on global namespace', function() {
    it('should have a working noConflict method', function() {
      var foo = Marionette;
      expect(Marionette.noConflict()).to.deep.equal(Marionette);
      Backbone.Marionette = foo;
    });

    it('should have a working getOption method which just returns when no optionName is passed', function() {
      const result = Marionette.getOption();
      expect(result).to.be.equal(undefined);
    });
  });
});
