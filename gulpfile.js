const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const htmlclean = require('gulp-htmlclean');

// folders
const folder = {
    src: 'src/',
    build: 'build/'
}

// Path Variables
const SCSS_PATH = '/src/scss/*.scss';
const SCRIPTS_PATH = '/src/scripts/*.js';

gulp.task('html', ['sass','images'], () => {
    let out = folder.build + 'html/';
        gulp.src(folder.src + 'html/**/*')
        .pipe(newer(out))
        .pipe(htmlclean())
        .pipe(gulp.dest(out))        
});

// Compile sass
gulp.task('sass', () => 
    gulp.src(SCSS_PATH)
    .pipe(sass())
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream())
);

// Babel ES6 
gulp.task('scripts', () => 
    gulp.src(SCRIPTS_PATH)
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest('public/scripts'))
);

// images task
gulp.task('images', () => {
    let out = folder.build + 'images/';
    gulp.src(folder.src + 'images/**/*')
        .pipe(newer(out))
        .pipe(imagemin({ optimizationLevel: 5 }))
        .pipe(gulp.dest(out));
});

// Serve
gulp.task('serve', ['sass'], () => 
    browserSync.init({
        server: {
            baseDir: "./build/html"
        }
    })
);

// Default
gulp.task('default', ['sass','images','html','scripts','serve']);