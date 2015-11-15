describe('features', function() {
  it('enabled when its present and true', function() {
    Marionette.setEnabled('foo', true);
    expect(Marionette.isEnabled('foo')).to.be.true;
  });

  it('disabled when its present and false', function() {
    Marionette.setEnabled('foo', false);
    expect(Marionette.isEnabled('foo')).to.be.false;
  });

  it('disabled when not present', function() {
    expect(Marionette.isEnabled('foo')).to.be.false;
  });
});
