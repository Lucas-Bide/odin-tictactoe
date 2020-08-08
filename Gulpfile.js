const { src, dest, watch } = require('gulp');
const sass = require('gulp-sass');
const clean = require('gulp-clean-css');
const rename = require('gulp-rename');
//const autoprefixer = require('gulp-autoprefixer');

// Compile SCSS
function scss(cb) {
  src('assets/src/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    // .pipe(autoprefixer({ cascade: false }))
    .pipe(dest('assets/dist/css'))
    .pipe(clean())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest('assets/dist/css'));
  cb();
}

// Copy JS over
function js(cb) {
  src('assets/src/scripts/main.js')
  .pipe(dest('assets/dist/scripts'))
  .pipe(dest('assets/dist/scripts'))
  cb();
}

exports.watch = function() {
  watch('assets/src/scss/*.scss', scss);
  watch('assets/src/scripts/main.js', js);
}