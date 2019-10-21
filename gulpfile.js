/*gulp script which transpiles files from ES6 to ES5, bundle output files and minify the result*/

const gulp = require("gulp");
const del = require("del");
const inject = require("gulp-inject");
const webserver = require("gulp-webserver");
const serveStatic = require("serve-static");
const runSequence = require("run-sequence");

const paths = {
  src: "app/**/*",
  srcHTML: "app/**/*.html",
  srcCSS: "app/**/*.css",
  srcImg: "app/**/*.+(png|jpg|gif|svg)",
  srcJS: "app/**/*.js",

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
