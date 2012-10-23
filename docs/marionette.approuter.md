# Marionette.AppRouter

Reduce the boilerplate code of handling route events and then calling a single method on another object.
Have your routers configured to call the method on your object, directly.

## Documentation Index

* [Configure Routes](#configure-routes)
* [Specify A Controller](#specify-a-controller)

## Configure Routes

Configure an AppRouter with `appRoutes`. The route definition is passed on to Backbone's standard routing
handlers. This means that you define routes like you normally would. Instead of providing a callback
method that exists on the router, though, you provide a callback method that exists on the `controller`
that you specify for the router instance (see below).

```js
MyRouter = Backbone.Marionette.AppRouter.extend({
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

You can also add standard routes to an AppRouter, with methods on the router.

## Specify A Controller

App routers can only use one `controller` object. You can either specify this
directly in the router definition:

```js
someController = {
  someMethod: function(){ /*...*/ }
};

Backbone.Marionette.AppRouter.extend({
  controller: someController
});
```

Or in a parameter to the constructor:

```js
myObj = {
  someMethod: function(){ /*...*/ }
};

new MyRouter({
  controller: myObj
});
```

Or

The object that is used as the `controller` has no requirements, other than it will 
contain the methods that you specified in the `appRoutes`.

It is recommended that you divide your controller objects into smaller pieces of related functionality
and have multiple routers / controllers, instead of just one giant router and controller.


