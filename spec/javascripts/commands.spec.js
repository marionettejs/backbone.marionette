describe('application commands', function() {
  'use strict';

  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when creating an instance of an Application', function() {
    var App;

    beforeEach(function() {
      App = new Marionette.Application();
    });

    it('should provide command execution framework', function() {
      expect(App.commands).to.be.instanceof(Backbone.Wreqr.Commands);
    });

    it('should allow execution of commands directly', function() {
      expect(typeof App.execute).to.equal('function');
    });

  });

});
