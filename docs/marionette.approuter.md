**_These docs are for Marionette 3 which is still in pre-release. Some parts may
not be accurate or up-to-date_**

# Marionette.AppRouter

The Marionette `AppRouter` extends the [`Backbone.Router`][backbone-router] to
make it easier to construct a large number of routes for your app. This is
particularly useful if you want to build a large single-page app while keeping
your router's core logic readable.

## Documentation Index

* [Using the AppRouter](#using-the-approuter)
* [Configure Routes](#configure-routes)
  * [Configure Routes In Constructor](#configure-routes-in-constructor)
  * [Add Routes At Runtime](#add-routes-at-runtime)
* [Specify A Controller](#specify-a-controller)
  * [Using Marionette.Object](#using-marionette-object)
* [Multiple Routers](#multiple-routers)
* [Backbone History](#backbone-history)
* [Handling Route Changes](#handling-route-changes)

## Using the AppRouter

The Marionette AppRouter is typically used to set up your app when the user
loads a specific endpoint directly. Typically, in a single-page app, users will
expect to be able to easily navigate back to a section of the application by
bookmarking a URL and loading it directly. Let's look at a concrete example:

```javascript
var Mn = require('backbone.marionette');

var EmailController = {
  showEmail: function(email) {
    // Look up the email and display it in our main layout
  }
};

var EmailRouter = Mn.AppRouter.extend({
  controller: EmailController,

  appRoutes: {
    'emails/:email': 'showEmail'
  }
});
```

Assuming our application is served from the root, whenever the user accesses
`http://ourapplication.com/#emails/email-subject-line-123`, the method
`showEmail` will be called with `email-subject-line-123` as its argument. This
will be covered in more detail below.

## Configure Routes

The AppRouter uses the `appRoutes` option to define how we respond to routes
being accessed. To define routes, set the route as your key and the method to
call as a string referencing a method on your controller. For more information
on route definitions, see the [Backbone documentation][#backbone-routes].

The major difference between `appRoutes` and `routes` is that we provide
callbacks on a controller instead of directly on the router itself. This allows
you to define a simpler router and keep your controller logic closer to the
modules it interacts directly with:

```javascript
var Mn = require('backbone.marionette');
var EmailController = require('./emails/controller/email');

var MyRouter = Mn.AppRouter.extend({
  controller: EmailController,

  // "someMethod" must exist at controller.someMethod
  appRoutes: {
    'email': 'listEmails',
    'email/:email': 'showEmail'
  }
});
```

As the `AppRouter` extends `Backbone.Router`, you can also define a `routes`
attribute whose callbacks must be present on the `AppRouter`:

```javascript
var Mn = require('backbone.marionette');

var MyRouter = Mn.AppRouter.extend({
  routes: {
    'email/:email': 'showEmail'
  },

  showEmail: function(email) {
    // show the email
  }
})
```

See the [Backbone documentation][backbone-routes] for more information about
defining `routes`.

### Configure Routes In Constructor

If you want more control when managing your routes, you can define your routes
[on router instantiation][basics-instantiation]:

```javascript
var Mn = require('backbone.marionette');
var EmailController = require('./emails/controllers/email');

var MyRouter = new Mn.AppRouter({
  controller: EmailController,
  appRoutes: {
    'email/': 'listEmails',
    'email/:email': 'showEmail'
  }
});
```

### Add Routes At Runtime

In addition to setting the `appRoutes` for an AppRouter, you can add app routes
at runtime, to an instance of a router. This is done with the `appRoute()`
method call. It works the same as the built-in `router.route()` call from
Backbone's Router, but has all the same semantics and behavior of the
`appRoutes` configuration.

```javascript
var Mn = require('backbone.marionette');

var MyRouter = Mn.AppRouter.extend({});

var router = new MyRouter();
router.appRoute("/foo", "fooThat");
```

Also you can specify a controller with the multiple routes at runtime with  the
`processAppRoutes` method. This will preserve the existing controller as well:

```javascript
var Mn = require('backbone.marionette');

var MyRouter = Mn.AppRouter.extend({});

var router = new MyRouter();
router.processAppRoutes(myController, {
  "foo": "doFoo",
  "bar/:id": "doBar"
});
```

## Specify A Controller

App routers can only use one `controller` object. You can either specify this
directly in the router definition:

```javascript
var Mn = require('backbone.marionette');

var someController = {
  someMethod: function(){ /*...*/ }
};

Mn.AppRouter.extend({
  controller: someController
});
```

The object that is used as the `controller` has no requirements, other than it
will contain the methods that you specified in the `appRoutes`.

### Using Marionette.Object

A controller can also be an instance of
[`Marionette.Object`](./marionette.object.md) - this is useful for cases where
you want to access the helper tools of the Object API and pass through
information on instantiation.

## Multiple Routers

Marionette allows you to run multiple AppRouters in a single application. It's
recommended that you break your routing into multiple sections, each with its
own router and/or controller setting up the views for their own components. This
will make it much easier to find and manage your route-handling logic as your
application grows in complexity.

## Backbone History

The [Backbone History API][backbone-history] monitors the browser's location bar
and triggers route changes on your app routers. It also provides a set of
methods to change the contents of the location bar manually when you want to
expose functionality to your user via a URL:

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var EmailView = require('./email/views/email');

var EmailList = Mn.View.extend({
  regions: {
    layout: '.layout-hook'
  },

  showEmail: function(model) {
    this.showChildView('layout', new EmailView({model: model}));
    Bb.history.navigate('email/' + model.id);
  }
});
```

As stated in the Backbone documentation, `navigate` takes an `options` argument
that lets you `trigger` on route change. We recommend against using this as it
tends to cause side-effects like making it hard to ensure the route is only
navigated to once, or unintentionally firing different route changes.

## Handling Route Changes

When the user navigates to a new route in your application that matches a route
in your `AppRouter`, the `route` event will be fired. Listening to this will let
you perform extra custom behavior:

```javascript
var Mn = require('backbone.marionette');
var Controller = require('./email/controller');

var MyRouter = Mn.AppRouter.extend({
  controller: Controller,

  appRoutes: {
    'emails/:email': 'showEmail'
  },

  onRoute: function(name, path, args) {
    console.log('User navigated to ' + path);
  }
});
```

This event handler takes three arguments:

1. `name` - Name of the route
2. `path` - Path that triggered this event
3. `args` - Arguments passed into the route

[backbone-history]: http://backbonejs.org/#History
[backbone-router]: http://backbonejs.org/#Router
[backbone-routes]: http://backbonejs.org/#Router-routes
[basics-instantiation]: ./basics.md#binding-attributes-on-instantiation
