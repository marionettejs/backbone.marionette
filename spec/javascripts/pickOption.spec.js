describe('Marionette.pickOptions', function() {
  describe('When calling pickOptions on an object with mergeOptions', function() {
    beforeEach(function() {
      this.mergeOptions = ['color', 'size'];

      this.options = {
        color: 'blue',
        size: 'large',
        department: 'swimsuits'
      };

      this.myObject = {
        pickOptions: Marionette.pickOptions,
        mergeOptions: this.mergeOptions
      };

      this.myObject.pickOptions(this.options);
    });

    it('should pick the mergeOptions keys from the options object, and merge it onto the object directly', function() {
      expect(this.myObject).to.contain.keys('color', 'size');
      expect(this.myObject.color).to.equal(this.options.color);
      expect(this.myObject.size).to.equal(this.options.size);
    });

    it('should ignore things not in mergeOptions', function() {
      expect(this.myObject).to.not.contain.keys('department');
    });
  });
});
