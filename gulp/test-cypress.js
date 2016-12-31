require('coffee-script/register');
const gulp = require('gulp');

// Because of issue with importing coffescript files with babel-register
delete require.cache[require.resolve('cypress-cli/lib/commands/run')];
const cypressRun = require('cypress-cli/lib/commands/run');

delete require.cache[require.resolve('cypress-cli/lib/commands/ci')];
const cypressCi = require('cypress-cli/lib/commands/ci');

gulp.task('cypress-run', ['build-test'], function() {
  cypressRun();
});

gulp.task('cypress-ci', ['build-test'], function() {
  cypressCi();
});
