import gulp from 'gulp';
import eslint from 'gulp-eslint';
import lintspaces from 'gulp-lintspaces';
import plumber from 'gulp-plumber';
import util from 'gulp-util';

function onError() {
  util.beep();
}

function lint(files) {
  return gulp.src(files)
    .pipe(plumber())
    .pipe(lintspaces({editorconfig: '.editorconfig'}))
    .pipe(lintspaces.reporter())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .on('error', onError);
}

function lintSrc() {
  return lint(['src/**/*.js']);
}

function lintTest() {
  return lint(['test/**/*.js']);
}

function lintMd() {
  return gulp.src('docs/*.md')
    .pipe(plumber())
    .pipe(lintspaces({editorconfig: '.editorconfig'}))
    .pipe(lintspaces.reporter())
    .on('error', onError);
}

gulp.task('lint-src', lintSrc);

gulp.task('lint-test', lintTest);

gulp.task('lint-code', ['lint-src', 'lint-test']);

gulp.task('lint-docs', lintMd);

gulp.task('lint', ['lint-code', 'lint-docs']);
