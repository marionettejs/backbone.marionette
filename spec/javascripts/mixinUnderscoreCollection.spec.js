describe('Marionette.actAsCollection', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  var double;

  beforeEach(function() {
    double = function(v) { return v * 2; };
  });

  describe('object literal', function() {
    var obj;

    beforeEach(function() {
      obj = {
        list: [1, 2, 3]
      };

      Marionette.actAsCollection(obj, 'list');
    });

    it('should be able to map over list', function() {
      expect(obj.map(double)).to.deep.equal([2, 4, 6]);
    });
  });

  describe('function prototype', function() {
    var Func, func;

    beforeEach(function() {
      Func = function(list) {
        this.list = list;
      };

      Marionette.actAsCollection(Func.prototype, 'list');
      func = new Func([1, 2, 3]);
    });

    it('should be able to map over list', function() {
      expect(func.map(double)).to.deep.equal([2, 4, 6]);
    });
  });
});
