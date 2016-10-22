// App Router
// ----------

// Reduce the boilerplate code of handling route events
// and then calling a single method on another object,
// called a controller.
// Have your routers configured to call the method on
// your controller, directly.
//
// Configure an AppRouter with `appRoutes`.
//
// App routers can only take one `controller` object.
// It is recommended that you divide your controller
// objects in to smaller pieces of related functionality
// and have multiple routers / controllers, instead of
// just one giant router and controller.
//
// You can also add standard routes to an AppRouter.

import Backbone from 'backbone';
import _ from 'underscore';
import { triggerMethod } from './common/trigger-method';
import MarionetteError from './error';
import CommonMixin from './mixins/common';

const ClassOptions = [
  'appRoutes',
  'controller'
];

const AppRouter = Backbone.Router.extend({

  constructor(options) {
    this._setOptions(options);

    this.mergeOptions(options, ClassOptions);

    Backbone.Router.apply(this, arguments);

    const appRoutes = this.appRoutes;
    const controller = this._getController();
    this.processAppRoutes(controller, appRoutes);
    this.on('route', this._processOnRoute, this);
  },

  // Similar to route method on a Backbone Router but
  // method is called on the controller
  appRoute(route, methodName) {
    const controller = this._getController();
    this._addAppRoute(controller, route, methodName);
    return this;
  },

  // process the route event and trigger the onRoute
  // method call, if it exists
  _processOnRoute(routeName, routeArgs) {
    // make sure an onRoute before trying to call it
    if (_.isFunction(this.onRoute)) {
      // find the path that matches the current route
      const routePath = _.invert(this.appRoutes)[routeName];
      this.onRoute(routeName, routePath, routeArgs);
    }
  },

  // Internal method to process the `appRoutes` for the
  // router, and turn them in to routes that trigger the
  // specified method on the specified `controller`.
  processAppRoutes(controller, appRoutes) {
    if (!appRoutes) { return this; }

    const routeNames = _.keys(appRoutes).reverse(); // Backbone requires reverted order of routes

    _.each(routeNames, route => {
      this._addAppRoute(controller, route, appRoutes[route]);
    });

    return this;
  },

  _getController() {
    return this.controller;
  },

  _addAppRoute(controller, route, methodName) {
    const method = controller[methodName];

    if (!method) {
      throw new MarionetteError(`Method "${methodName}" was not found on the controller`);
    }

    this.route(route, methodName, _.bind(method, controller));
  },

  triggerMethod: triggerMethod
});

_.extend(AppRouter.prototype, CommonMixin);

export default AppRouter;
