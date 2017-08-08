describe('Behavior', function() {
  'use strict';

  describe('when instantiating a behavior with some options', function() {
    beforeEach(function() {
      this.createOptions = {foo: 'bar'};
      this.behavior = new Marionette.Behavior(this.createOptions);
    });

    it('Those options should be merged into instance options', function() {
      expect(this.behavior.options.foo).to.be.eq(this.createOptions.foo);
    });
  });

});
