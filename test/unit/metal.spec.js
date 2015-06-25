describe('metal', function() {
  describe('classifying backbone primitives', function() {
    it('view instances are instances of classes', function() {
      expect(new Marionette.View()).to.be.instanceof(Backbone.View);
      expect(new Marionette.View()).to.be.instanceof(Marionette.View);
      expect(new Marionette.View()).to.be.instanceof(Backbone.Metal.Class);
    });

    it('model instances are instances of classes', function() {
      expect(new Marionette.Model()).to.be.instanceof(Backbone.Model);
      expect(new Marionette.Model()).to.be.instanceof(Marionette.Model);
      expect(new Marionette.View()).to.be.instanceof(Backbone.Metal.Class);
    });

    it('collection instances are instances of classes', function() {
      expect(new Marionette.Collection()).to.be.instanceof(Backbone.Collection);
      expect(new Marionette.Collection()).to.be.instanceof(Marionette.Collection);
      expect(new Marionette.View()).to.be.instanceof(Backbone.Metal.Class);
    });

    it('router instances are instances of classes', function() {
      expect(new Marionette.Router()).to.be.instanceof(Backbone.Router);
      expect(new Marionette.Router()).to.be.instanceof(Marionette.Router);
      expect(new Marionette.View()).to.be.instanceof(Backbone.Metal.Class);
    });
  });

  describe('The Metal implementation', function() {
    _.each(['Model', 'Collection', 'Router', 'History'], function(klass) {
      var Klass = Marionette[klass];
      describe('should be used for ' + klass, function() {
        _.each(Metal.Class.prototype, function(method, name) {
          it('for method ' + name, function() {
            expect(Klass.prototype[name]).to.be.equal(method);
          });
        });
      });
    });

  });
});
