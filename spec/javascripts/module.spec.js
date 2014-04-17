describe('application modules', function() {
  'use strict';
  var app;

  beforeEach(function() {
    app = new Backbone.Marionette.Application();
  });

  describe('.module', function() {
    describe('when creating a module', function() {

      var module, initializeSpy, additionalParam, defineSpy;

      beforeEach(function() {
        app = new Backbone.Marionette.Application();
        initializeSpy = jasmine.createSpy();
        defineSpy = jasmine.createSpy();
      });

      describe('and no params are passed in', function() {
        beforeEach(function() {
          module = app.module('Mod');
        });

        it('should add module to the app', function() {
          expect(module).toBe(app.Mod);
        });
      });

      describe('and the define function is provided', function() {
        beforeEach(function() {
          additionalParam = {};
          module = app.module('Mod', defineSpy, additionalParam);
        });

        it('it should add module to the app', function() {
          expect(module).toBe(app.Mod);
        });

        it('the define function should be called once', function() {
          expect(defineSpy.callCount).toBe(1);
        });

        it('the define function should be called on the module', function() {
          expect(defineSpy.mostRecentCall.object).toBe(module);
        });

        it('the define function should be called with arguments', function() {
          expect(defineSpy).toHaveBeenCalledWith(
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
            expect(module).toBe(app.Mod);
          });

          it('initialize function is called', function() {
            expect(initializeSpy).toHaveBeenCalled();
          });

          it('the define function is called', function() {
            expect(defineSpy).toHaveBeenCalled();
          });

          it('the define function should be called on the module', function() {
            expect(defineSpy.mostRecentCall.object).toBe(module);
          });

          it('the define function is called with arguments', function() {
            expect(defineSpy).toHaveBeenCalledWith(
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
            expect(initializeSpy).toHaveBeenCalledWith('Mod', app, options);
          });

          it('prototype properties are defined', function() {
            expect(module.propA).not.toBeUndefined();
          });

          it('options properties are defined', function() {
            expect(module.options.propB).not.toBeUndefined();
          });
        });

        describe('and initialize is overridden', function() {
          var initializeOptionSpy;

          beforeEach(function() {
            initializeOptionSpy = jasmine.createSpy();

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
            expect(initializeOptionSpy).toHaveBeenCalled();
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
            expect(module).toBe(app.Mod);
          });

          it('the initialize function is called', function() {
            expect(initializeSpy).toHaveBeenCalled();
          });

          it('the initialize function is called with arguments', function() {
            // this is a weird side effect of ModuleClass being treated as the define function
            // e.g. app.module('Mod', ModuleClass)
            var defOptions = _.extend({}, ModuleClass);
            expect(initializeSpy).toHaveBeenCalledWith('Mod', app, defOptions);
          });

          it('prototype properties', function() {
            expect(module.propA).not.toBeUndefined();
          });

          it('startwithParent should be true', function() {
            expect(module.startWithParent).toBe(true);
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
            expect(module.startWithParent).toBe(false);
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
          expect(module1).toBe(module2);
          expect(module1).toBe(app.Mod);
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
          expect(module.prop1).not.toBeUndefined();
          expect(module.prop2).not.toBeUndefined();
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
          expect(module.options.propA).toBeDefined();
        });

        it('it does not set the second property', function() {
          expect(module.options.propB).toBeUndefined();
        });

        it('it calls both define functions', function() {
          expect(aSpy).toHaveBeenCalled();
          expect(bSpy).toHaveBeenCalled();
        });

        it('startWithParent value will not be lost', function() {
          expect(module.startWithParent).toBe(false);
        });

      });
    });

    describe('when creating a sub-module', function() {
      var parent, child;

      describe('and the parent is already created', function() {
        var parentDefineSpy, childDefineSpy;

        beforeEach(function() {
          parentDefineSpy = jasmine.createSpy();
          childDefineSpy = jasmine.createSpy();

          parent = app.module('parent', parentDefineSpy);
          child = app.module('parent.child', childDefineSpy);
        });

        it('parent should remain the same', function() {
          expect(parent).toBe(app.parent);
        });

        it('parent definition should be called once', function() {
          expect(parentDefineSpy.callCount).toBe(1);
        });

        it('child should be created', function() {
          expect(child).toBe(app.parent.child);
        });

        it('child definition should be called once', function() {
          expect(childDefineSpy.callCount).toBe(1);
        });
      });

      describe('and the parent is not already created', function() {
        var defineSpy;
        beforeEach(function() {
          defineSpy = jasmine.createSpy();
          child = app.module('parent.child', defineSpy);
        });

        it('parent should be defined', function() {
          expect(app.parent).not.toBeUndefined();
        });

        it('child should be created', function() {
          expect(child).toBe(app.parent.child);
        });

        it('definition should be called once', function() {
          expect(defineSpy.callCount).toBe(1);
        });
      });
    });
  });

  describe('.start', function() {
    describe('when starting a module', function() {
      var module, startSpy, beforeStartSpy, initializeSpy1, initializeSpy2;
      beforeEach(function() {
        startSpy = jasmine.createSpy();
        beforeStartSpy = jasmine.createSpy();
        initializeSpy1 = jasmine.createSpy();
        initializeSpy2 = jasmine.createSpy();

        module = app.module('Mod');
        module.on('before:start', beforeStartSpy);
        module.on('start', startSpy);
        module.addInitializer(initializeSpy1);
        module.addInitializer(initializeSpy2);

        module.start();
      });

      it('triggers module before start event', function() {
        expect(beforeStartSpy).toHaveBeenCalled();
      });

      it('triggers module start event', function() {
        expect(startSpy).toHaveBeenCalled();
      });

      it('the module initializers are called', function() {
        expect(initializeSpy1).toHaveBeenCalled();
        expect(initializeSpy2).toHaveBeenCalled();
      });

      it('the module is initialized', function() {
        expect(module._isInitialized).toBe(true);
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
        expect(startSpy.callCount).toBe(1);
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

          it('parent is started', function() {
            expect(parentStartSpy).toHaveBeenCalled();
          });

          it('child is started', function() {
            expect(childStartSpy).toHaveBeenCalled();
          });
        });

        describe('and child is set to not start with parent', function() {
          beforeEach(function() {
            parent = app.module('Parent', {startWithParent: false});
            child = app.module('Parent.Child', {startWithParent: false});

            childStartSpy = sinon.spy(child, 'start');
            parent.start();
          });

          it('the parent is started', function() {
            expect(parentStartSpy).toHaveBeenCalled();
          });

          it('the child is not started', function() {
            expect(childStartSpy).not.toHaveBeenCalled();
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
          expect(startSpy).toHaveBeenCalled();
        });
      });

      describe('and its module is set to not start with parent', function() {
        beforeEach(function() {
          var module = app.module('Mod', {startWithParent: false});
          startSpy = sinon.spy(module, 'start');
          app.start();
        });

        it('it does not start', function() {
          expect(startSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('after app is started', function() {

      var module, initializeSpy;

      beforeEach(function() {
        app.start();
        initializeSpy = jasmine.createSpy();

        module = app.module('Mod');
        module.addInitializer(initializeSpy);
        module.start();
      });

      it('creates the module', function() {
        expect(module).toBe(app.Mod);
      });

      it('calls the modules initializers', function() {
        expect(initializeSpy).toHaveBeenCalled();
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
        expect(finalizerSpy).toHaveBeenCalled();
      });

      it('before:stop event is triggered', function() {
        expect(beforeStopSpy).toHaveBeenCalled();
      });

      it('stop event is triggered', function() {
        expect(stopSpy).toHaveBeenCalled();
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
        spyOn(child, 'stop').andCallThrough();

        module.start();
        module.stop();
      });

      it('its submodule stop function is invoked', function() {
        expect(child.stop).toHaveBeenCalled();
      });

      it('its submodule finalizer is called', function() {
        expect(finalizerSpy).toHaveBeenCalled();
      });

      it('its submodule before:stop event is triggered', function() {
        expect(beforeStopSpy).toHaveBeenCalled();
      });

      it('its submoule stop event is triggered', function() {
        expect(stopSpy).toHaveBeenCalled();
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
        expect(parentFinalizerSpy).not.toHaveBeenCalled();
      });

      it('the child does not trigger a stop event', function() {
        expect(childFinalizerSpy).not.toHaveBeenCalled();
      });

      it('the parent does not call its finalizer', function() {
        expect(parentStopSpy).not.toHaveBeenCalled();
      });

      it('the child does not call its finalizer', function() {
        expect(childStopSpy).not.toHaveBeenCalled();
      });
    });
  });
});
