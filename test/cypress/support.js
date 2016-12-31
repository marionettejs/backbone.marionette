// ***********************************************************
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can read more here:
// https://on.cypress.io/guides/configuration#section-global
// ***********************************************************

// Import using ES2015 syntax:
// import "./commands"

Cypress.addParentCommand('visitMn', function(runApp) {
  cy.visit('test/cypress/index.html')
    .window().then(function(win) {
      runApp({
        $: win.$,
        _: win._,
        Backbone: win.Backbone,
        Radio: win.Radio,
        Marionette: win.Marionette,
        window: win
      });
    });
});
