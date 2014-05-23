describe('Marionette.actAsCollection', function() {
  'use strict';

  beforeEach(function() {
    this.double = function(v) { return v * 2; };
  });

  describe('object literal', function() {
    beforeEach(function() {
      this.obj = {
        list: [1, 2, 3]
      };

      Marionette.actAsCollection(this.obj, 'list');
    });

    it('should be able to map over list', function() {
      expect(this.obj.map(this.double)).to.deep.equal([2, 4, 6]);
    });
  });

  describe('function prototype', function() {
    beforeEach(function() {
      this.Func = function(list) {
        this.list = list;
      };

      Marionette.actAsCollection(this.Func.prototype, 'list');
      this.func = new this.Func([1, 2, 3]);
    });

    it('should be able to map over list', function() {
      expect(this.func.map(this.double)).to.deep.equal([2, 4, 6]);
    });
  });
});
