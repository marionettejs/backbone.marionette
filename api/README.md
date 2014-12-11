## API Documentation – JSDoc

This is the folder for our API docs files. The files are parsed by JSDoc and converted into HTML during the www build
step. Although they're JSDoc, there might be some differences from what you're used to. First, we separated the documentation
from the source code so as not to impede the readability of the source files themselves. Secondly, we selected YAML as our
format of choice to take advantage of its readability and lightweight syntax.

### Structure of a Marionette YAML document

These are the top-level properties of each YAML file for the Marionette docs. Given that they're
not always required for each object that's being documented, they're all optional.

+ class
+ namespace
+ name
+ examples
+ properties
+ constructor
+ functions

#### Example

```yaml
name: Region
class: Region
namespace: Marionette
description: |
  # Regions are a persistent container for displaying Views.

properties:
  currentView: |
    The View that is currently being displayed inside of the Region.

constructor: |
  Instantiates the Region, creating its `el`.

functions:
  show:
    description: |
      Displays the passed-in `view` within the Region, destroying the current View, if there is one.

      @param view

    examples:
      -
        name: Showing a simple view
        example: |
          An example could be included here.
          It can span several lines, and it can also contain markdown.
```

### Compiling & Linting the Docs

The JSDoc files are compiled by running `grunt api` from the command line. This lints the files, then compiles the YAML into JSON documents,
placing them within in the `jsdoc` folder.

### Previewing the API

There are a couple steps needed for seeing the api on the website.

1. Clone the website
```bash
git clone git@github.com:marionettejs/marionettejs.com.git
```

2. Move into the website
```bash
cd marionettejs.com
```

3. Install the website dependencies
```bash
npm run setup
```

4. Build the api
```bash
grunt compile-api
```


#### Steps
cd www
bundle install
bundle exec rake api
middleman server
open http://0.0.0.0:4567/api
```

#### Local API
![](http://f.cl.ly/items/3w3w351W0Q1K0S0G2501/Image%202014-10-01%20at%201.19.05%20AM.png)

### Getting Started with YAML & JSDoc

It can be useful to know a few facts about YAML and JSDoc before making changes to the documentation. We'll list a few common
features of these languages that might come in handy to you.

#### JSDoc Sections

1. All JSDoc sections start with a pipe (`|`). This indicates to YAML that the subsequent content is intended to be parsed as text.
2. JSDoc always begins with a description, which can span multiple lines. The first line is special in that it is intended to be used as a summary.
3. JSDoc has a wide variety of tags, many of which are relevant to our documentation. There is sufficient documentation on [all of them on the JSDoc website](http://usejsdoc.org/).
  Three of the most common tags are `@param`, `return`, and `@api`, which you'll find examples of below.

```js
_.extend(Foo.prototype, {
  foo: function(options) {
    // do something interesting
    return this;
  }
});
```

```yaml
functions:
  foo: |
     This is the description of this method.

     @param {Object} options
     @return this
     @api private
```


#### Whitespace matters

Unlike JSON, whitespace has meaning in YAML. To give an example of a good and bad JSDoc file here are two examples.

In the first image, line 18 has an error because it doesn't consider the second paragraph as part of the same
description.

![](http://f.cl.ly/items/0O3B0P3G3u1o3i112G16/Image%202014-08-22%20at%209.27.36%20PM.png)

To fix it add a line of whitespace that matches the indentation of the paragraphs.

![](http://f.cl.ly/items/272h0V442i0c1j1L3V3o/Image%202014-08-22%20at%209.27.42%20PM.png)

#### YAML Lists

To create a list in YAML, separate each section with a hyphen on its own line (`-`)

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
