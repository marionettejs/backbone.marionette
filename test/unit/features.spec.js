describe('features', function() {

  beforeEach(function() {
    Marionette.FEATURES = {};
  });

  it('enabled when its present and true', function() {
    Marionette.FEATURES.foo = true;
    expect(Marionette.isEnabled('foo')).to.be.true;
  });

  it('disabled when its present and false', function() {
    Marionette.FEATURES.foo = false;
    expect(Marionette.isEnabled('foo')).to.be.false;
  });

  it('disabled when not present', function() {
    expect(Marionette.isEnabled('foo')).to.be.false;
  });
});
