// Renderer
// --------

// Render a template with data by passing in the template
// selector and the data to render.
Marionette.Renderer = {

  // Render a template with data. The `template` parameter is
  // passed to the `TemplateCache` object to retrieve the
  // template function. Override this method to provide your own
  // custom rendering and template handling for all of Marionette.
  render: function(template, data) {
    if (!template) {
      throwError('Cannot render the template since its false, null or undefined.',
        'TemplateNotFoundError');
    }

    var templateFunc;
    if (typeof template === 'function') {
      templateFunc = template;
    } else {
      templateFunc = Marionette.TemplateCache.get(template);
    }

    return templateFunc(data);
  }
};
