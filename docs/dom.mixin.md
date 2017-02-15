# The DOM Mixin API

With the release of Marionette 3.2, developers can remove the dependency on
jQuery and integrate with the DOM using a custom mixin.

## Mixin Methods

The DOM mixin manages the DOM on behalf of `View` and `CollectionView`. It
defines the methods that actually attach and remove views and children.

The default mixin depends on Backbone's jQuery `$` object however it does not
rely on jQuery-specific behavior. This should make it easier to develop your own
API.

### `createBuffer()`

Returns a new HTML DOM node instance. The resulting node can be passed into the
other DOM functions.

### `appendChildren(el, children)`

Takes the DOM node `el` and appends the rendered `children` to the end of the
element's contents.

### `beforeEl(el, sibling)`

Add `sibling` to the DOM immediately before the DOM node `el`. The `sibling`
will be at the same level as `el`.

### `replaceEl(newEl, oldEl)`

Remove `oldEl` from the DOM and put `newEl` in its place.

### `detachContents(el)`

Remove the inner contents of `el` from the DOM while leaving `el` itself in the
DOM.

### `setInnerContent(el, html)`

Replace the contents of `el` with the HTML string of `html`. Unlike other DOM
functions, this takes a literal string for its second argument.

### `removeEl(el)`

Remove `el` from the DOM.

### `findEls(selector, context)`

Lookup the `selector` string within the DOM node for `context`. The `context`
argument should be a DOM node reference.

## Providing Your Own DOM

To implement your own DOM API for `View`, override the provided functions to
provide the same functionality provided and mix it in using `_.extend` as such:

```js
var _ = require('underscore');
var Mn = require('backbone.marionette');

var MyDOMMixin = require('./mixins/mydom');

_.extend(Mn.View, MyDOMMixin);

module.exports = Mn.View;
```
