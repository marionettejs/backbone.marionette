const _ = Cypress._;
const $ = Cypress.$;

describe('CollectionView', () => {
  let BbModel;
  let BbCollection;
  let CollectionView;
  let MnView;

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

    });
  });

  describe('childView', () => {
    let collectionView;
    let fooModel;
    let barModel;

    beforeEach(() => {
      const Model = BbModel.extend({
        defaults: {
          isFoo: false
        }
      });

      fooModel = new Model({
        isFoo: true
      });

      barModel = new Model({
        isFoo: false
      });

      collectionView = new CollectionView();
      collectionView.render();

      $('#app-hook').html(collectionView.$el);
    });

    it('should be without childView\'s', function() {
      cy.get('.collection-view-container').should('be.empty');
    });

    it('should show default childView', function() {
      collectionView.collection.add(fooModel);

      cy.get('#app-hook').should('contain', 'Foo template content');
    });

    it('should show a special childView', function() {
      collectionView.collection.add(barModel);

      cy.get('#app-hook').should('contain', 'Bar template content');
    });
  });

  describe('emptyView', () => {
    beforeEach(() => {
      const EmptyView = MnView.extend({
        className: 'empty-view',
        template: _.template('Empty view content')
      });
      const CView = CollectionView.extend({
        collection: new BbCollection([]),
        emptyView: EmptyView
      });
      const collectionView = new CView();
      collectionView.render();

      $('#app-hook').html(collectionView.$el);
    });

    it('should have empty view element', () => {
      cy.get('.collection-view-container').should($container => {
        expect($container.find('.empty-view')).to.have.length(1);
      });
    });

    it('should have empty view content', () => {
      cy.get('.collection-view-container').should('contain', 'Empty view content');
    });
  });

  describe('Automatic Rendering', () => {
    let collection;
    let collectionView;

    beforeEach(() => {
      const Model = BbModel.extend({
        defaults: {
          isFoo: false
        }
      });
      collection = new BbCollection({model: new Model});
      collectionView = new CollectionView({
        collection: collection
      });
    });

    it('should rerender view if collection was reset', () => {
      collectionView.render();
      $('#app-hook').html(collectionView.$el);

      cy.get('#app-hook')
        .should('contain', 'Bar template content')
        .then(() => {
          collection.reset([{isFoo: true}]);
        })
        .should('contain', 'Foo template content');
    });
  });
});
