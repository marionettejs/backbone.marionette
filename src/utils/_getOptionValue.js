// Composes getOption with the intent of
// evaluating a target's property or option.
// Useful when class property like `events` or `regions`
// could either be an object or function.
export default function(target, optionName, params) {
  var option = target.getOption(optionName);
  return target.getValue(option, params);
}
