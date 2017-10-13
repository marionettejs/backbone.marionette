import _ from 'underscore';
import MarionetteError from '../utils/error';
import Region from '../region';

// return the region instance from the definition
export default function(definition, defaults) {
  if (definition instanceof Region) {
    return definition;
  }

  if (_.isString(definition)) {
    return buildRegionFromObject(defaults, { el: definition });
  }

  if (_.isFunction(definition)) {
    return buildRegionFromObject(defaults, { regionClass: definition });
  }

  if (_.isObject(definition)) {
    return buildRegionFromObject(defaults, definition);
  }

  throw new MarionetteError({
    message: 'Improper region configuration type.',
    url: 'marionette.region.html#defining-regions'
  });
}

function buildRegionFromObject(defaults, definition) {
  const options = _.extend({}, defaults, definition);

  const RegionClass = options.regionClass

  delete options.regionClass;

  return new RegionClass(options);
}
