/*
 * jsDocFiles is a task for compiling jsdoc api files
 *
 */

'use strict';

var dox = require('dox');
var _ = require('underscore');
var yaml = require('js-yaml');
var marked = require('marked');
var highlight = require('highlight.js');

function JsDocFilesTask(grunt) {
  this.grunt = grunt;
  this.markdown = new marked.Renderer();
  this.dox = dox.setMarkedOptions({
      renderer: this.markdown
    , gfm: true
    , tables: true
    , breaks: false
    , pedantic: false
    , sanitize: false
    , smartLists: true
    , smartypants: false
    , highlight: function(code, lang) {
        return highlight.highlight(lang, code).value;
    }
  })
};

_.extend(JsDocFilesTask.prototype, {
  buildFiles: function(files) {
    files.forEach(function(file) {
      file.src
        .filter(function(filepath) {
          return this.grunt.file.exists(filepath) && !this.grunt.file.isDir(filepath);
        }.bind(this))
        .map(function(filepath) {
          return this.compileJsDoc(file, filepath);
        }.bind(this));
    }.bind(this));
  },

  compileJsDoc: function(file, filepath) {

    var doc = this.grunt.file.read(filepath);
    var json = this.parseYaml(doc);

    json.functions = this.buildFunctions(json.functions);
    json.properties = this.buildProperties(json.properties);
    json.examples = this.buildExamples(json.examples);

    json.description = this.parseDescription(json.description);

    json.constructor = json.constructor || "";

    json.constructor = this.parseBody(json.constructor, 'constructor');

    this.writeJSON(file, json);
  },

  parseDescription: function(description) {
    description = description || "";
    return marked(description);
  },

  buildFunctions: function(functions) {
    functions = functions || [];

    _.each(functions, function(value, name) {
      functions[name] = this.parseBody(value, name);
    }, this);

    return functions
  },

  buildProperties: function(properties) {
    properties = properties || [];

    _.each(properties, function(value, name) {
      properties[name] = this.parseBody(value, name);
    }, this);

    return properties
  },

  buildExamples: function(examples) {
    examples = examples || [];

    _.each(examples, function(example, i) {
      examples[i] = this.parseExample(example);
    }, this);

    return examples
  },

  /**
   * parseBody takes a yaml body, which is either a string or an object.
   * if it's just a string, it assumes it's one dox string, if it's an object it
   * assumes it has a description and examples.
   *
   *
   * e.g
   * foo: |
   *    Foo function is yay
   *
   *     @param wtf
   *
   * or...
   * foo:
   *   description: |
   *     Foo function is yay
   *
   *      @param wtf
   *
   *   examples:
   *     -
   *       name: foo e.g. 1
   *       example: |
   *          show the foo in action
   *          ```js
   *             foo(1,2,3)
   *          ```
   *
  **/

  parseBody: function(value, name) {
    var result = {};

    if (_.isEmpty(value)) {
      return result;
    }

    // Function values have both a description and examples
    // If the function value is a string, only the description was added
    if (_.isObject(value)) {
      result = value;
    } else {
      result.examples = [];
      result.description = value;
    }

    result.description = this.parseDox(result.description, name);

    _.each(result.examples, function(example) {
      result.examples[name] = this.parseExample(example);
    }, this);


    return result;
  },

  parseExample: function(example) {
    if (!example.name) {
        this.grunt.fail.fatal('jsDocFile failed to find example name');
    }

    if (!example.example) {
        this.grunt.fail.fatal('jsDocFile failed to find example for ' + example.name);
    }

    example.example = marked(example.example);

    return example;
  },

  /**
   * parse the dox comment string.
   * We also pluck some tags from the tags property to make it easy to access later.
   * This could probably be moved out into a separate presentation task that www consumes
   *
  **/
  parseDox: function(docString, name) {

    try {
      var doc = dox.parseComment(docString);
    } catch (err) {
      this.grunt.fail.fatal('jsDocFile failed to parse dox at ' + name);
    }

    var tags = doc.tags || [];
    doc.api = _.findWhere(tags, {type: 'api'});
    doc.params = _.where(tags, {type: 'param'});
    doc.paramStr = _.pluck(doc.params, 'name').join(", ")

    doc.params = _.map(doc.params, function(param) {
      return _.extend(param, {
        typeStr: param.types.join(", "),
        description: param.description.replace(/^- /,'') // because dox doesn't parse the - out
      })
    });
    

    return doc;
  },

  // write parsed api to file
  writeJSON: function(file, json) {
    var prettyJSON = JSON.stringify(json, undefined, 2);
    this.grunt.file.write(file.dest, prettyJSON);
  },

  // read yaml file
  parseYaml: function(file) {
    try {
      return yaml.safeLoad(file);
    } catch (err){
      this.grunt.fail.fatal(err.name + ":\n"+  err.reason + "\n\n" + err.mark);
    }
  }

});

module.exports = function(grunt) {
  grunt.registerMultiTask('jsDocFiles', 'Compile jsdoc files to json', function() {
    var jsDocFiles = new JsDocFilesTask(grunt);
    jsDocFiles.buildFiles(this.files);
  });
}
