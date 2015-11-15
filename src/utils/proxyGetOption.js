import getOption from './getOption';

// Proxy `Marionette.getOption`
var proxyGetOption = function(optionName) {
  return getOption(this, optionName);
};

export default proxyGetOption;
