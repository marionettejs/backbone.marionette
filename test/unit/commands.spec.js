describe('application commands', function() {
  'use strict';

  beforeEach(function() {
    this.app = new Marionette.Application();
  });

  describe('when creating an instance of an Application', function() {
    it('should provide command execution framework', function() {
      expect(this.app.commands).to.be.instanceof(Backbone.Wreqr.Commands);
    });

    it('should allow execution of commands directly', function() {
      expect(this.app.execute).to.be.a('function');
    });
  });
});
