# Configuration

Marionette provides a set of configuration options that dictate the behavior of the framework as a whole.

## Documentation Index

* [Marionette.FEATURES](#marionettefeatures)
* [Marionette.VERSION](#marionetteversion)
* [Marionette.DEV_MODE](#marionettedevmode)


## Marionette.FEATURES

Marionette Features are opt-in functionality. That you can enable by setting `Marionette.FEATURES` in your app.

##### Goals:
+ make it possible to add breaking changes in a minor release
+ give community members a chance to provide feedback for new functionality


## Marionette.VERSION

Maintains a reference to the version of a Marionette instance. Marionette.VERSION is used by unit tests to direct users to the correctly versioned documentation when errors are thrown.


## Marionette.DEV_MODE

A boolean flag (default is ```false```) used by unit tests to handle calls to ```Marionette.deprecate()```. If the flag is set to ```true```, deprecation console warnings are issued at runtime.
