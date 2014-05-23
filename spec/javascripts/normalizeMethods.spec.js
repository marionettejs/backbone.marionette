describe('normalizeMethods', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when normalizeMethods is called with a hash of functions and strings', function() {
    beforeEach(function() {
      this.View = Backbone.Marionette.ItemView.extend({
        initialize: function(options) {
          this.two = function() {};
          var hash = _.extend({
            eventTwo: this.two
          }, options.hash);
          this.normalizedHash = this.normalizeMethods(hash);
        },
        one: function() {}
      });

      this.hash = {
        'eventOne': 'one',
        'eventThree': 'three'
      };

      this.view = new this.View({
        hash: this.hash
      });
    });

    it('should convert the strings that exist as functions to functions', function() {
      expect(this.view.normalizedHash.eventOne).to.exist;
      expect(this.view.normalizedHash.eventTwo).to.exist;
    });
    it('should ignore strings that dont exist as functions on the context', function() {
      expect(this.view.normalizedHash.eventThree).to.be.undefined;
    });
  });
});
