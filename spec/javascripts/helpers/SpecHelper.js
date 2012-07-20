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
    },

    toContainHtml: function(html) {
      var actualHtml = this.actual.html();
      var expectedHtml = jasmine.JQuery.browserTagCaseIndependentHtml(html);
      return (actualHtml.indexOf(expectedHtml)>=0);
    },

    toBeInstanceOf: function(object) {
      return this.actual instanceof object; 
    }
  });
});
