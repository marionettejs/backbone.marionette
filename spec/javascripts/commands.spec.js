describe('application commands', function() {
  'use strict';
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when creating an instance of an Application', function() {
    beforeEach(function() {
      this.App = new Marionette.Application();
    });

    it('should provide command execution framework', function() {
      expect(this.App.commands).to.be.instanceof(Backbone.Wreqr.Commands);
    });

    it('should allow execution of commands directly', function() {
      expect(typeof this.App.execute).to.equal('function');
    });
  });
});
