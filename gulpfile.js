/*gulp script which transpiles files from ES6 to ES5, bundle output files and minify the result*/

const gulp = require('gulp');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');

/*first clean any old dist, transpile js files, bundle the result to bundle.js, put bundle.js in dist folder, minify and rename it bundle.min.js and finally put in dist folder*/
gulp.task('minify', ['clean'], () => {
  browserify(['node_modules/@babel/polyfill/dist/polyfill.js', 'js/game-driver.js'])
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename('bundle.min.js'))
    .pipe(gulp.dest('dist'));
});

/*delete everything in dist folder*/
gulp.task('clean', () => {
  del('dist');
});

/*watching js files for changes and run the minify task should any changes occur*/
gulp.task('watch', () => {
  gulp.watch('js/**.*', ['minify'])
});

/*run the task simply by typing gulp*/
gulp.task('default', ['minify']);

