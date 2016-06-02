**_These docs are for Marionette 3 which is still in pre-release. Some parts may
not be accurate or up-to-date_**

# Marionette Events

The Marionette Event system provides a system for objects to communicate with
each other in a uniform way. In Marionette, this typically involves objects
(models, collections, and views) triggering events that other objects
(typically views) listen to and act on.

This section will mostly deal with View events and the semantics and methods of
responding to events.

**This section will not cover events from models and collections. See the
[documentation for View](./marionette.view.md#model-and-collection-events).**

## Documentation Index

* [Triggering and Listening to Events](#triggering-and-listening-to-events)
  * [View `triggerMethod`](#view-triggermethod)
  * [Listening to Events](#listening-to-events)
    * [Magic Method Binding](#magic-method-binding)
* [Managing View Children](#managing-view-children)
  * [Event Bubbling](#event-bubbling)
* [Lifecycle Events](#lifecycle-events)
