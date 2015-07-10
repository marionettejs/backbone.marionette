// Marionette.isNodeAttached
// -------------------------

// Determine if `el` is a child of the document
Marionette.isNodeAttached = function(el) {
  return Backbone.$.contains(document.documentElement, el);
};
