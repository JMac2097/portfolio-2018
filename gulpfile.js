const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const babel = require('gulp-babel');

// Path Variables
const HTML_PATH = 'src/*.html';
// const CSS_PATH = 'src/css/**/*.css';
const SCSS_PATH = 'src/scss/*.scss';
const SCRIPTS_PATH = 'src/scripts/*.js';


// Compile sass
gulp.task('sass', () => 
    gulp.src(SCSS_PATH)
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
);

// Babel ES6 
gulp.task('scripts', () => 
    gulp.src(SCRIPTS_PATH)
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest('public/scripts'))
);

// Serve
gulp.task('serve', () => 
    browserSync.init({
        server: {
            baseDir: "./"
        }
    })
);

// Default
gulp.task('default', ['sass','scripts','serve']);