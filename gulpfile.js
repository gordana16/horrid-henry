/*script that transpiles files from ES6 to ES5*/
const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const gutil = require('gulp-util');
const del = require('del');
const runSequence = require('run-sequence');


const paths = {
  srcJS: 'js/**.*',
  dist: 'dist'
};

gulp.task('transpile', function () {
  return gulp.src([
    'node_modules/@babel/polyfill/dist/polyfill.js',
    paths.srcJS])
    .pipe(babel())
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest(paths.dist));
});

gulp.task('clean', function () {
  return del(paths.dist);
});

gulp.watch(paths.srcJS, () => {
  runSequence('clean', 'transpile');
});



