const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

// Path Variables
const HTML_PATH = 'src/*.html';
// const CSS_PATH = 'src/css/**/*.css';
const SCSS_PATH = 'src/scss/*.scss';


// Compile sass
gulp.task('sass', function() {
    return gulp.src(SCSS_PATH)
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream())
});


// Watch And Serve
gulp.task('serve',  gulp.parallel('sass', function() {
    browserSync.init({
        server: 'src/'
    });

    gulp.watch(SCSS_PATH, gulp.parallel('sass'));
    gulp.watch(HTML_PATH).on('change', browserSync.reload);
}));

// Default
gulp.task('default', gulp.parallel('serve'));