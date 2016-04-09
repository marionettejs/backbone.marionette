# Backbone Radio

The Backbone Radio provides easy support for a number of messaging patterns for
Backbone and Marionette. This is provided through two basic constructs:

* Events - trigger events on a global object
* Requests - a global request/reply implementation

Radio takes these two constructs and adds the channel implementation - providing
namespaces for events and requests. In short, Radio is a global, namespaced,
message bus system designed to allow two otherwise unrelated objects to
communicate and share information.

Let's look at a simplified example in Marionette:

```javascript
var Marionette = require('backbone.marionette');

var NotificationHandler = Marionette.Object.extend({
  channelName: 'notify',

  radioRequests: {
    'show:success': 'showSuccessMessage',
    'show:error': 'showErrorMessage'
  },

  radioEvents: {
    'user:logged:in': 'showProfileButton',
    'user:logged:out': 'hideProfileButton'
  },

  showSuccessMessage: function(message) {
    // ...
  },

  showErrorMessage: function(message) {
    // ...
  },

  showProfileButton: function(user) {
    // ...
  },

  hideProfileButton: function(user) {
    // ...
  }
});
```

In an unrelated module:

```javascript
var Radio = require('backbone.radio');
var User = require('./models/user');

var notifyChannel = Radio.channel('notify');
var userModel = new User();

// The following will call Notification.showErrorMessage(message)
notifyChannel.request('show:error', 'A generic error occurred!');

// The following will call Notification.showProfileButton(user)
notifyChannel.trigger('user:logged:in', userModel);
```

In addition to this documentation, the Radio documentation can be found on
[Github](https://github.com/marionettejs/backbone.radio).

In addition to the standard documentation, the Radio has been integrated in
Marionette 3 to provide clearer interfaces to the existing API. This is detailed
in the documentation below. Anything that extends from `Marionette.Object` has
access to this API.

## Documentation Index

* [Channel](#channel)
  * [Assigning Channels to Objects](#assigning-channels-to-objects)
* [Event](#event)
  * [Listening to Events on Objects](#listening-to-events-on-objects)
  * [When to use Events](#when-to-use-events)
* [Request](#request)
  * [Returning Values from Reply](#returning-values-from-reply)
  * [Listening to Requests on Objects](#listening-to-requests-on-objects)
  * [When to use Requests](#when-to-use-requests)

## Channel

The `channel` is the biggest reason to use `Radio` as our event aggregator - it
provides a clean point for dividing global events. To retrieve a channel, use
`Radio.channel(channelName)`:

```javascript
var Radio = require('backbone.radio');

var myChannel = Radio.channel('basic');

myChannel.on('some:event', function() {
  // ...
});
```

The channel is accessible everywhere in your application. Simply import Radio
and call `channel()` to add listeners, fire callbacks, or send requests.

```javascript
var Radio = require('backbone.radio');

var someChannel = Radio.channel('basic');  // Exactly the same channel as above

someChannel.trigger('some:event');  // Will fire the function call above
```

### Assigning Channels to Objects

As of Marionette 3, it is now possible to assign Radio channels directly to
instances of `Marionette.Object` and assign listeners. To assign a channel, we
use the `channelName` attribute. We then retrieve the channel instance with
`getChannel()`:

```javascript
var Marionette = require('backbone.marionette');

var ChannelHandler = Marionette.Object.extend({
  channelName: 'basic',

  initialize: function() {
    var channel = this.getChannel();
    this.listenTo(channel, 'log', this.logMsg);
  },

  showAlertMessage: function(msg) {
    console.log(msg);
  }
})
```

## Event

The `Radio Event` works almost exactly the same way as regular `Backbone Events`
like model/collection events. They also expose exactly the same API:

* `channel.on('event', callback, context)` - when `event` fires, call `callback`
* `channel.off('event')` - stop listening to event
* `channel.trigger('event', ..args)` - fires `event` and passes  args into the
  resulting `callback`

Events are typically used to alert other parts of the system that something
happened. For example, a user login expired or the user performed a specific
action.

As the Radio can be imported anywhere, we can use it as a global event
aggregator as such:

```javascript
var Radio = require('backbone.radio');

var myChannel = Radio.channel('star');

myChannel.on('left:building', function(person) {
  console.log(person.get('name') + ' has left the building!');
});

var elvis = new Backbone.Model({name: 'Elvis'});
myChannel.trigger('left:building', elvis);

myChannel.off('left:building');
```

Just like Backbone Events, the Radio respects the `listenTo` handler as well:

```javascript
var Marionette = require('backbone.marionette');
var Radio = require('backbone.radio');


var Star = Marionette.Object.extend({
  initialize: function() {
    var starChannel = Radio.channel('star');

    this.listenTo(starChannel, 'left:building', this.leftBuilding);
  },

  leftBuilding: function(person) {
    console.log(person.get('name') + ' has left the building!');
  }
});
```

As with Backbone, this will bind `this` to our `Star` instance. See the
[Backbone documentation](http://backbonejs.org/#Events) for the full list of
Event handling methods.

### Listening to Events on Objects

The `Marionette.Object` class provides bindings to provide automatic event
listeners on your object instances. This works with a bound `channelName` to let
us provide listeners using the `radioEvents` attributes.

```javascript
var Marionette = require('backbone.marionette');


var Star = Marionette.Object.extend({
  channelName: 'star',

  radioEvents: {
    'left:building': 'leftBuilding'
  },

  leftBuilding: function(person) {
    console.log(person.get('name') + ' has left the building!');
  }
});
```

This gives us a clear definition of how this object interacts with the `star`
radio channel.

### When to use Events

The Event is a simple notification that _something happened_ and you may or may
not want other objects in your application to react to that. A few key
principles to bear in mind are:

* If you don't know what could act on the event, or don't care, use an `Event`
* If you find yourself calling it an action that occurred, use an `Event`
* If it's fine for many objects to perform an action, use an `Event`
* If you don't mind that no objects react, use an `Event`

If your use case isn't covered here, consider whether you want to
[use a request](#when-to-use-requests) instead.

## Request

The Request API provides a uniform way for unrelated parts of the system to
communicate with each other. For example, displaying notifications in response
to system activity. To attach a listener to a request channel, use `reply` or
`replyOnce` to attach a listener that immediately detaches after one call.

As with request, any arguments passed in `channel.request` will be passed into
the callback.

```javascript
var Marionette = require('backbone.marionette');
var Radio = require('backbone.radio');

var channel = Radio.channel('notify');

var Notification = Marionette.Object.extend({
  initialize: function() {
    channel.reply('show:success', this.showSuccessMessage);
    channel.reply('show:error', this.showErrorMessage);
  },

  showSuccessMessage: function(msg) {
    // ...
  },

  showErrorMessage: function(msg) {
    // ...
  }
});
```

So, for example, when a model sync fails:

```javascript
var Marionette = require('backbone.marionette');
var Radio = require('backbone.radio');

var channel = Radio.channel('notify');

var ModelView = Marionette.View.extend({
  modelEvents: {
    error: 'showErrorMessage'
  },

  showErrorMessage: function() {
    channel.request('show:error', 'An error occurred contacting the server');
  }
});
```

Now, whenever the model attached to this View is unable to sync with the server,
we can display an error message to the user.

### Returning Values from Reply

The Request API is also able to return values, making it extremely useful for
accessing objects that would be otherwise difficult to access. As an example,
let's assume we attach the currently logged-in user to the `Application` object
and we want to know if they're still logged-in.

```javascript
var Marionette = require('backbone.marionette');
var Radio = require('backbone.radio');

var channel = Radio.channel('user');

var App = Marionette.Application.extend({
  initialize: function() {
    channel.reply('user:logged:in', this.isLoggedIn);
  },

  isLoggedIn: function() {
    return this.model.getLoggedIn();
  }
});
```

Then, from another view, instead of trying to find the User model. we simply
`request` it:

```javascript
var Radio = require('backbone.radio');

var channel = Radio.channel('user');

var loggedIn = channel.request('user:logged:in');  // App.model.getLoggedIn()
```

### Listening to Requests on Objects

Marionette 3 integrates Request/Reply directly onto its `Object` class through
`radioRequests`. This will simplify the `Notification` quite a bit:

```javascript
var Marionette = require('backbone.marionette');

var Notification = Marionette.Object.extend({
  channelName: 'notify',

  radioRequests: {
    'show:success': 'showSuccessMessage',
    'show:error': 'showErrorMessage'
  },

  showSuccessMessage: function(msg) {
    // ...
  },

  showErrorMessage: function(msg) {
    // ...
  }
});
```

We now have a clear API for communicating with the `Notification` across the
application. Don't forget to define the `channelName` on your `Object`
definition.

As with a normal request/reply, we can return values from these bound handlers:

```javascript
var Marionette = require('backbone.marionette');

var App = Marionette.Application.extend({
  channelName: 'user',

  radioRequests: {
    'user:logged:in': 'isLoggedIn'
  },

  isLoggedIn: function() {
    return this.model.getLoggedIn();
  }
});
```

As above, define your `channelName` attribute, then simply add the `reply`
handler to `radioRequests` to bind it to your `Object` (`Application` in this
case).

### When to use Requests

A Request is, as you might guess, a request for information or for something to
happen. You will probably want to use requests when:

* You call the request an action to perform e.g. `show:notification`
* You want to get the return value of the request
* You want to call _exactly one_ function
