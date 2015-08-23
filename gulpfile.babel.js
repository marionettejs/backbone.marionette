import fs from 'fs';

// Load Gulp and all of our Gulp plugins
import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins'
const $ = loadPlugins({rename: {'gulp-yaml-validate': 'yaml'}});

// Load other npm modules
import del from 'del';
import glob from 'glob';
import path from 'path';
import isparta from 'isparta';
import babelify from 'babelify';
import watchify from 'watchify';
import buffer from 'vinyl-buffer';
import esperanto from 'esperanto';
import browserify from 'browserify';
import runSequence from 'run-sequence';
import source from 'vinyl-source-stream';
import unwrap from 'unwrap';

// Gather the library data from `package.json`
import manifest from './package.json';
const config = manifest.babelBoilerplateOptions;
const mainFile = manifest.main;
const destinationFolder = path.dirname(mainFile);
const exportFileName = path.basename(mainFile, path.extname(mainFile));
const unwrapConfigFiles = [
  {
    src: './node_modules/backbone.babysitter/lib/backbone.babysitter.js',
    dest: './tmp/backbone.babysitter.bare.js'
  },
  {
    src: './node_modules/backbone.radio/build/backbone.radio.js',
    dest: './tmp/backbone.radio.bare.js'
  },
  {
    src: './node_modules/backbone-metal/dist/backbone-metal.js',
    dest: './tmp/backbone.metal.bare.js'
  }
];

const preprocessData = {
  core: {
    src: 'src/build/core.js',
    dest: 'tmp/core.js'
  },
  bundle: {
    src: 'src/build/bundled.js',
    dest: 'tmp/backbone.marionette.js'
  }
};

const templateData = {
  options: {
    version: `${manifest.version}`
  },
  core: {
    src: `${preprocessData.core.dest}`,
    dest: `${preprocessData.core.dest}`
  },
  bundle: {
    src: `${preprocessData.bundle.dest}`,
    dest: `${preprocessData.bundle.dest}`
  }
};

const coreBanner = `// MarionetteJS (Backbone.Marionette)
// ----------------------------------
// v${manifest.version}
//
// Copyright (c)2015 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://marionettejs.com
`;

//TODO: Figure out getting current year in gulp
const meta = {
  version: `${manifest.version}`,
  coreBanner: coreBanner,
  banner: `${coreBanner}
/*!
 * Includes BabySitter
 * https://github.com/marionettejs/backbone.babysitter/
 *
 * Includes Radio
 * https://github.com/marionettejs/backbone.radio/
 * Includes Metal
 * https://github.com/marionettejs/backbone-metal/
 */\n\n\n`
};

// Remove the built files
gulp.task('clean', function(cb) {
  del([destinationFolder], cb);
});

// Remove our temporary files
gulp.task('clean-tmp', function(cb) {
  del(['tmp'], cb);
});

// Send a notification when JSCS fails,
// so that you know your changes didn't build
function jscsNotify(file) {
  if (!file.jscs) { return; }
  return file.jscs.success ? false : 'JSCS failed';
}

function createLintTask(taskName, files, options) {
  gulp.task(taskName, function() {
    return gulp.src(files)
      .pipe($.plumber())
      .pipe($.lintspaces({editorconfig: '.editorconfig'}))
      .pipe($.lintspaces.reporter())
      .pipe($.eslint())
      .pipe($.eslint.format())
      .pipe($.eslint.failOnError())
      .pipe($.jscs(options))
      .pipe($.notify(jscsNotify));
  });
}

// Lint our source code
createLintTask('lint-src', ['src/**/*.js']);

// Lint our test code
createLintTask('lint-test', ['test/**/*.js'], { maximumLineLength: 200 });

gulp.task('lint', ['lint-src', 'lint-test']);

// Lint docs
gulp.task('lint-docs', function() {
  return gulp.src('docs/*.md')
    .pipe($.lintspaces({editorconfig: '.editorconfig'}))
    .pipe($.lintspaces.reporter());
});

// Build two versions of the library
gulp.task('build', ['lint-src', 'clean'], function(done) {
  esperanto.bundle({
    base: 'src',
    entry: config.entryFileName,
  }).then(function(bundle) {
    var res = bundle.toUmd({
      // Don't worry about the fact that the source map is inlined at this step.
      // `gulp-sourcemaps`, which comes next, will externalize them.
      sourceMap: 'inline',
      name: config.mainVarName
    });

    $.file(exportFileName + '.js', res.code, { src: true })
      .pipe($.plumber())
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.babel())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(destinationFolder))
      .pipe($.filter(['*', '!**/*.js.map']))
      .pipe($.rename(exportFileName + '.min.js'))
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.uglify())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(destinationFolder))
      .on('end', done);
  })
  .catch(done);
});

function bundle(bundler) {
  return bundler.bundle()
    .on('error', function(err) {
      console.log(err.message);
      this.emit('end');
    })
    .pipe($.plumber())
    .pipe(source('./tmp/__spec-build.js'))
    .pipe(buffer())
    .pipe(gulp.dest(''))
    .pipe($.livereload());
}

function getBundler() {
  // Our browserify bundle is made up of our unit tests, which
  // should individually load up pieces of our application.
  // We also include the browserify setup file.
  var testFiles = glob.sync('./test/unit/**/*.js');
  var allFiles = ['./test/setup/browserify.js'].concat(testFiles);

  // Create our bundler, passing in the arguments required for watchify
  var bundler = browserify(allFiles, watchify.args);

  // Watch the bundler, and re-bundle it whenever files change
  bundler = watchify(bundler);
  bundler.on('update', function() {
    bundle(bundler);
  });

  // Set up Babelify so that ES6 works in the tests
  bundler.transform(babelify.configure({
    sourceMapRelative: __dirname + '/src'
  }));

  return bundler;
};

// Build the unit test suite for running tests
// in the browser
gulp.task('browserify', function() {
  return bundle(getBundler());
});

function test() {
  return gulp.src(['test/unit/setup/helpers.js', 'test/unit/**/*.spec.js'], {read: false})
    .pipe($.mocha({
      require: ['./test/unit/setup/node.js'],
      reporter: 'dot',
      globals: config.mochaGlobals
    }));
}

gulp.task('coverage', ['lint-src', 'lint-test'], function(done) {
  require('babel-core/register');
  return gulp.src(['src/**/*.js'])
    .pipe($.istanbul({ instrumenter: isparta.Instrumenter }))
    .pipe($.istanbul.hookRequire())
    .on('finish', function() {
      return test()
        .pipe($.istanbul.writeReports())
        .on('end', done);
    });
});

// Lint and run our tests
gulp.task('test', ['lint-src', 'lint-test', 'api'], function() {
  require('babel-core/register');
  return test();
});

gulp.task('api', function() {
  return gulp.src(['api/*.yaml'])
    .pipe($.yaml());
});

// Ensure that linting occurs before browserify runs. This prevents
// the build from breaking due to poorly formatted code.
gulp.task('build-in-sequence', function(callback) {
  runSequence(['lint-src', 'lint-test'], 'browserify', callback);
});

// These are JS files that should be watched by Gulp. When running tests in the browser,
// watchify is used instead, so these aren't included.
const jsWatchFiles = ['src/**/*', 'test/**/*'];
// These are files other than JS files which are to be watched. They are always watched.
const otherWatchFiles = ['package.json', '**/.eslintrc', '.jscsrc'];

// Run the headless unit tests as you make changes.
gulp.task('watch', function() {
  const watchFiles = jsWatchFiles.concat(otherWatchFiles);
  gulp.watch(watchFiles, ['test']);
});

// Set up a livereload environment for our spec runner
gulp.task('test-browser', ['build-in-sequence'], function() {
  $.livereload.listen({port: 35729, host: 'localhost', start: true});
  return gulp.watch(otherWatchFiles, ['build-in-sequence']);
});

function writeFile(path, content) {
  fs.writeFile(path, content);
}

gulp.task('unwrap', function(cb) {
  var timesLeft = 0;

  unwrapConfigFiles.forEach(function (file) {
    timesLeft++;
    unwrap(path.resolve(__dirname, file.src), function (err, content) {
      if (err) return console.log(err);
      writeFile(path.resolve(__dirname, file.dest), content);
      console.log(file.dest + ' created.');
      timesLeft--;
      if (timesLeft <= 0) cb();
    });
  });
});

function createPreprocessTask(taskName, src, dest) {
  gulp.task(taskName, function() {
    return gulp.src(src)
      .pipe($.preprocess())
      .pipe($.rename(dest))
      .pipe(gulp.dest(''));
  });
}

createPreprocessTask('preprocess-core', ['src/build/core.js'], 'tmp/core.js');
createPreprocessTask('preprocess-bundle', ['src/build/bundled.js'], 'tmp/backbone.marionette.js');
gulp.task('preprocess', ['preprocess-core', 'preprocess-bundle']);

function createTemplateTask(taskName, src, dest) {
  gulp.task(taskName, function() {
    return gulp.src(src)
      .pipe($.template(templateData.options))
      .pipe($.rename(dest))
      .pipe(gulp.dest(''));
  });
}

createTemplateTask('template-core', [templateData.core.src], templateData.core.dest);
createTemplateTask('template-bundle', [templateData.bundle.src], templateData.bundle.dest);
gulp.task('template', ['template-core', 'template-bundle']);

gulp.task('env-coverage', function() {
  $.env({
    APP_DIR_FOR_CODE_COVERAGE: '../../../test/src/'
  });
});

gulp.task('coveralls', function() {
  return gulp.src('coverage/lcov.info')
    .pipe($.coveralls({force: false}));
});

// gulp.task('coverage', ['unwrap', 'preprocess-bundle', 'template-bundle', 'env-coverage', 'instrument', 'test', 'storeCoverage', 'makeReport', 'coveralls']);

// An alias of test
gulp.task('default', ['test']);
