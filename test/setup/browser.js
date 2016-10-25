var mochaGlobals = require('../.globals.json').globals;

global.mocha.setup('bdd');
global.onload = function() {
  global.mocha.checkLeaks();
  global.mocha.globals(Object.keys(mochaGlobals));

  var runner = global.mocha.run();

  mochaResults(runner);
  require('./setup')();
};

var mochaResults = function(runner) {
  var failedTests = [];

  runner.on('end', function() {
    global.mochaResults = runner.stats;
    global.mochaResults.reports = failedTests;
  });

  runner.on('fail', function(test, err) {
    failedTests.push({
      title: test.title,
      fullTitle: test.fullTitle(),
      error: {
        message: err.message,
        stack: err.stack
      }
    });
  });
}
