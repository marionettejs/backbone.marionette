// Marionette.isNodeAttached
// -------------------------

// Determine if `el` is a child of the document
const isNodeAttached = function(el) {
  return document.documentElement.contains(el && el.parentNode);
};

export default isNodeAttached;
