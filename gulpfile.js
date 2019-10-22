/*gulp script which transpiles files from ES6 to ES5, bundle output files and minify the result*/

const gulp = require("gulp");
const del = require("del");
const inject = require("gulp-inject");
const webserver = require("gulp-webserver");
const serveStatic = require("serve-static");
const runSequence = require("run-sequence");
const htmlclean = require("gulp-htmlclean");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const babelify = require("babelify");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");

const paths = {
  src: "app/**/*",
  srcHTML: "app/**/*.html",
  srcCSS: "app/**/*.css",
  srcImg: "app/**/*.+(png|jpg|gif|svg)",
  srcJS: "app/**/*.js",
  srcEntryJS: "app/js/game-driver.js",

  tmp: "tmp",
  tmpIndex: "tmp/index.html",
  tmpCSS: "tmp/**/*.css",
  tmpImg: "tmp/**/*.+(png|jpg|gif|svg)",
  tmpJS: "tmp/**/*.js",

  dist: "dist",
  distIndex: "dist/index.html",
  distCSS: "dist/**/*.css",
  distJS: "dist/**/*.js"
};

/**
 * DEVELOPMENT
 */
gulp.task("html:tmp", function() {
  return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});

gulp.task("css:tmp", function() {
  return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
});

gulp.task("img:tmp", function() {
  return gulp.src(paths.srcImg).pipe(gulp.dest(paths.tmp));
});

gulp.task("js:tmp", function() {
  return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});

gulp.task("clean:tmp", function() {
  return del(paths.tmp);
});
gulp.task("copy:tmp", function(cb) {
  return runSequence(
    "clean:tmp",
    ["html:tmp", "css:tmp", "js:tmp", "img:tmp"],
    cb
  );
});

gulp.task("inject:tmp", ["copy:tmp"], function() {
  const css = gulp.src(paths.tmpCSS);
  const js = gulp.src(paths.tmpJS);
  return gulp
    .src(paths.tmpIndex)
    .pipe(inject(css, { relative: true }))
    .pipe(
      inject(js, {
        transform: function(filepath) {
          return `<script src="${filepath}" type="module"></script>`;
        },
        relative: true
      })
    )
    .pipe(gulp.dest(paths.tmp));
});

gulp.task("serve", ["inject:tmp"], function() {
  return gulp.src(paths.tmp).pipe(
    webserver({
      port: 3000,
      livereload: true,
      middleware: [serveStatic(paths.tmp, { extensions: ["js"] })],
      open: true
    })
  );
});

gulp.task("watch:tmp", ["serve"], function() {
  gulp.watch(paths.src, ["inject:tmp"]);
});

gulp.task("default", ["watch:tmp"]);
/**
 * DEVELOPMENT END
 */
/**
 * PRODUCTION
 */
gulp.task("html:dist", function() {
  return gulp
    .src(paths.srcHTML)
    .pipe(htmlclean())
    .pipe(gulp.dest(paths.dist));
});

gulp.task("css:dist", function() {
  return gulp
    .src(paths.srcCSS)
    .pipe(concat("style.min.css"))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dist));
});
gulp.task("img:dist", function() {
  return gulp.src(paths.srcImg).pipe(gulp.dest(paths.dist));
});
/* transpile js files, bundle the result, minify to bundle.min.js */
gulp.task("js:dist", function(cb) {
  return browserify([require.resolve("@babel/polyfill"), paths.srcEntryJS])
    .transform(babelify)
    .bundle()
    .pipe(source("bundle.min.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});

gulp.task("clean:dist", function() {
  return del(paths.dist);
});
gulp.task("copy:dist", function(cb) {
  return runSequence(
    "clean:dist",
    ["html:dist", "css:dist", "js:dist", "img:dist"],
    cb
  );
});

gulp.task("inject:dist", ["copy:dist"], function() {
  const css = gulp.src(paths.distCSS);
  const js = gulp.src(paths.distJS);
  return gulp
    .src(paths.distIndex)
    .pipe(inject(css, { relative: true }))
    .pipe(inject(js, { relative: true }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task("build", ["inject:dist"]);
