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

## Documentation Index

* [Channel](#channel)
  * [Assigning Channels to Objects](#assigning-channels-to-objects)
* [Event](#event)
  * [Listening to Events on Objects](#listening-to-events-on-objects)
* [Request](#request)
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

As with Backbone, this will bind `this` to our `Star` instance.

### Listening to Events on Objects

The `Marionette.Object` class provides bindings to provide automatic event
listeners on your object instances.

## Request

### Listening to Requests on Objects
