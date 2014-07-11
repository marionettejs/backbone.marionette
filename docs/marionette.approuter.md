# Marionette.AppRouter

Reduce the boilerplate code of handling route events and then calling a single method on another object.
Have your routers configured to call the method on your object, directly.

## Documentation Index

* [Configure Routes](#configure-routes)
* [Configure Routes In Constructor](#configure-routes-in-constructor)
* [Add Routes At Runtime](#add-routes-at-runtime)
* [Specify A Controller](#specify-a-controller)
* [onRoute](#onroute)

## Configure Routes

Configure an AppRouter with `appRoutes`. The route definition is passed on to Backbone's standard routing handlers. This means that you define routes like you normally would.  However, instead of providing a callback method that exists on the router, you provide a callback method that exists on the controller, which you specify for the router instance (see below.)

```js
var MyRouter = Backbone.Marionette.AppRouter.extend({
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

## Configure Routes In Constructor

Routes can be defined through the constructor function options, as well.

```js
var MyRouter = new Marionette.AppRouter({
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

## Add Routes At Runtime

In addition to setting the `appRoutes` for an AppRouter, you can add app routes
at runtime, to an instance of a router. This is done with the `appRoute()`
method call. It works the same as the built-in `router.route()` call from
Backbone's Router, but has all the same semantics and behavior of the `appRoutes`
configuration.

```js
var MyRouter = Marionette.AppRouter.extend({});

var router = new MyRouter();
router.appRoute("/foo", "fooThat");
```
Also you can specify a controller with the multiple routes at runtime with method
`processAppRoutes`. However, In this case the current controller of `AppRouter` will not change.

```js
var MyRouter = Marionette.AppRouter.extend({});

var router = new MyRouter();
router.processAppRoutes(myController, {
  "foo": "doFoo",
  "bar/:id": "doBar"
});
```

## Specify A Controller

App routers can only use one `controller` object. You can either specify this
directly in the router definition:

```js
var someController = {
  someMethod: function(){ /*...*/ }
};

Backbone.Marionette.AppRouter.extend({
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

## onRoute

If it exists, AppRouters will call the `onRoute` method whenever a user navigates within your app. The
callback receives three arguments: the name, path, and arguments of the route.
