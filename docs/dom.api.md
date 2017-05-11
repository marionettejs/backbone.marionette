# The DOM API

**Warning** *The DOM API is currently experimental and may change.*

With the release of Marionette 3.2, developers can remove the dependency on
jQuery and integrate with the DOM using a custom api.

## Mixin Methods

The DOM API manages the DOM on behalf of `View` and `CollectionView`. It
defines the methods that actually attach and remove views and children.

The default API depends on Backbone's jQuery `$` object however it does not
rely on jQuery-specific behavior. This should make it easier to develop your own
API. You will, however, [need to also handle Backbone's jQuery integration](#backbone-jquery-integration).

### `createBuffer()`

Returns a new HTML DOM node instance. The resulting node can be passed into the
other DOM functions.

### `getEl(selector, context)`

Lookup the `selector` string within the DOM node for `context`. The optional
`context` argument will come in as a DOM Node reference to run the `selector`
search. If `context` hasn't been set, then `getEls` should search the entire
`document` for the `selector`.

### `detachEl(el)`

Detach `el` from the DOM without removing listeners.

### `removeEl(el)`

Remove `el` from the DOM, removing listeners.

### `replaceEl(newEl, oldEl)`

Remove `oldEl` from the DOM and put `newEl` in its place.

### `setContents(el, html)`

Replace the contents of `el` with the HTML string of `html`. Unlike other DOM
functions, this takes a literal string for its second argument.

### `appendContents(el, contents)`

Takes the DOM node `el` and appends the rendered `contents` to the end of the
element's contents.

### `detachContents(el)`

Remove the inner contents of `el` from the DOM while leaving `el` itself in the
DOM.

### `beforeEl(el, sibling)`

Add `sibling` to the DOM immediately before the DOM node `el`. The `sibling`
will be at the same level as `el`.

## Providing Your Own DOM API

To implement your own DOM API for `View`, override the provided functions to
provide the same functionality provided and mix it in using `setDomApi` as such:

```js
var Mn = require('backbone.marionette');

var MyDOMApi = require('./mydom');

module.exports = Mn.View.setDomApi(MyDOMApi);
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

The DOM API takes care of the other DOM manipulation methods for you. The
[Backbone Wiki](https://github.com/jashkenas/backbone/wiki/using-backbone-without-jquery)
has a good reference for removing jQuery from the app, including Browserify and
Webpack configuration hooks.
