import {version as VERSION} from '../package.json';

import proxy from './utils/proxy';
import extend from './utils/extend';

import {
  bindEvents as _bindEvents,
  unbindEvents as _unbindEvents
} from './common/bind-events';
import {
  bindRequests as _bindRequests,
  unbindRequests as _unbindRequests
} from './common/bind-requests';
import _getOption from './common/get-option';
import _mergeOptions from './common/merge-options';
import monitorViewEvents from './common/monitor-view-events';
import _normalizeMethods from './common/normalize-methods';
import _triggerMethod from './common/trigger-method';

import Events from './mixins/events';

import MnObject from './object';
import View from './view';
import CollectionView from './collection-view';
import Behavior from './behavior';
import Region from './region';
import Application from './application';

import DomApi from './config/dom';

import {
  isEnabled,
  setEnabled
} from './config/features';

// Utilities

export const bindEvents = proxy(_bindEvents);
export const unbindEvents = proxy(_unbindEvents);
export const bindRequests = proxy(_bindRequests);
export const unbindRequests = proxy(_unbindRequests);
export const mergeOptions = proxy(_mergeOptions);
export const getOption = proxy(_getOption);
export const normalizeMethods = proxy(_normalizeMethods);
export const triggerMethod = proxy(_triggerMethod);


// Configuration

export const setDomApi = function(mixin) {
  CollectionView.setDomApi(mixin);
  Region.setDomApi(mixin);
  View.setDomApi(mixin);
};
export const setRenderer = function(renderer) {
  CollectionView.setRenderer(renderer);
  View.setRenderer(renderer);
};

export {
  View,
  CollectionView,
  MnObject,
  Region,
  Behavior,
  Application,
  isEnabled,
  setEnabled,
  monitorViewEvents,
  Events,
  extend,
  DomApi,
  VERSION
};

export default {
  View,
  CollectionView,
  MnObject,
  Object: MnObject,
  Region,
  Behavior,
  Application,
  isEnabled,
  setEnabled,
  monitorViewEvents,
  Events,
  extend,
  DomApi,
  VERSION
};
