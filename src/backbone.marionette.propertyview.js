// Property View
// --------------

// Simple shorthand for rendering a single property from a model.
// Useful as an itemView with collection views.
Marionette.PropertyView = Marionette.ItemView.extend({

    // Overridden to do a simple .get() on the configured
    // property
    generateHtml: function() {
        return this.model.get(this.property);
    }
});