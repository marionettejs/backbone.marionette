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

    this.treeViewTemplateFn = _.template('<li>name: <%= name %></li>');

    this.TreeView = Backbone.Marionette.CompositeView.extend({
      tagName: 'ul',
      template: this.treeViewTemplateFn,
      initialize: function() {
        this.collection = this.model.nodes;
      }
    });
  });

  describe('when instantiating a composite view', function() {
    beforeEach(function() {
      Marionette.DEV_MODE = true;
      this.sinon.spy(Marionette.deprecate, '_warn');
      this.sinon.stub(Marionette.deprecate, '_console', {
        warn: this.sinon.stub()
      });
      Marionette.deprecate._cache = {};

      this.view = new Backbone.Marionette.CompositeView();
    });

    it('should call Marionette.deprecate', function() {
      expect(Marionette.deprecate._warn).to.be.calledWith('Deprecation warning: CompositeView is deprecated. Convert to View at your earliest convenience');
    });

    afterEach(function() {
      Marionette.DEV_MODE = false;
    });
  });

  describe('when a composite view has a template without a model', function() {
    beforeEach(function() {
      this.templateFn = _.template('composite template');

      this.ChildView = Backbone.Marionette.View.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeViewNoModel = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: this.templateFn
      });

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

  describe('when rendering with a overridden attachElContent', function() {
    beforeEach(function() {
      this.attachElContentStub = this.sinon.stub();
      this.CompositeView = Marionette.CompositeView.extend({
        template: function() {},
        attachElContent: this.attachElContentStub
      });

      this.compositeView = new this.CompositeView();

      this.compositeView.render();
    });

    it('should render according to the custom attachElContent logic', function() {
      expect(this.attachElContentStub).to.have.been.calledOnce.and.calledWith(undefined);
    });
  });

  describe('when a composite view has a model and a template', function() {
    beforeEach(function() {
      this.templateFn = _.template('composite <%= foo %>');
      this.ChildView = Backbone.Marionette.View.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: this.templateFn,
        onRender: function() {}
      });

      this.m1 = new this.Model({foo: 'bar'});
      this.m2 = new this.Model({foo: 'baz'});
      this.collection = new this.Collection();
      this.collection.add(this.m2);

      this.compositeView = new this.CompositeView({
        model: this.m1,
        collection: this.collection
      });

      this.sinon.spy(Marionette.Renderer, 'render');

      this.compositeView.render();
    });

    it('should render the template with the model', function() {
      expect(this.compositeView.$el).to.contain.$text('composite bar');
    });

    it('should render the collections items', function() {
      expect(this.compositeView.$el).to.contain.$text('baz');
    });

    it('should pass template fn, data, and view instance to Marionette.Renderer.Render', function() {
      expect(Marionette.Renderer.render).to.have.been.calledWith(this.templateFn, {foo: 'bar'}, this.compositeView);
    });
  });

  describe('when a composite view triggers render in initialize', function() {
    var onAttachCalls;

    beforeEach(function() {
      onAttachCalls = [];

      this.collectionTemplateFn = _.template('');
      this.collectionItemTemplateFn = _.template('<% _.each(items, function(item){ %><span><%= item.foo %></span><% }) %>');
      this.emptyTemplateFn = _.template('&nbsp;');

      this.EmptyView = Backbone.Marionette.View.extend({
        template: this.emptyTemplateFn,
        tagName: 'hr',
        onAttach: function() {
          onAttachCalls.push('EMPTY');
        }
      });

      this.ChildView = Backbone.Marionette.View.extend({
        template: this.collectionItemTemplateFn,
        tagName: 'span'
      });

      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        emptyView: this.EmptyView,
        template: this.collectionTemplateFn,
        initialize: function() {
          this.render();
        },
        onRender: function() {}
      });

      this.m1 = new this.Model({foo: 'bar'});

      this.compositeView = new this.CompositeView({
        model: this.m1,
        collection: new this.Collection()
      });

      this.setFixtures('<div id="region"></div>');
      var region = new Backbone.Marionette.Region({el: '#region'});
      region.show(this.compositeView);
    });

    it('should call onAttach on its empty view', function() {
      expect(onAttachCalls.length).to.equal(1);
    });
  });

  describe('when rendering a composite view without a template', function() {
    beforeEach(function() {
      this.ChildView = Backbone.Marionette.View.extend({
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
      this.templateFn = _.template('composite <%= foo %>');

      this.ChildView = Backbone.Marionette.View.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: this.templateFn,
        onBeforeRender: function() {
          return this.isRendered();
        },
        onRender: function() {
          return this.isRendered();
        }
      });

      this.m1 = new this.Model({foo: 'bar'});
      this.m2 = new this.Model({foo: 'baz'});
      this.collection = new this.Collection();
      this.collection.add(this.m2);

      this.compositeView = new this.CompositeView({
        model: this.m1,
        collection: this.collection
      });

      this.sinon.spy(this.compositeView, 'trigger');
      this.sinon.spy(this.compositeView, 'onBeforeRender');
      this.sinon.spy(this.compositeView, 'onRender');
      this.sinon.spy(this.compositeView, '_renderTemplate');
      this.sinon.spy(this.compositeView, 'bindUIElements');
      this.sinon.spy(this.compositeView, 'renderChildren');

      this.compositeView.render();
    });

    it('should trigger a before:render event for the collection', function() {
      expect(this.compositeView.trigger).to.have.been.calledWith('before:render:children', this.compositeView);
    });

    it('should trigger a render event for the collection', function() {
      expect(this.compositeView.trigger).to.have.been.calledWith('render:children', this.compositeView);
    });

    it('should trigger a render event for the composite view', function() {
      expect(this.compositeView.trigger).to.have.been.calledWith('render', this.compositeView);
    });

    // ui bindings will only be available after the model is rendered,
    // but should be available before the collection is rendered.
    it('should guarantee rendering of the model before rendering the collection', function() {
      sinon.assert.callOrder(this.compositeView._renderTemplate, this.compositeView.bindUIElements, this.compositeView.renderChildren);
    });

    it('should call "onBeforeRender"', function() {
      expect(this.compositeView.onBeforeRender).to.have.been.calledOnce;
    });

    it('should call "onRender"', function() {
      expect(this.compositeView.onRender).to.have.been.calledOnce;
    });

    it('should call "onBeforeRender" before "onRender"', function() {
      expect(this.compositeView.onBeforeRender).to.have.been.calledBefore(this.compositeView.onRender);
    });

    it('should not be rendered when "onBeforeRender" is called', function() {
      expect(this.compositeView.onBeforeRender.lastCall.returnValue).not.to.be.ok;
    });

    it('should be rendered when "onRender" is called', function() {
      expect(this.compositeView.onRender.lastCall.returnValue).to.be.true;
    });

    it('should mark as rendered', function() {
      expect(this.compositeView).to.have.property('_isRendered', true);
    });
  });

  describe('when rendering a composite view twice', function() {
    beforeEach(function() {
      this.templateFn = _.template('composite <%= foo %>');

      this.ChildView = Backbone.Marionette.View.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeModelView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: this.templateFn
      });

      this.m1 = new this.Model({foo: 'bar'});
      this.m2 = new this.Model({foo: 'baz'});
      this.collection = new this.Collection();
      this.collection.add(this.m2);

      this.compositeView = new this.CompositeModelView({
        model: this.m1,
        collection: this.collection
      });

      this.sinon.spy(this.compositeView, 'render');
      this.sinon.spy(this.compositeView, '_destroyChildren');
      this.sinon.spy(Backbone.Marionette.Renderer, 'render');
      this.compositeRenderSpy = this.compositeView.render;

      this.compositeView.render();
      this.compositeView.render();
    });

    it('should re-render the template view', function() {
      expect(Backbone.Marionette.Renderer.render.callCount).to.equal(2);
    });

    it('should destroy all of the child collection child views', function() {
      expect(this.compositeView._destroyChildren).to.have.been.called;
      expect(this.compositeView._destroyChildren.callCount).to.equal(1);
    });

    it('should re-render the collections items', function() {
      expect(this.compositeRenderSpy.callCount).to.equal(2);
    });
  });

  describe('when rendering a composite view with an empty collection and then resetting the collection', function() {
    beforeEach(function() {
      this.templateFn = _.template('composite <%= foo %>');

      this.ChildView = Backbone.Marionette.View.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: this.templateFn,
        onRender: function() {}
      });

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
      this.templateFn = _.template('composite <%= foo %>');

      this.ChildView = Backbone.Marionette.View.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: this.templateFn,
        onRender: function() {}
      });

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
      this.templateFn = _.template('composite <%= foo %>');

      this.childViewTagName = 'span';

      this.ChildView = Backbone.Marionette.View.extend({
        tagName: this.childViewTagName,
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: this.templateFn,
        onRender: function() {}
      });

      this.m1 = new this.Model({foo: 'bar'});
      this.m2 = new this.Model({foo: 'baz'});

      this.collection = new this.Collection([this.m2]);

      this.compositeView = new this.CompositeView({
        model: this.m1,
        collection: this.collection
      });

      this.compositeView.render();

      this.sinon.spy(this.compositeView, '_renderTemplate');
      this.sinon.spy(this.compositeView, 'getChildViewContainer');
    });

    describe('and then resetting the collection', function() {
      beforeEach(function() {
        this.m3 = new this.Model({foo: 'quux'});
        this.m4 = new this.Model({foo: 'widget'});
        this.collection.reset([this.m3, this.m4]);
      });

      it('should not re-render the template with the model', function() {
        expect(this.compositeView._renderTemplate).not.to.have.been.called;
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
        expect(this.compositeView._renderTemplate).not.to.have.been.called;
      });

      it('should add to the collections items', function() {
        expect(this.compositeView.$el).to.contain.$text('bar');
        expect(this.compositeView.$el).to.contain.$text('baz');
        expect(this.compositeView.$el).to.contain.$text('quux');
      });

      it('shound send childView to getChildViewContainer', function() {
        expect(this.compositeView.getChildViewContainer).to.have.been.called;
        expect(this.compositeView.getChildViewContainer.getCall(0).args[1].tagName).to.equal(this.childViewTagName);
      });
    });

    describe('and then removing from the collection', function() {
      beforeEach(function() {
        this.model = this.collection.at(0);
        this.collection.remove(this.model);
      });

      it('should not re-render the template with the model', function() {
        expect(this.compositeView._renderTemplate).not.to.have.been.called;
      });

      it('should remove from the collections items', function() {
        expect(this.compositeView.$el).not.to.contain.$text('baz');
      });
    });
  });

  describe('when defining childView as neither a function or a class', function() {
    beforeEach(function() {
      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        template: _.template('composite'),
        onRender: function() {}
      });

      this.collection = new Backbone.Collection([{id: 1, name: 'one'}, {id: 2, name: 'two'}]);

      this.compositeView = new this.CompositeView({
        collection: this.collection,
        childView: 'invalid childView'
      });
    });

    it('should throw an error saying the childView is invalid', function() {
      expect(this.compositeView.render).to.throw('"childView" must be a view class or a function that returns a view class');
    });
  });

  describe('when working with a composite and recursive model', function() {
    beforeEach(function() {
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
      this.templateFn = _.template('composite <%= foo %>');

      this.ChildView = Backbone.Marionette.View.extend({
        tagName: 'span',
        render: function() {
          this.$el.html(this.model.get('foo'));
        }
      });

      this.CompositeModelView = Backbone.Marionette.CompositeView.extend({
        childView: this.ChildView,
        template: this.templateFn
      });

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
      expect(this.CompositeModelView.prototype.destroy).to.have.been.calledOnce;
    });

    it('should be marked destroyed', function() {
      expect(this.compositeView).to.have.property('_isDestroyed', true);
    });

    it('should be marked not rendered', function() {
      expect(this.compositeView).to.have.property('_isRendered', false);
    });
  });

  describe('when rendering a composite view with no model, using a template to create a grid', function() {
    beforeEach(function() {
      this.gridTemplateFn = _.template('<thead><tr><th>Username</th><th>Full Name</th><tr></thead><tbody></tbody>');
      this.gridRowTemplateFn = _.template('<td><%= username %></td><td><%= fullname %></td>');

      // A Grid Row
      this.GridRow = Backbone.Marionette.View.extend({
        tagName: 'tr',
        template: this.gridRowTemplateFn
      });

      // The grid view
      this.GridView = Backbone.Marionette.CompositeView.extend({
        tagName: 'table',
        template: this.gridTemplateFn,
        childView: this.GridRow,
        attachHtml: function(collectionView, itemView) {
          collectionView.$('tbody').append(itemView.el);
        }
      });

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
      this.gridTemplateFn = _.template('<thead><tr><th>Username</th><th>Full Name</th><tr></thead><tbody></tbody>');
      this.gridRowTemplateFn = _.template('<td><%= username %></td><td><%= fullname %></td>');
      this.GridViewWithUIBindingsTemplateFn = _.template('<thead><tr><th><%= userHeader %></th><th><%= nameHeader %></th><tr></thead><tbody></tbody>');

      // A Grid Row
      this.GridRow = Backbone.Marionette.View.extend({
        tagName: 'tr',
        template: this.gridRowTemplateFn
      });

      // The grid view
      this.GridView = Backbone.Marionette.CompositeView.extend({
        tagName: 'table',
        template: this.gridTemplateFn,
        childView: this.GridRow,

        attachHtml: function(collectionView, itemView) {
          collectionView.$('tbody').append(itemView.el);
        }
      });

      this.GridViewWithUIBindings = this.GridView.extend({
        template: this.GridViewWithUIBindingsTemplateFn,
        ui: {
          headersRow: 'thead tr',
          unfoundElement: '#unfound',
          itemRows: 'tbody tr'
        }
      });

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

  describe('when serializing view data', function() {
    beforeEach(function() {
      this.modelData = {foo: 'bar'};
      this.view = new Marionette.CompositeView();
      this.sinon.spy(this.view, 'serializeModel');
    });

    it('should return an empty object without data', function() {
      expect(this.view.serializeData()).to.deep.equal({});
    });

    describe('and the view has a model', function() {
      beforeEach(function() {
        this.view.model = new Backbone.Model(this.modelData);
        this.view.serializeData();
      });

      it('should call serializeModel', function() {
        expect(this.view.serializeModel).to.have.been.calledOnce;
      });
    });
  });

  describe('has a valid inheritance chain back to Marionette.CollectionView', function() {
    beforeEach(function() {
      this.constructor = this.sinon.spy(Marionette.CollectionView.prototype, 'constructor');
      this.compositeView = new Marionette.CompositeView();
    });

    it('calls the parent Marionette.CollectionViews constructor function on instantiation', function() {
      expect(this.constructor).to.have.been.calledOnce;
    });
  });

  describe('when defining childView as a function that returns a view class', function() {
    beforeEach(function() {

      this.m1 = new this.Model({id: 1, name: 'one'});
      this.m2 = new this.Model({id: 2, name: 'two'});
      this.m3 = new this.Model({foo: 'bar'});
      this.collection = new this.Collection([this.m1, this.m2]);

      this.EvenView = Marionette.View.extend({
        tagName: 'span',
        template: _.template('My name is <%= name %>. I am even.')
      });

      this.OddView = Marionette.View.extend({
        tagName: 'article',
        template: _.template('My name is <%= name %>. I am odd.')
      });

      var suite = this;
      this.CompositeView = Backbone.Marionette.CompositeView.extend({
        template: _.template('<header>composite template <%= foo %><div id="cv-container"></div></header>'),
        childViewContainer: '#cv-container',
        childView: function(child) {
          return child.get('id') % 2 === 0 ? suite.EvenView : suite.OddView;
        }
      });

      this.compositeView = new this.CompositeView({
        collection: this.collection,
        model: this.m3
      });

      this.compositeView.render();
    });

    it('should use the correct view class for each child', function() {
      var markupString = '<header>composite template bar<div id="cv-container"><article>My name is one. I am odd.</article><span>My name is two. I am even.</span></div></header>';
      expect(this.compositeView.$el).to.have.$html(markupString);
    });
  });

  describe('when rendering with a false template', function() {
    beforeEach(function() {
      this.onBeforeRenderStub = this.sinon.stub();
      this.onRenderStub = this.sinon.stub();

      this.CompositeView = Marionette.CompositeView.extend({
        template: false,
        onBeforeRender: this.onBeforeRenderStub,
        onRender: this.onRenderStub,

        ui: {
          testElement: '.test-element'
        }
      });

      this.compositeView = new this.CompositeView();

      this.marionetteRendererSpy = this.sinon.spy(Marionette.Renderer, 'render');
      this.triggerSpy = this.sinon.spy(this.compositeView, 'trigger');
      this.serializeDataSpy = this.sinon.spy(this.compositeView, 'serializeData');
      this.mixinTemplateContextSpy = this.sinon.spy(this.compositeView, 'mixinTemplateContext');
      this.attachElContentSpy = this.sinon.spy(this.compositeView, 'attachElContent');
      this.bindUIElementsSpy = this.sinon.spy(this.compositeView, 'bindUIElements');
      this.compositeView.render();
    });

    describe('when DEV_MODE is true', function() {
      beforeEach(function() {
        Marionette.DEV_MODE = true;
        this.sinon.spy(Marionette.deprecate, '_warn');
        this.sinon.stub(Marionette.deprecate, '_console', {
          warn: this.sinon.stub()
        });
        Marionette.deprecate._cache = {};
      });

      it('should call Marionette.deprecate', function() {
        this.compositeView.render();
        expect(Marionette.deprecate._warn).to.be.calledWith('Deprecation warning: template:false is deprecated.  Use _.noop.');
      });

      afterEach(function() {
        Marionette.DEV_MODE = false;
      });
    });

    it('should not throw an exception for a false template', function() {
      expect(this.compositeView.render).to.not.throw('Cannot render the template since it is null or undefined.');
    });

    it('should call an "onBeforeRender" method on the view', function() {
      expect(this.onBeforeRenderStub).to.have.been.calledOnce;
    });

    it('should call an "onRender" method on the view', function() {
      expect(this.onRenderStub).to.have.been.calledOnce;
    });

    it('should call bindUIElements', function() {
      expect(this.bindUIElementsSpy).to.have.been.calledOnce;
    });

    it('should trigger a before:render event', function() {
      expect(this.triggerSpy).to.have.been.calledWith('before:render', this.compositeView);
    });

    it('should trigger a rendered event', function() {
      expect(this.triggerSpy).to.have.been.calledWith('render', this.compositeView);
    });

    it('should not add in data or template context', function() {
      expect(this.serializeDataSpy).to.not.have.been.called;
      expect(this.mixinTemplateContextSpy).to.not.have.been.called;
    });

    it('should not render a template', function() {
      expect(this.marionetteRendererSpy).to.not.have.been.called;
    });

    it('should not attach any html content', function() {
      expect(this.attachElContentSpy).to.not.have.been.called;
    });

    it('should claim isRendered', function() {
      expect(this.compositeView.isRendered()).to.be.true;
    });
  });
});
