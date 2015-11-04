import gulp from 'gulp';
const plumber = require('gulp-plumber');
const glob = require('glob');
const babelify = require('babelify');
const watchify = require('watchify');
const browserify = require('browserify');
const runSequence = require('run-sequence');
const liveReload = require('gulp-livereload');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

function getBundler() {
  // Our browserify bundle is made up of our unit tests, which
  // should individually load up pieces of our application.
  // We also include the browserify setup file.
  var testFiles = glob.sync('./test/unit/**/*');
  var allFiles = ['./test/setup/browserify.js'].concat(testFiles);

  // Create our bundler, passing in the arguments required for watchify
  watchify.args.debug = true;
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

function bundle() {
  var bundler = getBundler();

  return bundler.bundle()
    .on('error', function(err) {
      console.log(err.message);
      this.emit('end');
    })
    .pipe(plumber())
    .pipe(source('./tmp/__spec-build.js'))
    .pipe(buffer())
    .pipe(gulp.dest(''))
    .pipe(liveReload());
}

// Build the unit test suite for running tests
// in the browser
gulp.task('browserify', function() {
  return bundle();
});

// Ensure that linting occurs before browserify runs. This prevents
// the build from breaking due to poorly formatted code.
gulp.task('build-in-sequence', function(callback) {
  runSequence([
    // 'lint-src',
    'lint-test'
  ], 'browserify', callback);
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
gulp.task('browser-test', ['build-in-sequence'], function() {
  liveReload.listen({port: 35729, host: 'localhost', start: true});
  return gulp.watch(otherWatchFiles, ['build-in-sequence']);
});
