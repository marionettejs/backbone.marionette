# The DOM Mixin API

With the release of Marionette 3.2, developers can remove the dependency on
jQuery and integrate with the DOM using a custom mixin.

## Mixin Methods

The DOM mixin manages the DOM on behalf of `View` and `CollectionView`. It
defines the methods that actually attach and remove views and children.

The default mixin depends on Backbone's jQuery `$` object.

### `createBuffer()`

Returns a HTML DOM node.

### `appendChildren(el, children)`

Takes the DOM node `el` and appends the rendered `children`. For example, given
the following:

```js
var el = '<ul></ul>';
var children = '<li>Item 1</li><li>Item 2</li>';

appendChildren(el, children);
```

The output will be:

```html
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

### `beforeEl(el, sibling)`

Add `sibling` to the DOM immediately before the DOM node `el`. For example,
given the following:

```js
var el = '<section></section';
var sibling = '<div></div>';

beforeEl(el, sibling);
```

The output will be:

```html
<div></div>
<section></section>
```

### `replaceEl(newEl, oldEl)`


  replaceEl(newEl, oldEl) {
    const parent = oldEl.parentNode;

    if (!parent) {
      return;
    }

    parent.replaceChild(newEl, oldEl);
  },

### `detachContents(el)`
  detachContents(el) {
    Backbone.$(el).contents().detach();
  },

### `setInnerContent(el, html)`

  setInnerContent(el, html) {
    Backbone.$(el).html(html);
  },

### `removeEl(el)`

  removeEl(el) {
    Backbone.$(el).remove();
  },

### `findEls(selector, context)`

  findEls(selector, context) {
    return Backbone.$(selector, context);
  }

## Using the Mixin API

