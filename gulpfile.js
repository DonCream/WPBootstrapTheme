const gulp = require('gulp');
const sass = require('gulp-sass');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const htmlsplit = require('gulp-htmlsplit');
const inject = require('gulp-inject-string');
const processhtml = require('gulp-processhtml');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssnano = require('gulp-cssnano');
const purify = require('gulp-purify-css');

var reload = browserSync.reload,
opts = { /* plugin options */ };

// Move Bootstrap CSS to src/css
gulp.task('boots', function(){
  return gulp.src('node_modules/bootstrap/dist/css/bootstrap.css')
    .pipe(gulp.dest("src/css"));
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

// Move particles.js to src/js
gulp.task('particles', function(){
  return gulp.src('node_modules/particlesjs/dist/particles.min.js')
    .pipe(gulp.dest("src/js"));
});

// Move Lightbox js to src/js
gulp.task('ekkojs', function(){
  return gulp.src('node_modules/ekko-lightbox/dist/ekko-lightbox.min.js')
    .pipe(gulp.dest("src/js"));
});

// Move Lightbox css to src/css
gulp.task('ekkocss', function(){
  return gulp.src('node_modules/ekko-lightbox/dist/ekko-lightbox.min.css')
    .pipe(gulp.dest("src/css"));
});

// Move JS Files to src/js
gulp.task('js', function(){
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js','node_modules/jquery/dist/jquery.min.js','node_modules/popper.js/dist/umd/popper.min.js'])
    .pipe(gulp.dest("src/js"))
    .pipe(browserSync.stream());
});

// Compile Sass & Inject Into Browser
gulp.task('sass', function(){
  return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss','src/scss/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});

// Add prefixing to style.css
gulp.task('fix', () =>
    gulp.src('src/style.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('src'))
);

// Remove unused css
gulp.task('purify', function() {
  return gulp.src('src/*.css')
    .pipe(purify(['src/*.js', 'src/*.html']))
    .pipe(gulp.dest('./dist/'));
});

// Minify css and create sourcemaps
gulp.task('min', function () {
    return gulp.src('style.css')
        .pipe(sourcemaps.init())
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src'));
});

// Watch Sass & Server
gulp.task('serve', ['sass'], function(){
  browserSync.init({
    server: "./src"
  });

  gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], ['sass']);
  gulp.watch("src/*.html").on('change', browserSync.reload);
});

// Add php tags to .php files
gulp.task('process', function () {
    return gulp.src('src/*.html')
               .pipe(processhtml(opts))
               .pipe(gulp.dest('src'));
});

//Split into .php files and move to /dist
gulp.task('split', function() {
  gulp.src('src/*.html')
    .pipe(htmlsplit())
    .pipe(gulp.dest('dist'));
});

//Move style.css to /dist and add Wordpress header
gulp.task('addhdft', function() {
   gulp.src(['dist/*.php', '!dist/header.php', '!dist/footer.php'])
      .pipe(inject.prepend('<?php get_header(); ?>\n'))
      .pipe(inject.append('\n<?php get_footer(); ?>'))
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.stream());
});

//Move style.css to /dist and add Wordpress header
gulp.task('cssmain', function() {
   gulp.src('src/css/style.css')
      .pipe(inject.prepend('/* Theme Name: Corners Theme Theme URI: Author: Lamar McMiller Author URI: http://www.lamarmcmiller.me Description: Bootstrap 4 Worpress Theme Version: 1.0 License: GNU General Public License v2 or later License URI: http://www.gnu.org/licenses/gpl-2.0.html Text Domain: */\n'))
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.stream());
});

//Move src/.css to /dist/css
gulp.task('cssmv', function() {
   gulp.src('src/css/*.css')
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
});

//Move .html files to /dist and rename to .php
gulp.task('htmlmv', function() {
   gulp.src('src/*.html')
      .pipe(gulp.dest('dist'))
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

// Move .js files to /dist/js
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
gulp.task('prod', ['process', 'split', 'scripts', 'imageMin', 'fontsmv', 'cssmain', 'cssmv']);
