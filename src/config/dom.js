// DomApi
//  ---------

import Backbone from 'backbone';

function getEl(el) {
  return el instanceof Backbone.$ ? el : Backbone.$(el);
}

// Static setter
export function setDomApi(mixin) {
  this.prototype.Dom = _.extend({}, this.prototype.Dom, mixin);
}

export default {
  createBuffer() {
    return document.createDocumentFragment();
  },

  getEl(el, context) {
    if (context) {
      return Backbone.$(el, context);
    }

    return getEl(el);
  },

  detachEl(el, _$el = getEl(el)) {
    _$el.detach();
  },

  removeEl(el, _$el = getEl(el)) {
    _$el.remove();
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

  setContents(el, contents, _$el = getEl(el)) {
    _$el.html(contents);
  },

  appendContents(el, contents, {_$el = getEl(el), _$contents = getEl(contents)}) {
    _$el.append(_$contents);
  },

  detachContents(el, _$el = getEl(el)) {
    _$el.contents().detach();
  }
};
