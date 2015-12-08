import Backbone           from 'backbone';
import {version}          from '../package.json';

import proxy              from './utils/_proxy';
import extend             from './utils/extend';
import isNodeAttached     from './utils/isNodeAttached';
import mergeOptions       from './utils/mergeOptions';
import getOption          from './utils/getOption';
import normalizeMethods   from './utils/normalizeMethods';
import deprecate          from './utils/deprecate';

import MonitorViewEvents  from './dom-refresh';
import MarionetteObject   from './object';
import Renderer           from './renderer';
import TemplateCache      from './template-cache';
import View               from './view';
import CollectionView     from './collection-view';
import CompositeView      from './composite-view';
import Behavior           from './behavior';
import Region             from './region';
import Application        from './application';
import AppRouter          from './app-router';
import MarionetteError    from './error';

import behaviorsLookup    from './config/behaviors-lookup';

import {
  FEATURES,
  isEnabled,
  setEnabled
} from './config/features';

import {
  bindEntityEvents,
  unbindEntityEvents
} from './bind-entity-events';

import {
  proxyRadioHandlers,
  unproxyRadioHandlers
} from './radio-helpers';

import {
  triggerMethod,
  triggerMethodOn,
  triggerMethodMany
} from './trigger-method';

var previousMarionette = Backbone.Marionette;
var Marionette = Backbone.Marionette = {};

// This allows you to run multiple instances of Marionette on the same
// webapp. After loading the new version, call `noConflict()` to
// get a reference to it. At the same time the old version will be
// returned to Backbone.Marionette.
Marionette.noConflict = function() {
  Backbone.Marionette = previousMarionette;
  return this;
};

// Utilities
Marionette.bindEntityEvents = proxy(bindEntityEvents);
Marionette.unbindEntityEvents = proxy(unbindEntityEvents);
Marionette.mergeOptions = proxy(mergeOptions);
Marionette.getOption = proxy(getOption);
Marionette.normalizeMethods = proxy(normalizeMethods);
Marionette.proxyRadioHandlers = proxyRadioHandlers;
Marionette.unproxyRadioHandlers = unproxyRadioHandlers;
Marionette.extend = extend;
Marionette.isNodeAttached = isNodeAttached;
Marionette.deprecate = deprecate;
Marionette.triggerMethod = proxy(triggerMethod);
Marionette.triggerMethodOn = triggerMethodOn;
Marionette.triggerMethodMany = triggerMethodMany;
Marionette.isEnabled = isEnabled;
Marionette.setEnabled = setEnabled;

Marionette.Behaviors = {};
Marionette.Behaviors.behaviorsLookup = behaviorsLookup;

// Classes
Marionette.Application = Application;
Marionette.AppRouter = AppRouter;
Marionette.MonitorViewEvents = MonitorViewEvents;
Marionette.Renderer = Renderer;
Marionette.TemplateCache = TemplateCache;
Marionette.View = View;
Marionette.CollectionView = CollectionView;
Marionette.CompositeView = CompositeView;
Marionette.Behavior = Behavior;
Marionette.Region = Region;
Marionette.Error = MarionetteError;
Marionette.Object = MarionetteObject;

// Configuration
Marionette.DEV_MODE = false;
Marionette.FEATURES = FEATURES;
Marionette.VERSION = version;

export default Marionette;
