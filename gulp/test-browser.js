import gulp from 'gulp';
import livereload from 'gulp-livereload';
import plumber from 'gulp-plumber';

import babelify  from 'babelify';
import preset from 'babel-preset-es2015';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import glob from 'glob';
import source from 'vinyl-source-stream';

const testFiles = glob.sync('./test/unit/**/*.js');
const allFiles = ['./test/setup/browserify.js'].concat(testFiles);

function _runBrowserifyBundle(bundler) {
  return bundler.bundle()
    .on('error', function(err) {
      console.log(err);
      this.emit('end');
    })
    .pipe(plumber())
    .pipe(source('./tmp/__spec-build.js'))
    .pipe(buffer())
    .pipe(gulp.dest(''))
    .pipe(livereload());
}

function bundle() {
  var bundler = browserify(allFiles, { debug: true });

  // Set up Babelify so that ES6 works in the tests
  bundler.transform(babelify.configure({
    sourceMapRelative: __dirname + '/src',
    presets: [ preset ]
  }));

  return _runBrowserifyBundle(bundler);
}

function browserWatch() {
  livereload.listen({port: 35729, host: 'localhost', start: true});
  gulp.watch(['src/**/*.js', 'test/**/*.js'], ['browser-bundle']);
}

gulp.task('browser-bundle', ['lint-src', 'lint-test'],   bundle);

gulp.task('test-browser', ['browser-bundle'], browserWatch);
