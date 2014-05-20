describe('module stop', function() {
  'use strict';

  beforeEach(global.setup);
  afterEach(global.teardown);

  var App;

  beforeEach(function() {
    App = new Backbone.Marionette.Application();
  });

  describe('when stopping a module that has been started', function() {
    var mod1, mod2, mod3, beforeStop, stop, finalizerSpy;

    beforeEach(function() {
      beforeStop = sinon.stub();
      stop = sinon.stub();
			finalizerSpy = sinon.spy();

      mod1 = App.module('Mod1', function(Mod1) {
        Mod1.addFinalizer(finalizerSpy);
      });

      mod1.on('before:stop', beforeStop);
      mod1.on('stop', stop);

      mod2 = App.module('Mod1.Mod2');
      mod3 = App.module('Mod1.Mod3');

      sinon.spy(mod2, 'stop');
      sinon.spy(mod3, 'stop');

      mod1.start();
      mod1.stop();
    });

    afterEach(function() {
      mod2.stop.restore();
      mod3.stop.restore();
    });

    it('should trigger a "before:stop" event', function() {
      expect(beforeStop).to.have.been.called;
    });

    it('should trigger a "stop" event', function() {
      expect(stop).to.have.been.called;
    });

    it('should run all finalizers for the module', function() {
      expect(finalizerSpy).to.have.been.called;
    });

    it('should run all finalizers for the module in the context of the module', function() {
			expect(finalizerSpy).to.have.been.calledOn(mod1);
    });

    it('should stop all sub-modules', function() {
      expect(mod2.stop).to.have.been.called;
      expect(mod3.stop).to.have.been.called;
    });

    it('should not remove the module from its parent module or application', function() {
      expect(App.module('Mod1')).to.equal(mod1);
    });

  });

  describe('when stopping a module that has not been started', function() {
    var mod1, mod2, mod3, finalizerSpy;

    beforeEach(function() {
      finalizerSpy = sinon.spy();
      mod1 = App.module('Mod1', function(Mod1) {
        Mod1.addFinalizer(finalizerSpy);
      });

      mod2 = App.module('Mod1.Mod2');
      mod3 = App.module('Mod1.Mod3');

      sinon.spy(mod2, 'stop');
      sinon.spy(mod3, 'stop');

      // this module has not been started
      mod1.stop();
    });

    afterEach(function() {
      mod2.stop.restore();
      mod3.stop.restore();
    });

    it('should not run any finalizers', function() {
      expect(finalizerSpy).not.to.have.been.called;
    });

    it('should not stop sub-modules', function() {
      expect(mod2.stop).not.to.have.been.called;
      expect(mod3.stop).not.to.have.been.called;
    });
  });

  describe('when adding a module finalizer outside of the module definition function and stopping the module', function() {
    var finalizer;

    beforeEach(function() {
      var MyApp = new Marionette.Application();
      var module = MyApp.module('MyModule');

      finalizer = sinon.stub();
      module.addFinalizer(finalizer);

      MyApp.start();
      module.stop();
    });

    it('should run the finalizer', function() {
      expect(finalizer).to.have.been.called;
    });

  });

});
