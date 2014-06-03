describe('view ui event trigger configuration', function() {
  'use strict';

  describe('@ui syntax within events and triggers', function() {
    beforeEach(function() {
      var suite = this;

      this.View = Backbone.Marionette.ItemView.extend({
        ui: {
          foo: '.foo',
          bar: '#tap',
          bat: '.bat'
        },

        triggers: {
          'click @ui.foo': 'do:foo'
        },

        events: {
          'click @ui.bar': 'attack',
          'click div:not(@ui.bar)': 'tapper',
          'click @ui.bar, @ui.foo, @ui.bat': 'defend'
        },

        tapper: function() {
          suite.tapHandler();
        },

        attack: function() {
          suite.attackHandler();
        },

        defend: function() {
          suite.defendHandler();
        },

        render: function() {
          this.$el.html('<button class="foo"></button><div id="tap"></div><div class="lap"></div><div class="bat"></div>');
        }
      });

      this.View2 = this.View.extend({
        triggers: function() {
          return {
            'click @ui.foo': {
              event: 'do:foo',
              preventDefault: true,
              stopPropagation: false
            }
          };
        },

        events: function() {
          return {
            'click @ui.bar': function() {
              this.attack();
            }
          };
        }
      });

      this.View3 = this.View2.extend({
        ui: function() {
          return {
            bar: '#tap'
          };
        }
      });

      this.view = new this.View({
        model: new Backbone.Model()
      });

      this.view2 = new this.View2({
        model: new Backbone.Model()
      });

      this.view3 = new this.View3({
        model: new Backbone.Model()
      });

      this.view.render();
      this.view2.render();
      this.view3.render();

      this.fooHandler = this.sinon.stub();
      this.attackHandler = this.sinon.stub();
      this.defendHandler = this.sinon.stub();
      this.tapHandler = this.sinon.stub();
      this.sinon.spy(this.view, 'attack');
      this.view.on('do:foo', this.fooHandler);
      this.view2.on('do:foo', this.fooHandler);
    });

    it('should correctly trigger an event', function() {
      this.view.$('.foo').trigger('click');
      expect(this.fooHandler).to.have.been.called;
    });

    it('should correctly trigger a complex event', function() {
      this.view.$('.lap').trigger('click');
      expect(this.tapHandler).to.have.been.called;
    });

    it('should correctly call an event', function() {
      this.view.$('#tap').trigger('click');
      expect(this.attackHandler).to.have.been.called;
    });

    it('should correctly call an event with a functional events hash', function() {
      this.view2.$('#tap').trigger('click');
      expect(this.attackHandler).to.have.been.called;
    });

    it('should correctly call an event with a functional triggers hash', function() {
      this.view2.$('.foo').trigger('click');
      expect(this.fooHandler).to.have.been.called;
    });

    it('should correctly call an event with a functional events hash and functional ui hash', function() {
      this.view3.$('#tap').trigger('click');
      expect(this.attackHandler).to.have.been.called;
    });

    describe('when multiple hashes are specified', function() {
      it('should correctly call an event when when the first hash is triggered', function() {
        this.view.$('#tap').trigger('click');
        expect(this.defendHandler).to.have.been.called;
      });

      it('should correctly call an event when when the second hash is triggered', function() {
        this.view.$('.foo').trigger('click');
        expect(this.defendHandler).to.have.been.called;
      });

      it('should correctly call an event when when the third hash is triggered', function() {
        this.view.$('.bat').trigger('click');
        expect(this.defendHandler).to.have.been.called;
      });
    });
  });
});
