var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiJq = require('chai-jq');

chai.use(sinonChai);
chai.use(chaiJq);

global.chai = chai;
global.sinon = sinon;
global.expect = global.chai.expect;

if (!global.document || !global.window) {
  var jsdom = require('jsdom').jsdom;
  var jsdomGlobal = require('jsdom-global');

  jsdomGlobal();
  jsdom('<html><head><script></script></head><body></body></html>', {
    FetchExternalResources: ['script'],
    ProcessExternalResources: ['script']
  });
}
