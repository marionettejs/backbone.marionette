describe('view triggers', function() {
  'use strict';

  describe('when DOM events are configured to trigger a view event, and the DOM events are fired', function() {
    var View = Backbone.Marionette.ItemView.extend({
      triggers: {
        'click .foo': 'do:foo',
        'click .bar': 'what:ever'
      },

      render: function() {
        this.$el.html('<button class="foo"></button><a href="#" class="bar">asdf</a>');
      }
    });

    var view, fooHandler, whatHandler, args;

    beforeEach(function() {
      view = new View({
        model: new Backbone.Model(),
        collection: new Backbone.Collection()
      });
      view.render();

      fooHandler = jasmine.createSpy('do:foo event handler');
      whatHandler = jasmine.createSpy('what:ever event handler');

      view.on('do:foo', fooHandler);
      view.on('what:ever', whatHandler);

      view.on('do:foo', function(e) {
        args = e;
      });

      view.$('.foo').trigger('click');
      view.$('.bar').trigger('click');
    });

    it('should trigger the first view event', function() {
      expect(fooHandler).toHaveBeenCalled();
    });

    it('should trigger the second view event', function() {
      expect(whatHandler).toHaveBeenCalled();
    });

    it('should include the view in the event args', function() {
      expect(args.view).toBe(view);
    });

    it('should include the views model in the event args', function() {
      expect(args.model).toBe(view.model);
    });

    it('should include the views collection in the event args', function() {
      expect(args.collection).toBe(view.collection);
    });
  });

  describe('when triggers and standard events are both configured', function() {
    var View = Backbone.Marionette.ItemView.extend({
      triggers: {
        'click .foo': 'do:foo'
      },

      events: {
        'click .bar': 'whateverClicked'
      },

      render: function() {
        this.$el.html('<button class="foo"></button><a href="#" class="bar">asdf</a>');
      },

      whateverClicked: function() {
        this.itWasClicked = true;
      }
    });

    var view, fooHandler;

    beforeEach(function() {
      view = new View();
      view.render();

      fooHandler = jasmine.createSpy('do:foo handler');
      view.on('do:foo', fooHandler);

      view.$('.foo').trigger('click');
      view.$('.bar').trigger('click');
    });

    it('should fire the trigger', function() {
      expect(fooHandler).toHaveBeenCalled();
    });

    it('should fire the standard event', function() {
      expect(view.itWasClicked).toBe(true);
    });
  });

  describe('when triggers are configured with a function', function() {
    var View = Backbone.Marionette.ItemView.extend({
      triggers: function() {
        return {
          'click .foo': 'do:foo',
          'click .bar': 'what:ever'
        };
      },

      render: function() {
        this.$el.html('<button class="foo"></button><a href="#" class="bar">asdf</a>');
      }
    });

    var view, fooHandler, whatHandler;

    beforeEach(function() {
      view = new View();
      view.render();

      fooHandler = jasmine.createSpy('do:foo handler');
      whatHandler = jasmine.createSpy('what:ever handler');

      view.on('do:foo', fooHandler);
      view.on('what:ever', whatHandler);

      view.$('.foo').trigger('click');
      view.$('.bar').trigger('click');
    });

    it('should trigger the first view event', function() {
      expect(fooHandler).toHaveBeenCalled();
    });

    it('should trigger the second view event', function() {
      expect(whatHandler).toHaveBeenCalled();
    });
  });

  describe('triggers should stop propigation and events by default', function() {
    var MyView = Backbone.Marionette.ItemView.extend({
      triggers: {
        'click h2': 'headline:clicked'
      },

      initialize: function() {
        this.spanClicked = false;
      },

      onRender: function() {
        var self = this;
        this.$('span').on('click', function() {
          self.spanClicked = true;
        });
      },

      template: _.template('<h2><span>hi</span></h2><a href="#hash-url">hash link</a>')
    });

    var viewInstance;

    beforeEach(function() {
      viewInstance = new MyView();
      spyOn(window, 'onhashchange');

      viewInstance.render();
      viewInstance.$('h2').click();
      viewInstance.$('a').click();
    });

    it('should stop propigation by default', function() {
      expect(viewInstance.spanClicked).toBe(false);
    });

    it('should prevent default by default', function() {
      expect(window.onhashchange).not.toHaveBeenCalled();
    });
  });

  describe('when triggers items are manually configured', function() {
    var View = Backbone.Marionette.ItemView.extend({
      triggers: {
        'click .foo': {
          event: 'do:foo',
          preventDefault: true,
          stopPropagation: false
        },
        'click .bar': {
          event: 'do:bar',
          stopPropagation: true
        }
      },

      render: function() {
        this.$el.html('<button class="foo"></button><a href="#" class="bar">asdf</a>');
      }
    });

    var view, fooEvent, barEvent;

    beforeEach(function() {
      view = new View();
      view.render();

      fooEvent = $.Event('click');
      barEvent = $.Event('click');

      spyOn(fooEvent, 'preventDefault');
      spyOn(fooEvent, 'stopPropagation');

      spyOn(barEvent, 'preventDefault');
      spyOn(barEvent, 'stopPropagation');

      view.$('.foo').trigger(fooEvent);
      view.$('.bar').trigger(barEvent);
    });

    it('should prevent and dont stop the first view event', function() {
      expect(fooEvent.preventDefault).toHaveBeenCalled();
      expect(fooEvent.stopPropagation).not.toHaveBeenCalled();
    });

    it('should not prevent and stop the second view event', function() {
      expect(barEvent.preventDefault).not.toHaveBeenCalled();
      expect(barEvent.stopPropagation).toHaveBeenCalled();
    });
  });

});
