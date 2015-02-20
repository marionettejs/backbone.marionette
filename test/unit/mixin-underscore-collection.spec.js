describe('Marionette.actAsCollection', function() {
  'use strict';

  beforeEach(function() {
    this.data = [1, 2, 3];
    this.doubledData = [2, 4, 6];
    this.double = function(v) { return v * 2; };
  });

  describe('object literal', function() {
    beforeEach(function() {
      this.target = {list: this.data};
      Marionette.actAsCollection(this.target, 'list');
      this.result = this.target.map(this.double);
    });

    it('should be able to map over list', function() {
      expect(this.result).to.deep.equal(this.doubledData);
    });
  });

  describe('function prototype', function() {
    beforeEach(function() {
      this.Class = function(list) { this.list = list; };
      Marionette.actAsCollection(this.Class.prototype, 'list');
      this.class = new this.Class(this.data);
      this.result = this.class.map(this.double);
    });

    it('should be able to map over list', function() {
      expect(this.result).to.deep.equal(this.doubledData);
    });
  });
});
