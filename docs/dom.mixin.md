# The DOM Mixin API

**Warning** *The DOM Mixin API is currently experimental and may change.*

With the release of Marionette 3.2, developers can remove the dependency on
jQuery and integrate with the DOM using a custom mixin.

## Mixin Methods

The DOM mixin manages the DOM on behalf of `View` and `CollectionView`. It
defines the methods that actually attach and remove views and children.

The default mixin depends on Backbone's jQuery `$` object however it does not
rely on jQuery-specific behavior. This should make it easier to develop your own
API. You will, however, [need to also handle Backbone's jQuery integration](#backbone-jquery-integration).

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

Lookup the `selector` string within the DOM node for `context`. The optional
`context` argument will come in as a DOM Node reference to run the `selector`
search. If `context` hasn't been set, then `findEls` should search the entire
`document` for the `selector`.

## Providing Your Own DOM API

To implement your own DOM API for `View`, override the provided functions to
provide the same functionality provided and mix it in using `_.extend` as such:

```js
var Mn = require('backbone.marionette');

var MyDOMMixin = require('./mixins/mydom');

module.exports = Mn.View.extend(MyDOMMixin);
```

This would need to be applied to `CollectionView`, `Region` and `TemplateCache`.

### Backbone jQuery Integration

Backbone.js is tied to jQuery's API for managing DOM manipulation. If you want
to completely remove jQuery from your Marionette app, you'll also have to
provide your own versions of the following methods:

* [`_setAttributes`](http://backbonejs.org/docs/backbone.html#section-170)
* [`delegate`](http://backbonejs.org/docs/backbone.html#section-165)
* [`undelegate`](http://backbonejs.org/docs/backbone.html#section-167)

#### See Also

The DOM Mixin takes care of the other DOM manipulation methods for you. The
[Backbone Wiki](https://github.com/jashkenas/backbone/wiki/using-backbone-without-jquery)
has a good reference for removing jQuery from the app, including Browserify and
Webpack configuration hooks.
