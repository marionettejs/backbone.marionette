// Renderer
// --------

import _               from 'underscore';
import MarionetteError from './error';
import TemplateCache   from './template-cache';

// Render a template with data by passing in the template
// selector and the data to render.
var Renderer = {

  // Render a template with data. The `template` parameter is
  // passed to the `TemplateCache` object to retrieve the
  // template function. Override this method to provide your own
  // custom rendering and template handling for all of Marionette.
  render: function(template, data) {
    if (!template) {
      throw new MarionetteError({
        name: 'TemplateNotFoundError',
        message: 'Cannot render the template since its false, null or undefined.'
      });
    }

    var templateFunc = _.isFunction(template) ? template : TemplateCache.get(template);

    return templateFunc(data);
  }
};

export default Renderer;
