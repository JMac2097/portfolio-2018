var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoPrefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');

// paths
var paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcSASS: 'src/styles/**/*.scss',
    srcJS: 'src/scripts/**/*.js',
    srcIMAGES: 'src/images/**/*.+(png|jpg|gif|svg)',

    tmp: 'tmp/',
    tmpINDEX: 'tmp/',
    tmpCSS: 'tmp/styles/**/*.css',
    tmpJS: 'tmp/scripts/**/*.js',
    tmpIMAGES: 'tmp/images/**/*.+(png|jpg|gif|svg)',
    
    dist: 'dist/',
    distINDEX: 'dist/index.html',
    distCSS: 'dist/styles/**/*.css',
    distJS: 'dist/scripts/**/*.js',
    distIMAGES: 'dist/images/**/*.+(png|jpg|gif|svg)'
};
//  destination variables
var dest = {
    tmp: 'tmp/',
    tmpCSS: 'tmp/styles/',
    tmpJS: 'tmp/scripts/',
    tmpIMAGES: 'tmp/images/',
};

// html task
gulp.task('html', function() {
    gulp.src(paths.srcHTML)
    .pipe(gulp.dest(paths.tmp))
});

// sass task
gulp.task('sass', function() {
    return gulp.src(paths.srcSASS)
    .pipe(sass())
    .pipe(gulp.dest(dest.tmpCSS))
    .pipe(browserSync.stream());
});

// scripts task
gulp.task('scripts', function() {
    return gulp.src(paths.srcJS)
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest(dest.tmpJS))
});

// image minification
gulp.task('images', function() {
    return gulp.src(paths.srcIMAGES)
    .pipe(cache(imagemin({
        interlaced: true
    })))
    .pipe(gulp.dest(dest.tmpIMAGES))
});

// serve
gulp.task('serve',['html', 'sass', 'scripts', 'images'], function() {
    browserSync.init({
        server: {
            baseDir: paths.tmp
        },
    })
    gulp.watch(paths.srcSASS, ['sass']);
    gulp.watch(paths.srcSASS).on('change', browserSync.reload);
    gulp.watch(paths.srcHTML, ['html']);
    gulp.watch(paths.srcHTML).on('change', browserSync.reload);
    gulp.watch(paths.srcJS, ['scripts']);
    gulp.watch(paths.srcJS).on('change', browserSync.reload);
});


gulp.task('default', ['serve']);