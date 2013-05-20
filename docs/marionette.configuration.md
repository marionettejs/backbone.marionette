# Marionette Configuration

Marionette has a few globally configurable settings that will
change how the system works. While many of these subjects are covered
in other docs, this configuration doc should provide a list of the
most common items to change.

## Documentation Index

* [Marionette.$](#marionette_)

## Marionette.$

Marionette makes use of jQuery, by default, to manipulate DOM
elements. To get a reference to jQuery, though, it assigns the
`Marionette.$` attribute to `Backbone.$`. This provides consistency
with Backbone in which exact version of jQuery or other DOM manipulation
library is used.

If you wish to change to a specific version of a DOM manipulation
library, you can directly assign these settings:

```js
Backbone.$ = myDOMLib;
Marionette.$ = myDOMLib;
```

Note that you should change both Backbone and Marionette at the same
time, to the same DOM manipulation library.
