describe('application modules', function() {
  'use strict';
  beforeEach(global.setup);
  afterEach(global.teardown);

  beforeEach(function() {
    this.app = new Backbone.Marionette.Application();
  });

  describe('.module', function() {
    describe('when creating a module', function() {
      beforeEach(function() {
        this.app = new Backbone.Marionette.Application();
        this.initializeSpy = this.sinon.stub();
        this.defineSpy = this.sinon.stub();
      });

      describe('and no params are passed in', function() {
        beforeEach(function() {
          this.module = this.app.module('Mod');
        });

        it('should add module to the app', function() {
          expect(this.module).to.equal(this.app.Mod);
        });
      });

      describe('and the define function is provided', function() {
        beforeEach(function() {
          this.additionalParam = {};
          this.module = this.app.module('Mod', this.defineSpy, this.additionalParam);
        });

        it('it should add module to the app', function() {
          expect(this.module).to.equal(this.app.Mod);
        });

        it('the define function should be called once', function() {
          expect(this.defineSpy.callCount).to.equal(1);
        });

        it('the define function should be called on the module', function() {
          expect(this.defineSpy.lastCall.thisValue).to.equal(this.module);
        });

        it('the define function should be called with arguments', function() {
          expect(this.defineSpy).to.have.been.calledWith(
            this.module,
            this.app,
            Backbone,
            Marionette,
            Backbone.$,
            _,
            this.additionalParam
          );
        });
      });

      describe('and the options object is used', function() {
        describe('', function() {
          beforeEach(function() {
            this.ModuleClass = Backbone.Marionette.Module.extend({
              initialize: this.initializeSpy,
              propA: 'becomes instance property'
            });

            this.options = {
              moduleClass: this.ModuleClass,
              define: this.defineSpy,
              propB: 'becomes options property'
            };
            this.module = this.app.module('Mod', this.options, this.additionalParam);
          });

          it('should add module to the app', function() {
            expect(this.module).to.equal(this.app.Mod);
          });

          it('initialize function is called', function() {
            expect(this.initializeSpy).to.have.been.called;
          });

          it('the define function is called', function() {
            expect(this.defineSpy).to.have.been.called;
          });

          it('the define function should be called on the module', function() {
            expect(this.defineSpy.lastCall.thisValue).to.equal(this.module);
          });

          it('the define function is called with arguments', function() {
            expect(this.defineSpy).to.have.been.calledWith(
              this.module,
              this.app,
              Backbone,
              Marionette,
              Backbone.$,
              _,
              this.additionalParam
            );
          });

          it('initialize function is called with arguments', function() {
            expect(this.initializeSpy).to.have.been.calledWith('Mod', this.app, this.options);
          });

          it('prototype properties are defined', function() {
            expect(this.module.propA).to.exist;
          });

          it('options properties are defined', function() {
            expect(this.module.options.propB).to.exist;
          });
        });

        describe('and initialize is overridden', function() {
          beforeEach(function() {
            this.initializeOptionSpy = this.sinon.stub();

            this.ModuleClass = Backbone.Marionette.Module.extend({
              initialize: this.initializeSpy,
              propA: 'becomes instance property'
            });

            this.module = this.app.module('Mod', {
              moduleClass: this.ModuleClass,
              initialize: this.initializeOptionSpy,
              propB: 'becomes options property'
            });
          });

          it('initialize function is called', function() {
            expect(this.initializeOptionSpy).to.have.been.called;
          });
        });
      });

      describe('and using a module class', function() {
        describe('', function() {
          beforeEach(function() {
            this.ModuleClass = Backbone.Marionette.Module.extend({
              initialize: this.initializeSpy,
              propA: 'becomes instance property'
            });

            this.module = this.app.module('Mod', this.ModuleClass);
          });

          it('should add module to the app', function() {
            expect(this.module).to.equal(this.app.Mod);
          });

          it('the initialize function is called', function() {
            expect(this.initializeSpy).to.have.been.called;
          });

          it('the initialize function is called with arguments', function() {
            // this is a weird side effect of ModuleClass being treated as the define function
            // e.g. this.app.module('Mod', ModuleClass)
            var defOptions = _.extend({}, this.ModuleClass);
            expect(this.initializeSpy).to.have.been.calledWith('Mod', this.app, defOptions);
          });

          it('prototype properties', function() {
            expect(this.module.propA).to.exist;
          });

          it('startwithParent should be true', function() {
            expect(this.module.startWithParent).to.be.true;
          });
        });

        describe('and startWithParent is false', function() {
          beforeEach(function() {
            this.ModuleClass = Backbone.Marionette.Module.extend({
              initialize: this.initializeSpy,
              propA: 'becomes instance property',
              startWithParent: false
            });

            this.module = this.app.module('Mod', this.ModuleClass);
          });

          it('startwithParent should be false', function() {
            expect(this.module.startWithParent).to.be.false;
          });
        });
      });
    });

    describe('when re-calling module', function() {
      beforeEach(function() {
        this.app = new Backbone.Marionette.Application();
      });

      describe('and no options are passed', function() {
        beforeEach(function() {
          this.module1 = this.app.module('Mod');
          this.module2 = this.app.module('Mod');
        });

        it('returns the same module', function() {
          expect(this.module1).to.equal(this.module2);
          expect(this.module1).to.equal(this.app.Mod);
        });
      });

      describe('and define functions are provided', function() {
        beforeEach(function() {
          this.module = this.app.module('Mod', function(module) {
            module.prop1 = 'first property';
          });

          this.module = this.app.module('Mod', function(module) {
            module.prop2 = 'second property';
          });
        });

        it('it sets both properties', function() {
          expect(this.module.prop1).to.exist;
          expect(this.module.prop2).to.exist;
        });
      });

      describe('and options object is provided', function() {
        beforeEach(function() {
          this.aSpy = this.sinon.spy();
          this.bSpy = this.sinon.spy();

          this.module = this.app.module('Mod', {
            propA: 'module property a',
            define: this.aSpy,
            startWithParent: false
          });

          this.module = this.app.module('Mod', {
            propB: 'module property b',
            define: this.bSpy
          });
        });

        it('it sets first the property', function() {
          expect(this.module.options.propA).to.exist;
        });

        it('it does not set the second property', function() {
          expect(this.module.options.propB).to.be.undefined;
        });

        it('it calls both define functions', function() {
          expect(this.aSpy).to.have.been.called;
          expect(this.bSpy).to.have.been.called;
        });

        it('startWithParent value will not be lost', function() {
          expect(this.module.startWithParent).to.be.false;
        });
      });
    });

    describe('when creating a sub-module', function() {
      describe('and the parent is already created', function() {
        beforeEach(function() {
          this.parentDefineSpy = this.sinon.stub();
          this.childDefineSpy = this.sinon.stub();

          this.parent = this.app.module('parent', this.parentDefineSpy);
          this.child = this.app.module('parent.child', this.childDefineSpy);
        });

        it('parent should remain the same', function() {
          expect(this.parent).to.equal(this.app.parent);
        });

        it('parent definition should be called once', function() {
          expect(this.parentDefineSpy.callCount).to.equal(1);
        });

        it('child should be created', function() {
          expect(this.child).to.equal(this.app.parent.child);
        });

        it('child definition should be called once', function() {
          expect(this.childDefineSpy.callCount).to.equal(1);
        });
      });

      describe('and the parent is not already created', function() {
        beforeEach(function() {
          this.defineSpy = this.sinon.stub();
          this.child = this.app.module('parent.child', this.defineSpy);
        });

        it('parent should be defined', function() {
          expect(this.app.parent).to.exist;
        });

        it('child should be created', function() {
          expect(this.child).to.equal(this.app.parent.child);
        });

        it('definition should be called once', function() {
          expect(this.defineSpy.callCount).to.equal(1);
        });
      });
    });
  });

  describe('.start', function() {
    describe('when starting a module', function() {
      beforeEach(function() {
        this.startSpy = this.sinon.stub();
        this.beforeStartSpy = this.sinon.stub();
        this.initializeSpy1 = this.sinon.stub();
        this.initializeSpy2 = this.sinon.stub();

        this.module = this.app.module('Mod');
        this.module.on('before:start', this.beforeStartSpy);
        this.module.on('start', this.startSpy);
        this.module.addInitializer(this.initializeSpy1);
        this.module.addInitializer(this.initializeSpy2);

        this.module.start();
      });

      it('triggers module before start event', function() {
        expect(this.beforeStartSpy).to.have.been.called;
      });

      it('triggers module start event', function() {
        expect(this.startSpy).to.have.been.called;
      });

      it('the module initializers are called', function() {
        expect(this.initializeSpy1).to.have.been.called;
        expect(this.initializeSpy2).to.have.been.called;
      });

      it('the module is initialized', function() {
        expect(this.module._isInitialized).to.be.true;
      });
    });

    describe('when calling module start twice', function() {
      beforeEach(function() {
        this.module = this.app.module('Mod');
        this.startSpy = this.sinon.spy();
        this.module.on('before:start', this.startSpy);
        this.module.start();
        this.module.start();
      });

      it('its only started once', function() {
        expect(this.startSpy.callCount).to.equal(1);
      });
    });

    describe('when starting a module with sub-modules', function() {
      describe('when starting parent', function() {
        describe('', function() {
          beforeEach(function() {
            this.parent = this.app.module('Parent');
            this.child = this.app.module('Parent.Child');

            this.childStartSpy = this.sinon.spy(this.child, 'start');
            this.parentStartSpy = this.sinon.spy(this.parent, 'start');
            this.parent.start();
          });

          it('parent is started', function() {
            expect(this.parentStartSpy).to.have.been.called;
          });

          it('child is started', function() {
            expect(this.childStartSpy).to.have.been.called;
          });
        });

        describe('and child is set to not start with parent', function() {
          beforeEach(function() {
            this.parent = this.app.module('Parent', {startWithParent: false});
            this.child = this.app.module('Parent.Child', {startWithParent: false});

            this.childStartSpy = this.sinon.spy(this.child, 'start');
            this.parent.start();
          });

          it('the parent is started', function() {
            expect(this.parentStartSpy).to.have.been.called;
          });

          it('the child is not started', function() {
            expect(this.childStartSpy).not.to.have.been.called;
          });
        });
      });
    });

    describe('when starting app', function() {
      describe('', function() {
        beforeEach(function() {
          this.module = this.app.module('Mod');
          this.startSpy = this.sinon.spy(this.module, 'start');
          this.app.start();
        });

        it('its module starts', function() {
          expect(this.startSpy).to.have.been.called;
        });
      });

      describe('and its module is set to not start with parent', function() {
        beforeEach(function() {
          this.module = this.app.module('Mod', {startWithParent: false});
          this.startSpy = this.sinon.spy(this.module, 'start');
          this.app.start();
        });

        it('it does not start', function() {
          expect(this.startSpy).not.to.have.been.called;
        });
      });
    });

    describe('after app is started', function() {
      beforeEach(function() {
        this.app.start();
        this.initializeSpy = this.sinon.stub();

        this.module = this.app.module('Mod');
        this.module.addInitializer(this.initializeSpy);
        this.module.start();
      });

      it('creates the module', function() {
        expect(this.module).to.equal(this.app.Mod);
      });

      it('calls the modules initializers', function() {
        expect(this.initializeSpy).to.have.been.called;
      });
    });
  });

  describe('.stop', function() {
    describe('when stopping a module', function() {
      beforeEach(function() {
        this.beforeStopSpy = this.sinon.spy();
        this.stopSpy = this.sinon.spy();
        this.finalizerSpy = this.sinon.spy();

        this.module = this.app.module('Mod');
        this.module.addFinalizer(this.finalizerSpy);
        this.module.on('before:stop', this.beforeStopSpy);
        this.module.on('stop', this.stopSpy);

        this.module.start();
        this.module.stop();
      });

      it('finalizer is called', function() {
        expect(this.finalizerSpy).to.have.been.called;
      });

      it('before:stop event is triggered', function() {
        expect(this.beforeStopSpy).to.have.been.called;
      });

      it('stop event is triggered', function() {
        expect(this.stopSpy).to.have.been.called;
      });
    });

    describe('when stopping a module with sub-modules', function() {
      beforeEach(function() {
        this.beforeStopSpy = this.sinon.spy();
        this.stopSpy = this.sinon.spy();
        this.finalizerSpy = this.sinon.spy();

        this.module = this.app.module('Mod');
        this.child = this.app.module('Mod.Child');
        this.child.addFinalizer(this.finalizerSpy);
        this.child.on('before:stop', this.beforeStopSpy);
        this.child.on('stop', this.stopSpy);
        this.sinon.spy(this.child, 'stop');

        this.module.start();
        this.module.stop();
      });

      it('its submodule stop function is invoked', function() {
        expect(this.child.stop).to.have.been.called;
      });

      it('its submodule finalizer is called', function() {
        expect(this.finalizerSpy).to.have.been.called;
      });

      it('its submodule before:stop event is triggered', function() {
        expect(this.beforeStopSpy).to.have.been.called;
      });

      it('its submoule stop event is triggered', function() {
        expect(this.stopSpy).to.have.been.called;
      });
    });

    describe('when stopping a module before its started', function() {
      beforeEach(function() {
        this.parentFinalizerSpy = this.sinon.spy();
        this.childFinalizerSpy = this.sinon.spy();
        this.parentStopSpy = this.sinon.spy();
        this.childStopSpy = this.sinon.spy();

        this.parent = this.app.module('Parent');
        this.child = this.app.module('Child');

        this.parent.on('stop', this.parentStopSpy);
        this.child.on('stop', this.childStopSpy);

        this.parent.addFinalizer(this.parentFinalizerSpy);
        this.child.addFinalizer(this.childFinalizerSpy);

        this.parent.stop();
      });

      it('the parent does not trigger a stop event', function() {
        expect(this.parentFinalizerSpy).not.to.have.been.called;
      });

      it('the child does not trigger a stop event', function() {
        expect(this.childFinalizerSpy).not.to.have.been.called;
      });

      it('the parent does not call its finalizer', function() {
        expect(this.parentStopSpy).not.to.have.been.called;
      });

      it('the child does not call its finalizer', function() {
        expect(this.childStopSpy).not.to.have.been.called;
      });
    });
  });
});
