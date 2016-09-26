# Common Marionette Functionality

Marionette has a few methods that are common to all classes.
These functions are documented in [marionette.functions](./marionette.functions.md).

* [extend](./marionette.functions.md#marionetteextend)
  - An alias of Backbone's `extend`.
* [mergeOptions](./marionette.functions.md#marionettemergeoptions)
  - A handy function to pluck certain `options` and attach them directly to an instance.
* [getOption](./marionette.functions.md#marionettegetoption)
  - Retrieve an object's attribute either directly from the object, or from the object's `this.options`.
* [triggerMethod](./marionette.functions.md#marionettetriggermethod)
  - Trigger an event and a corresponding method on the target object.
* [bindEvents](./marionette.functions.md#marionettebindevents)
  - This method is used to bind a backbone "entity" to methods on a target object.
* [unbindEvents](./marionette.functions.md#marionetteunbindevents)
  - This method can be used to unbind callbacks from entities' events.
* [normalizeMethods](./marionette.functions.md#marionettenormalizemethods)
  - Receives a hash of event names and functions and/or function names, and returns the same hash with the function names replaced with the function references themselves.
