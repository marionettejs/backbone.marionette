describe('view triggers', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when DOM events are configured to trigger a view event, and the DOM events are fired', function() {
    var View, view, fooHandler, whatHandler, args;

    beforeEach(function() {
      View = Backbone.Marionette.ItemView.extend({
        triggers: {
          'click .foo': 'do:foo',
          'click .bar': 'what:ever'
        },

        render: function() {
          this.$el.html('<button class="foo"></button><a href="#" class="bar">asdf</a>');
        }
      });

      view = new View({
        model: new Backbone.Model(),
        collection: new Backbone.Collection()
      });
      view.render();

      fooHandler = this.sinon.stub();
      whatHandler = this.sinon.stub();

      view.on('do:foo', fooHandler);
      view.on('what:ever', whatHandler);

      view.on('do:foo', function(e) {
        args = e;
      });

      view.$('.foo').trigger('click');
      view.$('.bar').trigger('click');
    });

    it('should trigger the first view event', function() {
      expect(fooHandler).to.have.been.called;
    });

    it('should trigger the second view event', function() {
      expect(whatHandler).to.have.been.called;
    });

    it('should include the view in the event args', function() {
      expect(args.view).to.equal(view);
    });

    it('should include the views model in the event args', function() {
      expect(args.model).to.equal(view.model);
    });

    it('should include the views collection in the event args', function() {
      expect(args.collection).to.equal(view.collection);
    });
  });

  describe('when triggers and standard events are both configured', function() {
    var View, view, fooHandler;

    beforeEach(function() {
      View = Backbone.Marionette.ItemView.extend({
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

      view = new View();
      view.render();

      fooHandler = this.sinon.stub();
      view.on('do:foo', fooHandler);

      view.$('.foo').trigger('click');
      view.$('.bar').trigger('click');
    });

    it('should fire the trigger', function() {
      expect(fooHandler).to.have.been.called;
    });

    it('should fire the standard event', function() {
      expect(view.itWasClicked).to.be.true;
    });
  });

  describe('when triggers are configured with a function', function() {
    var View, view, fooHandler, whatHandler;

    beforeEach(function() {
      View = Backbone.Marionette.ItemView.extend({
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

      view = new View();
      view.render();

      fooHandler = this.sinon.stub();
      whatHandler = this.sinon.stub();

      view.on('do:foo', fooHandler);
      view.on('what:ever', whatHandler);

      view.$('.foo').trigger('click');
      view.$('.bar').trigger('click');
    });

    it('should trigger the first view event', function() {
      expect(fooHandler).to.have.been.called;
    });

    it('should trigger the second view event', function() {
      expect(whatHandler).to.have.been.called;
    });
  });

  describe('triggers should stop propigation and events by default', function() {
    var MyView, viewInstance, hashChangeSpy;

    beforeEach(function() {
      MyView = Backbone.Marionette.ItemView.extend({
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
      viewInstance = new MyView();

      hashChangeSpy = this.sinon.stub();
      $(window).on('hashchange', hashChangeSpy);

      viewInstance.render();
      viewInstance.$('h2').click();
      viewInstance.$('a').click();
    });

    afterEach(function() {
      $(window).off('hashchange');
    });

    it('should stop propigation by default', function() {
      expect(viewInstance.spanClicked).to.be.false;
    });

    it('should prevent default by default', function() {
      expect(hashChangeSpy).not.to.have.been.called;
    });
  });

  describe('when triggers items are manually configured', function() {
    var View, view, fooEvent, barEvent;

    beforeEach(function() {
      View = Backbone.Marionette.ItemView.extend({
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

      view = new View();
      view.render();

      fooEvent = $.Event('click');
      barEvent = $.Event('click');

      this.sinon.spy(fooEvent, 'preventDefault');
      this.sinon.spy(fooEvent, 'stopPropagation');

      this.sinon.spy(barEvent, 'preventDefault');
      this.sinon.spy(barEvent, 'stopPropagation');

      view.$('.foo').trigger(fooEvent);
      view.$('.bar').trigger(barEvent);
    });

    it('should prevent and dont stop the first view event', function() {
      expect(fooEvent.preventDefault).to.have.been.called;
      expect(fooEvent.stopPropagation).not.to.have.been.called;
    });

    it('should not prevent and stop the second view event', function() {
      expect(barEvent.preventDefault).not.to.have.been.called;
      expect(barEvent.stopPropagation).to.have.been.called;
    });
  });
});
