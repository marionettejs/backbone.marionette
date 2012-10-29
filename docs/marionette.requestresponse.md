# Marionette.RequestResponse

An application level request/response system. This allows components in
an application to request some information or work be done by another
part of the app, but without having to be explicitly coupled to the 
component that is performing the work.

A return response is expected when making a request.

Facilitated by [Backbone.Wreqr](https://github.com/marionettejs/backbone.wreqr)'s 
RequestResponse object.

## Documentation Index

* [Register A Request Handler](#register-a-request-handler)
* [Request A Response](#request-a-response)
* [Remove / Replace A Request Handler](#remove--replace-a-request-handler)

## Register A Request Handler

To register a command, call `App.reqres.addHandler` and provide a name for
the command to handle, and a callback method.

```js
var App = new Marionette.Application();

App.reqres.addHandler("foo", function(bar){
  return bar + "-quux";
});
```

## Request A Response

To execute a command, either call `App.reqres.request` or the more direct
route of `App.request`, providing the name of the command to execute and
any parameters the command needs:

```js
App.request("foo", "baz"); // => returns "baz-quux"
```

## Remove / Replace A Request Handler

To remove a request handler, call `App.reqres.removeHandler` and provide the
name of the request handler to remove. 

To remove all request handlers, call `App.reqres.removeAllHandlers()`.

To replace a request handler, simply register a new handler for an existing
request handler name. There can be only one request handler 
for a given request name.
