const gulp = require('gulp');
const sass = require('gulp-sass');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const inject = require('gulp-inject');
const cache = require('gulp-cache');
const htmlsplit = require('gulp-htmlsplit');

var reload = browserSync.reload;

// Compile Sass & Inject Into Browser
gulp.task('sass', function(){
  return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss','src/scss/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});

// Move JS Files to src/js
gulp.task('js', function(){
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js','node_modules/jquery/dist/jquery.min.js','node_modules/popper.js/dist/umd/popper.min.js'])
    .pipe(gulp.dest("src/js"))
    .pipe(browserSync.stream());
});

// Watch Sass & Server
gulp.task('serve', ['sass'], function(){
  browserSync.init({
    server: "./src"
  });

  gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], ['sass']);
  gulp.watch("src/*.html").on('change', browserSync.reload);
});

// Move Fonts Folder to src/fonts
gulp.task('fonts', function(){
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest("src/fonts"));
});

// Move Font Awesome CSS to src/css
gulp.task('fa', function(){
  return gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest("src/css"));
});
//Inject Wordpress theme header and move to /src
gulp.task('split', function() {
  gulp.src('./src/*.html')
    .pipe(htmlsplit())
    .pipe(gulp.dest('dist'));
});

//Move src/bootstrap.css to /dist/css
gulp.task('cssmv', function() {
   gulp.src(['src/css/bootstrap.css', 'src/css/bootstrap.min.css'])
      .pipe(concat('bootstrap.min.css'))
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
});
//Move src/style.css to /dist
gulp.task('famv', function() {
   gulp.src('src/css/font-awesome.min.css')
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
});
// Move Fonts Folder from src/fonts to dist/fonts
gulp.task('fontsmv', function() {
   gulp.src('src/fonts/*')
      .pipe(gulp.dest("dist/fonts"))
      .pipe(browserSync.stream());
});
// Optimize Images and move to /dist/images
gulp.task('imageMin', () =>
   gulp.src('src/images/*')
   .pipe(cache(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
   })))
   .pipe(gulp.dest('dist/images'))
);
// concatenate .js files into main.js and move to /dist/js
gulp.task('scripts', function() {
   gulp.src('src/js/*.js')
      .pipe(gulp.dest('dist/js'))
      .pipe(browserSync.stream());
});

// Watch /dist files and reload server on change
gulp.task('php', ['sass'], function() {
   browserSync.init({
      server: "./dist"
   });
   gulp.watch(dist.css, ['sass']);
   gulp.watch(dist.html).on('change', reload);
});

gulp.task('default', ['boots', 'js', 'fa', 'fonts', 'sass']);
gulp.task('srv', ['serve']);
gulp.task('prod', ['scripts', 'famv', 'imageMin', 'fontsmv', 'cssmv']);
