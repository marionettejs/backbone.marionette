// Helpers
// -------

// For slicing `arguments` in functions
var slice = Array.prototype.slice;

// Borrow the Backbone `extend` method so we can use it as needed
Marionette.extend = Backbone.Model.extend;
