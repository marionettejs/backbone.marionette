import gulp from 'gulp';
import './gulp/build';
import './gulp/linting';
import './gulp/test';
import './gulp/test-browser';
import './gulp/test-cypress';

gulp.task('watch-code', function() {
  gulp.watch(['src/**/*', 'test/**/*'], ['lint-code', 'test']);
});

gulp.task('watch-docs', function() {
  gulp.watch(['api/**/*', 'docs/**/*'], ['lint-docs']);
});

// Run the linter and headless unit tests as you make changes.
gulp.task('watch', ['watch-code','watch-docs']);

// Run linter, tests
gulp.task('default', ['lint', 'test']);
