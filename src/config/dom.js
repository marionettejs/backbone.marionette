// DomApi
//  ---------
import _ from 'underscore';
import Backbone from 'backbone';

// Performant method for returning the jQuery instance
function getEl(el) {
  return el instanceof Backbone.$ ? el : Backbone.$(el);
}

// Static setter
export function setDomApi(mixin) {
  this.prototype.Dom = _.extend({}, this.prototype.Dom, mixin);
  return this;
}

export default {

  // Returns a new HTML DOM node instance
  createBuffer() {
    return document.createDocumentFragment();
  },

  // Lookup the `selector` string
  // Selector may also be a DOM element
  // Returns an array-like object of nodes
  getEl(selector) {
    return getEl(selector);
  },

  // Finds the `selector` string with the el
  // Returns an array-like object of nodes
  findEl(el, selector, _$el = getEl(el)) {
    return _$el.find(selector);
  },

  // Returns true if the el contains the node childEl
  hasEl(el, childEl) {
    return el.contains(childEl && childEl.parentNode);
  },

  // Detach `el` from the DOM without removing listeners
  detachEl(el, _$el = getEl(el)) {
    _$el.detach();
  },

  // Remove `oldEl` from the DOM and put `newEl` in its place
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

  // Swaps the location of `el1` and `el2` in the DOM
  swapEl(el1, el2) {
    if (el1 === el2) {
      return;
    }

    const parent1 = el1.parentNode;
    const parent2 = el2.parentNode;

    if (!parent1 || !parent2) {
      return;
    }

    const next1 = el1.nextSibling;
    const next2 = el2.nextSibling;

    parent1.insertBefore(el2, next1);
    parent2.insertBefore(el1, next2);
  },

  // Replace the contents of `el` with the HTML string of `html`
  setContents(el, html, _$el = getEl(el)) {
    _$el.html(html);
  },

  // Takes the DOM node `el` and appends the DOM node `contents`
  // to the end of the element's contents.
  appendContents(el, contents, {_$el = getEl(el), _$contents = getEl(contents)} = {}) {
    _$el.append(_$contents);
  },

  // Does the el have child nodes
  hasContents(el) {
    return !!el && el.hasChildNodes();
  },

  // Remove the inner contents of `el` from the DOM while leaving
  // `el` itself in the DOM.
  detachContents(el, _$el = getEl(el)) {
    _$el.contents().detach();
  }
};
