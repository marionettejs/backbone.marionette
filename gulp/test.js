import gulp from 'gulp';
import mocha from 'gulp-mocha';
import istanbul from 'gulp-istanbul';
import { Instrumenter } from 'isparta';
import coveralls from 'gulp-coveralls';
import runSequence from 'run-sequence';

const mochaGlobals = ['stub', 'spy', 'expect', 'Mn'];

function _registerBabel() {
  require('babel-register');
}

function _mocha(setupFile) {
  return gulp.src(
    [setupFile, 'test/unit/**/*.js'],
      {read: false}
    )
    .pipe(mocha({
      reporter: 'dot',
      globals: mochaGlobals,
      ignoreLeaks: false
    }));
}

function test() {
  _registerBabel();
  return _mocha('test/setup/node.js');
}

function coverage(done) {
  _registerBabel();
  gulp.src(['src/**/*.js'])
    .pipe(istanbul({ instrumenter: Instrumenter }))
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      return test()
        .pipe(istanbul.writeReports())
        .on('end', done);
    });
}

gulp.task('coveralls', ['coverage'], function(){
  return gulp.src('coverage/lcov.info')
    .pipe(coveralls());
});

gulp.task('coverage', ['lint-code'], coverage);

gulp.task('test', test);
