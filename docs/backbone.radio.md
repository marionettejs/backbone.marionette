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
var Mn = require('backbone.marionette');

var NotificationView = Mn.View.extend({
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

// The following will call NotificationView.showErrorMessage(message)
notifyChannel.request('show:error', 'A generic error occurred!');

// The following will call NotificationView.showProfileButton(user)
notifyChannel.trigger('user:logged:in', userModel);
```

In addition to this documentation, the Radio documentation can be found on
[Github](https://github.com/marionettejs/backbone.radio).

In addition to the standard documentation, the Radio has been integrated in
Marionette 3 to provide clearer interfaces to the existing API. This is detailed
in the documentation below. As always, anything that extends from
`Marionette.Object` has access to this API.

## Documentation Index

* [Channel](#channel)
  * [Assigning Channels to Objects](#assigning-channels-to-objects)
* [Event](#event)
  * [Listening to Events on Objects](#listening-to-events-on-objects)
* [Request](#request)
  * [Returning Values from Reply](#returning-values-from-reply)
  * [Listening to Requests on Objects](#listening-to-requests-on-objects)

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
var Mn = require('backbone.marionette');

var ChannelView = Mn.View.extend({
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
var Mn = require('backbone.marionette');
var Radio = require('backbone.radio');


var Star = Mn.Object.extend({
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
var Mn = require('backbone.marionette');


var Star = Mn.Object.extend({
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

## Request

The Request API provides a uniform way for unrelated parts of the system to
communicate with each other. For example, displaying notifications in response
to system activity. To attach a listener to a request channel, use `reply` or
`replyOnce` to attach a listener that immediately detaches after one call.

As with request, any arguments passed in `channel.request` will be passed into
the callback.

```javascript
var Mn = require('backbone.marionette');
var Radio = require('backbone.radio');

var channel = Radio.channel('notify');

var NotificationView = Mn.View.extend({
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
var Mn = require('backbone.marionette');
var Radio = require('backbone.radio');

var channel = Radio.channel('notify');

var ModelView = Mn.View.extend({
  modelEvents: {
    error: 'showErrorMessage'
  },

  showErrorMessage: function() {
    channel.request('show:error', 'An error occurred contacting the server');
  }
});
```

Now, whenever the model attached to this view is unable to sync with the server,
we can display an error message to the user.

### Returning Values from Reply

The Request API is also able to return values, making it extremely useful for
accessing objects that would be otherwise difficult to access. As an example,
let's assume we attach the currently logged-in user to the `Application` object
and we want to know if they're still logged-in.

```javascript
var Mn = require('backbone.marionette');
var Radio = require('backbone.radio');

var channel = Radio.channel('user');

var App = Mn.Application.extend({
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
`radioRequests`. This will simplify the `NotificationView` quite a bit:

```javascript
var Mn = require('backbone.marionette');

var NotificationView = Mn.View.extend({
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

We now have a clear API for communicating with the `NotificationView` across the
application. Don't forget to define the `channelName` on your `Object`
definition.

We can also return values from these handlers:

```javascript
var Mn = require('backbone.marionette');

var App = Mn.Application.extend({
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
