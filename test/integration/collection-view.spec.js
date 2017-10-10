const _ = Cypress._;

describe('CollectionView', () => {
  let BbModel;
  let BbCollection;
  let CollectionView;
  let MnView;
  let appRegion;

  beforeEach(() => {
    cy.server();

    cy.visitMn(function({Marionette, Backbone}) {
      BbModel = Backbone.Model;
      BbCollection = Backbone.Collection;
      MnView = Marionette.View;

      const FooView = Marionette.View.extend({
        template: _.template('Foo template content')
      });

      const BarView = Marionette.View.extend({
        template: _.template('Bar template content')
      });

      CollectionView = Marionette.CollectionView.extend({
        className: 'collection-view-container',
        collection: new BbCollection(),
        childView(item) {
          if (item.get('isFoo')) {
            return FooView;
          } else {
            return BarView;
          }
        }
      });

      appRegion = new Marionette.Region({ el: '#app-hook'});
    });
  });

  describe('childView', () => {
    let collectionView;
    let fooModel;
    let barModel;

    beforeEach(() => {
      fooModel = new BbModel({
        isFoo: true
      });

      barModel = new BbModel({
        isFoo: false
      });

      collectionView = new CollectionView();

      appRegion.show(collectionView);
    });

    it('should be without childView\'s', function() {
      cy.get('.collection-view-container').should('be.empty');
    });

    it('should show default childView', function() {
      collectionView.collection.add(fooModel);

      cy.get('@app-hook').should('contain', 'Foo template content');
    });

    it('should show a special childView', function() {
      collectionView.collection.add(barModel);

      cy.get('@app-hook').should('contain', 'Bar template content');
    });
  });

  describe('emptyView', () => {
    let CView;

    beforeEach(() => {
      const EmptyView = MnView.extend({
        className: 'empty-view',
        template: _.template('Empty view content')
      });
      CView = CollectionView.extend({
        collection: new BbCollection([]),
        emptyView: EmptyView
      });
    });

    it('should have empty view element', () => {
      appRegion.show(new CView());

      cy.get('.collection-view-container').find('.empty-view').should('contain', 'Empty view content');
    });
  });

  describe('Automatic Rendering', () => {
    let collection;
    let collectionView;

    beforeEach(() => {
      collection = new BbCollection({model: new BbModel({isFoo: false})});
      collectionView = new CollectionView({
        collection: collection
      });
    });

    it('should rerender view if collection was reset', () => {
      appRegion.show(collectionView);

      cy.get('@app-hook')
        .should('contain', 'Bar template content')
        .then(() => {
          collection.reset([{isFoo: true}]);
        })
        .should('contain', 'Foo template content');
    });
  });
});
