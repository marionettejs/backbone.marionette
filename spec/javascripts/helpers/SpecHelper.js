beforeEach(function() {
  this.addMatchers({
    toBeTypeOf: function(expectedType){
      var actualType = this.actual;
      this.message = function(){
        return "Expected '" + typeof actualType + "' to be type of '" + expectedType + "'";
      }
      return (typeof actualType === expectedType);
    },

    toHaveOwnProperty: function(propertyName){
      return this.actual.hasOwnProperty(propertyName);
    }

  });
});
