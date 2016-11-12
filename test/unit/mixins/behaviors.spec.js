'use strict';

import _ from 'underscore';
import BehaviorsMixin from '../../../src/mixins/behaviors';
import Behavior from '../../../src/behavior';

describe('Behaviors Mixin', function() {
  let Behaviors;

  beforeEach(function() {
    Behaviors = function() {};
    Behaviors.extend = Marionette.extend;
    _.extend(Behaviors.prototype, BehaviorsMixin);
  });

  describe('#_initBehaviors', function() {
    let behaviors;

    beforeEach(function() {
      behaviors = new Behaviors();
      this.sinon.spy(behaviors, '_getBehaviors');
      behaviors._initBehaviors();
    });

    it('should call _getBehaviors', function() {
      expect(behaviors._getBehaviors).to.be.calledOnce;
    });

    it('should not have behaviors', function() {
      expect(behaviors._getBehaviors()).to.be.deep.equal({});
    });
  });

  describe('#_getBehaviors', function() {
    let behaviorsInstance;
    let initializeStub;
    let actualBehaviors;
    let FooBehavior;

    beforeEach(function() {
      initializeStub = this.sinon.stub();
      behaviorsInstance = new Behaviors()
      FooBehavior = Behavior.extend({initialize: initializeStub});
    });

    describe('should work with behaviorClass option', function() {
      beforeEach(function() {
        behaviorsInstance.behaviors = [
          {
            behaviorClass: FooBehavior
          }
        ];
        actualBehaviors = behaviorsInstance._getBehaviors();
      });

      it('should call initialize when a behavior is created', function() {
        expect(initializeStub).to.be.calledOnce;
      });

      it('should have behaviors', function() {
        expect(actualBehaviors.length).to.be.equal(1);
      });
    });

    describe('should work without behaviorClass option', function() {
      beforeEach(function() {
        behaviorsInstance.behaviors = [FooBehavior];
        actualBehaviors = behaviorsInstance._getBehaviors();
      });

      it('should call initialize when a behavior is created', function() {
        expect(initializeStub).to.be.calledOnce;
      });

      it('should have behaviors', function() {
        expect(actualBehaviors.length).to.be.equal(1);
      });
    });

    describe('should work with behaviorsLookup', function() {
      beforeEach(function() {
        let behaviorOptions = {foo: 'bar'};
        let behaviors = {
          'foo': FooBehavior
        };
        Marionette.Behaviors.behaviorsLookup = behaviors;

        behaviorsInstance.behaviors = {foo: behaviorOptions};
        actualBehaviors = behaviorsInstance._getBehaviors();
      });

      it('should call initialize when a behavior is created', function() {
        expect(initializeStub).to.be.calledOnce;
      });

      it('should have behaviors', function() {
        expect(actualBehaviors.length).to.be.equal(1);
      });
    });
  });

  //@todo
  // _getBehaviorTriggers
  // _getBehaviorEvents
  // _proxyBehaviorViewProperties
  // _delegateBehaviorEntityEvents
  // _undelegateBehaviorEntityEvents
  // _destroyBehaviors
  // _bindBehaviorUIElements
  // _unbindBehaviorUIElements
  // _triggerEventOnBehaviors
});
