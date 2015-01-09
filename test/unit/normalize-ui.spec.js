describe('normalizeUI* utility functions', function() {
  'use strict';

  beforeEach(function() {
    this.ui = {
      foo: '.foo'
    };
  });

  describe('normalizeUIString', function() {
    describe('when passed a @ui. syntax string and ui hash', function() {
      it('should return a matching UI selector string', function() {
        expect(Marionette.normalizeUIString('@ui.foo', this.ui)).to.equal('.foo');
      });
    });
    describe('when passed a normal selector string', function() {
      it('should return the original string', function() {
        expect(Marionette.normalizeUIString('.baz', this.ui)).to.equal('.baz');
      });
    });
  });

  describe('normalizeUIKeys', function() {
    beforeEach(function() {
      this.uiKeysHash = {
        '@ui.foo': 'fooValue',
        'bar': 'barValue'
      };
    });
    describe('when passed a hash containing @ui. syntax keys', function() {
      beforeEach(function() {
        this.normalizedUIKeys = Marionette.normalizeUIKeys(this.uiKeysHash, this.ui);
      });
      it('should return a normalized hash of selector keys', function() {
        expect(this.normalizedUIKeys['.foo']).to.equal('fooValue');
      });
      it('should not modify non-@ui. syntax keys', function() {
        expect(this.normalizedUIKeys.bar).to.equal('barValue');
      });
      it('should remove the @ui. syntax key once normalized', function() {
        expect(this.normalizedUIKeys['@ui.foo']).to.not.exist;
      });
    });
  });

  describe('normalizeUIValues', function() {
    beforeEach(function() {
      this.uiValuesHash = {
        foo: '@ui.foo',
        bar: '.bar'
      };
      this.normalizedUIValues = Marionette.normalizeUIValues(this.uiValuesHash, this.ui);
    });
    describe('when passed a hash containing @ui. syntax values', function() {
      it('should return a normalized hash of selector values', function() {
        expect(this.normalizedUIValues.foo).to.equal(this.ui.foo);
      });
      it('should not modify non-@ui. syntax values', function() {
        expect(this.normalizedUIValues.bar).to.equal('.bar');
      });
    });
    describe('when passed an undefined hash', function() {
      it('should return undefined', function() {
        expect(Marionette.normalizeUIValues()).to.equal(undefined);
      });
    });
    describe('when passed a hash containing embedded objects', function() {
      beforeEach(function() {
        this.uiValuesHash = {
          embedded: {
            foo: '@ui.foo',
            bar: '@ui.bar'
          }
        };
        this.normalizedUIValues = Marionette.normalizeUIValues(this.uiValuesHash, this.ui, ['foo']);
      });
      describe('when passed a hash containing objects whose properties contain @ui syntax values', function() {
        it('should normalize properties with @ui. syntax values if they are named in the properties array', function() {
          expect(this.normalizedUIValues.embedded.foo).to.equal(this.ui.foo);
        });
        it('should not modify hash value object properties not named in the properties array', function() {
          expect(this.normalizedUIValues.embedded.bar).to.equal('@ui.bar');
        });
      });
    });
  });

});
