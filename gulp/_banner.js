import {version} from '../package.json';

const now = new Date();
const year = now.getFullYear();

export default `/**
* @license
* MarionetteJS (Backbone.Marionette)
* ----------------------------------
* v${version}
*
* Copyright (c)${year} Derick Bailey, Muted Solutions, LLC.
* Distributed under MIT license
*
* http://marionettejs.com
*/\n\n`;
