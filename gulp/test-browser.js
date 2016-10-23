import gulp from 'gulp';
import livereload from 'gulp-livereload';
import easySauce from 'easy-sauce';

import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import multiEntry from 'rollup-plugin-multi-entry';
import nodeResolve from 'rollup-plugin-node-resolve';
import nodeGlobals from 'rollup-plugin-node-globals';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import opn from 'opn';

const sauceConf = {
  name: 'Marionette.js',
  username: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  testPath: '/test/runner.html',
  port: '8080',
  framework: 'mocha',
  platforms: [
    ['Windows 10', 'MicrosoftEdge', 'latest'],
    ['Windows 10', 'chrome', 'latest'],
    ['OS X 10.11', 'chrome', 'latest'],
    ['OS X 10.11', 'firefox', "latest"],
    ['OS X 10.11', 'safari', '9.0']
  ],
  service: 'sauce-connect'
};

function bundle() {
  return rollup({
    entry: ['./test/setup/browser.js', './test/unit/**/*.js'],
    plugins: [
      multiEntry(),
      nodeResolve({ main: true }),
      commonjs(),
      nodeGlobals(),
      json(),
      babel({
        sourceMaps: true,
        presets: [ ['es2015', {modules: false}] ],
        babelrc: false,
        exclude: 'node_modules/**'
      })
    ]
  }).then(bundle => bundle.write({
    format: 'iife',
    sourceMap: true,
    moduleName: 'MnTests',
    dest: './tmp/__spec-build.js'
  }).then(livereload.reload('./tmp/__spec-build.js')));
}

function browserWatch() {
  livereload.listen({port: 35729, host: 'localhost', start: true});
  opn('./test/runner.html');
  gulp.watch(['src/**/*.js', 'test/**/*.js'], ['browser-bundle']);
}

function sauceRunner() {
  easySauce(sauceConf)
    .on('message', message => {
      // A message has been emitted, inform the user.
      console.log(message);
    })
    .on('update', job => {
      // A job's status has been updated
      console.log(job.status);
    })
    .on('done', (passed, jobs) => {
      // All tests have completed!
      if (passed) {
        console.log('All tests passed!');
      } else {
        console.log('Oops, there were failures:\n' + jobs);
      }
    })
    .on('error', error => {
      // An error occurred at some point running the tests.
      throw new Error(error.message);
    });
}

gulp.task('browser-bundle', ['lint-src', 'lint-test'], bundle);

gulp.task('test-browser', ['browser-bundle'], browserWatch);

gulp.task('test-cross-browser', ['browser-bundle'], sauceRunner);
