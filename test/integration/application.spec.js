const _ = Cypress._;

describe('Application', function() {
  let app;
  let FooView;

  beforeEach(function() {
    cy.server();

    cy.visitMn(function({Marionette}) {
      const Application = Marionette.Application.extend({
        region: '#app-hook',
      });

      FooView = Marionette.View;

      app = new Application();
      app.start();
    });
  });

  it('should show a view without additional arguments', function() {
    const view = new FooView({
      template: _.template('Application region content')
    });

    app.showView(view);

    cy.get('#app-hook').should('contain', 'Application region content');
  });

  it('should show a view with additional arguments', function() {
    const view = new FooView({
      template: _.template('<h1 class="title">Application region content</h1>')
    });

    app.showView(view, {
      replaceElement: true
    });

    cy.get('#app-hook').should('not.exist');
    cy.get('.title').should('contain', 'Application region content');
  });
});
