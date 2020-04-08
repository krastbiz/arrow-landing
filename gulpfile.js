var gulp          = require('gulp'),
    bs            = require('browser-sync'),
    sass          = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    concatCss     = require('gulp-concat-css'),
    cleanCss      = require('gulp-clean-css'),
    rename        = require('gulp-rename'),
    uglifyJs      = require('gulp-uglify'),
    htmlmin       = require('gulp-htmlmin'),
    imagemin      = require('gulp-imagemin');

// ----- DEV TASKS -----
var sassTask = gulp.series(function(cb) {
  console.log(`TASK: sass`);
  
  var res = 
    gulp.src("src/sass/*.sass")
        .pipe(sass().on('error', sass.logError))
        .pipe(concatCss('styles.css'))
        .pipe(gulp.dest("src/css"))
        .pipe(bs.stream());
  
  cb();
  return res;
});

var serve = gulp.series(sassTask, function(cb){
  console.log(`TASK: serve`);

  bs.init({
    server: './src'
  });

  gulp.watch(["src/sass/*.sass"], sassTask);
  gulp.watch("src/*.html").on("change", bs.reload);

  cb();
});

//----- BUILD TASKS -----
// minimize css task
var minCss = function(cb) {

  var result = 
    gulp.src("src/css/*.css")
        .pipe(rename({suffix: '.min'}))
        .pipe(autoprefixer())
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

var minImages = function(cb) {
  var result = 
    gulp.src("src/img/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img/'))
  
  cb();
  return result;
}

var fonts = function(cb) {
  var result = gulp.src("src/fonts/*")
                    .pipe(gulp.dest("dist/fonts/"));

  cb();

  return result;
}

var build = gulp.series(minCss, minJs, minHtml, minImages, fonts);

exports.build = build;
exports.default = serve;