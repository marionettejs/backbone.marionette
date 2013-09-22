// Renderer
// --------

// Render a template with data by passing in the template
// selector and the data to render.
Marionette.Renderer = {
  // Render a template with data. The `template` parameter is
  // passed to the `TemplateCache` object to retrieve the
  // template function. Override this method to provide your own
  // custom rendering and template handling for all of Marionette.
  render: function(template, data){
    var error;
    if (this.isDestroyed){
      error = new Error("Cannot re-render the view since it's already been destroyed.");
      error.name = "ViewDestroyedError";
      throw error;
    }

    if (!template) {
      error = new Error("Cannot render the template since it's false, null or undefined.");
      error.name = "TemplateNotFoundError";
      throw error;
    }

    var templateFunc;
    if (typeof template === "function"){
      templateFunc = template;
    } else {
      templateFunc = Marionette.TemplateCache.get(template);
    }

    return templateFunc(data);
  }
};

