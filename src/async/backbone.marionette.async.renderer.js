// Async Renderer
// --------

// Render a template with data by passing in the template
// selector and the data to render. Do it all asynchronously.
Backbone.Marionette.Renderer = {

  // Render a template with data. The `template` parameter is
  // passed to the `TemplateCache` object to retrieve the
  // template function. Override this method to provide your own
  // custom rendering and template handling for all of Marionette.
  render: function(template, data){
    var asyncRender = $.Deferred();

    var templateRetrieval = Marionette.TemplateCache.get(template);
    $.when(templateRetrieval).then(function(templateFunc){
      var html = templateFunc(data);
      asyncRender.resolve(html);
    });

    return asyncRender.promise();
  }
};

