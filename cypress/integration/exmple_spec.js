describe('Backbone.Marionette', function() {
  it('cy.should - assert that <title> is correct', function () {

    cy.visit('http://localhost:2020/');

    cy.title().should('include', 'Integration tests');
  });
});
