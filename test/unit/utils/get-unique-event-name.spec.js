import getUniqueEventName from '../../../src/utils/get-unique-event-name';

describe('getUniqueEventName', function() {
  it('should postfix a unique id to the event', function() {
    const matcher = /^(click\.evt\d+\sa\.name)$/;
    expect(getUniqueEventName('click a.name')).to.match(matcher);
  });
});
