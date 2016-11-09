// DomMixin
//  ---------

import Backbone from 'backbone';

export default {
  createBuffer() {
    return document.createDocumentFragment();
  },

  appendChildren(el, children) {
    Backbone.$(el).append(children);
  },

  beforeEl(el, sibling) {
    Backbone.$(el).before(sibling);
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

  detachContents(el) {
    Backbone.$(el).contents().detach();
  },

  setInnerContent(el, html) {
    Backbone.$(el).html(html);
  },

  detachEl(el) {
    Backbone.$(el).detach();
  },

  removeEl(el) {
    Backbone.$(el).remove();
  },

  findEls(selector, context) {
    return Backbone.$(selector, context);
  }
};
