describe('marionette application', function() {
  'use strict';

  describe('when instantiating an app with options specified', function() {
    beforeEach(function() {
      this.fooOption = 'bar';
      this.app = new Marionette.Application({fooOption: this.fooOption});
    });

    it('should merge those options into the app', function() {
      expect(this.app.fooOption).to.equal(this.fooOption);
    });
  });

  describe('when specifying an on start callback, and starting the app', function() {
    beforeEach(function() {
      this.fooOptions = {foo: 'bar'};
      this.app = new Marionette.Application();

      this.startStub = this.sinon.stub();
      this.app.on('start', this.startStub);

      this.app.start(this.fooOptions);
    });

    it('should run the onStart callback', function() {
      expect(this.startStub).to.have.been.called;
    });

    it('should pass the startup option to the callback', function() {
      expect(this.startStub).to.have.been.calledOnce.and.calledWith(this.fooOptions);
    });

    it('should have a cidPrefix', function() {
      expect(this.app.cidPrefix).to.equal('mna');
    });

    it('should have a cid', function() {
      expect(this.app.cid).to.exist;
    });
  });
});
