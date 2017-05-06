// DomMixin
//  ---------

import Backbone from 'backbone';

export default {
  createBuffer() {
    return document.createDocumentFragment();
  },

  appendChildren(el, children) {
    this._getEl(el).append(children);
  },

  beforeEl(el, sibling) {
    this._getEl(el).before(sibling);
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
    this._getEl(el).contents().detach();
  },

  setInnerContent(el, html) {
    this._getEl(el).html(html);
  },

  detachEl(el) {
    this._getEl(el).detach();
  },

  removeEl(el) {
    this._getEl(el).remove();
  },

  _getEl(el) {
    return el instanceof Backbone.$ ? el : Backbone.$(el);
  },

  findEls(selector, context) {
    return Backbone.$(selector, context);
  }
};
