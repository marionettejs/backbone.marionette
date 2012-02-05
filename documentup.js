this.DocumentUp = {};

var conf_to_params = function (conf) {
  var params = "";
  for (var param in conf) {
    params ? params += "&" : params = "?";
    params += param + "=" + encodeURIComponent(conf[param])
  }
  return params;
}

DocumentUp.document = function (opts) {
  var repo;
  if ("string" === typeof opts) {
    repo = opts;
    opts = {};
  } else {
    repo = opts.repo;
    delete opts.repo;
  }

  window.callback = function (resp) {
    if (resp.status === 200) {
      document.open();
      document.write(resp.html);
      document.close();
      if (opts.afterRender && typeof opts.afterRender === "function")
        opts.afterRender()
    }
  }

  var script = document.createElement('script');
  script.src = 'http://documentup.com/'+repo+conf_to_params(opts)+'&callback=callback';

  document.getElementsByTagName('head')[0].appendChild(script);
}
