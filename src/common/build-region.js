import _ from 'underscore';
import MarionetteError from '../utils/error';
import Region from '../region';

// return the region instance from the definition
export default function(definition, RegionClass) {
  if (definition instanceof Region) {
    return definition;
  }

  if (_.isString(definition)) {
    return buildRegionFromObject({ el: definition }, RegionClass);
  }

  if (_.isFunction(definition)) {
    return buildRegionFromObject({ regionClass: definition });
  }

  if (_.isObject(definition)) {
    return buildRegionFromObject(_.clone(definition), RegionClass);
  }

  throw new MarionetteError({
    message: 'Improper region configuration type.',
    url: 'marionette.region.html#defining-regions'
  });
}

function buildRegionFromObject(options, defaultRegionClass) {
  const RegionClass = options.regionClass || defaultRegionClass;

  delete options.regionClass;

  return new RegionClass(options);
}
