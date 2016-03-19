var mochaGlobals = require('../.globals.json').globals;

global.mocha.setup('bdd');
global.onload = function() {
  global.mocha.checkLeaks();
  global.mocha.globals(Object.keys(mochaGlobals));
  global.mocha.run();
  require('./setup')();
};
