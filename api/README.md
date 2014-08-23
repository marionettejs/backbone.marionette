## JS Doc Overview

We on Marionette, believe that documentation is incredibly important. Because of that, we've gone the extra mile to design an api format (jsdoc) that works great for us.
 
### Goals
1. Documentation should be in its own file
Good documentation is just as important as good source and tests. 

  Tests takes space to do right and context. 
Separating the the docs from the source makes it much easier to evaluate the documentation holistically.

2. Documentation should be structured

  There are many different components of documentation that should be structured: function signatures, descriptions, properties, examples.
Each of these types should be optimized so that it's easy to record the relevant information. 

  Function signatures fit naturally with `@tag` formats, while descriptions and examples fit well as markdown.
Yaml as overall document format provides the overall structure for the document so that the content is properly organized.

3. Documentation should have great content

  This should go without saying, but too often the documentation fails at being practical.

  The documentation should have complete coverage over all of the ways any class function could be used or property value set.

  The documentation should also have examples for the main use cases and explain the pros and cons of those approaches.

### Structure of the jsdoc document
+ class
+ namespace
+ name
+ examples
+ properties
+ constructor
+ functions


### Example Doc
```yaml
name: Region
class: Region
namespace: Marionette
description: |
  # Regions do really cool things

properties:
  currentView: |
    current view is important

constructor: |
  instantiate ya
  
functions: 
  show: 
    description: |
      show yea
      
      @param woo
      
    examples:
      -
        name: Showing a simple view
        example: |
          markdown example

  empty: |
    This is just a jsdoc description. 
    Why, because I'm lazy and don't want to write any examples
```

### Compile phase
Jsdoc documents are compiled by running `grunt api`. Under the hood, the docs are compiled with the `jsDocFiles` task.

The `jsdoc` files are compiled via a two-phase process. First, they're parsed through `yaml` to `json`. Then the `jsdoc` sections are parsed with the great `dox` library.

The result is a `json` api document in the `jsdoc` folder. We use the `json` files on the website to present the api, but you can feel free to use it for other purposes as well.


### Gotchas

#### jsdoc sections
It's important to know a little `yaml` and a little `jsdoc` to document a function.

1. all `jsdoc` sections start with a pipe (`|`). This is because when `yaml` sees that it will convert the subsequent content to text.
2. `jsdoc` always begins with at least one line of description. Multiple line descriptions are cool, but the first line will become a summary.
3. `jsdoc` loves its tags, you should read all about them, but here are the basics `@param`, `return`, `@api`

```js
_.extend(Foo.prototype, {
  foo: function(options) {
    // does foo
  }
})
```
```yaml
functions: 
  foo: |
     This is my description
        
     @param {Object} options
     @return this
     @api private
``` 


#### Whitespace matters

The api is written in `yaml`, so whitespace matters.

  #### > line 18 is bad
  ![](http://f.cl.ly/items/0O3B0P3G3u1o3i112G16/Image%202014-08-22%20at%209.27.36%20PM.png)

  #### > line 18 is good
  ![](http://f.cl.ly/items/272h0V442i0c1j1L3V3o/Image%202014-08-22%20at%209.27.42%20PM.png)

#### Lists
`Yaml`, is a little funny. One of the most common questions is how to list an array of objects.
This comes up in our `jsdocs` when you're showing a list of examples.

The appropriate way to do that is to separate each item in the list with a dash (`-`)

```yaml
examples:
  -
    name: first example
    example: |
       my cool markdown based example
  -
    name: second example
    example: |
       my cool markdown based example
```

