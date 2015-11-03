import {version} from '../package.json';

const now = new Date();
const year = now.getFullYear();

const core = `// MarionetteJS (Backbone.Marionette)
// ----------------------------------
// v${version}
//
// Copyright (c)${year} Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://marionettejs.com\n\n`;

const bundled = `${core}
/*!
* Includes BabySitter
* https://github.com/marionettejs/backbone.babysitter/
*
* Includes Radio
* https://github.com/marionettejs/backbone.radio/
*
* Includes Metal
* https://github.com/marionettejs/backbone-metal/
*/\n\n\n`;

export default {
  core,
  bundled
};
