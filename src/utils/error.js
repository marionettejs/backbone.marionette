// Error
// -----

import _ from 'underscore';
import extend from './extend';
import {version} from '../../package.json';

const errorProps = ['description', 'fileName', 'lineNumber', 'name', 'message', 'number', 'url'];

const MarionetteError = extend.call(Error, {
  urlRoot: `http://marionettejs.com/docs/v${version}/`,

  url: '',

  constructor(options) {
    const error = Error.call(this, options.message);
    _.extend(this, _.pick(error, errorProps), _.pick(options, errorProps));

    if (Error.captureStackTrace) {
      this.captureStackTrace();
    }

    this.url = this.urlRoot + this.url;
  },

  captureStackTrace() {
    Error.captureStackTrace(this, MarionetteError);
  },

  toString() {
    return `${ this.name }: ${ this.message } See: ${ this.url }`;
  }
});

export default MarionetteError;
