# Marionette.MnObject

Object incorporates backbone conventions `initialize`, `cid` and `extend`.
Object includes:
- [Common Marionette Functionality](./common.md).
- [Radio API](./backbone.radio.md#marionette-integration).

## Documentation Index

* [Unique Client ID](#unique-client-id)
* [Initialize](#initialize)
* [Destroying a MnObject](#destroying-a-mnobject)
* [Basic Use](#basic-use)

## Unique Client ID
The `cid` or client id is a unique identifier automatically assigned to MnObjects
when they're first created and by default is prefixed with `mno`.
You can modify the prefix for `MnObject`s you `extend` by setting the `cidPrefix`.

```javascript
import { MnObject } from 'backbone.marionette';

const MyFoo = MnObject.extend({
  cidPrefix: 'foo'
});

const foo = new MyFoo();

console.log(foo.cid); // foo1234
```

## Initialize
`initialize` is called immediately after the MnObject has been instantiated,
and is invoked with the same arguments that the constructor received.

```javascript
import { MnObject } from 'backbone.marionette';

const Friend = MnObject.extend({
  initialize(options){
    console.log(options.name);
  }
});

new Friend({name: 'John'});
```

[Live example](https://jsfiddle.net/marionettejs/1ytrwyog/)

## Destroying a MnObject

### `destroy`
MnObjects have a `destroy` method that unbind the events that are directly attached to the
instance. `destroy` returns the MnObject.

Invoking the `destroy` method will trigger `before:destroy` and `destroy` events and their [corresponding methods](./marionette.functions.md#marionettetriggermethod).

**Note** The event handlers will pass the `options` argument `destroy` was invoked with.

```javascript
import { MnObject } from 'backbone.marionette';

// define a mnobject with an onBeforeDestroy method
const MyObject = MnObject.extend({

  onBeforeDestroy(options){
    // put other custom clean-up code here
  }
});

// create a new mnobject instance
const obj = new MyObject();

// add some event handlers
obj.on('before:destroy', function(options){ ... });
obj.listenTo(something, 'bar', function(){...});

// destroy the mnobject: unbind all of the
// event handlers, trigger the "destroy" event and
// call the onBeforeDestroy method
obj.destroy({ foo: 'bar' });
```

### `isDestroyed`

This method will return a boolean indicating if the mnobject has been destroyed.

```javascript
import { MnObject } from 'backbone.marionette';

const obj = new MnObject();
obj.isDestroyed(); // false
obj.destroy();
obj.isDestroyed(); // true
```

## Basic Use

Selections is a simple MnObject that manages a selection of things.
Because Selections extends from MnObject, it gets `initialize` and `Events`
for free.

```javascript
import { MnObject } from 'backbone.marionette';

const Selections = MnObject.extend({

  initialize(options){
    this.selections = {};
  },

  select(key, item){
    this.selections[key] = item;
    this.triggerMethod('select', key, item);
  },

  deselect(key, item) {
    delete this.selections[key];
    this.triggerMethod('deselect', key, item);
  }

});

const selections = new Selections({
  filters: Filters
});

// use the built in EventBinder
selections.listenTo(selections, 'select', function(key, item){
  console.log(item);
});

selections.select('toy', Truck);
```
