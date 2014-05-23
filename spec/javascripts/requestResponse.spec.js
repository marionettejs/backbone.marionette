describe('application request/response', function() {
  'use strict';
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when creating an instance of an Application', function() {
    beforeEach(function() {
      this.App = new Marionette.Application();
    });

    it('should provide request/response framework', function() {
      expect(this.App.reqres).to.be.instanceof(Backbone.Wreqr.RequestResponse);
    });

    it('should allow direct request', function() {
      expect(typeof this.App.request).to.equal('function');
    });
  });
});
