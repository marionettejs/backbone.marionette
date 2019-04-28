import _ from 'underscore';
import MarionetteError from '../utils/error';

// return the region instance from the definition
export default function(definition, regionClass) {
  if (_.isString(definition)) {
    definition = { el: definition };
  }

  if (!_.isString(definition.el)) {
    console.log(definition);
    throw new MarionetteError({
      message: 'Improper region configuration type.',
      url: 'marionette.region.html#defining-regions'
    });
  }

  return _.extend({ regionClass }, definition);
}
