describe('view triggers', function() {
  'use strict';
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when DOM events are configured to trigger a view event, and the DOM events are fired', function() {
    beforeEach(function() {
      var suite = this;

      this.View = Backbone.Marionette.ItemView.extend({
        triggers: {
          'click .foo': 'do:foo',
          'click .bar': 'what:ever'
        },

        render: function() {
          this.$el.html('<button class="foo"></button><a href="#" class="bar">asdf</a>');
        }
      });

      this.view = new this.View({
        model: new Backbone.Model(),
        collection: new Backbone.Collection()
      });
      this.view.render();

      this.fooHandler = this.sinon.stub();
      this.whatHandler = this.sinon.stub();

      this.view.on('do:foo', this.fooHandler);
      this.view.on('what:ever', this.whatHandler);

      this.view.on('do:foo', function(e) {
        suite.args = e;
      });

      this.view.$('.foo').trigger('click');
      this.view.$('.bar').trigger('click');
    });

    it('should trigger the first view event', function() {
      expect(this.fooHandler).to.have.been.called;
    });

    it('should trigger the second view event', function() {
      expect(this.whatHandler).to.have.been.called;
    });

    it('should include the view in the event args', function() {
      expect(this.args.view).to.equal(this.view);
    });

    it('should include the views model in the event args', function() {
      expect(this.args.model).to.equal(this.view.model);
    });

    it('should include the views collection in the event args', function() {
      expect(this.args.collection).to.equal(this.view.collection);
    });
  });

  describe('when triggers and standard events are both configured', function() {
    beforeEach(function() {
      this.View = Backbone.Marionette.ItemView.extend({
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

      this.view = new this.View();
      this.view.render();

      this.fooHandler = this.sinon.stub();
      this.view.on('do:foo', this.fooHandler);

      this.view.$('.foo').trigger('click');
      this.view.$('.bar').trigger('click');
    });

    it('should fire the trigger', function() {
      expect(this.fooHandler).to.have.been.called;
    });

    it('should fire the standard event', function() {
      expect(this.view.itWasClicked).to.be.true;
    });
  });

  describe('when triggers are configured with a function', function() {
    beforeEach(function() {
      this.View = Backbone.Marionette.ItemView.extend({
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

      this.view = new this.View();
      this.view.render();

      this.fooHandler = this.sinon.stub();
      this.whatHandler = this.sinon.stub();

      this.view.on('do:foo', this.fooHandler);
      this.view.on('what:ever', this.whatHandler);

      this.view.$('.foo').trigger('click');
      this.view.$('.bar').trigger('click');
    });

    it('should trigger the first view event', function() {
      expect(this.fooHandler).to.have.been.called;
    });

    it('should trigger the second view event', function() {
      expect(this.whatHandler).to.have.been.called;
    });
  });

  describe('triggers should stop propigation and events by default', function() {
    beforeEach(function() {
      this.MyView = Backbone.Marionette.ItemView.extend({
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
      this.viewInstance = new this.MyView();

      this.hashChangeSpy = this.sinon.stub();
      $(window).on('hashchange', this.hashChangeSpy);

      this.viewInstance.render();
      this.viewInstance.$('h2').click();
      this.viewInstance.$('a').click();
    });

    afterEach(function() {
      $(window).off('hashchange');
    });

    it('should stop propigation by default', function() {
      expect(this.viewInstance.spanClicked).to.be.false;
    });

    it('should prevent default by default', function() {
      expect(this.hashChangeSpy).not.to.have.been.called;
    });
  });

  describe('when triggers items are manually configured', function() {
    beforeEach(function() {
      this.View = Backbone.Marionette.ItemView.extend({
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

      this.view = new this.View();
      this.view.render();

      this.fooEvent = $.Event('click');
      this.barEvent = $.Event('click');

      this.sinon.spy(this.fooEvent, 'preventDefault');
      this.sinon.spy(this.fooEvent, 'stopPropagation');

      this.sinon.spy(this.barEvent, 'preventDefault');
      this.sinon.spy(this.barEvent, 'stopPropagation');

      this.view.$('.foo').trigger(this.fooEvent);
      this.view.$('.bar').trigger(this.barEvent);
    });

    it('should prevent and dont stop the first view event', function() {
      expect(this.fooEvent.preventDefault).to.have.been.called;
      expect(this.fooEvent.stopPropagation).not.to.have.been.called;
    });

    it('should not prevent and stop the second view event', function() {
      expect(this.barEvent.preventDefault).not.to.have.been.called;
      expect(this.barEvent.stopPropagation).to.have.been.called;
    });
  });
});
