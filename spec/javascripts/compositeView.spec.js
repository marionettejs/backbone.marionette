describe('composite view', function() {
  'use strict';

  beforeEach(function() {
    var suite = this;

    // Models

    this.Model = Backbone.Model.extend();

    this.User = Backbone.Model.extend();

    this.Node = Backbone.Model.extend({
      initialize: function() {
        var nodes = this.get('nodes');
        if (nodes) {
          this.nodes = new suite.NodeCollection(nodes);
          this.unset('nodes');
        }
      }
    });

    // Collections

    this.Collection = Backbone.Collection.extend({
      model: this.Model
    });

    this.UserCollection = Backbone.Collection.extend({
      model: this.User
    });

    this.NodeCollection = Backbone.Collection.extend({
      model: this.Node
    });

    // Views

    this.TreeView = Backbone.Marionette.CompositeView.extend({
      tagName: 'ul',
      template: '#recursive-composite-template',
      initialize: function() {
        this.collection = this.model.nodes;
      }
    });
  });

  describe('when a composite view has a template without a model', function() {
    beforeEach(function() {
      this.ChildView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeViewNoModel = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: '#composite-template-no-model'
      });

      this.loadFixtures('compositeTemplate-noModel.html');

      this.m1 = new this.Model({foo: 'bar'});
      this.m2 = new this.Model({foo: 'baz'});
      this.collection = new this.Collection([this.m1, this.m2]);

      this.compositeView = new this.CompositeViewNoModel({
        collection: this.collection
      });

      this.compositeView.render();
    });

    it('should render the template', function() {
      expect(this.compositeView.$el).to.contain.$text('composite');
    });

    it('should render the collections items', function() {
      expect(this.compositeView.$el).to.contain.$text('bar');
      expect(this.compositeView.$el).to.contain.$text('baz');
    });
  });

  describe('when a composite view has a model and a template', function() {
    beforeEach(function() {
      this.ChildView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: '#composite-template',
        onRender: function() {}
      });

      this.loadFixtures('compositeTemplate.html');

      this.m1 = new this.Model({foo: 'bar'});
      this.m2 = new this.Model({foo: 'baz'});
      this.collection = new this.Collection();
      this.collection.add(this.m2);

      this.compositeView = new this.CompositeView({
        model: this.m1,
        collection: this.collection
      });

      this.compositeView.render();
    });

    it('should render the template with the model', function() {
      expect(this.compositeView.$el).to.contain.$text('composite bar');
    });

    it('should render the collections items', function() {
      expect(this.compositeView.$el).to.contain.$text('baz');
    });
  });

  describe('when a composite view triggers render in initialize', function() {
    beforeEach(function() {
      var suite = this;

      this.EmptyView = Backbone.Marionette.ItemView.extend({
        template: '#emptyTemplate',
        tagName: 'hr',
        onShow: function() {
          suite.onShow.push('EMPTY');
        }
      });

      this.ChildView = Backbone.Marionette.ItemView.extend({
        template: '#collectionItemTemplate',
        tagName: 'span'
      });

      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        emptyView: this.EmptyView,
        template: '#collection-template',
        initialize: function() {
          this.render();
        },
        onRender: function() {}
      });

      this.loadFixtures('collectionTemplate.html', 'collectionItemTemplate.html', 'emptyTemplate.html');

      this.m1 = new this.Model({foo: 'bar'});

      this.compositeView = new this.CompositeView({
        model: this.m1,
        collection: new this.Collection()
      });

      this.onShow = [];

      this.compositeView.trigger('show');
    });

    it('should call "onShowCallbacks.add"', function() {
      expect(this.onShow.length === 1).to.be.ok;
    });
  });

  describe('when rendering a composite view without a template', function() {
    beforeEach(function() {
      this.ChildView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView
      });

      this.m1 = new this.Model({foo: 'bar'});
      this.m2 = new this.Model({foo: 'baz'});
      this.collection = new this.Collection();
      this.collection.add(this.m2);

      this.compositeView = new this.CompositeView({
        model: this.m1,
        collection: this.collection
      });
    });

    it('should throw an exception because there was no valid template', function() {
      expect(this.compositeView.render).to.throw('Cannot render the template since its false, null or undefined.');
    });
  });

  describe('when rendering a composite view', function() {
    beforeEach(function() {
      var suite = this;

      this.ChildView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: '#composite-template',
        onRender: function() {}
      });

      this.order = [];
      this.loadFixtures('compositeTemplate.html');

      this.m1 = new this.Model({foo: 'bar'});
      this.m2 = new this.Model({foo: 'baz'});
      this.collection = new this.Collection();
      this.collection.add(this.m2);

      this.compositeView = new this.CompositeView({
        model: this.m1,
        collection: this.collection
      });

      this.compositeView.on('render:template', function() {
        suite.order.push(suite.compositeView.renderedModelView);
      });

      this.compositeView.on('render:collection', function() {
        suite.order.push(suite.compositeView.collection);
      });

      this.compositeView.on('render', function() {
        suite.order.push(suite.compositeView);
      });

      this.sinon.spy(this.compositeView, 'trigger');
      this.sinon.spy(this.compositeView, 'onRender');

      this.compositeView.render();
    });

    it('should trigger a render event for the model view', function() {
      expect(this.compositeView.trigger).to.have.been.calledWith('render:template');
    });

    it('should trigger a before:render event for the collection', function() {
      expect(this.compositeView.trigger).to.have.been.calledWith('before:render:collection', this.compositeView);
    });

    it('should trigger a render event for the collection', function() {
      expect(this.compositeView.trigger).to.have.been.calledWith('render:collection', this.compositeView);
    });

    it('should trigger a render event for the composite view', function() {
      expect(this.compositeView.trigger).to.have.been.calledWith('render', this.compositeView);
    });

    it('should guarantee rendering of the model before rendering the collection', function() {
      expect(this.order[0]).to.equal(this.compositeView.renderedModelView);
      expect(this.order[1]).to.equal(this.compositeView.collection);
      expect(this.order[2]).to.equal(this.compositeView);
    });

    it('should call "onRender"', function() {
      expect(this.compositeView.onRender).to.have.been.called;
    });

    it('should only call "onRender" once', function() {
      expect(this.compositeView.onRender.callCount).to.equal(1);
    });
  });

  describe('when rendering a composite view twice', function() {
    beforeEach(function() {
      this.ChildView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeModelView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: '#composite-template'
      });

      this.loadFixtures('compositeTemplate.html');

      this.m1 = new this.Model({foo: 'bar'});
      this.m2 = new this.Model({foo: 'baz'});
      this.collection = new this.Collection();
      this.collection.add(this.m2);

      this.compositeView = new this.CompositeModelView({
        model: this.m1,
        collection: this.collection
      });

      this.sinon.spy(this.compositeView, 'render');
      this.sinon.spy(this.compositeView, 'destroyChildren');
      this.sinon.spy(Backbone.Marionette.Renderer, 'render');
      this.compositeRenderSpy = this.compositeView.render;

      this.compositeView.render();
      this.compositeView.render();
    });

    it('should re-render the template view', function() {
      expect(Backbone.Marionette.Renderer.render.callCount).to.equal(2);
    });

    it('should destroy all of the child collection child views', function() {
      expect(this.compositeView.destroyChildren).to.have.been.called;
      expect(this.compositeView.destroyChildren.callCount).to.equal(2);
    });

    it('should re-render the collections items', function() {
      expect(this.compositeRenderSpy.callCount).to.equal(2);
    });
  });

  describe('when rendering a composite view with an empty collection and then resetting the collection', function() {
    beforeEach(function() {
      this.ChildView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: '#composite-template',
        onRender: function() {}
      });

      this.loadFixtures('compositeRerender.html');

      this.m1 = new this.Model({foo: 'bar'});
      this.collection = new this.Collection();
      this.compositeView = new this.CompositeView({
        model: this.m1,
        collection: this.collection
      });

      this.compositeView.render();

      this.m2 = new this.Model({foo: 'baz'});
      this.collection.reset([this.m2]);
    });

    it('should render the template with the model', function() {
      expect(this.compositeView.$el).to.contain.$text('composite bar');
    });

    it('should render the collections items', function() {
      expect(this.compositeView.$el).to.contain.$text('baz');
    });
  });

  describe('when rendering a composite view without a collection', function() {
    beforeEach(function() {
      this.ChildView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: '#composite-template',
        onRender: function() {}
      });

      this.loadFixtures('compositeRerender.html');

      this.m1 = new this.Model({foo: 'bar'});
      this.compositeView = new this.CompositeView({
        model: this.m1
      });

      this.compositeView.render();
    });

    it('should render the template with the model', function() {
      expect(this.compositeView.$el).to.contain.$text('composite bar');
    });

    it('should not render the collections items', function() {
      expect(this.compositeView.$el).not.to.contain.$text('baz');
    });
  });

  describe('when rendering a composite with a collection', function() {
    beforeEach(function() {
      this.ChildView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: '#composite-template',
        onRender: function() {}
      });

      this.loadFixtures('compositeRerender.html');

      this.m1 = new this.Model({foo: 'bar'});
      this.m2 = new this.Model({foo: 'baz'});

      this.collection = new this.Collection([this.m2]);

      this.compositeView = new this.CompositeView({
        model: this.m1,
        collection: this.collection
      });

      this.compositeView.render();

      this.sinon.spy(this.compositeView, '_renderRoot');
    });

    describe('and then resetting the collection', function() {
      beforeEach(function() {
        this.m3 = new this.Model({foo: 'quux'});
        this.m4 = new this.Model({foo: 'widget'});
        this.collection.reset([this.m3, this.m4]);
      });

      it('should not re-render the template with the model', function() {
        expect(this.compositeView._renderRoot).not.to.have.been.called;
      });

      it('should render the collections items', function() {
        expect(this.compositeView.$el).not.to.contain.$text('baz');
        expect(this.compositeView.$el).to.contain.$text('quux');
        expect(this.compositeView.$el).to.contain.$text('widget');
      });
    });

    describe('and then adding to the collection', function() {
      beforeEach(function() {
        this.m3 = new this.Model({foo: 'quux'});
        this.collection.add(this.m3);
      });

      it('should not re-render the template with the model', function() {
        expect(this.compositeView._renderRoot).not.to.have.been.called;
      });

      it('should add to the collections items', function() {
        expect(this.compositeView.$el).to.contain.$text('bar');
        expect(this.compositeView.$el).to.contain.$text('baz');
        expect(this.compositeView.$el).to.contain.$text('quux');
      });
    });

    describe('and then removing from the collection', function() {
      beforeEach(function() {
        this.model = this.collection.at(0);
        this.collection.remove(this.model);
      });

      it('should not re-render the template with the model', function() {
        expect(this.compositeView._renderRoot).not.to.have.been.called;
      });

      it('should remove from the collections items', function() {
        expect(this.compositeView.$el).not.to.contain.$text('baz');
      });
    });
  });

  describe('when working with a composite and recursive model', function() {
    beforeEach(function() {
      this.loadFixtures('recursiveCompositeTemplate.html');

      this.data = {
        name: 'level 1',
        nodes: [
          {
            name: 'level 2',
            nodes: [
              {
                name: 'level 3'
              }
            ]
          }
        ]
      };

      this.node = new this.Node(this.data);
      this.treeView = new this.TreeView({
        model: this.node
      });

      this.treeView.render();
    });

    it('should render the template with the model', function() {
      expect(this.treeView.$el).to.contain.$text('level 1');
    });

    it('should render the collections items', function() {
      expect(this.treeView.$el).to.contain.$text('level 2');
    });

    it('should render all the levels of the nested object', function() {
      expect(this.treeView.$el).to.contain.$text('level 3');
    });
  });

  describe('when destroying a composite view', function() {
    beforeEach(function() {
      this.ChildView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeModelView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: '#composite-template'
      });

      this.loadFixtures('compositeTemplate.html');

      this.m1 = new this.Model({foo: 'bar'});
      this.m2 = new this.Model({foo: 'baz'});
      this.collection = new this.Collection();
      this.collection.add(this.m2);

      this.compositeView = new this.CompositeModelView({
        model: this.m1,
        collection: this.collection
      });

      this.sinon.spy(this.CompositeModelView.prototype, 'destroy');

      this.compositeView.render();
      this.compositeView.destroy();
    });

    it('should delete the model view', function() {
      expect(this.compositeView.renderedModelView).to.be.undefined;
    });

    it('should destroy the collection of views', function() {
      expect(this.CompositeModelView.prototype.destroy.callCount).to.equal(1);
    });
  });

  describe('when rendering a composite view with no model, using a template to create a grid', function() {
    beforeEach(function() {
      // A Grid Row
      this.GridRow = Backbone.Marionette.ItemView.extend({
        tagName: 'tr',
        template: '#row-template'
      });

      // The grid view
      this.GridView = Backbone.Marionette.CompositeView.extend({
        tagName: 'table',
        template: '#grid-template',
        childView: this.GridRow,
        attachHtml: function(collectionView, itemView) {
          collectionView.$('tbody').append(itemView.el);
        }
      });

      this.loadFixtures('gridTemplates.html');

      this.userData = [
        {
          username: 'dbailey',
          fullname: 'Derick Bailey'
        },
        {
          username: 'jbob',
          fullname: 'Joe Bob'
        },
        {
          username: 'fbar',
          fullname: 'Foo Bar'
        }
      ];

      this.userList = new this.UserCollection(this.userData);

      this.gridView = new this.GridView({
        tagName: 'table',
        collection: this.userList
      });

      this.gridView.render();
    });

    it('should render the table', function() {
      expect(this.gridView.$('th').length).not.to.equal(0);
    });

    it('should render the users', function() {
      var body = this.gridView.$('tbody');
      expect(body).to.contain.$text('dbailey');
      expect(body).to.contain.$text('jbob');
      expect(body).to.contain.$text('fbar');
    });
  });

  describe('when a composite view has a ui elements hash', function() {
    beforeEach(function() {
      // A Grid Row
      this.GridRow = Backbone.Marionette.ItemView.extend({
        tagName: 'tr',
        template: '#row-template'
      });

      // The grid view
      this.GridView = Backbone.Marionette.CompositeView.extend({
        tagName: 'table',
        template: '#grid-template',
        childView: this.GridRow,

        attachHtml: function(collectionView, itemView) {
          collectionView.$('tbody').append(itemView.el);
        }
      });

      this.GridViewWithUIBindings = this.GridView.extend({
        template: '#ui-binding-template',
        ui: {
          headersRow: 'thead tr',
          unfoundElement: '#unfound',
          itemRows: 'tbody tr'
        }
      });

      this.loadFixtures('uiBindingTemplate.html');

      this.userData = [
        {
          username: 'dbailey',
          fullname: 'Derick Bailey'
        },
        {
          username: 'jbob',
          fullname: 'Joe Bob'
        }
      ];

      this.headersModel = new Backbone.Model({
        userHeader: 'Username',
        nameHeader: 'Full name'
      });

      this.userList = new this.UserCollection(this.userData);

      this.gridView = new this.GridViewWithUIBindings({
        tagName: 'table',
        model: this.headersModel,
        collection: this.userList
      });

      // We don't render the view here since we need more fine-tuned control on when the view is rendered,
      // specifically in the test that asserts the composite view template elements are accessible before
      // the collection is rendered.
    });

    describe('after the whole composite view finished rendering', function() {
      beforeEach(function() {
        this.gridView.render();
      });

      describe('accessing a ui element that belongs to the model template', function() {

        it('should return its jQuery selector if it can be found', function() {
          expect(this.gridView.ui.headersRow.find('th:first-child')).to.contain.$text('Username');
        });

        it('should return an empty jQuery object if it cannot be found', function() {
          expect(this.gridView.ui.unfoundElement.length).to.equal(0);
        });

        it('should return an up-to-date selector on subsequent renders', function() {
          // asserting state before subsequent render
          expect(this.gridView.ui.headersRow.find('th:first-child')).to.contain.$text('Username');

          this.headersModel.set('userHeader', 'User');
          this.gridView.render();

          expect(this.gridView.ui.headersRow.find('th:first-child')).to.contain.$text('User');
        });
      });

      describe('accessing a ui element that belongs to the collection', function() {
        // This test makes it clear that not allowing access to the collection elements is a design decision
        // and not a bug.
        it('should return an empty jQuery object', function() {
          expect(this.gridView.ui.itemRows.length).to.equal(0);
        });
      });
    });

    describe('after the model finished rendering, but before the collection rendered', function() {
      describe('accessing a ui element that belongs to the model template', function() {
        beforeEach(function() {
          var suite = this;

          this.gridView.onBeforeRender = function() {
            suite.called = true;
          };
          this.sinon.spy(this.gridView, 'onBeforeRender');
          this.gridView.render();
        });

        // this test enforces that ui elements should be accessible as soon as their html was inserted
        // to the DOM
        it('should return its jQuery selector', function() {
          expect(this.gridView.onBeforeRender).to.have.been.called;
        });

        it('should set the username', function() {
          expect($(this.gridView.ui.headersRow).find('th:first-child').text()).to.equal('Username');
        });
      });
    });
  });

  describe('has a valid inheritance chain back to Marionette.CollectionView', function() {
    beforeEach(function() {
      this.constructor = this.sinon.spy(Marionette, 'CollectionView');
      this.compositeView = new Marionette.CompositeView();
    });

    it('calls the parent Marionette.CollectionViews constructor function on instantiation', function() {
      expect(this.constructor).to.have.been.called;
    });
  });
});
