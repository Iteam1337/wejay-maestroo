var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  mocha = require('gulp-mocha'),
  plumber = require('gulp-plumber'),
  runSequence = require('run-sequence');

gulp.task('jshint', function () {
  return gulp.src(['./**/*.js', '!./node_modules/**/*'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('mocha', function () {
  return gulp.src('./tests/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('mocha:integration', function () {
  return gulp.src('./tests/integration/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('mocha:unit', function () {
  return gulp.src('./tests/unit/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('test', function (cb) {
  runSequence('jshint', 'mocha', cb);
});

gulp.task('watch', function () {
  gulp.watch(['./**/*.js', '!./node_modules/**/*'], ['test']);
});

gulp.task('default', ['test', 'watch']);