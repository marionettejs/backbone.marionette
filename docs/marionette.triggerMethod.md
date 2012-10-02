# Marionette.triggerMethod

Trigger an event and a corresponding method on the target object.

When an event is triggered, the first letter of each section of the 
event name is capitalized, and the word "on" is tagged on to the front 
of it. Examples:

* `triggerMethod("render")` fires the "onRender" function
* `triggerMethod("before:close")` fires the "onBeforeClose" function

All arguments that are passed to the triggerMethod call are passed along to both the event and the method, with the exception of the event name not being passed to the corresponding method.

`triggerMethod("foo", bar)` will call `onFoo: function(bar){...})`

