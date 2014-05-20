describe('application modules', function() {
  'use strict';

  beforeEach(global.setup);
  afterEach(global.teardown);

  var app;

  beforeEach(function() {
    app = new Backbone.Marionette.Application();
  });

  describe('.module', function() {
    describe('when creating a module', function() {

      var module, initializeSpy, additionalParam, defineSpy;

      beforeEach(function() {
        app = new Backbone.Marionette.Application();
        initializeSpy = sinon.stub();
        defineSpy = sinon.stub();
      });

      describe('and no params are passed in', function() {
        beforeEach(function() {
          module = app.module('Mod');
        });

        it('should add module to the app', function() {
          expect(module).to.equal(app.Mod);
        });
      });

      describe('and the define function is provided', function() {
        beforeEach(function() {
          additionalParam = {};
          module = app.module('Mod', defineSpy, additionalParam);
        });

        it('it should add module to the app', function() {
          expect(module).to.equal(app.Mod);
        });

        it('the define function should be called once', function() {
          expect(defineSpy.callCount).to.equal(1);
        });

        it('the define function should be called on the module', function() {
          expect(defineSpy.lastCall.thisValue).to.equal(module);
        });

        it('the define function should be called with arguments', function() {
          expect(defineSpy).to.have.been.calledWith(
            module,
            app,
            Backbone,
            Marionette,
            Backbone.$,
            _,
            additionalParam
          );
        });
      });

      describe('and the options object is used', function() {
        describe('', function() {
          var options;

          beforeEach(function() {
            var ModuleClass = Backbone.Marionette.Module.extend({
              initialize: initializeSpy,
              propA: 'becomes instance property'
            });

            options = {
              moduleClass: ModuleClass,
              define: defineSpy,
              propB: 'becomes options property'
            };
            module = app.module('Mod', options, additionalParam);
          });

          it('should add module to the app', function() {
            expect(module).to.equal(app.Mod);
          });

          it('initialize function is called', function() {
            expect(initializeSpy).to.have.been.called;
          });

          it('the define function is called', function() {
            expect(defineSpy).to.have.been.called;
          });

          it('the define function should be called on the module', function() {
            expect(defineSpy.lastCall.thisValue).to.equal(module);
          });

          it('the define function is called with arguments', function() {
            expect(defineSpy).to.have.been.calledWith(
              module,
              app,
              Backbone,
              Marionette,
              Backbone.$,
              _,
              additionalParam
            );
          });

          it('initialize function is called with arguments', function() {
            expect(initializeSpy).to.have.been.calledWith('Mod', app, options);
          });

          it('prototype properties are defined', function() {
            expect(module.propA).to.exist;
          });

          it('options properties are defined', function() {
            expect(module.options.propB).to.exist;
          });
        });

        describe('and initialize is overridden', function() {
          var initializeOptionSpy;

          beforeEach(function() {
            initializeOptionSpy = sinon.stub();

            var ModuleClass = Backbone.Marionette.Module.extend({
              initialize: initializeSpy,
              propA: 'becomes instance property'
            });

            module = app.module('Mod', {
              moduleClass: ModuleClass,
              initialize: initializeOptionSpy,
              propB: 'becomes options property'
            });
          });

          it('initialize function is called', function() {
            expect(initializeOptionSpy).to.have.been.called;
          });

        });
      });

      describe('and using a module class', function() {
        var ModuleClass;

        describe('', function() {
          beforeEach(function() {
            ModuleClass = Backbone.Marionette.Module.extend({
              initialize: initializeSpy,
              propA: 'becomes instance property'
            });

            module = app.module('Mod', ModuleClass);
          });

          it('should add module to the app', function() {
            expect(module).to.equal(app.Mod);
          });

          it('the initialize function is called', function() {
            expect(initializeSpy).to.have.been.called;
          });

          it('the initialize function is called with arguments', function() {
            // this is a weird side effect of ModuleClass being treated as the define function
            // e.g. app.module('Mod', ModuleClass)
            var defOptions = _.extend({}, ModuleClass);
            expect(initializeSpy).to.have.been.calledWith('Mod', app, defOptions);
          });

          it('prototype properties', function() {
            expect(module.propA).to.exist;
          });

          it('startwithParent should be true', function() {
            expect(module.startWithParent).to.be.true;
          });
        });

        describe('and startWithParent is false', function() {
          beforeEach(function() {
            ModuleClass = Backbone.Marionette.Module.extend({
              initialize: initializeSpy,
              propA: 'becomes instance property',
              startWithParent: false
            });

            module = app.module('Mod', ModuleClass);
          });

          it('startwithParent should be false', function() {
            expect(module.startWithParent).to.be.false;
          });
        });
      });
    });

    describe('when re-calling module', function() {
      var module;

      beforeEach(function() {
        app = new Backbone.Marionette.Application();
      });

      describe('and no options are passed', function() {
        var module1, module2;

        beforeEach(function() {
          module1 = app.module('Mod');
          module2 = app.module('Mod');
        });

        it('returns the same module', function() {
          expect(module1).to.equal(module2);
          expect(module1).to.equal(app.Mod);
        });
      });

      describe('and define functions are provided', function() {
        beforeEach(function() {
          module = app.module('Mod', function(module) {
            module.prop1 = 'first property';
          });

          module = app.module('Mod', function(module) {
            module.prop2 = 'second property';
          });
        });

        it('it sets both properties', function() {
          expect(module.prop1).to.exist;
          expect(module.prop2).to.exist;
        });
      });

      describe('and options object is provided', function() {

        var module, aSpy, bSpy;

        beforeEach(function() {
          aSpy = sinon.spy();
          bSpy = sinon.spy();

          module = app.module('Mod', {
            propA: 'module property a',
            define: aSpy,
            startWithParent: false
          });

          module = app.module('Mod', {
            propB: 'module property b',
            define: bSpy
          });
        });

        it('it sets first the property', function() {
          expect(module.options.propA).to.exist;
        });

        it('it does not set the second property', function() {
          expect(module.options.propB).to.be.undefined;
        });

        it('it calls both define functions', function() {
          expect(aSpy).to.have.been.called;
          expect(bSpy).to.have.been.called;
        });

        it('startWithParent value will not be lost', function() {
          expect(module.startWithParent).to.be.false;
        });

      });
    });

    describe('when creating a sub-module', function() {
      var parent, child;

      describe('and the parent is already created', function() {
        var parentDefineSpy, childDefineSpy;

        beforeEach(function() {
          parentDefineSpy = sinon.stub();
          childDefineSpy = sinon.stub();

          parent = app.module('parent', parentDefineSpy);
          child = app.module('parent.child', childDefineSpy);
        });

        it('parent should remain the same', function() {
          expect(parent).to.equal(app.parent);
        });

        it('parent definition should be called once', function() {
          expect(parentDefineSpy.callCount).to.equal(1);
        });

        it('child should be created', function() {
          expect(child).to.equal(app.parent.child);
        });

        it('child definition should be called once', function() {
          expect(childDefineSpy.callCount).to.equal(1);
        });
      });

      describe('and the parent is not already created', function() {
        var defineSpy;
        beforeEach(function() {
          defineSpy = sinon.stub();
          child = app.module('parent.child', defineSpy);
        });

        it('parent should be defined', function() {
          expect(app.parent).to.exist;
        });

        it('child should be created', function() {
          expect(child).to.equal(app.parent.child);
        });

        it('definition should be called once', function() {
          expect(defineSpy.callCount).to.equal(1);
        });
      });
    });
  });

  describe('.start', function() {
    describe('when starting a module', function() {
      var module, startSpy, beforeStartSpy, initializeSpy1, initializeSpy2;
      beforeEach(function() {
        startSpy = sinon.stub();
        beforeStartSpy = sinon.stub();
        initializeSpy1 = sinon.stub();
        initializeSpy2 = sinon.stub();

        module = app.module('Mod');
        module.on('before:start', beforeStartSpy);
        module.on('start', startSpy);
        module.addInitializer(initializeSpy1);
        module.addInitializer(initializeSpy2);

        module.start();
      });

      it('triggers module before start event', function() {
        expect(beforeStartSpy).to.have.been.called;
      });

      it('triggers module start event', function() {
        expect(startSpy).to.have.been.called;
      });

      it('the module initializers are called', function() {
        expect(initializeSpy1).to.have.been.called;
        expect(initializeSpy2).to.have.been.called;
      });

      it('the module is initialized', function() {
        expect(module._isInitialized).to.be.true;
      });
    });

    describe('when calling module start twice', function() {
      var startSpy;

      beforeEach(function() {
        var module = app.module('Mod');
        startSpy = sinon.spy();
        module.on('before:start', startSpy);
        module.start();
        module.start();
      });

      it('its only started once', function() {
        expect(startSpy.callCount).to.equal(1);
      });
    });

    describe('when starting a module with sub-modules', function() {
      var parent, child, parentStartSpy, childStartSpy;

      describe('when starting parent', function() {
        describe('', function() {
          beforeEach(function() {
            parent = app.module('Parent');
            child = app.module('Parent.Child');

            childStartSpy = sinon.spy(child, 'start');
            parentStartSpy = sinon.spy(parent, 'start');
            parent.start();
          });

          afterEach(function() {
            child.start.restore();
            parent.start.restore();
          });

          it('parent is started', function() {
            expect(parentStartSpy).to.have.been.called;
          });

          it('child is started', function() {
            expect(childStartSpy).to.have.been.called;
          });
        });

        describe('and child is set to not start with parent', function() {
          beforeEach(function() {
            parent = app.module('Parent', {startWithParent: false});
            child = app.module('Parent.Child', {startWithParent: false});

            childStartSpy = sinon.spy(child, 'start');
            parent.start();
          });

          afterEach(function() {
            child.start.restore();
          });

          it('the parent is started', function() {
            expect(parentStartSpy).to.have.been.called;
          });

          it('the child is not started', function() {
            expect(childStartSpy).not.to.have.been.called;
          });
        });
      });
    });

    describe('when starting app', function() {
      var startSpy;

      describe('', function() {
        beforeEach(function() {
          var module = app.module('Mod');
          startSpy = sinon.spy(module, 'start');
          app.start();
        });

        it('its module starts', function() {
          expect(startSpy).to.have.been.called;
        });
      });

      describe('and its module is set to not start with parent', function() {
        beforeEach(function() {
          var module = app.module('Mod', {startWithParent: false});
          startSpy = sinon.spy(module, 'start');
          app.start();
        });

        it('it does not start', function() {
          expect(startSpy).not.to.have.been.called;
        });
      });
    });

    describe('after app is started', function() {

      var module, initializeSpy;

      beforeEach(function() {
        app.start();
        initializeSpy = sinon.stub();

        module = app.module('Mod');
        module.addInitializer(initializeSpy);
        module.start();
      });

      it('creates the module', function() {
        expect(module).to.equal(app.Mod);
      });

      it('calls the modules initializers', function() {
        expect(initializeSpy).to.have.been.called;
      });
    });
  });

  describe('.stop', function() {

    describe('when stopping a module', function() {
      var module, beforeStopSpy, stopSpy, finalizerSpy;

      beforeEach(function() {
        beforeStopSpy = sinon.spy();
        stopSpy = sinon.spy();
        finalizerSpy = sinon.spy();

        module = app.module('Mod');
        module.addFinalizer(finalizerSpy);
        module.on('before:stop', beforeStopSpy);
        module.on('stop', stopSpy);

        module.start();
        module.stop();
      });

      it('finalizer is called', function() {
        expect(finalizerSpy).to.have.been.called;
      });

      it('before:stop event is triggered', function() {
        expect(beforeStopSpy).to.have.been.called;
      });

      it('stop event is triggered', function() {
        expect(stopSpy).to.have.been.called;
      });
    });

    describe('when stopping a module with sub-modules', function() {
      var module, child, beforeStopSpy, stopSpy, finalizerSpy;

      beforeEach(function() {
        beforeStopSpy = sinon.spy();
        stopSpy = sinon.spy();
        finalizerSpy = sinon.spy();

        module = app.module('Mod');
        child = app.module('Mod.Child');
        child.addFinalizer(finalizerSpy);
        child.on('before:stop', beforeStopSpy);
        child.on('stop', stopSpy);
        sinon.spy(child, 'stop');

        module.start();
        module.stop();
      });

      it('its submodule stop function is invoked', function() {
        expect(child.stop).to.have.been.called;
      });

      it('its submodule finalizer is called', function() {
        expect(finalizerSpy).to.have.been.called;
      });

      it('its submodule before:stop event is triggered', function() {
        expect(beforeStopSpy).to.have.been.called;
      });

      it('its submoule stop event is triggered', function() {
        expect(stopSpy).to.have.been.called;
      });
    });

    describe('when stopping a module before its started', function() {

      var parent, child, parentFinalizerSpy, childFinalizerSpy, parentStopSpy, childStopSpy;

      beforeEach(function() {
        parentFinalizerSpy = sinon.spy();
        childFinalizerSpy = sinon.spy();
        parentStopSpy = sinon.spy();
        childStopSpy = sinon.spy();

        parent = app.module('Parent');
        child = app.module('Child');

        parent.on('stop', parentStopSpy);
        child.on('stop', childStopSpy);

        parent.addFinalizer(parentFinalizerSpy);
        child.addFinalizer(childFinalizerSpy);

        parent.stop();
      });

      it('the parent does not trigger a stop event', function() {
        expect(parentFinalizerSpy).not.to.have.been.called;
      });

      it('the child does not trigger a stop event', function() {
        expect(childFinalizerSpy).not.to.have.been.called;
      });

      it('the parent does not call its finalizer', function() {
        expect(parentStopSpy).not.to.have.been.called;
      });

      it('the child does not call its finalizer', function() {
        expect(childStopSpy).not.to.have.been.called;
      });
    });
  });
});
