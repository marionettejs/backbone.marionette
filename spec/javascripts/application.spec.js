describe('marionette application', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when registering an initializer and starting the application', function() {
    beforeEach(function() {
      var self = this;

      this.someOptions = {};

      this.MyApp = new Backbone.Marionette.Application();

      this.MyModule = (function(MyApp) {
        var module = {};
        module.initializer = function() {};

        self.sinon.spy(module, 'initializer');
        MyApp.addInitializer(module.initializer);

        return module;
      })(this.MyApp);

      this.sinon.spy(this.MyApp, 'trigger');

      this.MyApp.start(this.someOptions);
    });

    it('should notify me before the starts', function() {
      expect(this.MyApp.trigger).to.have.been.calledWith('before:start', this.someOptions);
    });

    it('should notify me after the app has started', function() {
      expect(this.MyApp.trigger).to.have.been.calledWith('start', this.someOptions);
    });

    it('should call the initializer', function() {
      expect(this.MyModule.initializer).to.have.been.called;
    });

    it('should pass the options through to the initializer', function() {
      expect(this.MyModule.initializer).to.have.been.calledWith(this.someOptions);
    });

    it('should run the initializer with the context of the app object', function() {
      expect(this.MyModule.initializer).to.have.been.calledOn(this.MyApp);
    });
  });

  describe('when an app has been started, and registering another initializer', function() {
    beforeEach(function() {
      var self = this;
      this.MyApp = new Backbone.Marionette.Application();
      this.MyApp.start();

      this.MyApp.addInitializer(function() {
        self.initialized = true;
      });
    });

    it('should run the initializer immediately', function() {
      expect(this.initialized).to.be.ok;
    });
  });

  describe('when instantiating an app with options specified', function() {
    beforeEach(function() {
      this.MyApp = new Backbone.Marionette.Application({
        someOption: 'some value'
      });
    });

    it('should merge those options into the app', function() {
      expect(this.MyApp.someOption).to.equal('some value');
    });
  });

  describe('when specifying an on start callback, and starting the app', function() {
    beforeEach(function() {
      var self = this;
      this.MyApp = new Backbone.Marionette.Application();
      this.options = {};

      this.MyApp.on('start', function(opts) {
        self.started = true;
        self.onStartOptions = opts;
      });

      this.MyApp.start(this.options);
    });

    it('should run the onStart callback', function() {
      expect(this.started).to.be.ok;
    });

    it('should pass the startup option to the callback', function() {
      expect(this.onStartOptions).to.equal(this.options);
    });
  });
});
