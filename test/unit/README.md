### Unit Tests


### Running unit tests

1. Running just unit tests - `npm run test`

2. Running coverage reporter - `npm run coverage`. 
To check coverage, open `./coverage/lcov-report/index.html`.

3. Running tests in browser - `test-browser`.


### Common concepts for writing tests

1. Test suites should cover only public API.

2. Code style.

- Each `describe` should have name of tested method. 

> There are should be not more then 1 nested describe for on method.
 
Wrong way.
 
 ```javascript
 
 describe('some events in myMethod', function() {
   describe('some logic', function() {
     it('do something', function() {
      ...  
     })
     
     describe('some other logic', function() {
       etc...
     })
   })
 })
```


Wright way.


```javascript
 
  describe('#myMethod', function() {
    describe('when some logic', function() {
      it('should do something', function() {
        ...  
      })
    })
   
    describe('when some other logic', function() {
      it('should do something', function() {
        ...  
      })
    })
 })
```


- `before/beforeEach` should consist only some preparation logic 
but not call methods you expect to test.

Wrong way.

```javascript
  describe('#myMethod', function() {
    let myInstance;
    
    beforeEach(function() {
      myInstance = new MyClass({
        render: this.sinon.spy
      });
      myInstance.render();
    })
   
    it('should do something', function() {
      expect(myInstance.render).to.have.been.called;
    })
 })
```

Wright way.

```javascript
  describe('#myMethod', function() {
    let myInstance;
    let renderSpy;
    
    beforeEach(function() {
      renderSpy = this.sinon.spy();
      
      myInstance = new MyClass({
        render: renderSpy
      });
    })
   
    it('should do something', function() {
      myInstance.render();
      
      expect(renderSpy).to.have.been.called;
    })
 })
```

