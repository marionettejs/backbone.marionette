beforeEach(function() {
  this.addMatchers({
    toBeTypeOf: function(expectedType){
      var actualType = this.actual;
      this.message = function(){
        return "Expected '" + typeof actualType + "' to be type of '" + expectedType + "'";
      }
      return (typeof actualType === expectedType);
    }
  });
});

var startRouters = function(){
  try{
    Backbone.history.start();
  }
  catch(x){
    Backbone.history.loadUrl();
  }
}
