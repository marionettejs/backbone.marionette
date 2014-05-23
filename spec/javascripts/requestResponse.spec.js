describe('application request/response', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when creating an instance of an Application', function() {
    var App;

    beforeEach(function() {
      App = new Marionette.Application();
    });

    it('should provide request/response framework', function() {
      expect(App.reqres).to.be.instanceof(Backbone.Wreqr.RequestResponse);
    });

    it('should allow direct request', function() {
      expect(typeof App.request).to.equal('function');
    });
  });
});
