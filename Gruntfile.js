var path = require('path');
var unwrap = require('unwrap');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '<%= pkg.version %>',
      core_banner:
        '// MarionetteJS (Backbone.Marionette)\n' +
        '// ----------------------------------\n' +
        '// v<%= pkg.version %>\n' +
        '//\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Derick Bailey, Muted Solutions, LLC.\n' +
        '// Distributed under MIT license\n' +
        '//\n' +
        '// http://marionettejs.com\n' +
        '\n',
      banner:
        '<%= meta.core_banner %>\n' +
        '/*!\n' +
        ' * Includes BabySitter\n' +
        ' * https://github.com/marionettejs/backbone.babysitter/\n' +
        ' *\n' +
        ' * Includes Wreqr\n' +
        ' * https://github.com/marionettejs/backbone.wreqr/\n' +
        ' */\n\n\n'
    },

    clean: {
      lib: 'lib'
    },

    preprocess: {
      core: {
        src: 'src/build/core.js',
        dest: 'tmp/core.js'
      },
      bundle: {
        src: 'src/build/bundled.js',
        dest: 'tmp/backbone.marionette.js'
      }
    },

    template: {
      options: {
        data: {
          version: '<%= pkg.version %>'
        }
      },
      core: {
        src: '<%= preprocess.core.dest %>',
        dest: '<%= preprocess.core.dest %>'
      },
      bundle: {
        src: '<%= preprocess.bundle.dest %>',
        dest: '<%= preprocess.bundle.dest %>'
      }
    },

    concat: {
      options: {
        banner: '<%= meta.core_banner %>'
      },
      core: {
        src: '<%= preprocess.core.dest %>',
        dest: 'lib/core/backbone.marionette.js'
      },
      bundle: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: '<%= preprocess.bundle.dest %>',
        dest: 'lib/backbone.marionette.js'
      }
    },

    uglify : {
      core: {
        src : '<%= concat.core.dest %>',
        dest : 'lib/core/backbone.marionette.min.js',
        options : {
          banner: '<%= meta.core_bundle %>',
          sourceMap : 'lib/core/backbone.marionette.map',
          sourceMappingURL : '<%= uglify.bundle.options.sourceMappingURL %>',
          sourceMapPrefix : 1
        }
      },

      bundle: {
        src : '<%= concat.bundle.dest %>',
        dest : 'lib/backbone.marionette.min.js',
        options : {
          banner: '<%= meta.banner %>',
          sourceMap : 'lib/backbone.marionette.map',
          sourceMappingURL : 'backbone.marionette.map',
          sourceMapPrefix : 2
        }
      }
    },

    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: '../../../test/src/'
      }
    },

    instrument: {
      files: 'src/*.js',
      options: {
        lazy: true,
        basePath: 'test'
      }
    },

    mochaTest: {
      tests: {
        options: {
          require: 'test/unit/setup/node.js',
          reporter: grunt.option('mocha-reporter') || 'nyan',
          clearRequireCache: true,
          mocha: require('mocha')
        },
        src: [
          'test/unit/setup/helpers.js',
          'test/unit/*.spec.js'
        ]
      }
    },

    storeCoverage: {
      options: {
        dir: 'coverage'
      }
    },
    makeReport: {
      src: 'coverage/**/*.json',
      options: {
        type: 'lcov',
        dir: 'coverage',
        print: 'detail'
      }
    },

    "yaml-validate": {
      options: {
        glob: "api/*.yaml"
      }
    },
    coveralls: {
      options: {
        src: 'coverage/lcov.info',
        force: false
      },
      default: {
        src: 'coverage/lcov.info'
      }
    },

    plato: {
      marionette : {
        src : 'src/*.js',
        dest : 'reports',
        options : {
          jshint : grunt.file.readJSON('.jshintrc')
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },

      marionette: {
        src: [ 'src/*.js' ]
      },

      specs: {
        options: {
          jshintrc: 'test/.jshintrc'
        },

        files: {
          src: ['test/unit/**.js']
        }
      }
    },

    jscs: {
      options: {
        config: ".jscsrc"
      },

      marionette: {
        files: {
          src: [ 'src/*.js' ]
        }
      },

      specs: {
        files: {
          src: ['test/unit/**.js']
        },
        options: {
          maximumLineLength: 200
        }
      }
    },

    watch: {
      marionette : {
        options: {
          spawn: false
        },
        files : ['src/**/*.js', 'test/**/*.js'],
        tasks : ['test']
      }
    },

    connect: {
      server: {
        options: {
          port: 8888
        }
      }
    },

    lintspaces: {
      all: {
        src: [
          'src/*.js',
          'docs/*.md'
        ],
        options: {
          editorconfig: '.editorconfig'
        }
      }
    },

    unwrap: {
      babysitter: {
        src: './node_modules/backbone.babysitter/lib/backbone.babysitter.js',
        dest: './tmp/backbone.babysitter.bare.js'
      },
      wreqr: {
        src: './node_modules/backbone.wreqr/lib/backbone.wreqr.js',
        dest: './tmp/backbone.wreqr.bare.js'
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.registerMultiTask('unwrap', 'Unwrap UMD', function () {
    var done = this.async();
    var timesLeft = 0;

    this.files.forEach(function (file) {
      file.src.forEach(function (src) {
        timesLeft++;
        unwrap(path.resolve(__dirname, src), function (err, content) {
          if (err) return grunt.log.error(err);
          grunt.file.write(path.resolve(__dirname, file.dest), content);
          grunt.log.ok(file.dest + ' created.');
          timesLeft--;
          if (timesLeft <= 0) done();
        });
      });
    });
  });

  var defaultTestsSrc = grunt.config('mochaTest.tests.src');
  var defaultJshintSrc = grunt.config('jshint.marionette.src');
  var defaultJshintSpecSrc = grunt.config('jshint.specs.files.src');
  grunt.event.on('watch', function(action, filepath) {
    grunt.config('mochaTest.tests.src', defaultTestsSrc);
    grunt.config('jshint.marionette.src', defaultJshintSrc);
    grunt.config('jshint.specs.files.src', defaultJshintSpecSrc);
    if (filepath.match('test/unit/') && !filepath.match('setup') && !filepath.match('fixtures')) {
      grunt.config('mochaTest.tests.src', ['test/unit/setup/helpers.js', filepath]);
      grunt.config('jshint.specs.files.src', filepath);
      grunt.config('jshint.marionette.src', 'DO_NOT_RUN_ME');
    }
    if (filepath.match('src/')) {
      grunt.config('jshint.marionette.src', filepath);
      grunt.config('jshint.specs.files.src', 'DO_NOT_RUN_ME');
    }
  });

  grunt.registerTask('default', 'An alias task for running tests.', ['test']);

  grunt.registerTask('lint', 'Lints our sources', ['lintspaces', 'jshint', 'jscs']);

  grunt.registerTask('test', 'Run the unit tests.', ['lint', 'api', 'mochaTest']);

  grunt.registerTask('coverage', ['unwrap', 'preprocess:bundle', 'template:bundle', 'env:coverage', 'instrument', 'mochaTest', 'storeCoverage', 'makeReport', 'coveralls']);

  grunt.registerTask('dev', 'Auto-lints while writing code.', ['test', 'watch:marionette']);

  grunt.registerTask('api', 'test all yaml files', ['yaml-validate']);

  grunt.registerTask('build', 'Build all three versions of the library.', ['clean:lib', 'lint', 'mochaTest', 'unwrap', 'preprocess', 'template', 'concat', 'uglify']);
};
