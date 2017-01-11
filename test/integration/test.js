// This isn't a good test since it is testing the fixture data,
// but it is a good example of every cypress thing.
describe('Backbone.Marionette', function() {
  beforeEach(function() {
    cy
      .server()
      .route('/foo/**', 'fixture:foo').as('fooRoute');

    cy.visitMn(function({_, Backbone, Marionette}) {
      const Model = Backbone.Model.extend({
        urlRoot: '/foo'
      });

      const model = new Model({ id: 1 });

      const template = _.template('Hello <%- who %>!');

      const view = new Marionette.View({
        el: '#app-hook',
        model,
        template
      });

      model.fetch().done(function() {
        view.render();
      });
    });
  });

  it('should show a view', function() {
    cy.wait('@fooRoute').get('#app-hook').should('contain', 'Hello World!');
  });
});
