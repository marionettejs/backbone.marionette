# Marionette.Application

The `Application` provides hooks for organizing and initiating other elements
and a view tree.

`Application` includes:
- [Common Marionette Functionality](./common.md)
- [Radio API](./backbone.radio.md#marionette-integration)
- [MnObject's API](./marionette.mnobject.md)

In addition to `MnObject`'s API Application provides two significant additions.
A simple lifecycle hook with [`start`](#starting-an-application) and a [single region](#application-region)
for attaching a view tree.

One additional difference is the `Application` [`cidPrefix`](./marionette.mnobject.md#unique-client-id) is `mna`.

## Documentation Index

* [Application Events](#application-events)
* [Starting An Application](#starting-an-application)
* [Application Region](#application-region)
* [Application Region Methods](#application-region-methods)

## Application Events

The `Application` object will fire two events:

### `before:start`

Fired just before the application is started. Use this to prepare the
application with anything it will need to start, for example instantiating
routers, models, and collections.

### `start`

Fired as part of the application startup. This is where you should be showing
your views and starting `Backbone.history`.

### Application Lifecycle

When `Application` was initialized and `start` method was called
a set of events will be called in a specific order.

| Order |      Event      |
| :---: |-----------------|
|   1   | `before:start`  |
|   2   | `start`         |

```javascript
import Bb from 'backbone';
import { Application } from 'backbone.marionette';

import MyModel from './mymodel';
import MyView from './myview';

const MyApp = Application.extend({
  region: '#root-element',

  initialize: function(options) {
    console.log('Initialize');
  },

  onBeforeStart: function() {
    this.model = new MyModel(this.getOption('data'));
  },

  onStart: function() {
    this.showView(new MyView({model: this.model}));
    Bb.history.start();
  }
});

const myApp = new MyApp(options);
myApp.start();
```

[Live example](https://jsfiddle.net/marionettejs/ny59rs7b/)

As we'll see below, the `options` object is passed into the Application as an
argument to `start`.

## Starting An Application

Once you have your application configured, you can kick everything off by
calling: `myApp.start(options)`.

This function takes a single optional parameter. This parameter will be passed
to each of your initializer functions, as well as the initialize events. This
allows you to provide extra configuration for various parts of your app throughout the
initialization sequence.

```javascript
import Bb from 'backbone';
import { Application } from 'backbone.marionette';

const MyApp = Application.extend({
  region: '#root-element',

  initialize: function(options) {
    console.log('Initialize');
  },

  onBeforeStart: function(app, options) {
    this.model = new MyModel(options.data);
  },

  onStart: function(app, options) {
    this.showView(new MyView({model: this.model}));
    Bb.history.start();
  }
});

const myApp = new MyApp();

myApp.start({
  data: {
    id: 1,
    text: 'value'
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/k05dctyt/)

## Application Region

An `Application` provides a single region for attaching a view tree.
The `region` property can be [defined in multiple ways](./marionette.region.md#defining-regions)

```javascript
import { Application } from 'backbone.marionette';
import RootView from './views/root';

const MyApp = Application.extend({
  region: '#root-element',

  onStart: function() {
    this.showView(new RootView());
  }
});

const myApp = new MyApp();
myApp.start();
```

[Live example](https://jsfiddle.net/marionettejs/uzc8or6u/)

This will immediately render `RootView` and fire the usual triggers such as
`before:attach` and `attach` in addition to the `before:render` and `render`
triggers.

`region` can also be passed as an option during instantiation.

### `regionClass`

By default the [`Region`](./marionette.region.md) is used to instantiate the `Application`'s region.
An extended Region can be provided to the `Application` definition to override the default.

```javascript
import { Application, Region } from 'backbone.marionette';

const MyRegion = Region.extend({
  isSpecial: true
});

const MyApp = Application.extend({
  regionClass: MyRegion
});

const myApp = new Application({ region: '#foo' });

myApp.getRegion().isSpecial; // true
```

`regionClass` can also be passed as an option during instantiation.

## Application Region Methods

The Marionette Application provides helper methods for managing its attached region.

### `getRegion()`

Return the attached [region object](./marionette.region.md) for the Application.

### `showView(View)`

Display `View` in the region attached to the Application. This runs the [`View lifecycle`](./viewlifecycle.md).

### `getView()`

Return the view currently being displayed in the Application's attached
`region`. If the Application is not currently displaying a view, this method
returns `undefined`.

