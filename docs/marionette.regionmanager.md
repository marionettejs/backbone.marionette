# Marionette.RegionManager

Region managers provide a consistent way to manage
a number of Marionette.Region objects within an
application. The RegionManager is intended to be
used by other objects, to facilitate the addition,
storage, retrieval, and removal of regions from
that object. For examples of how it can be used,
see the [Marionette.Application](./marionette.application.md) and [Marionette.LayoutView](./marionette.layoutview.md)
objects.

## Documentation Index

* [Basic Use](#basic-use)
* [RegionManager.addRegion](#regionmanageraddregion)
* [RegionManager.addRegions](#regionmanageraddregions)
  * [addRegions default options](#addregions-default-options)
* [RegionManager.get](#regionmanagerget)
* [RegionManager.removeRegion](#regionmanagerremoveregion)
* [RegionManager.removeRegions](#regionmanagerremoveregions)
* [RegionManager.destroyRegions](#regionmanagerdestroyregions)
* [RegionManager.destroy](#regionmanagerdestroy)
* [RegionManager Events](#regionmanager-events)
  * [region:add event](#regionadd-event)
  * [region:remove event](#regionremove-event)
* [RegionManager Iterators](#regionmanager-iterators)

## Basic Use

RegionManagers can be instantiated directly, and can
have regions added and removed via several methods:

```js
var rm = new Marionette.RegionManager();

var region = rm.addRegion("foo", "#bar");

var regions = rm.addRegions({
  baz: "#baz",
  quux: "ul.quux"
});

regions.baz.show(myView);

rm.removeRegion("foo");
```

## RegionManager.addRegion

Regions can be added individually using the `addRegion`
method. This method takes two parameters: the region name
and the region definition.

```js
var rm = new Marionette.RegionManager();

var region = rm.addRegion("foo", "#bar");
```

In this example, a region named "foo" will be added
to the RegionManager instance. It is defined as a
jQuery selector that will search for the `#bar`
element in the DOM.

There are a lot of other ways to define a region,
including object literals with various options, and
instances of Region objects. For more information
on this, see the Region documentation.

## RegionManager.addRegions

Regions can also be added en-masse through the use
of the `addRegions` method. To use this method,
pass an object literal that contains the names of
the regions as keys, and the region definitions as
values.

```js
var rm = new Marionette.RegionManager();

var regions = rm.addRegions({
  foo: "#bar",
  bar: {
    selector: "#quux",
    regionClass: MyRegionClass
  }
});

regions.foo; //=> the "foo" region instance
regions.bar; //=> the "bar" region instance
```

This method returns an object literal that contains
all of the named region instances.

### addRegions default options

When adding multiple regions it may be useful to
provide a set of defaults that get applied to all
of the regions being added. This can be done through
the use of a `defaults` parameter. Specify this
parameter as an object literal with `key: value`
pairs that will be applied to every region added.

```js
var rm = new Marionette.RegionManager();

var defaults = {
  regionClass: MyRegionClass
};

var regions = {
  foo: "#bar",
  baz: "#quux"
};

rm.addRegions(regions, defaults);
```

In this example, all regions will be added as
instances of `MyRegionClass`.

## RegionManager.get

A region instance can be retrieved from the
RegionManager instance using the `get` method and
passing in the name of the region.

```js
var rm = new Marionette.RegionManager();
rm.addRegion("foo", "#bar");

var region = rm.get("foo");
```

## RegionManager.removeRegion

A region can be removed by calling the `removeRegion`
method and passing in the name of the region.

```js
var rm = new Marionette.RegionManager();
rm.addRegion("foo", "#bar");

rm.removeRegion("foo");
```

A region will have its `destroy` method called before
it is removed from the RegionManager instance and
`stopListening` is called.

## RegionManager.removeRegions

You can quickly remove all regions from the
RegionManager instance by calling the `removeRegions`
method.

```js
var rm = new Marionette.RegionManager();
rm.addRegions({
  foo: "#foo",
  bar: "#bar",
  baz: "#baz"
});

rm.removeRegions();
```

This will destroy all regions, and remove them.

## RegionManager.destroyRegions

You can quickly destroy all regions from the RegionManager
instance by calling the `destroyRegions` method.

```js
var rm = new Marionette.RegionManager();
rm.addRegions({
  foo: "#foo",
  bar: "#bar",
  baz: "#baz"
});

rm.destroyRegions();
```

This will destroy the regions without removing them
from the RegionManager instance.

## RegionManager.destroy

A RegionManager instance can be destroyd entirely by
calling the `destroy` method. This will both destroy
and remove all regions from the RegionManager instance.

```js
var rm = new Marionette.RegionManager();
rm.addRegions({
  foo: "#foo",
  bar: "#bar",
  baz: "#baz"
});

rm.destroy();
```

## RegionManager Events

A RegionManager will trigger various events as it
is being used.

### region:add event

The RegionManager will trigger a "region:add"
event when a region is added to the manager. This
allows you to use the region instance immediately,
or attach the region to an object that needs a
reference to it:

```js
var rm = new Marionette.RegionManager();

rm.on("region:add", function(name, region){

  // add the region instance to an object
  myObject[name] = region;

});

rm.addRegion("foo", "#bar");
```

### region:remove event

The RegionManager will trigger a "region:remove"
event when a region is removed from the manager.
This allows you to use the region instance one last
time, or remove the region from an object that has a
reference to it:

```js
var rm = new Marionette.RegionManager();

rm.on("region:remove", function(name, region){

  // add the region instance to an object
  delete myObject[name];

});

rm.addRegion("foo", "#bar");

rm.removeRegion("foo");
```

## RegionManager Iterators

The RegionManager has several methods for iteration
attached to it, from underscore.js. This works in the
same way as the Backbone.Collection methods that have
been imported. For example, you can easily iterate over
the entire collection of region instances by calling
the `each` method:

```js
var rm = new Marionette.RegionManager();

rm.each(function(region){
  // do stuff w/ the region instance here
});
```

The list of underscore methods includes:

* forEach
* each
* map
* find
* detect
* filter
* select
* reject
* every
* all
* some
* any
* include
* contains
* invoke
* toArray
* first
* initial
* rest
* last
* without
* isEmpty
* pluck
