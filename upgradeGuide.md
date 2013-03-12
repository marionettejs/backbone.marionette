## Upgrade to v1.0.0

In addition to the following notes, please see previous upgrade guide entries and the 
[changelog](https://github.com/marionettejs/backbone.marionette/blob/master/changelog.md).

### Wreqr v0.2.0

This update renames the `addHandler` methods to `setHandler` to help
set the expectation that there is a single handler for any given
command or request/response handler. When updating to Wreqr v0.2.0,
you will need to change all calls to `addHandler` to `setHandler`. For
more information on other changes in Wreqr, see the
[Wreqr changelog](https://github.com/marionettejs/backbone.wreqr/blob/master/CHANGELOG.md).

### Grunt v0.4

Grunt v0.4 has a significantly different architecture than previous versions. If
you are building Marionette and/or running the specs from your local computer, you
will need to update to the latest version of Grunt v0.4 to do so. 

See the
[getting started guide for Grunt](http://gruntjs.com/getting-started).

Once you have done that, you should be able to run Grunt to get things rolling.

### Marionette.createObject

This method has been removed. It was never used by Marionette directly,
and you should replace it's use with a proper polyfill such as Modernizr.

## Upgrade to v1.0.0-rc4

RC4 is mostly bug fixes and zombie killing. There are a few
things that you need to pay attention to, though. Check the
[changelog](https://github.com/marionettejs/backbone.marionette/blob/master/changelog.md)
for a more complete list.

### Marionette.addEventBinder Function Has Been Removed

The method `Marionette.addEventBinder` has been removed
entirely. If you were using this method call in your code,
you will need to delete that line of code.

The replacement for this is simply Backbone.Events, which
has the necessary `.listenTo` and `.stopListening` methods,
as noted in previous upgrade guide entries. 

The `addEventBinder` had provided a 4th `context` parameter
to the `.listenTo` and `.stopListening` methods, in anticipation
of Backbone adding these in a future release. After further
discussion and research, though, I realized that this parameter
is not needed. Further, Backbone is not going to be adding this
parameter any time soon. There has not been a clear need for
it. 

### Marionette.EventAggregator Object Has Been Removed

The `Marionette.EventAggregator` object did nothing more than
import `Backbone.Wreqr.EventAggregator` in to the Marionette
namespace. This has been removed as it added no value. Replace 
all uses of `Marionette.EventAggregator` with 
`Backbone.Wreqr.EventAggregator`.

## Upgrade v1.0.0-rc3 to Backbone v0.9.10 and jQuery v1.9.0

This is a simple update:

* Update Backbone to v0.9.10
* Update jQuery to v1.9.0

Note that there are no changes in Marionette for this minor. 
You should not have to change any Marionette specific code 
to update your app. You may have to change code that core 
Backbone runs, or that jQuery runs, though. This includes 
any core Backbone features that are included in Marionette, 
such as the use of the `view.make` function which is no 
longer included in Backbone.View. 

For more information on what you may need to change, see
the change logs for 
[Backbone v0.9.10](http://backbonejs.org/#changelog)
and the upgrade guide for [jQuery v1.9.0](http://jquery.com/upgrade-guide/1.9/)

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

### Marionette.Async is no longer supported

The Marionette.Async library was a mistake from the start. It advocated
bad practices by making the View layer responsible for the knowledge
of application workflow. I'm happy to say that it has been removed
from Marionette and is no longer supported. 

If your app currently relies on Marionette.Async, I suggest re-thinking
the architecture before upgrading to Marionette v1.0.0-rc3 or later. Specifically,
move any logic that deals with asynchronous calls, and workflow / process
logic out of your views and in to a Marionette.Controller or other object
that can properly coordinate the efforts.

For example, loading a model before displaying it:

```js
Marionette.Controller.extend({
  showById: function(id){
    var model = new MyModel({
      id: id
    });

    var promise = model.fetch();

    $.when(promise).then(_.bind(this.showIt, this));
  },

  showIt: function(model){
    var view = new MyView({
      model: model
    });

    MyApp.myRegion.show(view);
  }
});
```
