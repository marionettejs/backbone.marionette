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
var Radio = require('backbone.radio');

var notifyChannel = Radio.channel('notify');

var NotificationView = Mn.View.extend({
  initialize: function() {
    this.listenTo(notifyChannel, 'show:success', this.showSuccessMessage);
    this.listenTo(notifyChannel, 'show:error', this.showErrorMessage);
  },

  showSuccessMessage: function(message) {
    // ...
  },

  showErrorMessage: function(message) {
    // ...
  }
});
```

In an unrelated module:

```javascript
var Radio = require('backbone.radio');

var notifyChannel = Radio.channel('notify');

// The following will call NotificationView.showErrorMessage(message)
notifyChannel.trigger('show:error', 'A generic error occurred!');
```

In addition to this documentation, the Radio documentation can be found on
[Github](https://github.com/marionettejs/backbone.radio).

## Documentation Index

* [Event](#event)
* [Request](#request)
* [Channel](#channel)

## Event

## Request

## Channel
