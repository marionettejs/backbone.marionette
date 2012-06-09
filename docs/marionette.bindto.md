## Marionette.BindTo

The `BindTo` object provides event binding management and facilitates simple
event binding and unbinding for any object that extends from `Backbone.Events`.

### Bind Events

```js
var binder = _.extend({}, Backbone.Marionette.BindTo);

var model = new MyModel();

var handler = {
  doIt: function(){}
}
binder.bindTo(model, "change:foo", handler.doIt);
```

You can optionally specify a 4th parameter as the context in which the callback
method for the event will be executed:

```js
binder.bindTo(model, "change:foo", someCallback, someContext);
```

### Unbind A Single Event

When you call `bindTo`, it returns a "binding" object that can be
used to unbind from a single event with the `unbindFrom` method:

```js
var binding = binder.bindTo(model, "change:foo", someCallback, someContext);

// later in the code
binder.unbindFrom(binding);
```

This will unbind the event that was configured with the binding
object, and remove it from the BindTo bindings.

### Unbind All Events

You can call `unbindAll` to unbind all events that were bound with the
`bindTo` method:

```js
binder.unbindAll();
```

This even works with in-line callback functions.


