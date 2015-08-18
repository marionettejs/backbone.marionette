# Features

Marionette Features are opt-in functionality. That you can enable by setting `Marionette.Features` in your app.

##### Goals:
+ make it possible to add breaking changes in a minor release
+ give community members a chance to provide feedback for new functionality


##### Features:
+ class

### Class

Class is a new Marionette base class built on top of Metal.Class.
Class will replace Marionette.Object and have native support for Metal.class functionality like \_super.

Class updates the Marionette class hierarchy.
Class ensures that every class is a subclass of Marionette.Class, even Backbone classes like Backbone.View.
