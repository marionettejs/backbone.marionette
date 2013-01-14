## Upgrade from v1.0.0-rc2 to v1.0.0-rc3

There are several breaking changes that occurred between v1.0.0-rc2 and
v1.0.0-rc3 that need special attention. Please use this upgrade guide
as a list of things that you need to account for when updating.

In general, you need to grab the latest version of Backbone, Underscore,
and Backbone.Wreqr.

### Backbone v0.9.2 no longer supported

First and foremost, with the release of Backbone v0.9.9, we are no
longer supporting Backbone v0.9.2. There are several additions to
v0.9.9 that have made code previously found in Marionette's pre-requisites
obselete. This has caused a ripple effect of API changes for
naming consistency in Marionette. 

In order to use Marionette v1.0.0-rc3, you must upgrade to Backbone
v0.9.9 and Underscore v1.4.3 or higher (as necessary, with Backbone
versions).

### Backbone.EventBinder is now obselete

With Backbone v0.9.9, the Backbone.EventBinder pre-requisite is now
osbsolete. It will be kept around for backward compatibility with
older versions of Marionette and Backbone, but it is no longer used
by Marionette directly. Unless you have a significant investment in
it's use, you should discontinue it's use when ugprading to Marionette
v1.0.0-rc3. 

To replace the use of Backbone.EventBinder in your Marionette applications,
you have two choices: 

1. Mix Backbone.Events in to your objects directly
2. Use Backbone.Wreqr.EventAggregator

With the introduction of `.listenTo` and `.stopListening` to Backbone.Events,
the need for Backbone.EventBinder is no longer there. You can either
use `_.extend(myObject, Backbone.Events)` to mix in Backbone.Events
directly, or you can use an instance of `Backbone.Wreqr.EventAggregator`
to replace your Backbone.EventBinder instances, directly.

Along with this dependency being obsolete now, you should make the
following changes:

* Replace `bindTo` with `listenTo`
* Replace `unbindAll` with `stopListening`
* Remove calls to `unbindFrom` as this has no equivalent
