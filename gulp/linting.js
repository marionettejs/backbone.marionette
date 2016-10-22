import gulp from 'gulp';
import eslint from 'gulp-eslint';
import lintspaces from 'gulp-lintspaces';
import plumber from 'gulp-plumber';
import util from 'gulp-util';
import gulpIf from 'gulp-if';

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

function isFixed(file) {
	return file.eslint && file.eslint.fixed;
}

function lintFix(folder) {
  return gulp.src(folder + '/**/*.js')
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(gulpIf(isFixed, gulp.dest(folder)));
}

function lintSrc() {
  return lint(['src/**/*.js']);
}

function lintSrcFix() {
  return lintFix('src');
}

function lintTest() {
  return lint(['test/**/*.js']);
}

function lintTestFix() {
  return lintFix('test');
}

function lintMd() {
  return gulp.src('docs/*.md')
    .pipe(plumber())
    .pipe(lintspaces({editorconfig: '.editorconfig'}))
    .pipe(lintspaces.reporter())
    .on('error', onError);
}

gulp.task('lint-src', lintSrc);

gulp.task('lint-src-fix', lintSrcFix);

gulp.task('lint-test', lintTest);

gulp.task('lint-test-fix', lintTestFix);

gulp.task('lint-code', ['lint-src', 'lint-test']);

gulp.task('lint-docs', lintMd);

gulp.task('lint', ['lint-code', 'lint-docs']);

gulp.task('esfix', ['lint-src-fix', 'lint-test-fix']);
