import emulateCollection from '../../../src/utils/emulate-collection';

describe('emulateCollection', function() {
  it('should be able to map over list', function() {
    const target = { list: [1, 2, 3] };

    emulateCollection(target, 'list');

    expect(target.map(v => v * 2)).to.eql([2, 4, 6]);
  });
});
