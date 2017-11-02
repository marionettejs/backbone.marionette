import _ from 'underscore';
import * as Marionette from '../../src/backbone.marionette';
import CollectionView from '../../src/collection-view';
import Region from '../../src/region';
import View from '../../src/view';

describe('backbone.marionette', function() {
  'use strict';

  describe('when Marionettes on global namespace', function() {
    it('should have a working getOption method which just returns when no optionName is passed', function() {
      const result = Marionette.getOption();
      expect(result).to.be.equal(undefined);
    });
  });

  describe('#setDomApi', function() {
    const DomClasses = {
      CollectionView,
      Region,
      View
    };

    const fakeDomApi = {
      foo: 'bar'
    };

    _.each(DomClasses, function(Class, key) {
      it(`should setDomApi on ${ key }`, function() {
        this.sinon.spy(Class, 'setDomApi');
        Marionette.setDomApi(fakeDomApi);
        expect(Class.setDomApi).to.be.calledOnce.and.calledWith(fakeDomApi);
      });
    });
  });

  describe('#setRenderer', function() {
    let renderer;

    beforeEach(function() {
      renderer = Marionette.View.prototype._renderHtml;
    });

    afterEach(function() {
      Marionette.setRenderer(renderer);
    });

    const RendererClasses = {
      CollectionView,
      View
    };

    const fakeRenderer = function() {};

    _.each(RendererClasses, function(Class, key) {
      it(`should setRenderer on ${ key }`, function() {
        this.sinon.spy(Class, 'setRenderer');
        Marionette.setRenderer(fakeRenderer);
        expect(Class.setRenderer).to.be.calledOnce.and.calledWith(fakeRenderer);
      });
    });
  });
});
