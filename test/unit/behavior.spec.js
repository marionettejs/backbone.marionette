import _ from 'underscore';
import Behavior from '../../src/behavior';

describe('Behavior', function() {
  describe('when instantiating a behavior with some options', function() {
    it('should merge the options into instance options', function() {
      const createOptions = {foo: 'bar'};
      const behavior = new Behavior(createOptions);

      expect(behavior.options).to.eql(createOptions);
    });
  });

  describe('#getEvents', function() {
    let behavior;
    let eventHandlers;
    let events;

    beforeEach(function() {
      eventHandlers = {
        'click .test'() {},
        'click .no-handler': null,
        'click .test2': 'onHandler'
      };

      const MyBehavior = Behavior.extend({
        events() {
          return eventHandlers;
        },
        onHandler: this.sinon.stub()
      });

      behavior = new MyBehavior();

      this.sinon.spy(behavior, 'normalizeUIKeys');

      events = behavior.getEvents();
    });

    it('should pass normalizeUIKeys the results of events', function() {
      expect(behavior.normalizeUIKeys)
        .to.have.been.calledOnce
        .and.calledWith(eventHandlers);
    });

    it('should convert named handlers to bound instance handlers', function() {
      const onHandler = _.last(_.values(events));
      onHandler();

      expect(behavior.onHandler).to.be.calledOn(behavior);
    });

    it('should remove events without handlers', function() {
      expect(_.values(events)).to.be.lengthOf(2);
    });

    it('should namespace the handlers', function() {
      _.each(_.keys(events), key => {
        expect(key).to.have.string('.' + behavior.cid);
      });
    });
  });
});
