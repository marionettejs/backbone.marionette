describe('normalizeMethods', function() {

  describe('when normalizeMethods is called with a hash of functions and strings', function() {

    var hash, view;

    var View = Backbone.Marionette.ItemView.extend({
      initialize: function(options) {
        this.two = function() {};
        var hash = _.extend({
          eventTwo: this.two
        }, options.hash);
        this.normalizedHash = this.normalizeMethods(hash);
      },
      one: function() {}
    });

    beforeEach(function() {

      hash = {
        'eventOne': 'one',
        'eventThree': 'three'
      };

      view = new View({
        hash: hash
      });

    });

    it('should convert the strings that exist as functions to functions', function() {
      expect(view.normalizedHash.eventOne).toBeDefined();
      expect(view.normalizedHash.eventTwo).toBeDefined();
    });
    it('should ignore strings that dont exist as functions on the context', function() {
      expect(view.normalizedHash.eventThree).not.toBeDefined();
    });
  });

});
