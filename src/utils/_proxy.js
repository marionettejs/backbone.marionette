//Internal utility for creating context style global utils
var proxy = function(method) {
  return function(context, ...args) {
    return method.apply(context, args);
  };
};

export default proxy;
