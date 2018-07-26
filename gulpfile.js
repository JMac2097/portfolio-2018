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

    tmp: 'tmp',
    tmpINDEX: 'tmp/index.html',
    tmpCSS: 'tmp/styles/**/*.css',
    tmpJS: 'tmp/scripts/**/*.js',
    tmpIMAGES: 'src/images/**/*.+(png|jpg|gif|svg)',
    
    dist: 'dist',
    distINDEX: 'dist/index.html',
    distCSS: 'dist/styles/**/*.css',
    distJS: 'dist/scripts/**/*.js',
    distIMAGES: 'src/images/**/*.+(png|jpg|gif|svg)'
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
    .pipe(gulp.dest(paths.tmpCSS))
});

// scripts task
gulp.task('scripts', function() {
    return gulp.src(paths.srcJS)
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest(paths.tmpJS))
});

// image minification
gulp.task('images', function() {
    return gulp.src(paths.srcIMAGES)
    .pipe(cache(imagemin({
        interlaced: true
    })))
    .pipe(gulp.dest(paths.tmpIMAGES))
});

// clean distribution
gulp.task('clean:dist', function() {
    return del.sync(paths.DIST);
});

// clean image cache
gulp.task('cache:clear', function(callback) {
    return cache.clearAll(callback)
});

// useref task
gulp.task('useref', function() {
    return gulp.src(paths.tmpHTML)
    .pipe(useref())
    // minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest(paths.distJS))
    //minifies if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest(paths.distCSS))
});

// serve
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
});

// watch
gulp.task('watch', ['serve', 'sass', 'scripts'], function(){
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/scrips/**/*.js', browserSync.reload);
});

// build
gulp.task('build', function(callback) {
    runSequence('clean:dist',
    ['sass', 'scripts', 'useref', 'images', 'fonts'],
    callback  
    )  
});

// default
gulp.task('default', function(callback) {
    runSequence(['sass', 'scripts', 'serve', 'watch'],
    callback
    )
});