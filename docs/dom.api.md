# The DOM API

**Warning** *The DOM API is currently experimental and may change.*

With the release of Marionette 3.2, developers can remove the dependency on
jQuery and integrate with the DOM using a custom api.

## API Methods

The DOM API manages the DOM on behalf of each view type and `Region`.
It defines the methods that actually attach and remove views and children.

[The default API](#the-default-api) depends on Backbone's jQuery `$` object however it does not
rely on jQuery-specific behavior. This should make it easier to develop your own
API. You will, however, [need to also handle Backbone's jQuery integration](#backbone-jquery-integration).

### `createBuffer()`

Returns a new HTML DOM node instance. The resulting node can be passed into the
other DOM functions.

### `getEl(selector)`

Lookup the `selector` string withing the DOM. The `selector` may also be a DOM element.
It should return an array-like object of the node.

### `findEl(el, selector)`

Lookup the `selector` string within the DOM node `el`. It should return an array-like object of nodes.

### `detachEl(el)`

Detach `el` from the DOM without removing listeners.

### `replaceEl(newEl, oldEl)`

Remove `oldEl` from the DOM and put `newEl` in its place.

### `setContents(el, html)`

Replace the contents of `el` with the HTML string of `html`. Unlike other DOM
functions, this only takes a literal string for its second argument.

### `appendContents(el, contents)`

Takes the DOM node `el` and appends the DOM node `contents` to the end of the
element's contents.

### `hasContents(el)`

Returns a boolean indicating if the `el` has child nodes.

### `detachContents(el)`

Remove the inner contents of `el` from the DOM while leaving `el` itself in the
DOM.

## The default API

The API used by Marionette by default is attached as `Marionette.DomApi`.
This is useful if you [change the API](#providing-your-own-dom-api) globally,
but want to reuse the default in certain cases.

```javascript
var Mn = require('backbone.marionette');

var MyDOMApi = require('./mydom');

Mn.setDomApi(MyDOMApi);

// Use MyDOMApi everywhere but `Marionette.View`
Mn.View.setDomApi(Mn.DomApi);
```

## Providing Your Own DOM API

To implement your own DOM API use `setDomApi`:

```javascript
var Mn = require('backbone.marionette');

var MyDOMApi = require('./mydom');

Mn.setDomApi(MyDOMApi);
```

You can also implement a different DOM API for a particular class:

```javascript
Mn.View.setDomApi(MyDOMApi);
```

`CollectionView`, `CompositeView`, `NextCollectionView`, `Region`, and `View`
all have `setDomApi`. Each extended class may have their own DOM API.

Additionally a DOM API can be partially set:

```javascript
var MyView = Mn.View.extend();

MyView.setDomApi({
  setContents: function(el, html) {
    el.innerHTML = html;
  }
});
```

### CollectionView `beforeEl(el, sibling)`

The only DOM interaction not covered by the DOM API is `CollectionView.beforeEl`.
That function should be overridden separately.

Add `sibling` to the DOM immediately before the DOM node `el`. The `sibling`
will be at the same level as `el`.

```javascript
// Current implementation
Marionette.CollectionView.prototype.beforeEl = function(el, siblings) {
  this.$(el).before(siblings);
};
```

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
