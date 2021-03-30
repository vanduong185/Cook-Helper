var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('ts', function () {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
  return gulp
    .src('src/**/*.css')
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch(['src/**/*.ts', 'src/**/*.tsx'], gulp.series('ts'));
  gulp.watch(['src/**/*.css'], gulp.series('css'));
});

gulp.task('default', gulp.series('ts', 'css', 'watch'));
