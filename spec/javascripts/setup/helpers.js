var path = require('path');
var fs = require('fs');

var $body = $(document.body);

var setFixtures = function () {
  _.each(arguments, function (content) {
    $body.append(content);
  });
};

var loadFixtures = function () {
  setFixtures(fs.readFileSync('./spec/javascripts/fixtures/collectionItemTemplate.html').toString());
  setFixtures(fs.readFileSync('./spec/javascripts/fixtures/collectionTemplate.html').toString());
  setFixtures(fs.readFileSync('./spec/javascripts/fixtures/compositeChildContainerTemplate.html').toString());
  setFixtures(fs.readFileSync('./spec/javascripts/fixtures/compositeRerender.html').toString());
  setFixtures(fs.readFileSync('./spec/javascripts/fixtures/compositeTemplate-noModel.html').toString());
  setFixtures(fs.readFileSync('./spec/javascripts/fixtures/compositeTemplate.html').toString());
  setFixtures(fs.readFileSync('./spec/javascripts/fixtures/emptyTemplate.html').toString());
  setFixtures(fs.readFileSync('./spec/javascripts/fixtures/gridTemplates.html').toString());
  setFixtures(fs.readFileSync('./spec/javascripts/fixtures/itemTemplate.html').toString());
  setFixtures(fs.readFileSync('./spec/javascripts/fixtures/itemWithCheckbox.html').toString());
  setFixtures(fs.readFileSync('./spec/javascripts/fixtures/layoutViewManagerTemplate.html').toString());
  setFixtures(fs.readFileSync('./spec/javascripts/fixtures/recursiveCompositeTemplate.html').toString());
  setFixtures(fs.readFileSync('./spec/javascripts/fixtures/rendererTemplate.html').toString());
  setFixtures(fs.readFileSync('./spec/javascripts/fixtures/rendererWithDataTemplate.html').toString());
  setFixtures(fs.readFileSync('./spec/javascripts/fixtures/uiBindingTemplate.html').toString());
};

var clearFixtures = function () {
  $body.find(':not(script)').remove();
};

loadFixtures();

beforeEach(function () {
  this.sinon = sinon.sandbox.create();
  this.setFixtures   = setFixtures;
});

afterEach(function () {
  this.sinon.restore();
  clearFixtures();
  window.location.hash = '';
  Backbone.history.stop();
  Backbone.history.handlers.length = 0;
});
