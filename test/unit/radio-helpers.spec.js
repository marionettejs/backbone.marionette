describe('Marionette radio helpers', function() {

  describe('when creating a Marionette.Object', function() {

    beforeEach(function() {
      this.clickStub1 = this.sinon.stub();
      this.clickStub2 = this.sinon.stub();
      this.clickStub3 = this.sinon.stub();
      this.Object = Marionette.Object.extend({
        radioEvents: {
          'foo bar': this.clickStub1
        },
        radioRequests: {
          'foo bar': 'baz'
        },

        baz: this.clickStub3,

      });
      this.object = new this.Object();
      Backbone.Radio.channel('foo').trigger('bar');
      Backbone.Radio.channel('foo').request('bar');

    });

    it('should support listening to radio events declaratively', function() {
      expect(this.clickStub1).to.have.been.calledOnce;
    });

    it('should support replying to radio requests declaratively', function() {
      expect(this.clickStub3).to.have.been.calledOnce;
    });

    it('should unsubscribe events when the object is destroyed', function() {
      this.object.destroy();
      Backbone.Radio.channel('foo').trigger('bar');
      expect(this.clickStub1).to.have.been.calledOnce;
    });

    it('should unsubscribe requests when the object is destroyed', function() {
      this.object.destroy();
      Backbone.Radio.channel('foo').request('bar');
      expect(this.clickStub3).to.have.been.calledOnce;
    });

    it('shouldn\'t overunsubscribe events when the object is destroyed', function() {
      this.object2 = new this.Object();
      this.object.destroy();
      Backbone.Radio.channel('foo').trigger('bar');
      expect(this.clickStub1).to.have.been.calledTwice;
    });

    it('shouldn\'t overunsubscribe requests when the object is destroyed', function() {
      this.object2 = new this.Object();
      this.object.destroy();
      Backbone.Radio.channel('foo').request('bar');
      expect(this.clickStub3).to.have.been.calledTwice;
    });

  });

});
