### Unit Tests


### Running unit tests

1. via the command line

```
grunt test
```

2. in the browser
```
open SpecRunner.html
```


### Adding a new test file

New test files are added as a script tag to the SpecRunner.html

```html
<script src="test/unit/application.app-regions.spec.js"></script>
<script src="test/unit/application.spec.js"></script>
```


### Adding a new source file

When you want to add a new source file to be tested, the file needs to be added in two places

1. SpecRunner.html

```html
<script src="src/item-view.js"></script>
```

2. unit/setup/node.js file

```js
requireHelper('composite-view');
```