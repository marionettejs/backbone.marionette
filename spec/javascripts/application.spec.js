describe('marionette application', function() {
  'use strict';

  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when registering an initializer and starting the application', function() {
    var MyModule, MyApp;
    var someOptions = {};

    beforeEach(function() {
      var self = this;
      MyApp = new Backbone.Marionette.Application();

      MyModule = (function(MyApp) {
        var module = {};
        module.initializer = function() {};

        self.sinon.spy(module, 'initializer');
        MyApp.addInitializer(module.initializer);

        return module;
      })(MyApp);

      this.sinon.spy(MyApp, 'trigger');

      MyApp.start(someOptions);
    });

    it('should notify me before the starts', function() {
      expect(MyApp.trigger).to.have.been.calledWith('before:start', someOptions);
    });

    it('should notify me after the app has started', function() {
      expect(MyApp.trigger).to.have.been.calledWith('start', someOptions);
    });

    it('should call the initializer', function() {
      expect(MyModule.initializer).to.have.been.called;
    });

    it('should pass the options through to the initializer', function() {
      expect(MyModule.initializer).to.have.been.calledWith(someOptions);
    });

    it('should run the initializer with the context of the app object', function() {
      expect(MyModule.initializer).to.have.been.calledOn(MyApp);
    });
  });

  describe('when an app has been started, and registering another initializer', function() {
    var MyApp, initialized;

    beforeEach(function() {
      MyApp = new Backbone.Marionette.Application();
      MyApp.start();

      MyApp.addInitializer(function() {
        initialized = true;
      });
    });

    it('should run the initializer immediately', function() {
      expect(initialized).to.be.ok;
    });
  });

  describe('when instantiating an app with options specified', function() {
    var MyApp;

    beforeEach(function() {
      MyApp = new Backbone.Marionette.Application({
        someOption: 'some value'
      });
    });

    it('should merge those options into the app', function() {
      expect(MyApp.someOption).to.equal('some value');
    });
  });

  describe('when specifying an on start callback, and starting the app', function() {
    var started, options, onStartOptions;

    beforeEach(function() {
      var MyApp = new Backbone.Marionette.Application();
      options = {};

      MyApp.on('start', function(opts) {
        started = true;
        onStartOptions = opts;
      });

      MyApp.start(options);
    });

    it('should run the onStart callback', function() {
      expect(started).to.be.ok;
    });

    it('should pass the startup option to the callback', function() {
      expect(onStartOptions).to.equal(options);
    });
  });

});
