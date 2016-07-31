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
* [onRoute](#onroute)

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
`showEmail` will be called. This will be covered in more detail below.

## Configure Routes

The AppRouter adds the `appRoutes` option that lets you determine actions to
occur
Configure an AppRouter with `appRoutes`. The route definition is passed on to Backbone's standard routing handlers. This means that you define routes like you normally would.  However, instead of providing a callback method that exists on the router, you provide a callback method that exists on the controller, which you specify for the router instance (see below.)

```javascript
var Mn = require('backbone.marionette');

var MyRouter = Mn.AppRouter.extend({
  // "someMethod" must exist at controller.someMethod
  appRoutes: {
    "some/route": "someMethod"
  },

  /* standard routes can be mixed with appRoutes/Controllers above */
  routes : {
	"some/otherRoute" : "someOtherMethod"
  },
  someOtherMethod : function(){
	// do something here.
  }

});
```

You can also add standard routes to an AppRouter with methods on the router.

### Configure Routes In Constructor

Routes can be defined through the constructor function options, as well.

```javascript
var Mn = require('backbone.marionette');

var MyRouter = new Mn.AppRouter({
  controller: myController,
  appRoutes: {
    "foo": "doFoo",
    "bar/:id": "doBar"
  }
});
```

This allows you to create router instances without having to `.extend`
from the AppRouter. You can just create the instance with the routes defined
in the constructor, as shown.

### Add Routes At Runtime

In addition to setting the `appRoutes` for an AppRouter, you can add app routes
at runtime, to an instance of a router. This is done with the `appRoute()`
method call. It works the same as the built-in `router.route()` call from
Backbone's Router, but has all the same semantics and behavior of the `appRoutes`
configuration.

```javascript
var Mn = require('backbone.marionette');

var MyRouter = Mn.AppRouter.extend({});

var router = new MyRouter();
router.appRoute("/foo", "fooThat");
```
Also you can specify a controller with the multiple routes at runtime with method
`processAppRoutes`. However, In this case the current controller of `AppRouter` will not change.

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

... or in a parameter to the constructor:

```js
var myObj = {
  someMethod: function(){ /*...*/ }
};

new MyRouter({
  controller: myObj
});
```

The object that is used as the `controller` has no requirements, other than it will
contain the methods that you specified in the `appRoutes`.

It is recommended that you divide your controller objects into smaller pieces of related functionality
and have multiple routers / controllers, instead of just one giant router and controller.

### Using Marionette.Object

A controller can also be an instance of
[`Marionette.Object`](./marionette.object.md) - this is useful for cases where
you want to access the helper tools of the Object API.

## onRoute

If it exists, AppRouters will call the `onRoute` method whenever a user navigates within your app. The
callback receives three arguments: the name, path, and arguments of the route.

[backbone-router]: http://backbonejs.org/#Router
