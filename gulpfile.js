var gulp = require('gulp');
var bs = require('browser-sync');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concatCss = require('gulp-concat-css');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglifyJs = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');

var sassTask = gulp.series(function(cb) {
  console.log(`TASK: sass`);
  
  var res = 
    gulp.src("src/sass/*.sass")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(concatCss('styles.css'))
        .pipe(gulp.dest("src/css"))
        .pipe(bs.stream());
  
  cb();
  return res;
});

var serve = gulp.series(function(cb){
  console.log(`TASK: serve`);

  bs.init({
    server: './src'
  });

  gulp.watch(["src/sass/*.sass"], sassTask);
  gulp.watch("src/*.html").on("change", bs.reload);

  cb();
});

// minimize css task
var minCss = function(cb) {

  var result = 
    gulp.src("src/css/*.css")
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCss())
        .pipe(gulp.dest("dist/css"));

  cb();
  return result;
};

// minimize Js task
var minJs = function(cb) {
  var result = 
    gulp.src("src/js/*.js")
        .pipe(rename({suffix: ".min"}))
        .pipe(uglifyJs())
        .pipe(gulp.dest("build/js"))
  
  cb();
  return result;
}

// minimize Html task
var minHtml = function(cb) {
  var result = 
    gulp.src("src/*.html")
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("dist"))
  
  cb();
  return result;
}

var build = gulp.series(minCss, minJs, minHtml);

exports.build = build;
exports.default = serve;