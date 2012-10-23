# Marionette.commands

An application level command execution system. This allows components in
an application to state that some work needs to be done, but without having
to be explicitly coupled to the component that is performing the work.

No response is allowed from the execution of a command. It's a "fire-and-forget"
scenario.

Facilitated by [Backbone.Wreqr](https://github.com/marionettejs/backbone.wreqr)'s 
Commands object.

## Documentation Index

* [Register A Command](#register-a-command)
* [Execute A Command](#execute-a-command)
* [Remove / Replace Commands](#remove--replace-commands)

## Register A Command

To register a command, call `App.commands.register` and provide a name for
the command to handle, and a callback method.

```js
var App = new Marionette.Application();

App.commands.register("foo", function(bar){
  console.log(bar);
});
```

## Execute A Command

To execute a command, either call `App.commands.execute` or the more direct
route of `App.execute`, providing the name of the command to execute and
any parameters the command needs:

```js
App.execute("foo", "baz");
// outputs "baz" to the console, from command registered above
```

## Remove / Replace Commands

To remove a command, call `App.commands.removeHandler` and provide the
name of the command to remove. 

To remove all commands, call `App.commands.removeAllHandlers()`.

To replace a command, simply register a new handler for an existing
command name. There can be only one command handler for a given command name.
