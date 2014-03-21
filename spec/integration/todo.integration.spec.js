var wd             = require("wd");
var chai           = require("chai");
var chaiAsPromised = require("chai-as-promised");

// support for promise-returning test style
require("mocha-as-promised")();

// extends chai with language for asserting facts about promises
chai.use(chaiAsPromised);

// use chai should BDD styles assertion
chai.should();

// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

describe('Todo App', function() {

  var browser;

  // increase timeout - integration tests can be quite slow
  this.timeout(10000);

  before(function() {
    var username = process.env.SAUCE_USERNAME;
    var accessKey = process.env.SAUCE_ACCESS_KEY;
    browser = wd.promiseChainRemote("ondemand.saucelabs.com", 80, username, accessKey);
    return browser.init({
      "browserName":"chrome",
      "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
      "name": "Integration tests - Todo App",
      "build": process.env.TRAVIS_BUILD_NUMBER
    });
  });

  beforeEach(function() {
    return browser.get("http://localhost:8888/spec/integration/todo");
  });

  after(function() {
    return browser.quit();
  });

  it("should have page title", function() {
    return browser.title().should.become('Marionette • TodoMVC')
  });

  it("should have H1 tag", function() {
    return browser.elementByTagName('h1').text().should.become('todos')
  });

});