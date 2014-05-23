describe('module stop', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  beforeEach(function() {
    this.App = new Backbone.Marionette.Application();
  });

  describe('when stopping a module that has been started', function() {
    beforeEach(function() {
      var suite = this;

      this.beforeStop = this.sinon.stub();
      this.stop = this.sinon.stub();
			this.finalizerSpy = this.sinon.spy();

      this.mod1 = this.App.module('Mod1', function(Mod1) {
        Mod1.addFinalizer(suite.finalizerSpy);
      });

      this.mod1.on('before:stop', this.beforeStop);
      this.mod1.on('stop', this.stop);

      this.mod2 = this.App.module('Mod1.Mod2');
      this.mod3 = this.App.module('Mod1.Mod3');

      this.sinon.spy(this.mod2, 'stop');
      this.sinon.spy(this.mod3, 'stop');

      this.mod1.start();
      this.mod1.stop();
    });

    it('should trigger a "before:stop" event', function() {
      expect(this.beforeStop).to.have.been.called;
    });

    it('should trigger a "stop" event', function() {
      expect(this.stop).to.have.been.called;
    });

    it('should run all finalizers for the module', function() {
      expect(this.finalizerSpy).to.have.been.called;
    });

    it('should run all finalizers for the module in the context of the module', function() {
			expect(this.finalizerSpy).to.have.been.calledOn(this.mod1);
    });

    it('should stop all sub-modules', function() {
      expect(this.mod2.stop).to.have.been.called;
      expect(this.mod3.stop).to.have.been.called;
    });

    it('should not remove the module from its parent module or application', function() {
      expect(this.App.module('Mod1')).to.equal(this.mod1);
    });
  });

  describe('when stopping a module that has not been started', function() {
    beforeEach(function() {
      var suite = this;
      this.finalizerSpy = this.sinon.spy();
      this.mod1 = this.App.module('Mod1', function(Mod1) {
        Mod1.addFinalizer(suite.finalizerSpy);
      });

      this.mod2 = this.App.module('Mod1.Mod2');
      this.mod3 = this.App.module('Mod1.Mod3');

      this.sinon.spy(this.mod2, 'stop');
      this.sinon.spy(this.mod3, 'stop');

      // this module has not been started
      this.mod1.stop();
    });

    it('should not run any finalizers', function() {
      expect(this.finalizerSpy).not.to.have.been.called;
    });

    it('should not stop sub-modules', function() {
      expect(this.mod2.stop).not.to.have.been.called;
      expect(this.mod3.stop).not.to.have.been.called;
    });
  });

  describe('when adding a module finalizer outside of the module definition function and stopping the module', function() {
    beforeEach(function() {
      this.MyApp = new Marionette.Application();
      this.module = this.MyApp.module('MyModule');

      this.finalizer = this.sinon.stub();
      this.module.addFinalizer(this.finalizer);

      this.MyApp.start();
      this.module.stop();
    });

    it('should run the finalizer', function() {
      expect(this.finalizer).to.have.been.called;
    });
  });
});
