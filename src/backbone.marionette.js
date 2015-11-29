var Marionette;

import {version}          from '../package.json';
import _                  from 'underscore';

import extend             from './utils/extend';
import isNodeAttached     from './utils/isNodeAttached';
import mergeOptions       from './utils/mergeOptions';
import getOption          from './utils/getOption';
import proxyGetOption     from './utils/proxyGetOption';
import normalizeMethods   from './utils/normalizeMethods';
import normalizeUIString  from './utils/normalizeUIString';
import normalizeUIKeys    from './utils/normalizeUIKeys';
import normalizeUIValues  from './utils/normalizeUIValues';
import deprecate          from './utils/deprecate';

import MonitorDOMRefresh  from './dom-refresh';
import MarionetteObject   from './object';
import Renderer           from './renderer';
import TemplateCache      from './template-cache';
import View               from './view';
import CollectionView     from './collection-view';
import CompositeView      from './composite-view';
import Behavior           from './behavior';
import Behaviors          from './behaviors';
import Region             from './region';
import Application        from './application';
import AppRouter          from './app-router';
import MarionetteError    from './error';

import {
  FEATURES,
  isEnabled,
  setEnabled
} from './features';

import {
  bindEntityEvents,
  unbindEntityEvents,
  proxyBindEntityEvents,
  proxyUnbindEntityEvents
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

Marionette = Marionette || {};

// Utilities
Marionette.bindEntityEvents = bindEntityEvents;
Marionette.unbindEntityEvents = unbindEntityEvents;
Marionette.proxyBindEntityEvents = proxyBindEntityEvents;
Marionette.proxyUnbindEntityEvents = proxyUnbindEntityEvents;
Marionette.proxyRadioHandlers = proxyRadioHandlers;
Marionette.unproxyRadioHandlers = unproxyRadioHandlers;
Marionette.extend = extend;
Marionette.isNodeAttached = isNodeAttached;
Marionette.mergeOptions = mergeOptions;
Marionette.getOption = getOption;
Marionette.proxyGetOption = proxyGetOption;
Marionette.normalizeMethods = normalizeMethods;
Marionette.normalizeUIString = normalizeUIString;
Marionette.normalizeUIKeys = normalizeUIKeys;
Marionette.normalizeUIValues = normalizeUIValues;
Marionette.deprecate = deprecate;
Marionette.triggerMethod = triggerMethod;
Marionette.triggerMethodOn = triggerMethodOn;
Marionette.triggerMethodMany = triggerMethodMany;
Marionette.isEnabled = isEnabled;
Marionette.setEnabled = setEnabled;

// Classes
Marionette.Application = Application;
Marionette.AppRouter = AppRouter;
Marionette.MonitorDOMRefresh = MonitorDOMRefresh;
Marionette.Renderer = Renderer;
Marionette.TemplateCache = TemplateCache;
Marionette.View = View;
Marionette.CollectionView = CollectionView;
Marionette.CompositeView = CompositeView;
Marionette.Behavior = Behavior;
Marionette.Behaviors = Behaviors;
Marionette.Region = Region;
Marionette.Error = MarionetteError;
Marionette.Object = MarionetteObject;

// Configuration
Marionette.DEV_MODE = false;
Marionette.FEATURES = FEATURES;
Marionette.VERSION = version;

export default Marionette;
