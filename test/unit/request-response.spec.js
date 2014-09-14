describe('application request/response', function() {
  'use strict';

  beforeEach(function() {
    this.app = new Marionette.Application();
  });

  describe('when creating an instance of an Application', function() {
    it('should provide request/response framework', function() {
      expect(this.app.reqres).to.be.an.instanceof(Backbone.Wreqr.RequestResponse);
    });

    it('should allow direct request', function() {
      expect(this.app.request).to.be.a('function');
    });
  });
});
