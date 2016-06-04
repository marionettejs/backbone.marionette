// Marionette.isNodeAttached
// -------------------------

import Backbone from 'backbone';

// Determine if `el` is a child of the document
const isNodeAttached = function(el) {
  return Backbone.$.contains(document.documentElement, el);
};

export default isNodeAttached;
