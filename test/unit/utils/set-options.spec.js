import setOptions from '../../../src/utils/set-options';

describe('setOptions', function() {
  let object;
  const options = {
    foo: 'baz',
    baz: 'baz'
  };

  beforeEach(function() {
    object = {
      options() {
        return {
          foo: 'bar',
          bar: 'baz'
        };
      }
    };

    setOptions.call(object, options);
  });

  it('should not mutate the options argument', function() {
    expect(options).to.eql({
      foo: 'baz',
      baz: 'baz'
    })
  });

  // This test covers merge order and options as a function
  it('should set options on the context', function() {
    expect(object.options).to.eql({
      foo: 'baz',
      bar: 'baz',
      baz: 'baz'
    });
  });
});
