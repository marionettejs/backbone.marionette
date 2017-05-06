// DomMixin
//  ---------

import Backbone from 'backbone';

function getEl(el, context) {
  return el instanceof Backbone.$ ? el : Backbone.$(el, context);
}

// Static setter
export function setDomMixin(mixin) {
  this.prototype.Dom = _.extend({}, this.prototype.Dom, mixin);
}

export default {
  getEl,

  createBuffer() {
    return document.createDocumentFragment();
  },

  detachEl(el) {
    getEl(el).detach();
  },

  removeEl(el) {
    getEl(el).remove();
  },

  replaceEl(newEl, oldEl) {
    if (newEl === oldEl) {
      return;
    }

    const parent = oldEl.parentNode;

    if (!parent) {
      return;
    }

    parent.replaceChild(newEl, oldEl);
  },

  setContents(el, content) {
    getEl(el).html(content);
  },

  appendContents(el, content) {
    getEl(el).append(content);
  },

  detachContents(el) {
    getEl(el).contents().detach();
  }
};
