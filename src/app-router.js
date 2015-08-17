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

import MarionetteError         from './error';
import mergeOptions            from './utils/mergeOptions';
import proxyGetOption          from './utils/proxyGetOption';
import { proxyBindEntityEvents, proxyUnbindEntityEvents } from './bind-entity-events';
import { triggerMethod }       from './trigger-method';

Marionette.AppRouter = Backbone.Router.extend({

  constructor: function(options) {
    this.options = options || {};

    Backbone.Router.apply(this, arguments);

    var appRoutes = this.getOption('appRoutes');
    var controller = this._getController();
    this.processAppRoutes(controller, appRoutes);
    this.on('route', this._processOnRoute, this);
  },

  // Similar to route method on a Backbone Router but
  // method is called on the controller
  appRoute: function(route, methodName) {
    var controller = this._getController();
    this._addAppRoute(controller, route, methodName);
  },

  // process the route event and trigger the onRoute
  // method call, if it exists
  _processOnRoute: function(routeName, routeArgs) {
    // make sure an onRoute before trying to call it
    if (_.isFunction(this.onRoute)) {
      // find the path that matches the current route
      var routePath = _.invert(this.getOption('appRoutes'))[routeName];
      this.onRoute(routeName, routePath, routeArgs);
    }
  },

  // Internal method to process the `appRoutes` for the
  // router, and turn them in to routes that trigger the
  // specified method on the specified `controller`.
  processAppRoutes: function(controller, appRoutes) {
    if (!appRoutes) { return; }

    var routeNames = _.keys(appRoutes).reverse(); // Backbone requires reverted order of routes

    _.each(routeNames, function(route) {
      this._addAppRoute(controller, route, appRoutes[route]);
    }, this);
  },

  _getController: function() {
    return this.getOption('controller');
  },

  _addAppRoute: function(controller, route, methodName) {
    var method = controller[methodName];

    if (!method) {
      throw new MarionetteError('Method "' + methodName + '" was not found on the controller');
    }

    this.route(route, methodName, _.bind(method, controller));
  },

  mergeOptions: mergeOptions,

  // Proxy `getOption` to enable getting options from this or this.options by name.
  getOption: proxyGetOption,

  triggerMethod: triggerMethod,

  bindEntityEvents: proxyBindEntityEvents,

  unbindEntityEvents: proxyUnbindEntityEvents
});
