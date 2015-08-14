// Marionette.isNodeAttached
// -------------------------

// Determine if `el` is a child of the document
var isNodeAttached = function(el) {
  return Backbone.$.contains(document.documentElement, el);
};

export default isNodeAttached;
