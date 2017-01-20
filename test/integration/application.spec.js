describe('Application', function() {
  let app;
  let fooView;
  let barView;

  beforeEach(function() {
    cy.server();

    cy.visitMn(function({_, Backbone, Marionette}) {
      const Application = Marionette.Application.extend({
        region: '#app-hook',
      });

      fooView = new Marionette.View({
        template: _.template('Application region content')
      });
      barView = new Marionette.View({
        template: _.template('<h1 class="title">Application region content</h1>')
      });

      app = new Application();
      app.start();
    });
  });

  it('should show a view without additional arguments', function() {
    app.showView(fooView);
    cy.get('#app-hook').should('contain', 'Application region content');
  });

  it('should show a view with additional arguments', function() {
    app.showView(barView, {
      selector: '.title',
      replaceElement: true
    });
    cy.get('.title').should('contain', 'Application region content');
  });
});
